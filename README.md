# Flowday

React 기반 SPA 과제 제출용 프로젝트입니다. 하루의 몰입, 감정, 다음 행동을 기록하는 "Flowday" 서비스를 구현했습니다.

배포 URL: https://flowday-focus.vivleon0510.chatgpt.site/  
GitHub 저장소: https://github.com/vivleon/flowday-react-spa

<a id="overview"></a>
## 프로젝트 개요

- 서비스 주제: 개인 몰입 기록 저널
- 핵심 데이터: `flow_entries`
- 백엔드: Supabase
- 프론트엔드: React 19 + Vinext(App Router 기반) + TypeScript
- 스타일링: Tailwind CSS 4
- 애니메이션: Framer Motion

<a id="features"></a>
## 주요 기능

- 최소 5개 이상 라우트 구성
- 원격 데이터 기준 CRUD
- 로그인/회원가입/익명 체험 로그인
- 보호 라우트
- 로딩/에러/빈 상태 통일
- controlled form + 필수값 검증 + 제출 중 비활성화
- 전역 상태(Context)로 테마, 로그인 사용자, 알림 관리
- 메모이제이션과 지연 검색으로 불필요한 렌더링 완화
- WebMCP imperative 도구 등록 코드 포함

<a id="routes"></a>
## 라우트

| 경로 | 설명 |
| --- | --- |
| `/` | 홈 |
| `/login` | 로그인 / 회원가입 / 체험 로그인 |
| `/entries` | 기록 목록 |
| `/entries/new` | 기록 등록 |
| `/entries/:id` | 기록 상세 |
| `/entries/:id/edit` | 기록 수정 |
| `/profile` | 프로필 / 테마 / 요약 통계 |
| `*` | Not Found |

<a id="structure"></a>
## 폴더 구조

```text
app/                  라우트 엔트리
screens/              페이지 화면 컴포넌트
components/           재사용 UI 컴포넌트
hooks/                커스텀 훅
lib/                  Supabase, 검증, 타입, 전역 상태
supabase/             설정 및 마이그레이션
tests/                Vitest 테스트
scripts/              원격 CRUD 검증 스크립트
```

<a id="components"></a>
## 재사용 컴포넌트

과제 기준인 8개 이상을 충족하도록 재사용 컴포넌트를 분리했습니다.

- `MainNav`
- `PageTransition`
- `ProtectedRoute`
- `EntryList`
- `EntryCard`
- `EntryForm`
- `EntryPreview`
- `FiltersBar`
- `LoadingState`
- `ErrorState`
- `EmptyState`
- `MetricCard`
- `NotificationCenter`
- `SectionHeading`
- `StatusPill`

<a id="state-flow"></a>
## 상태와 데이터 흐름

### 사용자 이벤트 → 상태 변화 → 렌더링 변화 예시

1. 검색 입력 변경  
   `search` 상태가 바뀌고 `useDeferredValue` + `useEntries()` 필터링 결과가 다시 계산되어 목록 UI가 바뀝니다.

2. 폼 입력 변경  
   `EntryForm`의 controlled input 값이 바뀌고 `EntryPreview`가 즉시 다시 렌더링됩니다.

3. 저장 성공  
   폼 제출 성공 후 전역 알림이 뜨고, 상세 라우트로 이동하며 화면이 전환됩니다.

4. 로그인 상태 변경  
   Supabase 세션이 바뀌면 `AuthContext`가 갱신되고 네비게이션, 보호 라우트, 프로필 화면이 함께 바뀝니다.

### 상태를 어디에 두었는가

- 폼 입력 상태: `screens/entry-form-screen.tsx`
- 목록/상세/로딩/에러 상태: `hooks/use-entries.ts`, `hooks/use-entry-detail.ts`
- 전역 상태: `lib/app-context.tsx`
- 알림 상태: `lib/app-context.tsx`
- 테마 상태: `lib/app-context.tsx`

### useEffect 사용 지점

- Supabase 세션 초기화 및 auth 변화 구독
- 목록/상세 데이터 최초 조회
- 수정 화면에서 기존 데이터 폼 초기값 주입
- WebMCP 도구 등록

<a id="requirements"></a>
## 요구사항 체크

### 필수 요구사항

- [x] React 기반 프로젝트
- [x] `pages` 역할은 `app/`, UI는 `components/`, 훅/유틸은 `hooks`, `lib`로 분리
- [x] 공통 레이아웃과 네비게이션 적용
- [x] 5개 이상 라우트
- [x] 목록 / 상세 라우트 포함
- [x] Not Found 페이지
- [x] 재사용 컴포넌트 8개 이상
- [x] controlled form
- [x] 로딩 / 에러 / 빈 상태 통일
- [x] 커스텀 훅으로 데이터 조회 분리
- [x] Supabase 원격 CRUD
- [x] 등록 / 수정 후 이동 흐름
- [x] 삭제 후 목록 이동
- [x] 필수값 검증
- [x] 입력 근처 에러 표시
- [x] 제출 중 버튼 비활성화
- [x] 실패 메시지 표시
- [x] 외부 접속 가능한 배포
- [x] GitHub 저장소 공유
- [x] README 실행 방법 및 스택 명시

### 보너스

- [x] 전역 상태(Context): 사용자, 테마, 알림
- [x] 성능 최적화: `useMemo`, `useDeferredValue`, `React.memo`
- [x] 인증 추가: Supabase Auth + 보호 라우트

<a id="result-examples"></a>
## 결과 예시 수행 내용

아래 예시를 실제로 구현했고, 검증도 각각 진행했습니다.

- `/entries`에서 카드 리스트가 보이고 로딩 중에는 스피너가 보입니다.
- 리스트 항목 클릭 시 `/entries/:id` 상세 화면으로 이동합니다.
- `/entries/new`에서 빈 폼 제출 시 검증 에러가 표시됩니다.
- `/entries/new`에서 저장 성공 시 상세 화면으로 이동합니다.
- 필터 결과가 없으면 "표시할 데이터가 없습니다."가 보입니다.
- 요청 실패 시 "요청에 실패했습니다. 다시 시도하세요." 패턴으로 표시됩니다.
- 잘못된 주소 접근 시 404 페이지가 표시됩니다.

<a id="verification"></a>
## 테스트 및 검증

### 로컬 검증

```bash
npm install
npm run typecheck
npm run lint
npm run test
npm run build
```

### 원격 CRUD 검증

선택적인 원격 검증은 Git에서 제외되는 `.env.remote-test`에 서버 전용 정리 키를 준비한 로컬/CI 환경에서만 실행합니다. 이 키를 `VITE_` 변수나 배포 환경에 넣어서는 안 됩니다.

```dotenv
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_for_test_cleanup_only
```

```bash
npm run test:remote
```

검증 스크립트는 다음 흐름을 실제 Supabase에서 확인합니다.

- 익명 사용자 생성
- 기록 생성
- 목록/상세 조회
- 기록 수정
- 기록 삭제
- RLS owner 기준 확인
- 테스트 사용자 정리

<a id="local-run"></a>
## 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경 변수 준비

`.env.example`를 참고해서 `.env` 파일을 만듭니다.

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 프로덕션 빌드 확인

```bash
npm run build
```

<a id="supabase-setup"></a>
## Supabase 설정

### 필요한 환경 변수

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 마이그레이션 반영

```bash
supabase link --project-ref <your-project-ref>
supabase db push --linked --yes
```

<a id="stack"></a>
## 기술 스택

- React 19
- Vinext
- TypeScript
- Tailwind CSS 4
- Supabase
- Framer Motion
- Vitest
- Testing Library

<a id="evaluator-answers"></a>
## 평가용 바로 답변 표

| 질문 | 구현 위치 | 바로 말할 답변 | 검증 근거 |
| --- | --- | --- | --- |
| 컴포넌트를 어떤 기준으로 쪼갰나요? | `screens/*`, `components/*` | 라우트 단위 화면은 `screens`, 반복되는 UI와 상태 패턴은 `components`로 분리했습니다. | 목록/폼/상태 패널/네비게이션이 서로 독립 재사용됩니다. |
| props와 state는 어떻게 구분했나요? | `components/journal/entry-form.tsx`, `screens/entry-form-screen.tsx` | 입력값 같은 변경 가능한 데이터는 상위 screen state로 두고, 하위 컴포넌트는 props로 받아 표시와 이벤트만 담당하게 했습니다. | `EntryForm`은 `values`, `errors`, `onChange`를 props로 받습니다. |
| 상태를 어디에 두었나요? | `lib/app-context.tsx`, `screens/*`, `hooks/*` | 전역적으로 필요한 로그인/테마/알림만 Context로 올리고, 폼과 목록 필터처럼 지역적인 상태는 각 화면에 남겼습니다. | 네비게이션과 보호 라우트는 Context를 쓰고, 검색 입력은 `EntriesScreen` 내부 상태입니다. |
| useEffect는 어디에서 왜 쓰였나요? | `lib/app-context.tsx`, `hooks/use-entries.ts`, `hooks/use-webmcp.ts` | 세션 초기화, 원격 데이터 조회, 수정 화면 초기값 주입, WebMCP 등록처럼 렌더 이후 동기화가 필요한 곳에만 사용했습니다. | 로그인 상태 변화와 목록 조회가 effect 기반으로 동작합니다. |
| 비동기 상태는 어떻게 표현했나요? | `components/shared/state-panel.tsx` | 로딩/성공/실패/빈 상태를 각 페이지마다 따로 만들지 않고 공통 컴포넌트로 통일했습니다. | 목록, 상세, 프로필, 보호 라우트가 같은 패턴을 씁니다. |
| 라우팅부터 렌더링까지 한 기능이 어떻게 연결되나요? | `app/entries/new/page.tsx`, `screens/entry-form-screen.tsx`, `lib/validation.ts` | `/entries/new` 진입 후 입력 상태를 갱신하고, 제출 시 검증 후 Supabase에 저장하고, 성공 알림과 함께 상세 라우트로 이동합니다. | 입력 미리보기, 제출 알림, 상세 이동이 한 흐름으로 이어집니다. |

<a id="security"></a>
## 보안 메모

- `.env`와 `.env.remote-test`는 Git 추적에서 제외됩니다.
- 실제 키는 저장소에 커밋하지 않습니다.
- 배포 환경에서는 플랫폼 환경 변수에 별도로 등록해야 합니다.

<a id="release-check"></a>
## 제출 전 최종 검증 메모

- `npm run typecheck` 통과
- `npm run lint` 통과
- `npm run test` 통과
- `npm run build` 통과
- `npm run test:remote` 통과

참고: `hooks/use-webmcp.ts`에 imperative WebMCP 등록 코드는 포함했지만, 현재 배포물은 별도 MCP 연결 선언을 하지 않아 Sites 연결 검증 대상에는 포함하지 않았습니다.

배포 URL과 GitHub 저장소 URL은 실제 공개 주소로 반영했습니다.
