# Flowday

React 기반 SPA 과제 제출용 프로젝트입니다. 하루의 몰입, 감정, 다음 행동을 기록하는 "Flowday" 서비스를 구현했습니다.

배포 URL: https://flowday-focus.vivleon0510.chatgpt.site/  
GitHub 저장소: https://github.com/vivleon/flowday-react-spa

[30초 발표](#presentation) · [예상 질문과 답변](#evaluator-answers) · [필수·보너스 체크](#requirements) · [배포 검증 기록](docs/ACCEPTANCE_TESTS.md#v5)

<a id="presentation"></a>
## 30초 발표 멘트

> Flowday는 하루의 집중과 감정을 기록하는 React 웹앱입니다. Supabase에서 내 기록을 조회하고 작성·수정·삭제할 수 있습니다. 검색하면 목록이 바뀌고, 폼에 입력하면 미리보기가 갱신되며, 저장하면 알림과 함께 상세 화면으로 이동합니다. 이 세 가지를 통해 사용자 이벤트가 React 상태와 화면에 어떻게 연결되는지 보여주고자 했습니다.

**시연 순서**　[체험 로그인](https://flowday-focus.vivleon0510.chatgpt.site/login) → 기록 목록에서 감정 필터 변경 → 빈 폼 제출 → 입력과 미리보기 → 저장·상세 → 수정·삭제. 목록에서 검색어를 바꿔 빈 상태를 보여주거나 운영체제의 ‘동작 줄이기’를 켜 전환 효과를 비교할 수 있습니다.

<a id="overview"></a>
## 프로젝트 개요

- 서비스 주제: 개인 몰입 기록 저널
- 핵심 데이터: `flow_entries`
- 백엔드: Supabase
- 프론트엔드: React 19 + Vinext(App Router 기반) + TypeScript
- 스타일링: Tailwind CSS 4
- 애니메이션: CSS 페이지 진입 효과, Libraries.dev Liquid Gooey, Framer Motion 알림

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
- 홈·기록 목록·상세에 한정한 180ms 진입 효과와 동작 줄이기 지원
- 감정 필터의 기존 선택 상태를 표시하는 Liquid Gooey 이동 효과
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

- 목록과 폼: [EntryList](components/journal/entry-list.tsx#L4), [EntryCard](components/journal/entry-card.tsx#L8), [EntryForm](components/journal/entry-form.tsx#L12), [EntryPreview](components/journal/entry-preview.tsx#L6), [FiltersBar](components/journal/filters-bar.tsx#L10)
- 공통 상태: [LoadingState](components/shared/state-panel.tsx#L13), [ErrorState](components/shared/state-panel.tsx#L35), [EmptyState](components/shared/state-panel.tsx#L66)
- 공통 표시: [MetricCard](components/shared/metric-card.tsx#L4), [SectionHeading](components/shared/section-heading.tsx#L3), [StatusPill](components/shared/status-pill.tsx#L12)

위 11개는 각각 데이터·문구·콜백 등의 props를 받습니다. 헤더와 알림처럼 Context에서 직접 값을 읽는 컴포넌트는 이 수에 포함하지 않았습니다.

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

| 구분 | 확인 | 구현·검증 근거 |
| --- | --- | --- |
| 필수 · React 18 이상 및 역할 분리 | ✅ | [React 19 의존성](package.json), [라우트·화면·UI·훅 구조](#structure) |
| 필수 · SPA 라우팅과 공통 내비게이션 | ✅ | [7개 경로](#routes), [공통 레이아웃](app/layout.tsx#L12), [내비게이션](components/layout/main-nav.tsx#L10), [404](app/not-found.tsx), [공개 주소 응답](docs/ACCEPTANCE_TESTS.md#v5-routes) |
| 필수 · prop 기반 재사용 UI 8개 이상 | ✅ | [실제 사용 중인 11개 컴포넌트](#components) |
| 필수 · 목록/상세/로딩/오류 상태와 커스텀 훅 | ✅ | [목록 훅](hooks/use-entries.ts#L13), [상세 훅](hooks/use-entry-detail.ts#L8), [공통 상태 패널](components/shared/state-panel.tsx#L13), [빈 상태와 오류 검증](docs/ACCEPTANCE_TESTS.md#v5-states) |
| 필수 · Supabase 목록·상세·등록·수정·삭제 | ✅ | [목록](hooks/use-entries.ts#L30), [상세](hooks/use-entry-detail.ts#L30), [등록·수정](screens/entry-form-screen.tsx#L79), [삭제](hooks/use-entries.ts#L67), [배포 CRUD 검증](docs/ACCEPTANCE_TESTS.md#v5-crud) |
| 필수 · controlled form, 필수값, 필드 에러, 제출 중, 성공 후 이동 | ✅ | [입력 상태와 제출](screens/entry-form-screen.tsx#L27), [제목·회고·다음 행동 검증](lib/validation.ts#L15), [폼과 스피너](components/journal/entry-form.tsx#L190), [배포 폼 상태 검증](docs/ACCEPTANCE_TESTS.md#v5-forms) |
| 필수 · 이벤트 → 상태 → 렌더링 3곳 이상 | ✅ | [검색·미리보기·성공 알림·로그인 반영](#state-flow), [배포 브라우저 검증](docs/ACCEPTANCE_TESTS.md#v5-browser) |
| 필수 · 공개 배포·GitHub·실행법/스택·환경변수 분리 | ✅ | [배포 사이트](https://flowday-focus.vivleon0510.chatgpt.site/), [저장소](https://github.com/vivleon/flowday-react-spa), [실행 방법](#local-run), [기술 스택](#stack), [환경변수 제외](.gitignore#L29) |
| 보너스 · Context 전역 상태 | ✅ | [로그인·테마·알림 Context](lib/app-context.tsx#L34), [테마 유지와 로그인 반영](docs/ACCEPTANCE_TESTS.md#v5-browser) |
| 보너스 · 메모이제이션 | ✅ | [필터 `useMemo`](hooks/use-entries.ts#L52), [카드 `React.memo`](components/journal/entry-card.tsx#L70), [입력 지연 `useDeferredValue`](screens/entries-screen.tsx#L19), [필터 재요청 없음](docs/ACCEPTANCE_TESTS.md#v5-browser) |
| 보너스 · Supabase Auth와 보호 라우트 | ✅ | [이메일·익명 인증](screens/login-screen.tsx#L50), [보호 라우트](components/auth/protected-route.tsx#L10), [RLS 정책](supabase/migrations/20260904203000_create_flow_entries.sql#L38), [공개 환경 인증 검증](docs/ACCEPTANCE_TESTS.md#v5-auth) |

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
- Libraries.dev Liquid Gooey (`liquid-gooey@0.2.2`, MIT)
- Vitest
- Testing Library

<a id="evaluator-answers"></a>
## 평가용 바로 답변 표

| 질문 | 구현 위치 | 바로 말할 답변 | 검증 근거 |
| --- | --- | --- | --- |
| 화면과 컴포넌트는 어떻게 나눴나요? | [공통 레이아웃](app/layout.tsx#L12), [상세 라우트](app/entries/%5Bid%5D/page.tsx#L3), [목록 화면](screens/entries-screen.tsx#L16), [재사용 UI 11개](#components) | “Vinext App Router로 7개 경로를 구성했습니다. `app`은 경로, `screens`는 화면, `components`는 카드·폼·상태 패널 같은 재사용 UI, `hooks`는 데이터 조회를 맡습니다.” | [7개 경로·전용 404](docs/ACCEPTANCE_TESTS.md#v5-routes), [카드에서 상세로 이동](docs/ACCEPTANCE_TESTS.md#v5-crud) |
| Props와 State의 차이와 배치 기준은요? | [폼 입력 상태](screens/entry-form-screen.tsx#L27), [폼 props](components/journal/entry-form.tsx#L12), [미리보기](components/journal/entry-preview.tsx#L6), [목록 필터 상태](screens/entries-screen.tsx#L16), [Context](lib/app-context.tsx#L34) | “State는 화면이 기억하는 값이고, props는 부모가 자식에게 넘기는 값이나 함수입니다. 등록 화면이 입력값을 저장하고, 폼과 미리보기는 그 값을 props로 받습니다. 검색어와 감정 필터는 목록 화면에, 여러 화면이 공유하는 로그인·테마·알림은 Context에 뒀습니다.” | [입력에 따른 미리보기 갱신](docs/ACCEPTANCE_TESTS.md#v5-forms), [필터·테마 검증](docs/ACCEPTANCE_TESTS.md#v5-browser) |
| `useEffect`는 언제 실행되나요? | [목록 조회 effect](hooks/use-entries.ts#L48), [상세 조회와 정리](hooks/use-entry-detail.ts#L51), [세션 구독](lib/app-context.tsx#L62) | “화면이 반영된 뒤 실행되고 의존성이 바뀌면 다시 실행됩니다. 사용자 ID나 상세 ID가 바뀌면 조회 콜백이 바뀌어 다시 조회합니다. 상세 화면을 벗어나면 진행 중인 조회를 중단합니다. 감정 필터는 받아온 목록 안에서 골라냅니다.” | [로그인 후 조회·상세 이동](docs/ACCEPTANCE_TESTS.md#v5-crud), [감정 필터 변경 중 DB 재요청 0건](docs/ACCEPTANCE_TESTS.md#v5-browser) |
| 비동기 상태는 어떻게 보여주나요? | [공통 패널](components/shared/state-panel.tsx#L13), [상세 조회](hooks/use-entry-detail.ts#L27), [수정 화면 분기](screens/entry-form-screen.tsx#L114), [제출 버튼](components/journal/entry-form.tsx#L190) | “요청 중에는 로딩, 실패하면 오류와 재시도, 조회에 성공했지만 기록이 없으면 빈 상태를 보여줍니다. 저장 중에는 제출 버튼을 잠그고, 수정·삭제는 서버가 변경된 기록 ID를 돌려준 경우에 성공으로 표시합니다.” | [빈 상태·실패 후 재시도](docs/ACCEPTANCE_TESTS.md#v5-states), [제출 중 버튼과 0행 처리](docs/ACCEPTANCE_TESTS.md#v5-forms) |
| 등록 흐름을 설명해 주세요. | [등록 경로](app/entries/new/page.tsx), [필수값 검증](lib/validation.ts#L15), [저장과 상세 이동](screens/entry-form-screen.tsx#L55), [전역 알림](components/shared/notification-center.tsx#L14) | “`/entries/new`에서 입력하면 상태와 미리보기가 바뀝니다. 저장할 때 필수값을 검증하고 Supabase에 등록합니다. 성공하면 알림을 띄우고, 반환된 ID로 상세 화면에 이동합니다.” | [빈 폼·입력·저장](docs/ACCEPTANCE_TESTS.md#v5-forms), [공개 사이트에서 등록·수정·삭제](docs/ACCEPTANCE_TESTS.md#v5-crud) |
| 화면이 어떻게 부드럽게 바뀌나요? | [전환 대상](components/layout/page-transition.tsx#L6), [180ms 진입 CSS](app/globals.css#L121), [Gooey 필터](components/journal/filters-bar.tsx#L38) | “홈·목록·상세 본문만 180ms 동안 투명도와 위치를 바꿉니다. 감정 필터는 기존 선택 상태에 맞춰 Gooey 표시가 움직입니다. 동작 줄이기를 켜면 선택 상태와 콘텐츠를 즉시 확인할 수 있습니다.” | [모바일·키보드·뒤로/앞으로·동작 줄이기](docs/ACCEPTANCE_TESTS.md#v5-browser) |
| 보너스 세 가지는 무엇인가요? | [Context](lib/app-context.tsx#L34), [필터 메모](hooks/use-entries.ts#L52), [카드 memo](components/journal/entry-card.tsx#L70), [Supabase Auth](screens/login-screen.tsx#L50), [보호 라우트](components/auth/protected-route.tsx#L10), [DB 정책](supabase/migrations/20260904203000_create_flow_entries.sql#L38) | “Context로 로그인·테마·알림을 공유하고, `useMemo`와 `React.memo`로 목록 계산과 카드 렌더링을 최적화했습니다. Supabase Auth와 보호 라우트를 적용했고, RLS의 `auth.uid() = user_id` 조건이 DB에서도 각 계정이 자기 기록에만 접근하도록 제한합니다.” | [전역 테마·필터 재요청 확인](docs/ACCEPTANCE_TESTS.md#v5-browser), [인증 검증과 RLS 확인 범위](docs/ACCEPTANCE_TESTS.md#v5-auth) |
| 어떤 환경에서 검증했나요? | [검사 명령](package.json), [Supabase 환경변수 연결](lib/supabase.ts#L5), [실행 방법](#local-run) | “로컬에서 타입·린트·단위 테스트·프로덕션 빌드를 실행했고, 공개 사이트에서는 테스트 계정으로 CRUD를 끝까지 검증했습니다. 환경변수는 로컬과 Sites 배포에 별도로 설정합니다.” | [v5 소스 커밋과 검증 범위](docs/ACCEPTANCE_TESTS.md#v5), [공개 배포](https://flowday-focus.vivleon0510.chatgpt.site/) |

<a id="security"></a>
## 보안 메모

- `.env`와 `.env.remote-test`는 Git 추적에서 제외됩니다.
- 실제 키는 저장소에 커밋하지 않습니다.
- 배포 환경에서는 플랫폼 환경 변수에 별도로 등록해야 합니다.

<a id="release-check"></a>
## 제출 전 최종 검증 메모

2026-11-26 기준 Sites v5 프로덕션과 `81e5e0e` 코드의 검증 근거는 [인수 테스트 기록](docs/ACCEPTANCE_TESTS.md#v5)에 있습니다. 정적 검사 및 빌드, 공개 브라우저 QA, 이전 원격 스크립트 실행 기록을 구분했습니다.

참고: `hooks/use-webmcp.ts`에 imperative WebMCP 등록 코드는 포함했지만, 현재 배포물은 별도 MCP 연결 선언을 하지 않아 Sites 연결 검증 대상에는 포함하지 않았습니다.

배포 URL과 GitHub 저장소 URL은 실제 공개 주소로 반영했습니다.

### 화면 전환과 오류 처리

- `components/layout/page-transition.tsx`에서 홈·기록 목록·상세를 고릅니다. CSS의 `--flow-enter-duration`과 `--flow-enter-offset`으로 강도를 조절합니다. 폼이나 로그인으로 이동할 때 콘텐츠를 지연시키는 퇴장 효과는 없습니다.
- `components/journal/filters-bar.tsx`에서 필터의 기존 `mood` 값으로 장식 표시를 이동시킵니다. 좁은 화면과 동작 줄이기 모드에서는 버튼의 선택 표시만 사용합니다. 필터 전환에 별도 API 호출이 없습니다.
- `useEntryDetail`의 조회 결과가 없으면 공통 빈 상태를, 요청이 실패하면 재시도를 표시합니다. 수정·삭제는 Supabase가 변경된 행 ID를 돌려준 경우에만 성공으로 처리합니다.

모션 디자인 참고: [Libraries.dev Gooey](https://libraries.dev/gooey). 화면 구성과 가독성은 [Hallmark](https://github.com/Nutlope/hallmark)를 참고했습니다.
