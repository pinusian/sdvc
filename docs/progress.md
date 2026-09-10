# 진행 상황

> 마지막 업데이트: 2026-09-10 · 프로젝트: SDVC 웹서비스 · 현재 단계: [P2-8] 완료 → **[P2-9] 슬라이스 1 최종 검증 예정**

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
- **다음: [P2-9] 슬라이스 1 최종 검증 (Playwright E2E 정식화)**

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
  프로덕션 도메인: **https://sdvc-app-b5vk.vercel.app**
  (개별 배포 URL: `sdvc-app-b5vk-62pxbymea-sdvc.vercel.app` — 매 배포마다 바뀌므로 위 도메인 기준으로 접속할 것)
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
- [ ] **[P2-9] 슬라이스 1 최종 검증부터 시작** — Playwright E2E 작성, 브라우저 실행 증거 수집(승인 게이트 없음, 검증만)
- [ ] Vercel 프로덕션 환경변수 5종 등록 — [P2-9] 전까지는 반드시 처리 (위 §5 참조)
- [ ] [P2-9] 끝나면 슬라이스 2(Phase 3, SDVC 엔진)로

## 5. 막힌 것 / 사용자 결정 대기

- ~~[P0-2] Vercel 가입 미완료~~ → 완료(위 참조)
- **Vercel 프로덕션 환경변수 미등록** — `.env.example`의 5개 항목을 Vercel 프로젝트 Settings → Environment Variables에 등록해야 배포판에서도 동작함. [P2-9] 전까지 처리.

## 6. 알아둘 함정

- **[P#-#] 표기 규칙**: 사용자 지시(2026-09-10)로 이후 모든 작업·커밋에 WBS 작업 ID를 명시한다. 커밋 컨벤션: `{type}: [P#-#] {제목} - {단계}`
- spec.md/plan.md/tasks.md는 모두 `sdvc`(방법론) 저장소의 `docs/`에 있다. **실제 코드는 `sdvc-app`(별도 저장소, 로컬 `AI Vibecoding\SDVC-app\`)에 만든다** — 두 저장소를 혼동하지 말 것.
- WBS 문서(`10_SDVC_웹서비스/WBS_서버구축.md`, docx)는 Phase 단위 로드맵이고, `tasks.md`는 그중 MVP(Phase 2~5)만 슬라이스로 세분화한 것. Phase 6 이후로 갈 때는 그 Phase에 대해 다시 Block1(Specify 보완)~Block4(Tasks)를 간략히 반복해야 한다.
- 트리거: `SDVC서버 구축`(시작/재개) · `작업 휴식`(저장 후 중단)
- 이 PC에는 LibreOffice 없음 — WBS docx 육안검증 불가, python-docx 구조검증까지만.
