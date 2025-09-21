# ai-bo: AI 보험 약관 해석 서비스 🤖

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0-blue.svg)](https://flask.palletsprojects.com/)
[![Docker](https://img.shields.io/badge/Docker-blue.svg)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**ai-bo**는 사용자가 복잡한 보험 약관을 쉽게 이해하고 필요한 정보에 접근할 수 있도록 돕는 AI 기반 챗봇 서비스입니다. 특히 어린이 보험에 가입한 부모님들을 위해 어려운 법률 용어와 방대한 문서의 장벽을 허물어, 보험 혜택을 온전히 활용할 수 있도록 지원하는 것을 목표로 합니다.

## **목차**

- [문제 제기](#문제-제기-)
- [우리의 해결책: ai-bo](#우리의-해결책-ai-bo-)
- [주요 기능](#주요-기능)
- [기술 스택 및 아키텍처](#기술-스택-및-아키텍처-)
- [시작하기 (Getting Started)](#시작하기-getting-started)
  - [사전 요구사항](#사전-요구사항)
  - [로컬 환경에서 실행하기](#로컬-환경에서-실행하기)
- [팀원 소개](#팀원-소개-)
- [프로젝트 자체 평가](#프로젝트-자체-평가-)

## **문제 제기** 🤔

많은 사람들이 적지 않은 보험료를 내고 있지만, 정작 자신이 가입한 보험이 무엇을 보장하는지, 어떻게 권리를 찾아야 하는지 정확히 알지 못합니다. 그 원인은 다음과 같습니다:

- **방대한 분량:** 보험 약관은 최대 950페이지에 달하며, 이를 읽고 이해하는 데 평균 47시간이 소요됩니다.
- **어려운 법률 용어:** 내용의 90%가 법률 및 전문 용어로 구성되어 있어 이해율이 12%에 불과합니다.
- **복잡한 구조:** 평균 8단계의 조건부 보장 구조와 200개가 넘는 예외 조항으로 인해 실제 보장 내용을 파악하기 어렵습니다.

이러한 문제로 인해 약관 완독률은 3.2%에 그치고, 청구 착오율은 47%, 혜택 미활용률은 62%에 달합니다. 이는 연간 약 2.3조 원의 미청구 보험금이라는 막대한 경제적 손실로 이어집니다.

## **우리의 해결책: ai-bo** ✨

**ai-bo**는 '아이보험도우미'의 줄임말로, '내 손안의 따뜻한 전문가'라는 콘셉트의 서비스입니다. 우리는 청구 빈도가 높고 부모가 신청 주체인 **어린이 보험**에 우선적으로 집중하여 문제를 해결하고자 합니다.

## **주요 기능**

- **AI 기반 실시간 번역:** 어려운 법률 용어를 일상적인 언어로 실시간 번역합니다.
- **상황별 맞춤 해석:** 사용자의 질문을 관련 약관 조항과 연결하여 개인화된 답변을 제공합니다.
- **스마트 청구 가이드:** 복잡한 청구 절차를 단계별로 안내하고, 상황에 맞는 필요 서류 정보를 제공합니다.
- **음성 인터페이스 (STT/TTS):** 음성으로 질문하고 답변을 들을 수 있어 접근성을 높였습니다.
- **24/7 AI 상담:** 시간에 구애받지 않고 언제든지 상담이 가능합니다.

## **기술 스택 및 아키텍처** 💻

**ai-bo**는 안정성과 확장성을 위해 최신 클라우드 기반 아키텍처로 구축되었습니다.

- **프론트엔드 (Front-end):** `HTML`, `CSS`, `JavaScript`
- **백엔드 (Back-end):** `Python`, `Flask`, `Gunicorn`
- **AI & 머신러닝:**
    - **Language Models:** Azure OpenAI의 `gpt-4` (답변 생성) 및 `text-embedding-3-large` (임베딩) 모델을 활용하여 높은 수준의 자연어 처리 능력을 구현했습니다.
    - **RAG (Retrieval-Augmented Generation):** Facebook AI Research의 `FAISS` 라이브러리를 사용하여 벡터 데이터베이스를 구축하고, 실제 보험 약관에 기반한 정확하고 신뢰도 높은 답변을 생성하는 RAG 파이프라인을 설계했습니다.
- **데이터 처리:** `Pandas`, `NumPy`, `Jupyter Notebook`, `Gradio` (프로토타이핑)
- **배포 및 인프라:** `Docker`, `Azure Web App`, `GitHub`

### **시스템 아키텍처**

사용자의 질문(텍스트 또는 음성)은 Flask 백엔드 서버로 전송됩니다. 서버는 Azure OpenAI 서비스를 호출하여 질문을 임베딩 벡터로 변환하고, FAISS 벡터 DB에서 가장 유사한 보험 약관 조항을 검색합니다. 검색된 조항과 원본 질문을 `gpt-4` 모델에 전달하여 최종 답변을 생성한 후, 사용자에게 다시 전달하는 RAG(검색 증강 생성) 구조로 동작합니다.

## **시작하기 (Getting Started)**

### **사전 요구사항**

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/products/docker-desktop)

### **로컬 환경에서 실행하기**

1. **리포지토리 클론:**
   ```bash
   git clone https://github.com/howl-papa/ai-bo.git
   cd ai-bo
   ```

2. **환경 변수 설정:**
   프로젝트 루트 디렉터리에 `.env` 파일을 생성하고 Azure OpenAI API 키와 엔드포인트를 추가합니다.
   ```
   # .env
   AZURE_OPENAI_KEY="<YOUR_AZURE_OPENAI_API_KEY>"
   AZURE_OPENAI_ENDPOINT="<YOUR_AZURE_OPENAI_ENDPOINT>"
   ```

3. **Docker 컨테이너 빌드 및 실행:**
   ```bash
   # Docker 이미지 빌드
   docker build -t ai-bo .

   # Docker 컨테이너 실행
   docker run -p 5000:5000 -d --env-file .env ai-bo
   ```

4. **서비스 접속:**
   웹 브라우저에서 `http://localhost:5000`으로 접속합니다.

## **팀원 소개** 👥

- **박용락 (프로젝트 총괄):** 프로젝트 기획, 서비스 계획 수립 및 품질 관리.
- **박한민 (기술 통합 리드):** RAG 아키텍처 설계 및 전체 기술 스택 통합.
- **이승재 (기술팀 PM & 음성 처리 리드):** 기술 개발 일정 관리 및 STT/TTS 기능 구현.
- **반준우 (풀스택 개발 리드):** Azure 기반 백엔드 시스템 구축 및 웹 채팅 UI 연동.
- **김예원 (UX/UI 리드):** 사용자 친화적 웹 대시보드 디자인 및 사용자 경험 설계.
- **진소희 (데이터 분석 리드):** 보험 약관 데이터 정제, 모델 학습 및 데이터셋 구축.

## **주요 개발 이슈 및 해결 과정** 💡

프로젝트 구현 과정에서 최적의 성능을 내기 위해 다음과 같은 이슈들을 겪었으며, 비교 테스트를 통해 해결 방안을 도출했습니다.

### **1. 모델 선정: OCR vs RAG**

* [cite_start]**이슈:** PDF 문서 기반의 정확한 질의응답 시스템을 구현하기 위해 OCR(Document Intelligence) 모델과 RAG(검색 증강 생성) 모델 중 어떤 것이 더 적합할지 결정해야 했습니다. [cite: 372]
* [cite_start]**해결 과정:** 두 모델의 답변 품질, 처리 속도, 핵심 장점을 비교 분석했습니다. [cite: 374] [cite_start]OCR 모델은 PDF에서 텍스트를 추출하는 데 시간이 소요되고, 단순 텍스트 추출 기반이라 깊이 있는 답변에 한계가 있었습니다. [cite: 374] [cite_start]반면 RAG 모델은 전체 맥락을 이해하고 유연한 답변을 생성하는 데 우수했습니다. [cite: 374]
* [cite_start]**최종 결정:** **RAG 모델을 채택**하여 사용자의 질문에 더 높은 품질의 답변을 신속하게 제공하기로 결정했습니다. [cite: 374]

### **2. 구현 방식 선정: Chat API vs Assistants API**

* [cite_start]**이슈:** OpenAI의 기능 중, Chat(Completions API)을 기반으로 직접 RAG를 구성할지, 아니면 Assistants API의 내장 기능을 활용할지 선택해야 했습니다. [cite: 412, 413]
* **해결 과정:**
    * [cite_start]**1차 시도 (Chat + 직접 RAG):** Chat API를 기반으로 자체 데이터셋을 Fine-Tuning하고 AI 인덱서를 직접 연동했으나, 답변의 품질과 일관성이 목표 수준에 미치지 못했습니다. [cite: 414, 420, 421]
    * [cite_start]**2차 시도 (Assistants API):** Assistants API는 파일 관리, Retrieval 등 RAG 관련 기능이 내장되어 있어 복잡한 설정 없이도 일관되고 품질 높은 결과물을 안정적으로 생성했습니다. [cite: 416, 424, 425, 427]
* [cite_start]**최종 결정:** 개발 복잡도가 낮고 안정적인 성능을 보여준 **Assistants API를 채택**했습니다. [cite: 417, 426, 427]

### **3. 모델 성능 개선: Fine-Tuning**

* [cite_start]**이슈:** Assistants API의 기본 모델만으로는 부모 눈높이에 맞는 친절한 말투, UI 구성에 최적화된 답변 구조 등 저희가 원하는 요구사항을 충족시키기 어려웠습니다. [cite: 439]
* [cite_start]**해결 과정:** 기존 Assistants 모델과 저희가 직접 Fine-Tuning한 모델의 답변을 비교했습니다. [cite: 438, 439]
    * [cite_start]**기존 모델:** 다소 건조한 상담사 말투이며, 정보가 문단형으로 섞여 있어 UI에 적용하기 어려웠습니다. [cite: 439]
    * [cite_start]**Fine-Tuning 모델:** 친절하고 부모 눈높이에 맞춘 톤을 유지하며, '###' 섹션 구조로 답변이 정리되어 UI(말풍선 분할, 카드화 등) 구성에 훨씬 유리했습니다. [cite: 439] [cite_start]또한 핵심 정보 위주로 간결하게 응답하여 사용자의 집중도를 높였습니다. [cite: 439]
* [cite_start]**최종 결정:** **Fine-Tuning 모델을 최종 채택**하여 챗봇의 페르소나를 확립하고 사용자 경험을 극대화했습니다. [cite: 439]

