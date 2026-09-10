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
