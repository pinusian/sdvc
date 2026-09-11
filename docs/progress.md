# 진행 상황

> 마지막 업데이트: 2026-09-12 · 프로젝트: SDVC 웹서비스 · 현재 단계: **Phase 6(결제) — [P6-1]~[P6-6] 완료, 실제 테스트 결제로 등급 상승·해지 강등까지 검증** → 다음 **[P6-7] 체험/해지 시 산출물 처리**

## 1. 지금 어디까지 왔나

- 완료: [P0] 준비 — 계정 일부(Vercel·Supabase 진행중/보류), 게이트 G1·G2, 저장소 `sdvc-app` 생성
- 완료: [P1-1] Specify — `docs/spec.md` (User Story 18개, FR 24개, SC 8개)
- 완료: [P1-2] Clarify — 이메일인증/프로젝트삭제/해지정책/관리자계정 4건 확정
- 완료: [P1-3] Plan — `docs/plan.md` (게이트 G3 승인) — 폴더구조·DB 5표·화면 4개·API 5개·테스트도구(Vitest+Playwright)
- 완료: [P1-4] Tasks — `docs/tasks.md` (게이트 G4 승인) — MVP 4개 버티컬 슬라이스로 분해
- 완료: [P1-5] Analyze — 누락 2건(FR-022 삭제기능 누락, FR-024 관리자메커니즘 불명확) 발견·수정
- 완료: [블록5] Implement 슬라이스 1(Phase 2) 중 **[P2-1] Next.js 뼈대, [P2-2] Vercel 배포, [P2-3] Supabase 연결** — 아래 §4 참조
- 완료: [P2-4] `profiles` 테이블(역할·등급·구독상태) 생성 및 검증
- 완료: [P2-5] 회원가입·로그인 핵심 로직 (TDD 2사이클 완료)
- 완료: [P2-6] 권한 검사 공통 모듈 `can()` (WBS 2.4절 매트릭스 그대로 구현)
- 완료: [P2-7] 관리자 자동승격(FR-024) + 2FA 검사 primitive + **보안 취약점 발견·수정**(자기수정 RLS 허점)
- 완료: [P2-8] 회원가입·로그인·대시보드 실제 화면 + UI 표준 확정(ALCP webapp-reading 디자인 톤 이식)
- 완료: [P2-9] Playwright E2E 4종 통과 + Vercel 프로덕션 환경변수 등록·검증 — **슬라이스 1(로그인·인증) 완전 종료**
- 완료: [P3-1] ANTHROPIC_API_KEY 로컬·Vercel 설정 확인 (실제 API 호출로 키 유효성 검증)
- 완료: [P3-2] 대화 API 뼈대 `/api/chat` (RED→GREEN→REFACTOR 3커밋)
- 완료: [P3-3] SDVC 진행대본을 서버 프롬프트 모듈로 이식 — **슬라이스 2의 핵심 작업** (RED→GREEN + 실제 API 검증 중 발견한 결함 1건 수정)
- 완료: [P3-4] 대화 상태 DB 저장 — `conversations`·`messages` 표, 저장소 모듈, `/api/chat` 계약을 대화 ID 기반으로 전환, `/api/conversations` 2종 추가
- 완료: [P3-5] 채팅 화면(`/conversations/[id]`) — 스트리밍 표시·"생각하는 중"·오류 표시, 대시보드 "새 프로젝트" 연결
- 완료: [P3-6] 승인 게이트 UI — gate 이벤트 → 승인/수정 버튼, 승인 시에만 다음 블록
- 완료: [P3-7] 슬라이스 2 검증 — 실제 Claude API로 브라우저에서 헌장→명세→명확화→계획까지 진행 확인, E2E 3종 추가. **슬라이스 2(SDVC 엔진) 완전 종료**
- 완료: [P4-1] Storage 비공개 버킷 `artifacts` 생성(스크립트로 재현 가능) · [P4-2] `projects` 표(주소 slug·공개범위·상태)
- 완료: [P4-3] 파일 생성·저장·삭제 로직 (TDD 4사이클) · [P4-4] 생성 진행 표시와 대시보드 프로젝트 목록
- 완료: [P4-5] 슬라이스 3 검증 — **실제 Claude가 만든 index.html·style.css가 Storage에 저장되는 것 확인**. **슬라이스 3 완전 종료**
- 완료: [P4-6] 확인 버튼 미표시 수정 · [P5-1] `/site/{주소}` 서빙 · [P5-3] 공개범위 변경 · [P5-4b] 이어서 수정 진입점
- 완료: **[P5-5] ★게이트 G5 통과 → MVP(슬라이스 1~4) 완료** (가입→대화→생성→공개→열람 전 구간 실제 실행)
- 완료: [P6-2] 사용량 기록·월 집계 · [P6-3] 접근 판정 모듈 · [P6-4] `/api/chat`에 체험·한도 차단 연결
- **다음: [P6-5] Stripe Checkout 연동 — 사용자의 Stripe 가입·키 등록이 선행되어야 함**
  - [P5-2](파일형식·자산 처리)는 [P5-1]에서, [P5-4](목록 화면)는 [P4-4]에서 선행 완료
  - 미결: `/conversations/[id]` 경로를 plan.md 원안대로 `/projects/[id]/chat`으로 옮길지

## 2. 방금 세션에서 한 일 (2026-09-11, 슬라이스 4 완결 → **MVP 완료**)

- **사용자 요구 반영**: "개발자가 자기 프로젝트의 버그 수정·기능 추가를 SDVC에게 요청할 수 있어야 한다" → 이미 명세에 있던 US-D7·US-D8을 **P3에서 P2로 상향**, 진입점 **FR-025** 신설, tasks.md에 **[P5-4b]** 추가해 MVP 안에서 구현. 본체(버그 등록·추적 P7-2/3, 기능요청 흐름 P7-4, 롤백 P7-6)는 Phase 7 유지. 커밋 `4415862`.
- **[P4-6]** 확인 버튼 미표시 수정(사용자 신고) · **[P5-1]** `/site/{주소}` 서빙 · **[P5-3]** 공개범위 설정 · **[P5-4b]** 이어서 수정 진입점 · **[P5-5]** 게이트 G5. 상세는 §4.
- **MVP(슬라이스 1~4) 완료.** "대화 → 홈페이지 완성 → 남에게 URL 공유"가 실제로 작동함을 전 구간 실행으로 확인(§3).
- 이번 세션의 교훈: **실제로 브라우저에서 열어봐야만 드러나는 결함이 압도적으로 많다.** [P5-1] 하나에서만 4건이 나왔고 그중 2건(CDN 캐시 구멍, CSP-쿠키 충돌)은 프로덕션에서만 재현됐다.
- 환경 메모: **curl이 샌드박스에 막혔다**(`Bad access`) → HTTP 확인은 `node -e "fetch(...)"`로. 브라우저 창은 **프로덕션 도메인의 JS·CSS를 차단**(ERR_BLOCKED_BY_CLIENT)하므로 화면 조작 검증은 로컬 프로덕션 빌드(127.0.0.1)로 한다.

## 2-1. 그 앞 세션 (2026-09-11 새벽, 슬라이스 3)

- 슬라이스 3(Phase 4, 산출물 생성·저장) **[P4-1]~[P4-5] 전부 완료**. 작업별 상세는 §4.
- 사용자 지시로 **작업 ID 하나([P#-#])를 마칠 때마다 보고하고 확인받는 방식**으로 진행함.
- 사용자 작업 1건: Supabase SQL Editor에서 `0004_projects.sql` 실행.
- **설계 결정 4가지**
  1. Storage 버킷은 **비공개**. 공개 버킷이면 URL을 아는 누구나 항상 볼 수 있어 공개범위(FR-007)와 해지 시 즉시 비공개(FR-023)가 무력화된다. 서버가 권한을 확인하고 대신 내보낸다.
  2. 파일은 ```` ```file:경로 ```` 표시가 붙은 코드블록만 저장한다. 설명용 코드블록과 구분하기 위해서.
  3. **모델이 만든 경로는 믿지 않는다** — `../`·절대경로·백슬래시·허용 외 확장자는 버린다.
  4. 삭제는 **파일 먼저, 기록 나중**. 반대면 주인 없는 파일이 저장소에 영영 남는다.
- 발견·수정한 결함 4건: ①대화 저장소가 `title`·`project_id`를 안 읽어와 매번 새 프로젝트가 생길 뻔함 ②발행 결과의 상태가 실제와 달랐음 ③**구현 단계에서 max_tokens(8192)에 걸려 파일이 미완성으로 잘렸고 아무 안내가 없었음** ④잘린 응답을 사용자가 알 방법이 없었음

## 3. 검증 증거 (실제 실행한 명령과 결과)

### [P6-1~P6-6] 실제 테스트 결제 한 바퀴 (2026-09-12, Stripe 테스트 모드 + Vercel 프로덕션)

1. **결제**: 테스트 카드 4242…로 기본 요금제($12/월) 결제 → Stripe `checkout.session.completed` 발생, 세션 `complete`/`paid`
2. **웹훅 도착**: Vercel 프로덕션 `/api/billing/webhook`이 받아 `subscription_status: none → active`, `stripe_customer_id` 연결
3. **등급 전환**: `grade: trial → basic` (구독 갱신 이벤트로 확인)
4. **해지 강등**: 구독 해지 → `subscription_status: canceled`, `grade: basic → trial` **자동**
5. **위조 차단**: 잘못된 서명으로 웹훅 호출 → **400**(아무것도 바꾸지 않음)

**검증 중 발견·수정한 결함 2건**
- ⚠️ **웹훅 이벤트 설정 누락**: 사용자가 등록한 목적지에 `invoice.payment_failed` 하나만 체크돼 있어 결제 알림이 오지 않았다. 원인을 Stripe API로 확인하고(등록된 enabled_events 조회) 사용자 허락을 받아 4개로 수정.
- ⚠️ **결제했는데 등급이 안 올라감**: `checkout.session.completed` 이벤트에는 산 가격이 담겨 오지 않아, "모르면 건드리지 않는" 설계대로 등급을 그대로 뒀다 — 상태만 active가 되고 한도는 체험 그대로. 세션 생성 시 `metadata[price_id]`를 실어 보내도록 수정(`a61967c`).

### ★게이트 G5 — MVP 전 구간 실제 실행 (2026-09-11)

로컬 프로덕션 빌드 + **실제 Claude API**로 처음부터 끝까지:

1. **가입**: `/signup`에서 실제 폼 제출 → "메일함을 확인해주세요" 화면. DB에 계정 생성, `profiles` 자동 생성(`role=developer`, `grade=trial`, 체험 만료 7일 뒤) 확인
2. **인증·로그인**: 메일 링크 대신 관리자 API로 인증 처리 → 로그인 → 대시보드("체험 등급", 빈 목록)
3. **대화**: "새 프로젝트" → 블록 1에서 "동네 커피숍 홈페이지" 요청 → **헌장 4종 추천 → 명세(User Story·FR·SC·제외항목) → 명확화 5문항 → 계획(+헌장 점검표) → 작업 분해(버티컬 슬라이스) → 구현**까지 5개 블록 전부 통과. 각 단계 승인 버튼으로 이동
4. **생성**: "홈페이지 파일을 만드는 중…" → **"홈페이지가 만들어졌습니다 (파일 7개)"**. Storage에 `index.html`·`css/`·`images/`·`tests/`·`package.json` 등 저장
5. **공개**: 대시보드에서 "링크를 아는 사람만 봅니다"로 변경 → "주소 복사" 표시
6. **열람**: 로그인 없이 `/site/site-u87j41` → **200**, 제목 "동네 커피숍", `<base>` 주입 확인, `css/style.css`(text/css)·`images/hero.svg`(image/svg+xml) 모두 200, `x-robots-tag: noindex`
7. **프로덕션에서도 동일 확인**: `https://sdvc-app.vercel.app/site/site-u87j41` → 200, CSS·이미지 200, CSP sandbox 적용

즉 **"대화 → 홈페이지 완성 → 남에게 URL 공유"가 실제로 작동한다.**

- [P5-5] 최종: `npm run test` → **Tests 198 passed (24 files)**, `npx playwright test` → **15 passed**, lint 무경고, build 통과.

- [P5-4b] 최종: `npm run test` → **Tests 198 passed (24 files)**, `npx playwright test` → **14 passed**, lint 무경고, build 통과.
  (첫 실행에서 3건 실패했으나 서버 기동 중 포트 경합이었고 재실행 시 재현되지 않음 — 코드 문제 아님)
- **[P5-4b] 실제 Claude로 "이어서 수정" 검증**(로컬 프로덕션 빌드 + 실제 API): 기존 홈페이지(제목 "원래 제목입니다", h1 파랑)의 대화로 "이어서 수정"으로 들어가 "제목을 바꾸고 글자색을 초록으로" 요청 → `index.html`의 제목·h1이 바뀌고 `style.css`의 `h1{color:green}`으로 갱신됨. **같은 프로젝트에 덮어써졌고 새 프로젝트는 생기지 않음**(프로젝트 수 그대로), 사이트 200.
- [P5-3] 프로덕션 공개범위 실검증: 비공개 **404** → 링크공개 **200**(noindex) → 전체공개 **200**(검색 허용) → 다시 비공개 **404 즉시**.

- [P4-5] 최종: `npm run test` → **Tests 152 passed (21 files)**, `npx playwright test` → **10 passed**(슬라이스1 4 + 슬라이스2 3 + 슬라이스3 3), lint 무경고, build 통과.
- [P4-1] 버킷 권한 실검증: 서버키 업로드·다운로드 OK / Supabase 공개 URL 404 / 브라우저키 다운로드·업로드 모두 차단(RLS).
- [P4-2] `projects` 제약 실검증: 주소 중복 거부, 잘못된 주소 6종(`AB`·`Has Space`·`대문자Slug`·2자·앞뒤 하이픈) 전부 거부, 없는 공개범위 값 거부, 외래키 작동, **프로젝트 삭제해도 대화는 남음**(project_id=null), 브라우저키 읽기·쓰기 차단.
- [P4-3] 통합 검증(임시 계정): 파일 2개 저장(하위 폴더 포함), 설명용 코드블록·`../` 경로는 저장 안 됨, 한글 이름 → `site-xxxxxx` 주소, 다시 만들기 시 같은 프로젝트에 덮어쓰기, 삭제 후 파일 0개.
- **[P4-5] 실제 Claude로 홈페이지 생성 성공**(로컬 프로덕션 빌드 + 실제 API): 구현 단계에서 "만들어주세요" → 화면에 "홈페이지 파일을 만드는 중…" → **"홈페이지가 만들어졌습니다 (파일 2개)" + 주소 `/site/site-jdterm`**. Storage 확인: `index.html`(1540B, text/html), `style.css`(1063B, text/css), 내용은 `<!doctype html>`로 시작하는 실제 한국어 홈페이지이고 style.css를 정상 연결. DB: `status=deployed`, 대화-프로젝트 연결 OK.
  대시보드에서 목록 확인 → 삭제(2단계 확인) → **프로젝트 행 0건, Storage 파일 0개, 대화는 보존**.

- [P3-1~P3-3] `npm run test` → **Test Files 11 passed / Tests 61 passed**, `npm run lint` 무오류, `npm run build` ✓ Compiled successfully (라우트 8개, `/api/chat` 포함)
- [P3-3] **실제 Claude API로 이식된 대본 검증** (`claude-sonnet-5`, block=plan, max_tokens 4000): 응답에 화면 구성·폴더 구조·**헌장 점검 표**·승인 선택지 3종("예, 이대로 진행(권장)"/"일부 수정"/"다시 설명")이 대본 지시대로 나왔고, 마지막 줄에 `<<SDVC_GATE:plan>>` 마커가 정확히 출력됨. block=constitution_specify로는 헌장 4종 추천 + 쉬운 말 비유가 나오는 것 확인.
- [P3-7] 최종: `npm run test` → **Tests 94 passed (14 files)**, `npx playwright test` → **7 passed**(슬라이스1 4종 + 슬라이스2 3종). 프로덕션 재배포 확인: `https://sdvc-app.vercel.app/api/health` 4개 플래그 모두 true, `/conversations/<id>` 307(비로그인 리다이렉트 = 라우트 배포됨).
- [P3-4~P3-6] `npm run test` → **Test Files 14 passed / Tests 92 passed**, `npm run lint` 무경고, `npm run build` ✓ (라우트 11개: `/api/chat`, `/api/conversations`, `/api/conversations/[id]`, `/conversations/[id]` 추가)
- [P3-5] 자체 결함 1건: jsdom에 `scrollIntoView`가 없어 스트리밍이 첫 청크에서 중단됐다 → `?.()`로 있을 때만 호출하도록 수정(테스트가 잡아냄).
- [P3-3] **검증 중 결함 1건 발견·수정**: 모델이 계획 수립 같은 요청에서 **스스로 확장 사고(thinking)를 켜는데**, 그동안 `text_delta`가 안 나와 화면이 멈춘 것처럼 보였다(max_tokens가 작으면 사고만 하다 끝나 아예 빈 응답). 사고 내용은 감추되 `{"type":"thinking"}` 신호를 한 번 보내도록 RED→GREEN으로 수정.

- `gh repo create sdvc-app --private` 및 `git push -u origin main` 성공 확인 (`gh repo view` → isEmpty:false)
- `node -v` → v24.19.0 확인
- [P2-1] `sdvc-app`에서 실제 실행:
  ```
  $ npm run test
  Test Files  1 passed (1)
       Tests  1 passed (1)

  $ npm run lint
  (오류 없음)

  $ npm run build
  ✓ Compiled successfully in 20.8s
  Route (app): / , /_not-found (모두 Static)
  ```
  커밋: `6e00a8b` (sdvc-app 저장소)

## 4. 다음 세션이 이어서 할 일

- [x] **[P2-1] 완료** — `SDVC-app/` (GitHub `pinusian/sdvc-app`)에 Next.js **16**(App Router)+TypeScript+Tailwind 뼈대 생성. Vitest+Playwright 테스트 도구 설정, 스모크테스트 통과. `npm run test`/`lint`/`build` 전부 실행 확인함(아래 §3 증거).
  **주의**: plan.md엔 "Next.js 14"라 적었으나 실제 설치판은 **16.3.4**(React 19.2.8) — AGENTS.md 경고에 따라 실제 문서(`node_modules/next/dist/docs`) 확인 후 진행함. params/searchParams가 Promise, PageProps/LayoutProps 전역 헬퍼 타입 사용 등 컨벤션 차이 있음 — 다음 작업(P2-5 이후) 코드 작성 시 계속 유의할 것.
- [x] **[P0-2]+[P2-2] 완료** — Vercel 가입(이메일 `parkbctop@hotmail.com`) 성공, GitHub(`pinusian`) 연결, `sdvc-app` 첫 배포 성공.
  **프로덕션 도메인(정정): https://sdvc-app.vercel.app** — `sdvc-app-b5vk.vercel.app`은 오배포 화면에 표시된 보조 도메인이고 실제 기본 도메인이 아니었음. 이 착오로 [P2-9] 이후 한동안 잘못된 URL로 프로덕션을 확인해 혼선을 빚음 — **앞으로는 반드시 `sdvc-app.vercel.app` 기준으로 확인할 것.**
  문제 해결 이력: 최초 배포가 "Installing dependencies..."에서 실패 → npm peer-dependency 충돌(로컬에서 이미 겪었던 것과 동일) → `.npmrc`(legacy-peer-deps=true) 추가로 해결, 재배포 성공(sdvc-app 커밋 `4db547f`)
- [x] **[P0-1]+[P0-3]+[P2-3] 완료** — Anthropic 키·Supabase 프로젝트 준비 확인됨. `lib/supabase/{client,server}.ts` 작성(Next.js 16 cookies() Promise 반영), `.env.example`을 Supabase 신규 키 명칭(publishable/secret key)으로 갱신, `/api/health` 라우트로 연결 확인.
  로컬 `.env.local`로 종단간 검증: publishable key→`/auth/v1/health` 200 / secret key→`/rest/v1/` 200.
  진행 중 오류 2건 발견·수정: URL에 대시보드 링크를 넣었던 것(→API URL로 정정), `.supabase.com` 오타(→`.co`로 정정). 헬스체크 라우트 자체도 잘못된 엔드포인트(secret key 필요한 곳을 publishable key로 호출) 쓰고 있던 걸 수정(`bd5f6b4`).
  **⚠️ Vercel 프로덕션 환경변수는 아직 미등록** — 로컬만 확인됨. [P2-9] 슬라이스 검증 전까지 Vercel 대시보드에도 등록 필요.
- [x] **[P2-4] 완료** — `supabase/migrations/0001_profiles.sql` 작성, 사용자가 Supabase SQL Editor에서 직접 실행.
  검증(secret key로 REST 조회): status=200, 컬럼 9개(id/email/role/grade/trial_ends_at/stripe_customer_id/subscription_status/created_at/updated_at) 확인.
  RLS 검증: publishable key(비로그인)로 조회 시 0행 반환 → 본인 행만 보이는 정책이 실제로 작동함 확인.
  설계 결정: ADMIN_EMAIL 기반 관리자 승격은 DB 트리거가 아니라 [P2-7] 애플리케이션 코드에서 처리(트리거에 env var 넘기는 것보다 단순).
  커밋: `23cd87c`(sdvc-app)
- [x] **[P2-5] 완료** — `src/lib/auth/{validation,signup,login}.ts`. Supabase 클라이언트를 인자로 주입받는 구조라 실제 네트워크 없이 테스트 가능. 이메일인증(FR-021)은 emailRedirectTo로 처리. TDD 2사이클(회원가입/로그인) 모두 RED→GREEN 커밋 분리(`6a20081`→`3943506`, `57f5da4`→`0d23425`).
  참고: 빌드 타입체크가 테스트 목(mock)의 `as never` 캐스팅 오류를 잡아냄 — vitest는 타입체크 안 하므로 `npm run build`까지 꼭 돌려야 함.
  화면(UI)은 아직 없음 — [P2-8]에서 만듦.
- [x] **[P2-6] 완료** — `src/lib/permissions/check.ts`의 `can(actor, action, subject)`. 관리자=전권, 개발자=project:create 가능+소유권행위(read/update/delete/visibility)는 자기 것만, 관리자전용 행위 항상 거부, subject 누락 시 안전하게 거부(fail-closed).
  이후 모든 API 라우트(Phase 4~8)는 처리 전에 이 함수로 검사해야 함 — 잊지 말 것.
- [x] **[P2-7] 완료** — `src/lib/auth/admin.ts`: `ensureAdminRole`(FR-024, ADMIN_EMAIL 일치 시 admin 승격) + `hasVerifiedMfa`(세션 aal2 검사 primitive, MFA 등록 UI는 P8-1로 미룸).
  **보안 취약점 발견·수정**: [P2-4]에서 만든 `profiles_update_own` RLS 정책이 컬럼 제한 없어 개발자가 자기 role을 admin으로 직접 바꿀 수 있는 허점 발견 → `0002_profiles_lockdown.sql`로 정책 제거, 이후 profiles 쓰기는 전부 secret key 서버 코드로만.
  실제 Supabase 종단간 검증(임시 유저 생성→테스트→정리, 커밋 `9298cd2`): 자기수정 시도 0행 변경 확인, ensureAdminRole 실제 DB role 변경 확인(일반이메일→developer 유지, ADMIN_EMAIL일치→admin 변경).
- [x] **[P2-8] 완료** — signup/login/verify-email/dashboard 화면, Server Actions(signupAction/loginAction/logoutAction)로 [P2-5]~[P2-7] 로직 연결. 재사용 컴포넌트 Button/Card/Field.
  **UI 표준 확정**: '독서활동'(reading-activity-example)은 서브에이전트 6종뿐 실제 UI 없음 → ALCP 프로젝트(`C:\Users\USER\AI_Code_Study\webapp-reading`)의 실제 디자인("따뜻한 종이질감+세리프 타이틀+세이지그린")을 SDVC 기본 UI 표준으로 채택(사용자 확정). Tailwind v4 `@theme`로 색상·폰트(Fraunces+Noto Sans KR)·둥글기·그림자 토큰화(`globals.css`, `layout.tsx`).
  **실제 브라우저 E2E 수동 검증 완료**(로컬 dev서버 + Gmail `+`별칭 실계정, 종료 후 관리자API로 정리): ①/signup 디자인 확인(스크린샷) ②잘못된 이메일(example.com) 제출→Supabase 오류 실시간 표시 ③유효 이메일 가입→/verify-email 리다이렉트 ④미인증 상태 로그인 시도→"Email not confirmed" 차단(FR-021 실증) ⑤관리자API로 인증처리→재로그인→대시보드 진입(이메일·등급 정상 표시, 스크린샷) ⑥로그아웃→/login 복귀. Playwright 자동화는 [P2-9]에서 정식화.
  커밋: `90184e4`(sdvc-app)
- [x] **[P2-9] 로컬 검증 완료** — `e2e/auth.spec.ts` 4개 작성·전부 통과: 이메일형식 서버측검증(Supabase 미호출), 미인증계정 로그인차단(FR-021), 인증된 개발자 로그인→대시보드→로그아웃, 미로그인시 대시보드 접근차단.
  **트러블슈팅**: 처음엔 실제 `auth.signUp()`으로 매 테스트 가입 → Supabase 무료플랜 이메일 발송 한도("email rate limit exceeded")에 걸려 실패 → `admin.createUser()`(확인메일 미발송)로 계정을 미리 만들어두는 방식으로 재설계해 해결. 이메일 형식 테스트도 브라우저 기본 `type="email"` 검증이 우리 서버검증 전에 막던 문제 발견 → 점(.) 없는 이메일로 교체해 해결.
  커밋: `c6962e9`(sdvc-app)
- [x] **Vercel 프로덕션 환경변수 5종 등록 완료 및 검증** — `https://sdvc-app.vercel.app/api/health` → `{supabaseUrlConfigured:true, supabaseKeyConfigured:true, supabaseReachable:true, anthropicKeyConfigured:true}`. 루트 `/`도 500→307(정상 리다이렉트)로 회복.
  **트러블슈팅 과정**(참고용): ①환경변수 저장 직후엔 재배포가 자동으로 일어나지 않는다는 걸 몰라 혼선 ②`NEXT_PUBLIC_*` 변수를 처음에 "Secret" 타입으로 저장했다가 "Config"로 전환 불가 → 삭제 후 Config로 재생성 ③재배포 후에도 계속 false로 나와 원인 조사 → **`sdvc-app-b5vk.vercel.app`이 실제 프로덕션 기본 도메인이 아니었음**(진짜는 `sdvc-app.vercel.app`)이 근본 원인으로 밝혀짐. Vercel 최신 UI(Environment Variables가 별도 사이드바 메뉴로 분리, Domains도 프로젝트 세팅 하위)라 경로 찾기에 시간이 걸림.
  **슬라이스 1(로그인·인증) 완전 종료** — 로컬(P2-1~P2-9)과 프로덕션 모두 검증 완료.

### 슬라이스 2(Phase 3, SDVC 엔진) 7작업 (tasks.md 기준)

- [x] **[P3-1] 완료** — `.env.local`에 5종 모두 채워져 있음을 확인(값은 출력하지 않고 존재 여부만 점검). 실제 Anthropic API 호출로 키 유효성 검증: `GET /v1/models` → 200, 사용 가능 모델에 `claude-sonnet-5`·`claude-opus-5` 확인. Vercel 프로덕션은 [P2-9]에서 이미 `anthropicKeyConfigured:true`.
- [x] **[P3-2] 완료** — `src/lib/claude/chat.ts`(Anthropic Messages 스트리밍 호출) + `src/app/api/chat/route.ts`.
  설계: ①fetch를 주입받아 네트워크 없이 테스트 가능([P2-5]와 같은 구조) ②바깥으로는 SSE가 아니라 **NDJSON 이벤트**(`{"type":"text"|"thinking"|"done"|"error"}`)를 흘림 — [P3-6] 승인 게이트처럼 텍스트 아닌 사건을 같은 통로로 추가하려고 ③라우트가 `role`을 user/assistant로만 제한 — 클라이언트가 system을 끼워넣어 진행대본을 덮어쓰지 못하게.
  REFACTOR에서 직접 만든 ReadableStream → `TransformStream`으로 교체(역압 확보). 커밋 `fab149c`→`126b590`→`9329f5f`.
- [x] **[P3-3] 완료** — `src/lib/sdvc/blocks.ts`(5블록·7단계·게이트 위치·`advanceBlock` fail-closed) + `src/lib/sdvc/prompt.ts`(`buildSystemPrompt`). 라우트가 `block`·`projectName`을 받아 해당 블록 프롬프트를 system으로 전달, 모르는 block은 400.
  대본 준수를 테스트로 고정: 블록 순서, 7단계 배치, 게이트는 Plan·Tasks에만, 관통 규칙 4가지(예시 답안/쉬운 말/증거 기반/승인 게이트) 전 블록 포함, 헌장 보안 규칙 포함, 서버 비밀값 미포함.
  커밋 `aa93e6c`→`d16a07d`, 결함 수정 `a6a31ca`→`4db52f9`.
- [x] **[P3-4] 완료** — `supabase/migrations/0003_conversations.sql`(conversations·messages, 둘 다 RLS 켜고 정책 없음 = 서버 전용) + `src/lib/conversations/store.ts`(모든 접근에 owner_id 조건 직접 부여).
  `/api/chat` 계약 변경: 클라이언트는 `conversationId`와 이번 메시지만 보내고, 기록과 진행 단계는 서버가 DB에서 읽는다(클라이언트가 단계를 건너뛸 수 없음). 응답 스트림에서 `<<SDVC_GATE:…>>` 마커를 걷어내 `gate` 이벤트로 바꾸고, 마커 뺀 답변을 저장.
  `/api/conversations`(POST 생성) · `/api/conversations/[id]`(GET 불러오기) 추가. 커밋 `e2968fc`→`2a7662b`→`ea69cb7`.
- [x] **[P3-5] 완료** — `src/components/chat/ChatView.tsx` + `/conversations/[id]` 화면 + 대시보드 "새 프로젝트" 버튼.
  NDJSON을 한 줄씩 읽어 답변을 이어붙이고, `thinking` 이벤트에 "생각하는 중…" 표시, 전송 중 재전송 차단. 커밋 `ed05e31`→`13ef996`.
  **경로 결정**: plan.md의 `/projects/[id]/chat`은 projects 표가 생기는 [P4-2] 이후로 미루고, 지금은 `/conversations/[id]`를 쓴다.
- [x] **[P3-6] 완료** — gate 이벤트를 받으면 "예, 이대로 진행"/"수정할 게 있어요" 버튼 표시. 승인만 `approved:true`로 재요청하고, 서버는 그때만 다음 블록으로 옮긴 뒤 `block` 이벤트로 화면 표시를 갱신. 커밋 `fc3cea9`.
- [x] **[P3-7] 완료** — 사용자가 `0003_conversations.sql` 실행 후 실브라우저 검증. 커밋 `4477ad0`·`4c6e487`.
  **실제 대화 진행 증거**(로컬 dev + 실제 Claude API, 테스트계정은 관리자API로 생성 후 삭제): "홈페이지 만들고 싶어" → 블록1에서 헌장 4종을 표로 쉬운 말 설명 + 예시 답변 → 답변 후 명세(User Story P1/P2, FR-001~, SC-001~) 생성 → 승인 버튼 → **블록 2 명확화** 5문항 객관식(권장안+예시답변) → 승인 → **블록 3 계획**: 폴더구조·화면구성·**헌장 점검 표**·승인 선택지 3종. `.env.example`은 빈 틀만 만들겠다고 스스로 말함(헌장 보안규칙이 실제로 작동).
  DB 확인: `conversations.current_block='plan'`, 메시지 14건 저장, **마커가 남은 메시지 0건**(화면·DB 모두 새어나오지 않음).
  **검증 중 결함 1건 발견·수정**: 게이트 블록(Plan·Tasks)에만 마커를 지시했더니 헌장·명확화 블록에서는 사용자가 "예"라고 해도 **다음 블록으로 갈 방법이 자체가 없었다**(단계 이동은 마커→확인버튼으로만 일어나므로). → 모든 블록이 마커를 내도록 변경. 추가 예방책으로 "사용자가 말로 예라고 해도 다음 블록 일을 미리 시작하지 말고 확인 버튼을 다시 띄운다"를 프롬프트에 명시.
  `e2e/chat.spec.ts` 3종 추가: 스트리밍 표시·마커 감추기·승인 게이트 전환 / 저장된 대화 복원 / 남의 대화 404.
  **주의**: Anthropic 호출은 **서버**가 하므로 Playwright의 `page.route('https://api.anthropic.com/...')`로는 못 막는다(처음에 이렇게 짰다가 실패). `/api/chat` 응답 자체를 대신 돌려주는 방식으로 작성했다.

### 슬라이스 3(Phase 4, 산출물 생성·저장) — 완료

- [x] **[P4-1] 완료** — Supabase Storage 비공개 버킷 `artifacts`(파일당 5MB). 대시보드 수작업 대신 `scripts/setup-storage.mjs`로 남겨 재현 가능. 커밋 `e941c2a`.
- [x] **[P4-2] 완료** — `supabase/migrations/0004_projects.sql`(사용자가 실행). 주소 slug는 소문자·숫자·하이픈 3~40자 + 전체 고유. `conversations.project_id` 외래키 연결(프로젝트 삭제해도 대화는 보존). 커밋 `530f9e9`·`facdcdb`.
- [x] **[P4-3] 완료** — TDD 4사이클. `lib/projects/slug.ts`(한글 이름 → `site-xxxxxx`), `lib/artifacts/parse.ts`(```` ```file:경로 ```` 블록만, 위험 경로·확장자 차단, 개수·크기 상한), `lib/artifacts/storage.ts`(업로드·재귀 삭제), `lib/projects/store.ts`, `lib/artifacts/publish.ts`(발행 오케스트레이션), `DELETE /api/projects/[id]`(FR-022). 커밋 `df849e4`~`e71cb17`.
- [x] **[P4-4] 완료** — 채팅 화면의 "만드는 중" 표시와 완성 안내(주소·열어보기), 대시보드 프로젝트 목록(상태·공개범위·2단계 확인 삭제). 커밋 `0cfc7ba`·`e0d0c18`.
- [x] **[P4-5] 완료** — 실브라우저 검증(위 §3) + `e2e/artifacts.spec.ts` 3종. 검증 중 발견한 결함 수정: 구현 단계 max_tokens를 32000으로, `truncated` 이벤트와 "이어서 계속" 버튼 추가. 커밋 `daf41f1`·`ddfd8cf`.

- [x] **[P4-6] 완료(사용자 신고 대응)** — 명확화 단계에서 모델이 "아래 확인 버튼을 눌러주시면"이라고 안내했는데 **화면에 버튼이 없어 진행이 막힌** 문제. 원인 둘 다 대응: ①모델이 마커를 빠뜨림 → 프롬프트에 "버튼을 말로 언급했다면 반드시 표시를 함께 낸다" 명시 ②게이트 안내가 메모리에만 있어 **새로고침하면 사라짐** → 단계 표시줄에 **"다음 단계로 →" 버튼을 항상** 배치(마지막 블록에서는 감춤, 대기 중에는 비활성). 실브라우저로 신고 상황 재현·확인(블록2→3 이동, DB `current_block=plan`). 커밋 `77324e1`·`38f7fe8`.

### 슬라이스 4(Phase 5, 산출물 URL 서빙) — 진행 중

- [x] **[P5-1] 완료** — `/site/{주소}` 서빙. `lib/projects/access.ts`(`canViewArtifact`: 비공개=주인만 / 링크·전체공개=누구나 / 미완성은 주인만 / 모르는 값이면 막음) + `app/site/[slug]/[[...path]]/route.ts`. 볼 수 없으면 403이 아니라 **404**(존재 자체를 숨김). 커밋 `3f53c2f`→`c532dfb`→`3454be3`→`d03ecb7`.
  **프로덕션 검증에서 결함 4건 발견·수정** (전부 실제로 열어봐야 드러난 것):
  1. Supabase Storage가 html을 `text/plain`으로 돌려줘 홈페이지가 **소스코드로 보였다** → 확장자로 우리가 판단.
  2. 상대 경로가 깨졌다(`css/style.css` → `/site/css/style.css`). Next.js가 앱 전체에서 끝의 `/`를 떼므로 리다이렉트로는 못 고침 → HTML `<head>`에 `<base href="/site/{주소}/">` 주입.
  3. **CDN 캐시 구멍**: 전체공개 응답을 CDN이 60초 캐시한 뒤 비공개로 바꿔도 캐시본이 계속 200으로 나갔다(`X-Vercel-Cache: HIT`, Age 44). → 어떤 공개범위든 공용 캐시에 남기지 않음. FR-023(해지 시 즉시 비공개)이 여기에 걸려 있었다.
  4. **CSP sandbox와 쿠키의 충돌**: 가둬진 문서의 요청에는 SameSite 쿠키가 실리지 않아 **비공개 사이트의 CSS·JS가 전부 404**였다 → 링크·전체공개만 sandbox, 비공개는 주인 본인만 보므로 sandbox 없이. 근본 해결은 **산출물 전용 도메인**(Phase 6 이후 과제).
- [x] **[P5-3] 완료** — 공개범위 변경 (FR-007). `setProjectVisibility` + `PATCH /api/projects/[id]/visibility`(세 값만 허용) + 대시보드 선택기("비공개 — 나만 봅니다" / "링크를 아는 사람만 봅니다" / "누구나 봅니다") + 공개 시 "주소 복사". 화면을 먼저 바꾸되 실패하면 되돌린다(비공개인데 공개된 것처럼 보이면 안 되므로). 커밋 `4f176d5`→`34e42ce`→`595a57e`.
  프로덕션 실검증: 비공개 404 → 링크공개 200(noindex) → 전체공개 200(검색허용) → **다시 비공개 즉시 404**.
- [x] **[P5-4b] 완료 (사용자 요구 반영, FR-025)** — 개발자 모드의 버그 수정·기능 추가 진입점. `findConversationsByProjects` + 대시보드 **"이어서 수정"** 링크 + 유지보수용 프롬프트(이미 배포된 프로젝트면 "전체를 새로 만들지 말고 **고칠 파일만**", 버그는 **재현** 방법 먼저(SC-008), 헌장부터 다시 묻지 않기). 커밋 `35858db`→`50dac8c`→`8d38687`.
  **실제 Claude로 검증**: 기존 홈페이지의 대화로 들어가 "제목 바꾸고 글자색 초록으로" 요청 → index.html·style.css가 **같은 프로젝트에 덮어써짐**(새 프로젝트 안 생김), 사이트 200.
  테스트가 잡은 버그 1건: `conversation.projectId !== null`이 undefined일 때 참이 되어 프로젝트 없는 대화에도 유지보수 안내가 붙었다 → `Boolean()`.
- [x] **[P5-5] 완료 (★게이트 G5 통과)** — MVP 전 구간을 **실제 Claude로 한 번에** 돌렸다(아래 §3 증거). 자동 회귀는 `e2e/journey.spec.ts`. 커밋 `270323c`.
  자동화하지 않은 두 구간과 이유: ①**실제 가입 폼** — Supabase 무료 플랜 확인메일 한도(실가입으로 짰다가 2회차에서 바로 막힘). 사람이 한 번 통과시켜 확인했고 입력 검증은 auth.spec이 담당 ②**실제 Claude 대화** — 매 실행 비용·시간. [P5-5]에서 실제로 돌려 확인.
  간헐 실패 1건 수정: 공개범위는 화면이 먼저 바뀌고 저장이 나중이라 저장 응답을 안 기다리면 열람이 404로 잡혔다 → `waitForResponse`로 고정.

### 🎉 MVP(슬라이스 1~4) 완료

- 남은 MVP 미결: `/conversations/[id]` 경로를 plan.md 원안대로 `/projects/[id]/chat`으로 옮길지(기능엔 영향 없음)

### 슬라이스 5(Phase 6, 결제·등급) — 진행 중

착수 전 Clarify 4건 확정(spec.md FR-026~028): 한도 초과=즉시 차단+업그레이드 안내 /
체험 만료=즉시 비공개+**10일** 유예(해지는 30일) / Stripe는 테스트 모드 먼저 / 통화는 USD.

- [x] **[P6-2] 완료** — `usage_logs` 표 + `lib/usage/{pricing,store}.ts`. Anthropic이 알려준 **실제 사용량**(추정 아님)을 기록하고 그때 단가로 원가를 남긴다. 모르는 모델은 가장 비싼 단가로 잡는다(원가를 낮게 잡으면 적자). 커밋 `f43374a`→`0d6d7d8`→`e2c19b3`.
  실검증: 서버키 기록 OK, 음수 토큰 거부, 브라우저키 읽기·쓰기 차단, 계정 삭제 시 함께 삭제. **실제 대화 1회로 기록 확인**(입력 1646/출력 144/$0.004732 — 단가 계산 일치), 월 집계는 지난달 100만 토큰을 심어도 안 변함.
- [x] **[P6-3] 완료** — `lib/billing/access.ts`: 체험·구독·월토큰·프로젝트수를 서버 한 곳에서 판정. 결제중이면 체험 만료 무관 허용, 미납/해지 구분 안내, 한도 도달 시 상위 등급 권유(최고 등급이면 권유 없음), 프로젝트 한도는 "만들기"만 차단. **모르는 등급·만료일 없음은 차단**(fail-closed). 커밋 `5aabb69`→`3f9ade5`.
- [x] **[P6-4] 완료** — `lib/billing/account.ts`(프로필+사용량+프로젝트수) + `/api/chat` 연결. Claude 호출 **전에**, 메시지 저장 **전에** 판정 → 막히면 402 + reason/upgradeTo. 화면은 빨간 오류 대신 안내 카드와 "요금제 보기". 커밋 `15ff74b`→`0b9056f`.
  **실검증**: 체험이 어제 끝난 계정으로 대화 시도 → "7일 체험 기간이 끝났어요" + 요금제 버튼, **메시지 0건·토큰 사용 0건**(아예 안 불림). 구독을 active로 바꾸자 즉시 다시 대화 가능(사용량도 정상 기록).
- [x] **[P6-1] 완료** — Stripe 샌드박스(테스트 모드) 가입, 상품 2개 등록, 키 3종 `.env.local` 입력. 실검증: 계정 연결 200, `SDVC 기본` $12/월·`SDVC 프로` $35/월 모두 **반복 결제**로 활성(livemode=false).
  **주의(실결제 전환 시)**: 현재 계정 국가가 **US**다. Stripe는 기존 계정의 국가를 바꿀 수 없으므로, 한국 계좌로 정산하려면 **한국 국가로 새 계정을 만들어** 상품을 다시 등록하고 키만 교체해야 한다(코드는 그대로). 실결제 준비([P6-9] 이후) 체크리스트에 포함할 것.
- [x] **[P6-5] 완료** — `lib/billing/stripe.ts`(REST를 fetch로 얇게 감쌈) + `POST /api/billing/checkout`. **가격 id는 서버 환경변수에서만** 가져온다(클라이언트 값을 쓰면 $0 가격을 끼워넣을 수 있다). 카드정보는 우리 서버를 지나가지 않는다. 커밋 `23fbe6b`→`0cd0bf4`.
- [x] **[P6-6] 완료** — 웹훅 서명 검증 + 등급 자동 전환. 로그인 검사가 없는 공개 엔드포인트라 **서명이 유일한 방어선**. 본문은 파싱 전 원문으로 HMAC 검증, 5분 지난 서명 거절(재전송 공격), 처리 실패 시 **500**(200을 주면 Stripe가 재시도하지 않아 결제가 유실된다). 커밋 `2a2aa2a`→`909589d`→`a61967c`.
- [ ] **[P6-7]** 체험/해지 시 산출물 처리(FR-023·FR-027) · [ ] **[P6-8]** 요금제·결제·구독관리 화면 · [ ] **[P6-9]** 게이트 G6

## 5. 막힌 것 / 사용자 결정 대기

- **[P6-5] 착수 시 사용자 작업 필요**: Stripe 가입 → 테스트 모드에서 상품 2개 등록(기본 $12/월, 프로 $35/월) → 키 3종(공개키·비밀키·웹훅 서명키)을 `.env.local`과 Vercel에 등록. 그 전까지는 제가 혼자 진행할 수 있는 구간이 없다.
- 참고: 사용자 계정으로 만든 시험용 대화 3건과 프로젝트 1건(`site-qiioxo`)이 DB에 남아 있다(사용자 소유, 지워도 무방). 내가 만든 테스트 계정·프로젝트·파일은 전부 정리했다.
- 진행 방식: 사용자 지시(2026-09-11)로 **작업 ID 하나([P#-#])를 마칠 때마다 보고하고 확인받은 뒤** 다음으로 넘어간다.

## 6. 알아둘 함정

- **[P#-#] 표기 규칙**: 사용자 지시(2026-09-10)로 이후 모든 작업·커밋에 WBS 작업 ID를 명시한다. 커밋 컨벤션: `{type}: [P#-#] {제목} - {단계}`
- spec.md/plan.md/tasks.md는 모두 `sdvc`(방법론) 저장소의 `docs/`에 있다. **실제 코드는 `sdvc-app`(별도 저장소, 로컬 `AI Vibecoding\SDVC-app\`)에 만든다** — 두 저장소를 혼동하지 말 것.
- WBS 문서(`10_SDVC_웹서비스/WBS_서버구축.md`, docx)는 Phase 단위 로드맵이고, `tasks.md`는 그중 MVP(Phase 2~5)만 슬라이스로 세분화한 것. Phase 6 이후로 갈 때는 그 Phase에 대해 다시 Block1(Specify 보완)~Block4(Tasks)를 간략히 반복해야 한다.
- 트리거: `SDVC서버 구축`(시작/재개) · `작업 휴식`(저장 후 중단)
- 이 PC에는 LibreOffice 없음 — WBS docx 육안검증 불가, python-docx 구조검증까지만.
- **프로덕션 URL은 `https://sdvc-app.vercel.app`이다.** `sdvc-app-b5vk.vercel.app`이 아니다 — 첫 배포 완료 화면에 표시된 도메인을 잘못 믿어서 한동안 헷갈렸다(위 P0-2/P2-2 항목 참고). 앞으로 프로덕션 확인 시 이 URL을 쓸 것.
- **모델은 확장 사고(thinking)를 스스로 켠다.** 사고 중에는 텍스트가 안 나오므로 `max_tokens`가 작으면 응답이 통째로 비어 보인다. `/api/chat`은 기본 8192 토큰이고 사고 중에는 `{"type":"thinking"}` 이벤트를 보낸다 — [P3-5] 채팅 화면에서 이 이벤트로 "생각하는 중" 표시를 해야 한다.
- **dev 서버가 유령으로 남는다**: 이전 세션의 Playwright가 띄운 dev 서버가 포트 3000을 계속 물고 있다가 워커가 죽어 500을 뱉었다(원인 찾는 데 시간 씀). `Get-NetTCPConnection -LocalPort 3000`으로 확인하고 필요하면 종료 후 새로 띄울 것.
- **`.claude/launch.json`의 preview_start는 이 PC에서 실패한다**(`'C:\Program' ...` 오류 — npm 경로 공백 문제). dev 서버는 Bash 백그라운드로 `npm run dev` 하는 편이 확실하다.
- **Supabase 무료 플랜은 확인메일 발송 한도가 낮다.** 실제 가입 폼을 자동 테스트에 넣으면 2회차부터 막힌다 — 테스트 계정은 `admin.createUser(email_confirm:true)`로 만든다([P2-9]·[P5-5]에서 두 번 겪음).
- **공개범위 변경은 화면이 먼저, 저장이 나중이다**([P5-3] 설계). 테스트에서 저장 응답(`waitForResponse`)을 기다리지 않으면 열람이 간헐적으로 404가 된다.
- **산출물 서빙의 함정 3가지**(전부 [P5-1]에서 겪음): ①Supabase Storage는 html을 `text/plain`으로 돌려준다 ②우리 주소는 끝에 `/`가 없어 상대 경로가 깨진다(→`<base>` 주입) ③CSP `sandbox`를 걸면 그 문서의 요청에 쿠키가 안 실려 로그인 확인이 필요한 파일은 전부 404가 된다.
- **공용 캐시(CDN)에 산출물을 캐시하면 안 된다.** 공개범위를 바꿔도 캐시본이 계속 나간다 — FR-023(해지 시 즉시 비공개)이 여기에 걸린다.
- **`localhost`와 `127.0.0.1`이 다르게 잡힌다**(IPv6/IPv4). 브라우저 도구로 로컬 서버를 열 때 `localhost:3000`이 실패하면 `127.0.0.1:3000`으로 시도할 것 — [P4-5]에서 서버가 죽은 줄 알고 헤맸다.
- **로컬 검증은 `npm run dev`보다 `npm run build && npm start`가 낫다.** dev 서버의 HMR이 스트리밍 요청(`/api/chat`)을 계속 끊어(ERR_ABORTED) 검증이 불가능했다.
- **구현 단계 응답은 길다**: max_tokens 8192로는 파일 하나도 다 못 쓴다(→32000으로). 파일 블록이 닫히지 않으면 **저장하지 않는 것이 정상 동작**이다(반쯤 쓴 파일을 저장하지 않으려고) — 대신 `truncated` 이벤트로 사용자에게 알린다.
- **vitest 워커 타임아웃**은 이 PC에서 가끔 나는 인프라 문제다(테스트 실패 아님). 같은 명령을 한 번 더 실행하면 정상 통과한다 — RED로 오인하지 말 것.
- `sdvc-app` 저장소에는 git 사용자 정보가 설정돼 있지 않아 커밋이 거부될 수 있다. `git config user.name pinusian` / `user.email pinusian@gmail.com`(기존 커밋과 동일)으로 저장소에 로컬 설정해 두었다.
- Vercel 최신 UI: **Environment Variables**와 **Domains**는 각각 `.../settings/environment-variables`, `.../settings/domains` — 사이드바 목록에 이름 그대로 안 보일 수 있으니 URL 직접 수정이 빠르다. `NEXT_PUBLIC_*` 변수는 타입을 **Config**로(Secret은 나중에 되돌릴 수 없음), 나머지는 **Secret**으로.
