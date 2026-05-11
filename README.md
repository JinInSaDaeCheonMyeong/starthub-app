# StartHub App

<img width="1440" alt="메인 페이지" src="https://github.com/user-attachments/assets/9290eaff-985c-4f08-8d31-a3db084fbc02" />

StartHub는 창업자와 예비 창업자를 위한 서비스입니다. 사용자는 창업 지원 사업 공고를 탐색하고, 관심 공고와 일정을 관리하며, BMC와 경쟁사 분석, AI 챗봇을 통해 창업 준비에 필요한 정보를 한곳에서 확인할 수 있습니다.

이 프로젝트는 Expo 기반 React Native 앱으로, 인증부터 홈 대시보드, 공고 탐색, 캘린더, BMC, 경쟁사 분석, 챗봇, 프로필 관리까지 앱 전체 사용자 흐름을 구성합니다.

## 핵심 기능

- 이메일, Google, Apple 기반 인증
- 창업 상태별 회원가입 및 온보딩
- 지원 사업 공고 탐색, 검색, 관심 공고 관리
- 캘린더 기반 일정 관리와 마감 공고 확인
- BMC 조회와 경쟁사 분석 결과 확인
- AI 챗봇 세션, 파일 첨부, 스트리밍 응답
- 푸시 알림 수신 및 알림 목록
- 프로필 및 계정 관리

## 기술 스택

- **Framework**: Expo, React Native
- **Language**: TypeScript
- **UI**: React Native StyleSheet, React Native SVG, Expo Image
- **Navigation**: React Navigation Native Stack, Bottom Tabs
- **State Management**: Zustand
- **Network**: Axios
- **Authentication**: Firebase Auth, Expo Auth Session, Expo Apple Authentication
- **Push Notification**: Firebase Messaging, Expo Notifications
- **Animation / Gesture**: React Native Reanimated, Gesture Handler
- **Calendar**: React Native Calendars
- **Storage**: AsyncStorage

## 라우팅 구조

앱의 전체 화면 전환은 `RootStack`을 기준으로 구성됩니다.

```text
RootStack
├─ AuthStack
│  ├─ Splash
│  ├─ Welcome
│  ├─ LoginSelect
│  ├─ Signin
│  ├─ Signup
│  ├─ SignupInput
│  └─ CompanyInput
│
├─ HomeStack
│  ├─ Home
│  ├─ Notice
│  ├─ Calendar
│  └─ BMC
│
├─ SystemStack
│  ├─ Profile
│  └─ EditProfile
│
├─ CompetitorStack
│  ├─ History
│  └─ Result
│
├─ InNotice
├─ InBMC
├─ NoticeSearch
├─ MyLikes
├─ ChatBot
└─ Alarm
```

홈 화면의 주요 진입 메뉴는 `Competitor`, `MyLikes`, `ChatBot`, `Alarm`로 연결됩니다. 이 중 `ChatBot`은 하단 탭 내부가 아니라 `RootStack`에 직접 등록된 전체 화면 라우트입니다.

## 주요 화면

### Auth

사용자 인증과 회원가입 흐름을 담당합니다. 앱 시작 시 `SplashScreen`에서 저장된 토큰을 확인하고, 인증 상태에 따라 로그인 화면 또는 홈 화면으로 이동합니다.

- `WelcomeScreen`: 앱 진입 화면
- `LoginSelectScreen`: 로그인 방식 선택
- `SigninScreen`: 이메일 로그인
- `SignupScreen`: 기본 회원가입
- `SignupInputScreen`: 사용자 추가 정보 입력
- `CompanyInputScreen`: 창업 관련 회사 정보 입력

### Home

앱의 메인 탭 영역입니다. 하단 탭을 통해 홈, 공고, 캘린더, BMC 화면으로 이동합니다. 우측 사이드바에서는 프로필, 로그아웃 등 시스템 메뉴에 접근합니다.

- `HomeScreen`: 추천 공고, 마감 임박 공고, 주요 진입점 표시
- `NoticeScreen`: 지원 사업 공고 목록
- `CalendarScreen`: 공고 일정 캘린더
- `BMCScreen`: BMC 목록
- `ChatBotScreen`: 홈의 `Hub AI` 메뉴에서 진입하는 AI 채팅 화면

### Notice

지원 사업 공고 탐색과 상세 보기를 담당합니다. 사용자는 카테고리, 지원 분야, 검색어를 기반으로 공고를 찾고 관심 공고로 저장할 수 있습니다.

- `NoticeSearchScreen`: 공고 검색과 필터링
- `InNoticeScreen`: 공고 상세 정보, 요약, 외부 링크 이동
- `MyLikesScreen`: 저장한 관심 공고 목록

### BMC

사업 모델 캔버스 정보를 조회하는 영역입니다.

- `BMCScreen`: BMC 목록
- `InBMCScreen`: BMC 상세 내용

### Competitor

경쟁사 분석 결과와 히스토리를 다룹니다.

- `HistoryScreen`: 이전 경쟁사 분석 결과 목록
- `ResultScreen`: 분석 결과, 비교 정보, 주요 섹션 표시

### ChatBot

창업 관련 질문을 AI 챗봇과 주고받는 독립 화면입니다. 홈 화면의 `Hub AI` 메뉴에서 진입하며, 채팅 화면 내부에는 별도의 사이드바와 세션 흐름이 있습니다.

- `ChatBotScreen`: 채팅 화면 루트, 채팅 사이드바, 입력 영역, 첨부 바텀시트 조합
- `ChatBotSideBar`: 프로필, 알림, 북마크, 홈 이동, 새 채팅, 공고, 경쟁사 분석, BMC 이동, 채팅 기록 목록
- `ChatEmptyState`: 공고, 법률, 아이디어 질문 유형 선택
- `ChatInputBar`: 메시지 입력, 질문 유형 표시, 첨부 파일 표시, 전송 액션
- `ChatAttachmentSheet`: 카메라, 갤러리, 문서 첨부 선택
- `ChatMessageList`: 사용자/AI 메시지 목록, Markdown 응답, 스트리밍 상태 표시
- `ChatTokenCard`: AI 응답 안의 공고, BMC, 경쟁사 분석 참조 카드

챗봇 응답에 포함된 참조 카드는 앱 내부 화면으로 이어집니다.

- 공고 참조: `InNotice`로 이동
- BMC 참조: `InBMC`로 이동
- 경쟁사 분석 참조: `Competitor > Result`로 이동

### System

사용자 프로필과 계정 관리를 담당합니다.

- `ProfileScreen`: 사용자 정보 조회
- `EditProfileScreen`: 프로필 수정

## 아키텍처

이 프로젝트는 화면, 화면 로직, API 호출, 전역 상태, 타입을 분리하는 구조를 사용합니다. 화면 컴포넌트는 UI 표현에 집중하고, 복잡한 데이터 처리와 이벤트 핸들링은 `hooks/`로 분리합니다.

```text
Screen
  └─ Hook
      ├─ API
      ├─ Store
      ├─ Util
      └─ Type
```

### Screen Layer

`screens/`는 실제 라우팅 대상 화면을 담습니다. 각 화면은 레이아웃과 사용자 인터랙션의 진입점 역할을 하며, 필요한 비즈니스 로직은 전용 hook에서 가져옵니다.

### Component Layer

`component/`는 공통 UI와 화면별 하위 컴포넌트를 담습니다. 버튼, 헤더, 입력 필드 같은 공통 컴포넌트와 공고, 챗봇, 캘린더, 경쟁사 분석 등 도메인별 컴포넌트가 함께 구성되어 있습니다.

### Hook Layer

`hooks/`는 화면의 상태 관리, 입력 검증, API 호출 흐름, 네비게이션 이벤트 처리를 담당합니다. 화면 컴포넌트가 커지는 것을 막고, UI와 로직을 분리하는 역할을 합니다.

### API Layer

`api/`는 서버와 통신하는 함수들을 도메인별로 관리합니다. Axios 기반 공통 인스턴스는 `lib/StartHubAxios.ts`에서 관리하며, 토큰 재발급과 인증 헤더 처리를 담당합니다.

챗봇 메시지는 세션 생성 후 `chatbot/sessions/{sessionId}/messages/stream` 엔드포인트를 통해 스트리밍 응답으로 처리합니다. 파일 첨부가 있는 경우 multipart form data로 함께 전송합니다.

### Store Layer

`store/`는 Zustand 기반 전역 상태를 관리합니다. 인증 토큰, 프로필, 공고, 일정, 홈 화면 데이터처럼 여러 화면에서 공유되는 상태를 저장합니다.

### Type Layer

`type/`은 API 요청/응답, 화면 파라미터, 도메인 모델 타입을 정의합니다. 서버 응답 구조와 화면에서 사용하는 데이터 형태를 명확히 분리합니다.

### Util Layer

`util/`은 토큰 저장, 날짜 포맷, 일정 변환, HTML 처리, 네비게이션 서비스, Toast 호출 등 여러 영역에서 재사용되는 보조 로직을 담습니다.

## 디렉터리 구조

```text
api/          도메인별 API 요청 함수
assets/       폰트, 아이콘, 로고, 이미지 리소스
component/    공통 UI 및 화면별 하위 컴포넌트
constants/    색상, 카테고리, 선택지, 정적 데이터
hooks/        화면 로직, 상태 처리, 입력 검증
lib/          Axios 인스턴스, Toast 설정
navigation/   루트 스택, 인증 스택, 홈 탭, 시스템 스택
plugins/      Expo 설정 플러그인
screens/      라우팅되는 앱 화면
store/        Zustand 전역 상태
type/         API와 도메인 타입 정의
util/         공통 유틸리티 함수
```

챗봇 관련 주요 파일은 다음과 같습니다.

```text
screens/Home/ChatBotScreen.tsx
hooks/home/useChatBot.ts
api/chatbot.ts
component/home/ChatBotSideBar.tsx
component/home/chatbot/
type/chatbot/
util/chatbotMessageParser.ts
```

## 데이터 흐름

일반적인 화면 데이터 흐름은 다음과 같습니다.

```text
User Action
  ↓
Screen Event
  ↓
Custom Hook
  ↓
API / Store / Util
  ↓
State Update
  ↓
Screen Render
```

예를 들어 챗봇 화면에서는 사용자가 메시지를 보내면 `useChatBot`이 세션 생성, 첨부 파일 검증, 스트리밍 요청, 메시지 상태 갱신을 담당하고, `ChatBotScreen`은 사이드바, 메시지 목록, 입력 바, 첨부 바텀시트를 조합해 렌더링합니다.

## 상태 관리

전역 상태는 Zustand store로 분리되어 있습니다.

- `authStore`: 인증 토큰 로드와 인증 상태 관리
- `profileStore`: 사용자 프로필 조회와 캐싱
- `noticeStore`: 공고 목록, 검색, 관심 공고 관련 상태
- `scheduleStore`: 캘린더 일정 상태
- `homeStore`: 홈 화면 데이터 상태

지역 상태는 각 화면의 custom hook 내부에서 관리합니다. 여러 화면에서 공유되어야 하는 값만 store로 올리는 구조입니다.

## 플랫폼 연동

StartHub는 인증, 알림, 미디어 접근처럼 iOS와 Android에서 처리 방식이 다른 기능을 각 플랫폼 환경에 맞게 구현했습니다.

- Firebase 기반 인증, 메시징, Crashlytics
- Google OAuth와 Apple Sign In
- FCM 토큰 등록과 푸시 알림 수신
- 카메라와 사진 보관함 접근
- iOS, Android 네이티브 프로젝트 기반 앱 배포
