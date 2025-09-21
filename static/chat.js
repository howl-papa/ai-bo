// public/chat.js

// --- 기본 DOM 요소 ---
const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");
const faqToggle = document.getElementById("faq-toggle");
const faqPanel = document.getElementById("faq-panel");
const history = [];

// --- [Azure Speech SDK 설정 (토큰 인증 방식)] ---
let speechConfig = null;

async function initializeSpeechConfig() {
    try {
        const response = await fetch('/api/get-speech-token', { method: 'POST' });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`인증 토큰을 가져오는데 실패했습니다: ${errorData.error || response.statusText}`);
        }
        const data = await response.json();
        const { token, region } = data;

        speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);
        speechConfig.speechSynthesisVoiceName = "ko-KR-SunHiNeural";
        speechConfig.speechRecognitionLanguage = "ko-KR";

        console.log("Azure Speech 설정이 성공적으로 완료되었습니다.");
    } catch (err) {
        console.error('Speech Config 초기화 실패:', err);
        alert("음성 서비스 인증에 실패했습니다. 페이지를 새로고침하거나 관리자에게 문의하세요.");
    }
}

document.addEventListener('DOMContentLoaded', initializeSpeechConfig);


// --- [TTS 관련 전역 변수 및 함수] ---
let synthesizer = null;
let isSpeaking = false;
let currentSpokenMessageId = null;

const volumeUpIcon = '<span class="material-symbols-outlined">volume_up</span>';
const stopCircleIcon = '<span class="material-symbols-outlined">stop_circle</span>';

function stopSpeech(onStopCompleted) {
    if (!synthesizer || !isSpeaking) {
        if (onStopCompleted) onStopCompleted();
        return;
    }
    synthesizer.stopSpeakingAsync(
        () => {
            console.log("Speech stopped.");
            isSpeaking = false;
            currentSpokenMessageId = null;
            document.querySelectorAll('.tts-btn').forEach(b => b.innerHTML = volumeUpIcon);
            if (onStopCompleted) onStopCompleted();
        },
        (err) => {
            console.error("Stop speaking error:", err);
            isSpeaking = false;
            currentSpokenMessageId = null;
            document.querySelectorAll('.tts-btn').forEach(b => b.innerHTML = volumeUpIcon);
        }
    );
}

function startSpeech(text, messageId) {
    if (!speechConfig) {
        alert("음성 서비스가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
        return;
    }

    if (!synthesizer) {
        synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
    }
    const btn = document.querySelector(`[data-message-id='${messageId}'] .tts-btn`);
    if (btn) btn.innerHTML = stopCircleIcon;

    isSpeaking = true;
    currentSpokenMessageId = messageId;

    synthesizer.speakTextAsync(
        text.replace(/<[^>]+>/g, ""),
        result => {
            isSpeaking = false;
            currentSpokenMessageId = null;
            if (btn) btn.innerHTML = volumeUpIcon;
            if (result.reason === SpeechSDK.ResultReason.Canceled) {
                 console.log("Speech synthesis canceled.");
            } else if (result.reason !== SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                console.error("Speech synthesis failed:", result.errorDetails);
            }
        },
        error => {
            console.error("Speech synthesis error:", error);
            isSpeaking = false;
            currentSpokenMessageId = null;
            if (btn) btn.innerHTML = volumeUpIcon;
        }
    );
}

function toggleAzureTTS(text, messageId) {
    if (isSpeaking && currentSpokenMessageId === messageId) {
        stopSpeech();
        return;
    }
    if (isSpeaking) {
        stopSpeech(() => startSpeech(text, messageId));
        return;
    }
    startSpeech(text, messageId);
}

// --- 메시지 화면에 추가 (TTS 버튼 통합) ---
function addMessage(text, sender) {
    const msg = document.createElement("div");
    const messageId = `msg-${Date.now()}-${Math.random()}`;
    msg.dataset.messageId = messageId;
    msg.classList.add("message", sender);

    if (sender === "bot") {
        msg.innerHTML = marked.parse(text);
        const ttsBtn = document.createElement("button");
        ttsBtn.className = "tts-btn";
        ttsBtn.title = "음성으로 듣기/중지";
        ttsBtn.innerHTML = volumeUpIcon;
        ttsBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const plainText = msg.innerText;
            toggleAzureTTS(plainText, messageId);
        });
        msg.appendChild(ttsBtn);
        msg.style.paddingRight = "38px";
    } else {
        msg.textContent = text;
    }

    chatContainer.append(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// --- [수정된 부분] 로딩 표시/제거 및 입력창 비활성화 ---
function setLoading(on) {
    // 입력창, 전송 버튼, 마이크 버튼의 disabled 속성 제어
    userInput.disabled = on;
    sendBtn.disabled = on;
    micBtn.disabled = on;

    if (on) {
        // 로딩 시작 시
        userInput.placeholder = "답변을 생성하는 중입니다..."; // 플레이스홀더 텍스트 변경
        const load = document.createElement("div");
        load.id = "__loading";
        load.classList.add("message", "bot");
        load.textContent = "생각하는 중...";
        chatContainer.append(load);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } else {
        // 로딩 종료 시
        userInput.placeholder = "메시지를 입력하세요..."; // 원래 플레이스홀더로 복원
        const load = document.getElementById("__loading");
        if (load) load.remove();
    }
}

// --- 백엔드 호출 함수 ---
async function callChatAPI() {
    setLoading(true); // <--- 로딩 시작 및 입력창 비활성화
    try {
        const lastUser = history.slice().reverse().find((m) => m.role === "user");
        const question = lastUser ? lastUser.content : "";
        const res = await fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
        });
        const data = await res.json();
        setLoading(false); // <--- 로딩 종료 및 입력창 활성화
        const reply = (data.full || "").trim();
        addMessage(reply, "bot");
        history.push({ role: "assistant", content: reply });
    } catch (err) {
        setLoading(false); // <--- 에러 발생 시에도 입력창 활성화
        console.error(err);
        addMessage("서버 호출 중 오류가 발생했습니다.", "bot");
    }
}

// --- 메시지 전송 핸들러 ---
function sendMessage(e) {
    if (e) e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;
    addMessage(text, "user");
    history.push({ role: "user", content: text });
    userInput.value = "";
    callChatAPI();
}

sendBtn.addEventListener("click", sendMessage);
document.getElementById("chat-form").addEventListener("submit", sendMessage);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { // Shift+Enter는 줄바꿈을 위해 제외
        e.preventDefault();
        sendMessage();
    }
});

// --- [음성인식 (Azure STT)] ---
micBtn.addEventListener("click", () => {
    if (!speechConfig) {
        alert("음성 서비스가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
        return;
    }

    if (isSpeaking) {
        stopSpeech();
    }

    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    userInput.value = "듣고 있어요...";
    userInput.disabled = true; // 음성인식 중에도 입력창 비활성화
    micBtn.disabled = true; // 음성인식 중에도 마이크 버튼 비활성화

    recognizer.recognizeOnceAsync(
        result => {
            if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
                userInput.value = result.text;
                if(userInput.value.trim()) sendMessage();
            } else {
                userInput.value = "";
                console.error("Azure STT 오류:", result.errorDetails);
                alert("음성을 인식하지 못했습니다.");
            }
            recognizer.close();
            userInput.disabled = false; // 끝나면 다시 활성화
            micBtn.disabled = false; // 끝나면 다시 활성화
        },
        error => {
            userInput.value = "";
            console.error("Azure STT 실패:", error);
            alert("음성인식 중 오류가 발생했습니다.");
            recognizer.close();
            userInput.disabled = false; // 끝나면 다시 활성화
            micBtn.disabled = false; // 끝나면 다시 활성화
        }
    );
});

// --- FAQ 및 하단 메뉴 등 나머지 코드는 기존과 동일 ---
faqToggle.addEventListener("click", () => {
    const icon = faqToggle.querySelector("span");
    faqPanel.classList.toggle("open");
    icon.textContent = faqPanel.classList.contains("open")
        ? "chevron_left"
        : "arrow_forward";
});

document.querySelectorAll("#faq-panel li").forEach((item) => {
    item.addEventListener("click", () => {
        const q = item.textContent.trim();
        faqPanel.classList.remove("open");
        faqToggle.querySelector("span").textContent = "arrow_forward";
        addMessage(q, "user");
        history.push({ role: "user", content: q });
        callChatAPI();
    });
});

const params = new URLSearchParams(window.location.search);
const initial = params.get("q");
if (initial) {
    const decoded = decodeURIComponent(initial);
    addMessage(decoded, "user");
    history.push({ role: "user", content: decoded });
    callChatAPI();
}

const menuBtn = document.getElementById("menu-btn");
const menuPanel = document.getElementById("menu-panel");
const menuHome = document.getElementById("menu-home");
const menuHistory = document.getElementById("menu-history");

menuBtn.addEventListener("click", () => {
    menuPanel.classList.toggle("open");
});

menuHome.addEventListener("click", () => {
    window.location.href = "/";
});

menuHistory.addEventListener("click", () => {
    alert("History 기능은 추후 업데이트 예정입니다!");
});

document.addEventListener("click", (e) => {
    if (!menuBtn.contains(e.target) && !menuPanel.contains(e.target)) {
        menuPanel.classList.remove("open");
    }
});

