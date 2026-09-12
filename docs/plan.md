# plan.md — SDVC 웹서비스 기술 설계

> 작성일: 2026-09-10 · [P1-3] Plan · 게이트 G3 승인 대상
> 저장소: [`pinusian/sdvc-app`](https://github.com/pinusian/sdvc-app) · spec.md를 바탕으로 작성

## 1. 기술 스택 (게이트 G1에서 이미 확정)

| 영역 | 선택 | 쉬운 말로 |
|---|---|---|
| 언어·프레임워크 | Next.js 14 (App Router) + TypeScript | 화면과 서버 기능을 한 프로젝트, 한 언어로 |
| 인증·DB·저장소 | Supabase (Postgres + Auth + Storage, 서울 리전) | 로그인 기능과 데이터베이스, 파일저장소를 한 번에 제공하는 서비스 |
| 결제 | Stripe | 구독 결제 대행 |
| 배포 | Vercel (GitHub 연동 자동배포) | `git push`만 하면 알아서 배포됨 |
| AI 호출 | Claude API 직접 호출 (Anthropic SDK) | Claude Code가 아니라, 우리 서버 코드가 직접 Claude에게 요청을 보냄 |
| 테스트 | Vitest(단위) + Playwright(브라우저 E2E) | TDD 규율을 지킬 도구 — 실제 브라우저 동작까지 자동 확인 가능 |

## 2. 폴더 구조 (sdvc-app 저장소)

```
sdvc-app/
├── app/                        Next.js 화면·API 라우트
│   ├── (auth)/signup, login, verify-email/
│   ├── dashboard/               내 프로젝트 목록
│   ├── projects/[id]/chat/      SDVC 대화 화면
│   ├── pricing/, billing/       요금제·결제 (Phase 6)
│   ├── admin/                   서버관리자 화면 (Phase 8)
│   ├── site/[slug]/[...path]/   산출물 서빙 (로그인 불필요)
│   └── api/
│       ├── chat/                SDVC 엔진 대화 API
│       ├── projects/            프로젝트 CRUD
│       ├── stripe/               결제 webhook 등 (Phase 6)
│       └── admin/                관리자 API (Phase 8)
├── lib/
│   ├── supabase/                Supabase 클라이언트
│   ├── claude/                  Claude API 호출 모듈 + SDVC 진행대본 프롬프트
│   ├── permissions/              권한 검사 공통 모듈 (P2-6)
│   └── storage/                 프로젝트 파일 저장·서빙 로직
├── components/                  화면 부품
├── tests/                       Vitest 단위·통합 테스트
├── e2e/                         Playwright 브라우저 테스트
├── .env.example                 빈 환경변수 틀 (실제 값은 사용자가 직접)
└── docs/task-reports/           슬라이스별 완료 보고서
```

## 3. 데이터베이스 표 (MVP 우선)

| 표 | 핵심 칼럼 | 비고 |
|---|---|---|
| `profiles` | id(auth.users FK), email, role('admin'\|'developer'), grade('trial'\|'basic'\|'pro'), trial_ends_at, stripe_customer_id, subscription_status | [P2-4] |
| `projects` | id, owner_id, name, slug(고유), visibility('private'\|'link'\|'public'), status, created_at | [P4-2] |
| `conversations` | id, project_id, current_block, updated_at | [P3-4] |
| `messages` | id, conversation_id, role, content, created_at | [P3-4] |
| `usage_logs` | id, user_id, project_id, model, input_tokens, output_tokens, cost_usd | [P8-3] 원가 모니터링용, MVP부터 기록만 시작 |

**Phase 7~8에서 추가되는 표** (지금 설계만 예약, 구현은 해당 Phase에서): `project_versions`(P7-6 롤백), `bug_reports`(P7-2), `platform_reports`(P7-5), `audit_logs`(P8-7)

## 4. 화면 목록 (MVP)

| 화면 | 경로 | 접근 권한 |
|---|---|---|
| 회원가입/로그인/이메일인증 | `/signup` `/login` `/verify-email` | 누구나 |
| 대시보드(내 프로젝트 목록) | `/dashboard` | 로그인한 개발자 |
| SDVC 대화 화면 | `/projects/[id]/chat` | 프로젝트 소유 개발자 |
| 산출물 열람 | `/site/[slug]/...` | 공개범위에 따라 (비공개=소유자만, 링크공개=URL아는 누구나, 전체공개=검색노출 포함 누구나) |

## 5. 서버 API 목록 (MVP)

| API | 메서드 | 설명 |
|---|---|---|
| `/api/chat` | POST | SDVC 엔진과 대화 (스트리밍 응답) |
| `/api/projects` | GET/POST | 내 프로젝트 목록 조회·생성 |
| `/api/projects/[id]` | DELETE | 프로젝트 삭제 (FR-022) |
| `/api/projects/[id]/visibility` | PATCH | 공개범위 변경 (FR-007) |
| `/site/[slug]/[...path]` | GET | 산출물 파일 서빙 (인증 불필요) |

로그인·회원가입 자체는 Supabase Auth 클라이언트 SDK가 대부분 처리하며, 이메일 인증(FR-021)도 Supabase Auth 내장 기능을 사용합니다.

## 6. 데이터 흐름 (한눈에)

```
[개발자 브라우저]
   │ 로그인 (Supabase Auth)
   ▼
[대시보드] → "새 프로젝트" → [/projects/[id]/chat]
   │ 대화 입력 POST /api/chat
   ▼
[서버] → Claude API 호출(Anthropic) → 5블록 진행대본 프롬프트로 헌장~구현 안내
   │ 구현 단계에서 Claude가 파일 내용 생성
   ▼
[서버] → Supabase Storage에 저장 → projects.status='deployed'
   │
   ▼
[누구나] → /site/{slug} 접속 → Storage에서 파일 읽어 표시
```

## 7. 헌장 점검

| 헌장 규칙 | 반영 방식 |
|---|---|
| TDD 필수 | Vitest(단위)·Playwright(E2E) 먼저 작성 → 구현. 각 슬라이스(Phase 2~5)를 RED→GREEN→REFACTOR로 진행 |
| 보안 규칙 | `ANTHROPIC_API_KEY`·Stripe 키·Supabase 서비스키는 전부 Vercel 환경변수. `.env.example`만 커밋, 실제 값은 사용자 직접 입력 |
| 기록 의무 | 모든 결정 spec.md/plan.md/tasks.md + 커밋 메시지에 `[P#-#]` 표기 (사용자 지시 반영) |
| 커밋 컨벤션 | `{type}: [P#-#] {제목} - {단계}` — 예: `test: [P2-5] 로그인 - RED` |
| 완료 보고 규칙 | 슬라이스 끝날 때마다 실제 실행 명령·출력을 `docs/task-reports/`에 남김 |

## 8. 단계적 구현 순서 (WBS Phase와 매핑)

Phase 2(로그인) → Phase 3(SDVC 엔진) → Phase 4(파일 저장) → Phase 5(URL 서빙) 순으로, 슬라이스 하나가 끝날 때마다 실제로 눈으로 확인 후 다음으로 진행합니다. 이 설계는 그 4개 슬라이스를 전제로 합니다 — 세부 작업 분해는 [P1-4] Tasks에서.

---

## 9. 슬라이스 6·7 설계 보완 (2026-09-12, FR-029~FR-033)

쓰다가 발견한 5건(`docs/backlog.md` BL-001~005)을 기존 설계에 어떻게 얹는지.
**새로 만드는 것보다 이미 있는 것을 고쳐 쓰는 쪽을 택했다** — 표도 API도 최소로 늘린다.

### 9-1. 유지보수 블록 (FR-029, BL-001) — 슬라이스 6

지금은 구현이 끝나면 대화 단계가 `done`이 되고, `/api/chat`이 모든 입력을 400으로 막는다.
`done`을 없애는 대신 그 앞에 **여섯 번째 블록 `maintenance`** 를 넣는다.

| 항목 | 지금 | 바꾼 뒤 |
|---|---|---|
| 구현 완료 후 단계 | `done` (영구 종료) | `maintenance` (계속 열림) |
| `advanceBlock("implement", 승인)` | `"done"` | `"maintenance"` |
| `advanceBlock("maintenance", 승인)` | — | `"maintenance"` (더 갈 곳이 없다) |
| 화면 머리말 | "대화가 끝났습니다." | "블록 6 / 유지보수 — 고칠 곳을 말씀해주세요" |
| 프롬프트 | 헌장부터 다시 안내 | 이미 있는 `MAINTENANCE_SECTION`을 본문으로 승격 |

`done`은 타입에 남겨둔다(과거 대화 중 이미 `done`이 된 것들이 DB에 있다).
**그 대화들도 열리도록** 화면·API가 `done`을 `maintenance`처럼 취급한다 — 마이그레이션으로 값을 바꾸는 것보다 안전하다.

### 9-2. 프로젝트 이름 (FR-030, BL-002) — 슬라이스 6

`projects.name`·`conversations.title` 컬럼은 **이미 있다.** 넣고 고치는 길만 뚫으면 된다.

- `POST /api/conversations` 가 `title`을 받는다(선택). 비면 지금처럼 자동.
- 비었을 때의 자동 이름: 첫 산출물 발행 시점에 **대화 첫 메시지**에서 만든다(모델을 한 번 더 부르지 않는다 — 비용 0).
- `PATCH /api/projects/[id]` 에 `name` 추가 (공개범위 라우트와 같은 소유권 검사 재사용).
- 화면: "새 프로젝트" 버튼 → 이름 입력(빈칸 허용) / 대시보드 카드에서 이름 클릭 → 바로 수정.

### 9-3. 대시보드 배치 (FR-033, BL-003) — 슬라이스 6

`AccountStatus` 카드를 `ProjectList` **아래로** 옮기고, 글자·세로 여백을 70%로 줄인다(가로 폭은 그대로).
정보 위계상으로도 맞다 — 이 화면의 주인공은 프로젝트 목록이다.

### 9-4. 프롬프트 첨부 (FR-031, BL-004) — 슬라이스 7

```
[입력창에 파일 끌어놓기]
      │ POST /api/attachments  (파일당 10MB·최대 5개·형식 검사)
      ▼
[Supabase Storage: attachments/{userId}/{conversationId}/{id}.{ext}]  ← 새 비공개 버킷
      │ 응답: {id, kind: "image"|"text", name}
      ▼
[POST /api/chat  body.attachmentIds]
      │ 서버가 id로 다시 읽어 Claude 메시지에 싣는다
      │  - 이미지 → image 블록(base64)
      │  - 글파일 → text 블록(파일명 + 내용)
      ▼
[사용량 기록] 이미지 토큰도 같은 usage_logs·같은 월 한도로 차감 (Clarify 12)
```

**클라이언트가 보낸 파일 내용을 그대로 믿지 않는다** — 서버가 Storage에서 다시 읽는다(가격 id를 서버에서만 읽는 [P6-5]와 같은 원칙).
형식은 확장자가 아니라 **바이트 앞머리(매직 넘버)** 로 판정한다. 첨부는 대화와 함께 지워진다.

### 9-5. 산출물에 이미지 넣기 (FR-032, BL-005) — 슬라이스 7

이미지는 Claude가 글로 만들 수 없으므로, **파일 블록 대신 "이 첨부를 이 경로에 넣어라"는 지시**를 쓴다.

```
```use-image:images/hero.jpg@{첨부id}```
```

산출물 발행([P4-3] `publishArtifact`)이 이 지시를 보면 첨부 원본을 **프로젝트 폴더로 복사**한다.
→ `/site/{slug}/images/hero.jpg` 로 서빙되고, 공개범위·해지 잠금·유예 삭제 규칙이 자동으로 적용된다(Clarify 13).
허용 확장자 목록에 이미지 4종을 추가하고, 이미지에는 파일당 크기 상한을 따로 둔다.

### 9-6. 이 보완이 건드리는 것

| 구분 | 내용 |
|---|---|
| DB 표 | **추가 없음** (`projects.name`·`conversations.title` 이미 존재) |
| Storage | 비공개 버킷 `attachments` **1개 추가** |
| API | `POST /api/attachments` 추가, `PATCH /api/projects/[id]` 확장, `POST /api/chat`·`/api/conversations` 입력 확장 |
| 화면 | 대화 입력창(첨부), 새 프로젝트(이름), 대시보드(이름 수정·카드 위치) |

### 9-7. 헌장 점검

| 헌장 규칙 | 이번 보완에서 |
|---|---|
| TDD 필수 | 5건 모두 RED→GREEN. 특히 BL-001은 **"완료된 대화에 입력이 된다"는 실패 테스트**부터 (SC-008: 버그는 재현 먼저) |
| 보안 규칙 | 첨부 업로드는 서버가 형식·용량을 판정하고 비공개 버킷에 둔다. 새 비밀값 없음 |
| 기록 의무 | backlog.md에 처리 결과와 커밋을 남긴다 |
| 커밋 컨벤션 | `{type}: [P#-#] {제목} - {단계}` 유지 |
| 완료 보고 규칙 | 슬라이스마다 실제 실행 증거 첨부 (첨부 기능은 **실제 이미지로 홈페이지에 넣어보는 것**까지) |

---

## 10. 슬라이스 8 설계 — 되돌리기 (2026-09-12, FR-012)

Phase 7 본체 중 **되돌리기만** 남았다. 고쳐달라는 요청(FR-010·FR-011)은 [P7-4b] 유지보수 블록으로 이미 동작하고, 버그 추적(P7-2·P7-3)과 신고 채널(P7-5)은 Clarify 15·17에서 뒤로 미뤘다.

### 10-1. 지금 무엇이 없나

발행할 때마다 같은 경로에 **덮어쓴다**(`uploadArtifactFiles`의 upsert). 고쳤다가 더 나빠져도 되돌릴 방법이 없다. 유지보수 기능을 넣은 이상 짝으로 있어야 한다(WBS P7-6의 판단).

### 10-2. 어떻게 보관하나

**발행이 끝날 때마다 그 시점의 파일 전부를 사본으로 남긴다**(Clarify 14).

```
versions 버킷 (신규, 비공개)
└ {projectId}/
   ├ 0001/  index.html  style.css  images/hero.png   ← 첫 발행 직후
   ├ 0001/meta.json     { "at": "...", "request": "빵집 홈페이지 만들어줘" }
   └ 0002/  …                                        ← 고친 직후
```

- **버킷을 또 나눈다.** `artifacts`에 `.versions/` 같은 폴더로 두면 `/site/{주소}` 서빙 경로가 한 번만 어긋나도 **옛 버전이 통째로 공개된다.** 첨부(`attachments`)를 나눈 것과 같은 이유다.
- **표를 만들지 않는다.** 폴더 이름(`0001`…)이 순서이고, `meta.json`에 시각과 그때의 요청 문장을 적는다. 마이그레이션 없이 목록을 만들 수 있다.
- 사본은 **발행 뒤**에 남긴다 — 그래야 "지금 보이는 상태"도 목록에 있다.

### 10-3. 어떻게 되돌리나

```
[대시보드] 프로젝트 카드 → "되돌리기" → 버전 목록(시각 + 그때의 요청)
   │ POST /api/projects/[id]/rollback  { version: "0002" }
   ▼
[서버] 그 버전 폴더의 파일을 artifacts로 덮어쓰고,
      그 버전에 없는 live 파일은 지운다(안 지우면 찌꺼기가 남아 화면이 섞인다)
   ▼
[되돌린 결과도 새 버전으로 남긴다] — 되돌리기를 다시 되돌릴 수 있어야 한다
```

**대화 기록은 건드리지 않는다**(Clarify 16). 무엇을 왜 바꿨는지가 사라지면 같은 실수를 반복한다.

### 10-4. 잠금·삭제 규칙과의 관계

**정정(구현 중 확인)**: 계획 단계에서는 "잠글 때도 사본을 지운다"고 적었으나 잘못이었다.
잠금([P6-7])은 파일을 지우는 것이 아니라 **공개범위를 비공개로 돌리는 것**이고, 버전 사본은
애초에 서빙되지 않는다(별도 비공개 버킷). 그러므로 잠금에서 할 일은 없다.

사본을 지워야 하는 곳은 **실제로 지우는 두 경로**뿐이다:
- 프로젝트 삭제(`DELETE /api/projects/[id]`)
- 유예 만료 정리(`runLifecycleSweep`)

본편만 지우고 사본을 남기면 그 사본에 옛 홈페이지가 통째로 들어 있어 "지웠다"는 말이 거짓이 된다.

### 10-5. 이 보완이 건드리는 것

| 구분 | 내용 |
|---|---|
| DB 표 | **추가 없음** (폴더 이름이 순서, `meta.json`이 설명) |
| Storage | 비공개 버킷 `versions` **1개 추가** |
| API | `GET/POST /api/projects/[id]/rollback` 추가 |
| 화면 | 대시보드 카드에 "되돌리기" |
| 기존 | `publishArtifact`가 발행 후 사본을 남긴다 · 잠금/삭제가 사본도 함께 처리 |

### 10-6. 헌장 점검

| 헌장 규칙 | 이번 보완에서 |
|---|---|
| TDD 필수 | 전부 RED→GREEN. 되돌리기는 **"그 버전에 없던 파일이 사라지는지"** 부터 테스트 |
| 보안 규칙 | 새 비밀값 없음. 버전 버킷은 비공개, 서버 secret key로만 접근 |
| 기록 의무 | backlog·progress에 결과와 커밋을 남긴다 |
| 완료 보고 규칙 | **실제로 고쳤다가 되돌려** 사이트가 이전 모습으로 돌아오는 것까지 확인 |

---

## 11. 슬라이스 9 설계 — 출시 전 최소 운영 수단 (2026-09-12, FR-014·015·016·017·034)

Phase 8을 통째로 하지 않고 **사람을 받기 전에 반드시 있어야 하는 것**만 한다.
나머지(관리자 등급 화면·감사 로그 화면·상한 조절·신고 접수함)는 뒤로 미루되,
**가로지르는 두 가지는 지금 뼈대를 넣는다** — 나중에 붙이면 되돌아가 고쳐야 하기 때문이다.

### 11-1. 왜 이 순서인가

| 순서 | 작업 | 지금 해야 하는 이유 |
|---|---|---|
| 1 | 관리자 권한 판정 한 곳으로 (FR-034 뼈대) | 나중에 3단계를 넣으면 **이미 만든 관리자 기능을 전부 다시 훑어야** 한다. 권한을 되돌아가 고치는 자리에서 구멍이 생긴다([P2-7] RLS 허점이 그랬다) |
| 2 | 감사 로그 기록부 (FR-017 뼈대) | 나중에 붙이면 먼저 만든 행위마다 되돌아가 심어야 하고, 하나라도 빠지면 **분쟁 때 증거가 없는 경로**가 생긴다 |
| 3 | 비상 차단 (FR-016) | 산출물이 우리 도메인에서 서빙된다. 불법·유해물이 올라오면 즉시 내릴 수단이 **법적으로** 필요하다 |
| 4 | 개발자 관리 (FR-014) | 정지·체험연장 없이는 문제 계정에 손쓸 수 없다 |
| 5 | 사용량·원가 대시보드 (FR-015) | 적자 구조를 늦게 알면 손실이 그만큼 커진다 (SC-007) |

### 11-2. 관리자 권한 판정 (FR-034 뼈대)

지금은 `can()`이 "관리자면 전권"이다. **판정 지점만 한 곳으로 모은다**:

```
adminCan(actor, action)   ← 새로 만든다. 모든 관리자 라우트가 이것만 부른다
  action: "developer:read" | "developer:suspend" | "developer:extend_trial"
        | "artifact:block" | "usage:read" | "policy:change"
```

- `profiles.admin_tier`(super | operator | support) 컬럼을 **지금 만든다**(0008). 기본값은 `super` — 지금 관리자는 나 혼자다.
- 등급을 고르는 **화면은 만들지 않는다.** 나중에 사람을 쓸 때 그 화면만 붙이면 되고, 판정은 이미 한 곳이라 손댈 데가 없다.

### 11-3. 감사 로그 (FR-017 뼈대)

```
admin_audit_logs 표 (0008)
  actor_id · action · target_type · target_id · detail(jsonb) · created_at
```

- 관리자 라우트는 **성공하든 실패하든** 한 줄을 남긴다. **열람도 남긴다**(Clarify 20).
- **보는 화면은 만들지 않는다.** 기록은 지금부터 쌓이고, 필요할 때 화면만 붙인다.
- 기록 실패가 본 행위를 막지는 않되 **조용히 넘기지 않는다**(경고를 응답에 싣는다).

### 11-4. 비상 차단 (FR-016)

**지우지 않고 가린다**(Clarify 18) — 오판했을 때 되돌려야 하고, 분쟁 시 증거도 남아야 한다.

| 대상 | 어떻게 | 되돌리기 |
|---|---|---|
| 산출물 하나 | `projects.blocked_at` 기록 → `/site/{주소}`가 **404**(403이 아니라 — 존재 자체를 숨긴다, [P5-1]과 같은 원칙) | 해제하면 원래 공개범위로 |
| 계정 | `profiles.suspended_at` 기록 → 로그인은 되되 **대화·생성·결제 전부 차단**, 그 사람의 산출물도 전부 가림 | 해제하면 전부 복구 |

정지된 사람의 화면에는 **왜 정지됐는지와 문의 방법**을 보여준다(Clarify 19).

### 11-5. 개발자 관리 (FR-014)

`/admin` 화면 하나. 개발자 목록(이메일·등급·구독상태·이번 달 사용량·가입일) + 행마다 **정지/해제·체험연장**.
검색은 이메일 부분일치. 목록 자체가 열람이므로 **감사 로그에 남는다.**

### 11-6. 사용량·원가 대시보드 (FR-015)

`/admin` 같은 화면 위쪽에: 이번 달 **총원가**(`usage_logs.cost_usd` 합) · **총매출**(활성 구독 등급 합) · **마진** · **요금 대비 원가 비율**(SC-007) · 개발자별 원가 순위.
그래프는 데이터가 쌓인 뒤에(Clarify 21).

### 11-7. 이 보완이 건드리는 것

| 구분 | 내용 |
|---|---|
| DB | 마이그레이션 `0008` — `profiles.admin_tier`·`suspended_at`, `projects.blocked_at`, `admin_audit_logs` 표 |
| API | `/api/admin/developers`(목록·정지·연장), `/api/admin/projects/[id]/block`, `/api/admin/usage` |
| 화면 | `/admin` 한 장 (원가 요약 + 개발자 목록) |
| 기존 | `/site` 서빙·`canStartChat`·결제에 차단/정지 검사 추가 |

### 11-8. 헌장 점검

| 헌장 규칙 | 이번 보완에서 |
|---|---|
| TDD 필수 | 전부 RED→GREEN. 특히 **"정지된 사람이 정말 막히는가"**·**"차단된 산출물이 404인가"** 부터 |
| 보안 규칙 | 관리자 판정은 한 곳(`adminCan`)에서만. 새 비밀값 없음. **fail-closed** — 모르는 등급·모르는 행위는 거부 |
| 기록 의무 | 관리자 행위는 코드가 자동으로 감사 로그에 남긴다 |
| 완료 보고 규칙 | 실제로 **차단해 보고 404를 확인**하고, 정지해 보고 402/차단을 확인한 증거를 붙인다 |
