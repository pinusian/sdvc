# SDVC — Structured Document & Vibe Coding

> **구조화된 문서가 AI 코딩을 이끈다.**

SDVC는 기존 **AI-VC(AI 바이브코딩)** 방법론 v1.2.0을 계승·개명한 것이며,
앞으로 **유료 웹서비스 제품**으로 개발해 나가는 플랫폼의 이름입니다.

이 저장소는 그 플랫폼의 원본(source of truth)입니다.

---

## 1. 방법론 — 5블록 7단계

Claude Code 프롬프트에 **`SDVC 최신버전 작동`** 이라고 입력하면(또는 그냥 "OO 앱 만들고 싶어"라고만 해도),
다음 절차로 헌장부터 실제 코드 구현까지 안내합니다.

```
[1] Constitution + Specify  — 규칙 정하고, 무엇을 만들지 명세로 확정
[2] Clarify                — 애매한 부분을 AI가 질문, 사용자가 답
[3] Plan                   — 기술 설계 제시 → ★사용자 승인★
[4] Tasks                  — 작업 목록 제시 → ★사용자 승인★
[5] Analyze + Implement    — 모순 점검 후 테스트 먼저(RED→GREEN→REFACTOR)
```

모든 질문에는 **초보자가 그대로 따라 답할 수 있는 예시 답안**이 함께 제시됩니다.
세션이 끊겨도(새 대화, `/clear`) `docs/progress.md`를 먼저 읽어 이전 맥락을 이어받고,
"완료"를 보고할 때는 **반드시 실제 실행한 명령과 그 출력**을 근거로 첨부합니다.

### 4가지 함정 → 4가지 규칙

| 함정 | 규칙 |
|---|---|
| 애매한 요청 → 애매한 결과 | 명세(Specify) 없이 구현 금지 |
| 검증 수단의 부재 | 테스트 없이 "완성" 금지 — RED→GREEN→REFACTOR + 실행 증거 |
| 기록의 부재 | 결정을 spec/plan/tasks + 커밋에 기록 |
| 세션이 끊기면 맥락 소실 | `docs/progress.md` 세션 간 인계 |

---

## 2. 설치 방법 (3가지 중 택 1)

### 방법 1 — 플러그인 설치 (Claude Code CLI/데스크톱, 권장)

```
/plugin marketplace add pinusian/sdvc
/plugin install sdvc-guide@sdvc-marketplace
```

### 방법 2 — 프로젝트 폴더에 직접 넣기 (claude.ai/code 클라우드 포함)

이 저장소의 `plugins/sdvc-guide/skills/sdvc-guide/` 폴더를
작업할 프로젝트의 `.claude/skills/` 아래에 복사합니다.
(이 저장소 자체를 클론했다면 `.claude/skills/sdvc-guide/` 가 이미 들어 있어 바로 동작합니다.)

### 방법 3 — 개인 스킬로 설치 (Windows, 이 PC의 모든 프로젝트에 적용)

`install.bat` 을 더블클릭하거나 실행합니다.
`skill\sdvc-guide\` 의 내용을 `%USERPROFILE%\.claude\skills\sdvc-guide\` 로 복사합니다.

```bat
install.bat
```

> 기존 `vibecoding-guide` 스킬은 건드리지 않습니다. 두 스킬은 공존할 수 있습니다.

설치 후 **새 Claude Code 세션**을 열어야 반영됩니다.

---

## 3. 트리거 문구

`SDVC 최신버전 작동` · `SDVC 작동` · `SDVC 시작` · `SDVC`
(그 밖에 "앱 만들고 싶어", "웹서비스 만들어줘" 같은 신규 제작 요청에도 발동)

```
사용자: SDVC 최신버전 작동
Claude: SDVC 프로젝트를 불러왔습니다. 구조화된 문서로 AI 코딩을 이끄는
        5단계 대화로, 헌장부터 구현까지 진행하겠습니다... (예시 답안 제시)
```

---

## 4. 폴더 구조

```
SDVC/
├── README.md / VERSION(2.0.0) / 00_INDEX.md
├── install.bat            개인 스킬로 설치
├── sync-skill.bat         스킬 원본 → 배포 슬롯 3곳 동기화
│
├── skill/sdvc-guide/      ★ 스킬 원본 (source of truth)
│   ├── SKILL.md                              핵심 지침 + 트리거
│   └── references/
│       ├── 00-guided-session-script.md       ★ 5블록·7단계 진행 대본(핵심)
│       ├── 01-why-sdd.md                     왜 절차가 필요한가
│       ├── 02-speckit-8steps.md              A코스: Spec Kit 8단계
│       ├── 03-lite-workflow.md               B코스: 경량 내장 워크플로(기본)
│       ├── 04-tdd-vertical-slice.md          TDD + 버티컬 슬라이스
│       ├── 05-troubleshooting.md             실전 트러블슈팅
│       ├── 06-collaboration-and-security.md  AI 협업 원칙·보안
│       ├── 07-run-guide-template.md          구동 방법 문서 템플릿
│       ├── 08-design-doc-template.md         설계서(~30p) 템플릿
│       ├── 09-github-deploy-guide.md         GitHub 배포 안내
│       └── 10-session-continuity.md          ★ progress.md 인계 + 증거 기반 보고
│
├── .claude-plugin/marketplace.json           마켓플레이스 매니페스트
├── plugins/sdvc-guide/                       플러그인 배포본 (스킬 사본)
├── .claude/skills/sdvc-guide/                저장소 동봉본 (클라우드에서 즉시 동작)
│
├── 10_SDVC_웹서비스/      ★ 유료 웹서비스 제품화 트랙
│   ├── _제품_개요.md
│   └── 20260907_웹서비스_제품화_논의요약.md
│
├── docs/progress.md       ★ 세션 간 맥락 인계 파일
├── _작업기억/SDVC/         plan.md / context.md / checklist.md
│
├── 00_공통자료/            교재·가이드·도서원고 (AI-VC에서 승계)
├── 01_프로젝트 보고서/      프로젝트 문서 (AI-VC에서 승계)
├── 02_플랫폼_프로젝트/      프로젝트 코드·번들 (AI-VC에서 승계)
├── 03_보고서/              요약보고서·현황자료 (AI-VC에서 승계)
└── reading-activity-example/   예시 서브에이전트 번들
```

---

## 5. 스킬을 수정했을 때 (갱신 절차)

1. `skill\sdvc-guide\` 아래를 수정 (SKILL.md 또는 references/*.md)
2. `VERSION` 과 `plugins\sdvc-guide\.claude-plugin\plugin.json` 의 버전을 올림
3. **`sync-skill.bat` 실행** → 배포 슬롯 3곳(plugin / .claude / 개인 스킬)에 일괄 반영
4. `git commit` + `git push`
5. 새 Claude Code 세션을 열면 최신 버전으로 동작

---

## 6. AI-VC와의 관계

| 구분 | AI-VC (기존, 그대로 보존) | SDVC (이 저장소) |
|---|---|---|
| 성격 | 교육용 개인 스킬 | 유료 웹서비스 제품 |
| 스킬 이름 | `vibecoding-guide` v1.2.0 | `sdvc-guide` v2.0.0 |
| 트리거 | "AI바이브코딩 작동" | "SDVC 최신버전 작동" |
| 위치 | `...\AI Vibecoding\` 루트 | `...\AI Vibecoding\SDVC\` |
| GitHub | `pinusian/vibecoding-guide`, `pinusian/vibecoding-starter` | `pinusian/sdvc` |
| 방법론 | 5블록 7단계 | **동일** |

기존 AI-VC 자산은 삭제·이동하지 않고 원위치에 그대로 남아 있습니다.

## 7. Spec Kit과의 관계

GitHub의 정식 도구 [Spec Kit](https://github.com/github/spec-kit)이 설치되어 있으면
`/speckit.*` 명령을 활용하는 A코스로 진행합니다. 없어도 스킬에 내장된 경량 절차(B코스, 기본값)로
동일한 5블록·7단계 규율을 지킵니다. 설치는 필수가 아닙니다.
