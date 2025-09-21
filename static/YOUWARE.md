# AI 보험 약관 해석 웹사이트 - 개발 가이드

## 프로젝트 개요
한국의 주요 어린이 보험사 약관을 AI로 해석하여 사용자에게 쉽게 설명해주는 웹사이트입니다.

## 핵심 기능
- AI 기반 보험 약관 해석 및 질의응답
- 사용자별 맞춤형 추천 시스템
- 실시간 검색창 타이핑 애니메이션
- 반응형 FAQ 섹션
- 프리미엄 디자인 시스템

## 기술 스택
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **폰트**: Inter (본문), Playfair Display (제목)
- **디자인**: CSS Grid, Flexbox, CSS Variables
- **애니메이션**: CSS Transitions, Keyframes

## 파일 구조
```
/
├── index.html              # 메인 홈페이지
├── home(ver4).css         # 메인 스타일시트
├── recommendation-styles.css # 추천 시스템 전용 스타일
└── [이미지 및 리소스]
```

## 핵심 컴포넌트

### 1. 검색 시스템
- **ID**: `search-input` - 메인 검색창
- **기능**: 실시간 placeholder 타이핑 애니메이션
- **연동**: 추천 버튼 및 FAQ 링크와 상호작용

### 2. 맞춤형 추천 시스템 
- **클래스**: `.recommendation-system`
- **필터 버튼**: `.filter-btn` (전체, 상해보험, 건강보험, 종합보험)
- **데이터 속성**: `data-category`, `data-popularity`
- **로컬 스토리지**: 사용자 선호도 저장 (`userPreferences`)

### 3. 파트너 카드 시스템
- **클래스**: `.partner-card`
- **추천 배지**: `.recommendation-badge` (인기, 신규, 급상승, 추천)
- **매칭 스코어**: `.match-score` (동적 계산)

### 4. FAQ 토글 시스템
- **ID**: `explore-faq` (트리거), `faq-section` (콘텐츠)
- **애니메이션**: max-height, opacity, transform 기반

## CSS 변수 시스템
```css
:root {
  --primary-color: #1a365d;
  --secondary-color: #2b77e4;
  --accent-color: #f093fb;
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --gradient-accent: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}
```

## JavaScript 핵심 기능

### 검색창 타이핑 애니메이션
- 4개 보험 관련 문구 순환
- 타이핑/삭제 속도 제어
- 실제 사용자 질문 기반 문구

### 사용자 선호도 추적
```javascript
userPreferences = {
    searchHistory: ['어린이보험', '상해보험', '치아'],
    clickedCategories: ['comprehensive', 'accident'],
    viewTime: Date.now()
}
```

### 매칭도 알고리즘
- 기본 점수: 85점
- 카테고리 매칭: +10점
- 인기도 high: +5점  
- 사용자 히스토리 매칭: +3점
- 최대 점수: 95점

## 반응형 디자인
- **모바일**: 768px 이하
- **주요 변경사항**:
  - 섹션 제목 크기 축소 (32px → 24px)
  - 컨테이너 레이아웃 세로 배치
  - 푸터 그리드 2열로 축소
  - 추천 시스템 패딩 조정

## 성능 최적화
- **Google Fonts**: `&display=swap` 옵션 사용
- **CSS**: 하드웨어 가속 활용 (`transform`, `opacity`)
- **이미지**: 외부 CDN 활용 (namu.wiki)
- **로컬 스토리지**: 사용자 데이터 캐싱

## 브랜딩 및 시각적 아이덴티티
- **색상 팔레트**: 프로페셔널한 블루-퍼플 그라디언트
- **타이포그래피**: 가독성과 elegance 균형
- **애니메이션**: 부드러운 전환 효과 (0.3-0.5초)
- **그림자**: 층위감 있는 카드 디자인

## 개발 시 주의사항
1. **사용자 데이터**: 로컬 스토리지 데이터 검증 필수
2. **애니메이션**: `prefers-reduced-motion` 고려 권장
3. **접근성**: 키보드 네비게이션 및 스크린 리더 지원
4. **크로스 브라우저**: CSS Grid/Flexbox fallback 확인
5. **이미지 최적화**: 외부 이미지 로드 실패 대비책 구현 권장

## 확장 가능성
- 백엔드 API 연동 준비 (현재 프론트엔드 전용)
- 다국어 지원 구조
- PWA 변환 가능성
- AI 모델 실시간 연동 인터페이스