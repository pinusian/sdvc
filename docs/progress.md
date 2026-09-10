# 진행 상황

> 마지막 업데이트: 2026-09-10 · 프로젝트: SDVC 웹서비스 · 현재 단계: **[P3-7] 완료 — 슬라이스 2(SDVC 엔진) 전체 종료** → **슬라이스 3(Phase 4, 산출물 생성·저장) 시작 예정**

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
- **다음: 슬라이스 3(Phase 4, 산출물 생성·저장) — [P4-1] Storage 버킷·권한 정책부터**

## 2. 방금 세션에서 한 일 (2026-09-10, 이 세션)

- 계정 준비 확인: [P0-4] Node.js v24.19.0 확인. [P0-2] Vercel은 OAuth 리디렉션 오류로 **보류** — [P2-2]에서 리마인드하기로 함
- [P0-7] GitHub 저장소 [`pinusian/sdvc-app`](https://github.com/pinusian/sdvc-app) 생성, 로컬 `AI Vibecoding\SDVC-app\`에 초기 커밋(README·gitignore) 후 push
- [P0-5] 게이트 G1 확정: TypeScript 단일 + **Claude API 직접호출**(Agent SDK 아님 — 서버리스와 안 맞아서) + 신규저장소 분리
- [P0-6] 게이트 G2 확정: 체험7일 / 기본 3개·200만토큰·$12 / 프로 10개·800만토큰·$35
- [P1-1] spec.md 작성. 중간에 사용자가 "산출물 회원기능(사용자 로그인+개발자의 사용자관리)"을 다시 제안 → 2026-09-08 MVP제외 결정과 충돌 확인 후 재확인 질문 → **MVP 이후로 유지(기존 결정 유지)** 하되 US-D12/FR-020으로 향후 설계 상세 기록
- [P1-2] Clarify 4문항 전부 권장안 확정 (이메일인증 필수 / 프로젝트삭제 가능 / 해지시 즉시비공개+30일유예삭제 / 관리자는 ADMIN_EMAIL 환경변수로 자동부여) — **기존 미결사항이던 P9-3(해지시 산출물처리)이 이걸로 해소됨**
- [P1-3] plan.md 작성, 게이트 G3 승인
- [P1-4] tasks.md 작성(MVP 4슬라이스), 게이트 G4 승인
- [P1-5] Analyze — spec/plan/tasks 대조해 누락 2건 발견·수정(범위변경 아님, 승인 재요청 안 함)
- 사용자 지시로 **모든 작업에 WBS 작업 ID `[P#-#]` 명시하는 관행** 확립 (`_작업기억/SDVC/context.md`에 기록)

## 3. 검증 증거 (실제 실행한 명령과 결과)

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

## 5. 막힌 것 / 사용자 결정 대기

- 없음. 다음 세션은 바로 슬라이스 3(Phase 4, 산출물 생성·저장) 착수 가능.
- 참고: 사용자 계정(`parkbctop@hotmail.com`)으로 만든 시험용 대화 1건이 DB에 남아 있다(지워도 무방).

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
- **vitest 워커 타임아웃**은 이 PC에서 가끔 나는 인프라 문제다(테스트 실패 아님). 같은 명령을 한 번 더 실행하면 정상 통과한다 — RED로 오인하지 말 것.
- `sdvc-app` 저장소에는 git 사용자 정보가 설정돼 있지 않아 커밋이 거부될 수 있다. `git config user.name pinusian` / `user.email pinusian@gmail.com`(기존 커밋과 동일)으로 저장소에 로컬 설정해 두었다.
- Vercel 최신 UI: **Environment Variables**와 **Domains**는 각각 `.../settings/environment-variables`, `.../settings/domains` — 사이드바 목록에 이름 그대로 안 보일 수 있으니 URL 직접 수정이 빠르다. `NEXT_PUBLIC_*` 변수는 타입을 **Config**로(Secret은 나중에 되돌릴 수 없음), 나머지는 **Secret**으로.
