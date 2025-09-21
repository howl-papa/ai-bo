import os, time, requests
from flask      import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv     import load_dotenv
from openai     import AzureOpenAI

# 환경변수 로드
load_dotenv()
AZURE_KEY      = os.getenv("AZURE_OPENAI_KEY")
AZURE_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT").rstrip("/")
ASSISTANT_ID   = os.getenv("ASSISTANT_ID")

app = Flask(
    __name__,
    static_folder="static",
    template_folder="templates"
)
CORS(app)

client = AzureOpenAI(
    api_key       = AZURE_KEY,
    azure_endpoint = AZURE_ENDPOINT,
    api_version   = "2024-05-01-preview"
)

def query_assistant(user_input: str) -> dict:
    thr = client.beta.threads.create()
    client.beta.threads.messages.create(
        thread_id=thr.id, role="user", content=user_input
    )
    run = client.beta.threads.runs.create(
        thread_id=thr.id, assistant_id=ASSISTANT_ID
    )
    while run.status in ("queued", "in_progress"):
        time.sleep(1)
        run = client.beta.threads.runs.retrieve(
            thread_id=thr.id, run_id=run.id
        )

    if run.status == "completed":
        msgs = client.beta.threads.messages.list(thread_id=thr.id).data
        assists = [m for m in msgs if getattr(m,"role","")=="assistant"]
        text = assists[-1].content[0].text.value if assists else "답변을 찾을 수 없습니다."
        return {"full": text, "summary": ""}

    return {"full": "서버 오류가 발생했습니다.", "summary": ""}

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/chat")
def chat():
    return render_template("chat.html")

@app.route("/api/ask", methods=["POST"])
def ask():
    data = request.get_json(force=True)
    q = data.get("question","").strip()
    if not q:
        return jsonify({"full":"질문이 비어 있습니다.","summary":""})
    return jsonify(query_assistant(q))

@app.route("/api/get-speech-token", methods=["POST"])
def get_speech_token():
    """Azure Speech Service용 인증 토큰을 발급하는 API"""
    speech_key = os.getenv("AZURE_SPEECH_KEY")
    speech_region = os.getenv("AZURE_SPEECH_REGION")

    if not speech_key or not speech_region:
        return jsonify({"error": "Azure Speech 키 또는 지역이 설정되지 않았습니다."}), 500

    headers = {
        'Ocp-Apim-Subscription-Key': speech_key,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    url = f"https://{speech_region}.api.cognitive.microsoft.com/sts/v1.0/issueToken"

    try:
        response = requests.post(url, headers=headers)
        response.raise_for_status()  # 오류 발생 시 예외를 발생시킴
        return jsonify({"token": response.text, "region": speech_region})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
