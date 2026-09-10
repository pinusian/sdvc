# 진행 상황

> 마지막 업데이트: 2026-09-10 · 프로젝트: SDVC 웹서비스 · 현재 단계: [P2-3] 완료 → **[P2-4] 역할·등급·권한 DB 설계 예정**

## 1. 지금 어디까지 왔나

- 완료: [P0] 준비 — 계정 일부(Vercel·Supabase 진행중/보류), 게이트 G1·G2, 저장소 `sdvc-app` 생성
- 완료: [P1-1] Specify — `docs/spec.md` (User Story 18개, FR 24개, SC 8개)
- 완료: [P1-2] Clarify — 이메일인증/프로젝트삭제/해지정책/관리자계정 4건 확정
- 완료: [P1-3] Plan — `docs/plan.md` (게이트 G3 승인) — 폴더구조·DB 5표·화면 4개·API 5개·테스트도구(Vitest+Playwright)
- 완료: [P1-4] Tasks — `docs/tasks.md` (게이트 G4 승인) — MVP 4개 버티컬 슬라이스로 분해
- 완료: [P1-5] Analyze — 누락 2건(FR-022 삭제기능 누락, FR-024 관리자메커니즘 불명확) 발견·수정
- **진행 예정: [블록5] Implement — 슬라이스 1(Phase 2, 로그인·인증) [P2-1]부터 TDD로 시작**

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
- [ ] [P2-4]~[P2-9] tasks.md 순서대로 TDD 진행 (RED→GREEN→REFACTOR, 매 단계 `[P2-#]` 태그로 커밋)
- [ ] 슬라이스 1(Phase 2) 끝나면 [P2-9]에서 브라우저 실행 증거 남기고 슬라이스 2(Phase 3)로

## 5. 막힌 것 / 사용자 결정 대기

- ~~[P0-2] Vercel 가입 미완료~~ → 완료(위 참조)
- **Vercel 프로덕션 환경변수 미등록** — `.env.example`의 5개 항목을 Vercel 프로젝트 Settings → Environment Variables에 등록해야 배포판에서도 동작함. [P2-9] 전까지 처리.

## 6. 알아둘 함정

- **[P#-#] 표기 규칙**: 사용자 지시(2026-09-10)로 이후 모든 작업·커밋에 WBS 작업 ID를 명시한다. 커밋 컨벤션: `{type}: [P#-#] {제목} - {단계}`
- spec.md/plan.md/tasks.md는 모두 `sdvc`(방법론) 저장소의 `docs/`에 있다. **실제 코드는 `sdvc-app`(별도 저장소, 로컬 `AI Vibecoding\SDVC-app\`)에 만든다** — 두 저장소를 혼동하지 말 것.
- WBS 문서(`10_SDVC_웹서비스/WBS_서버구축.md`, docx)는 Phase 단위 로드맵이고, `tasks.md`는 그중 MVP(Phase 2~5)만 슬라이스로 세분화한 것. Phase 6 이후로 갈 때는 그 Phase에 대해 다시 Block1(Specify 보완)~Block4(Tasks)를 간략히 반복해야 한다.
- 트리거: `SDVC서버 구축`(시작/재개) · `작업 휴식`(저장 후 중단)
- 이 PC에는 LibreOffice 없음 — WBS docx 육안검증 불가, python-docx 구조검증까지만.
