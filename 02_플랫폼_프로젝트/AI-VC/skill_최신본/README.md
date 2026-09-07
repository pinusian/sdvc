# AI바이브코딩 프로젝트

프로그래밍 초보자가 AI(Claude)와 함께 **체계적으로** 앱·웹서비스를 만들 수 있게 돕는 개인용 코칭 스킬 프로젝트입니다. 이 폴더가 "최신 버전"의 원본(source of truth)입니다.

## 이 프로젝트가 하는 일

Claude Code 프롬프트에 **"AI바이브코딩 작동"** (또는 **"AI바이브코딩 최신버전 작동"**, 그냥 "OO 앱 만들고 싶어"라고만 말해도), 다음 5단계 대화로 헌장부터 실제 코드 구현까지 안내합니다.

**v1.2.0부터**: 세션이 끊겨도(새 대화, `/clear` 등) `docs/progress.md`를 먼저 읽어 이전 맥락을 이어받고, "완료"를 보고할 때는 반드시 실제 실행한 명령과 그 출력을 근거로 첨부합니다 (자세한 규율: `skill/vibecoding-guide/references/10-session-continuity.md`).

```
[1] Constitution + Specify  — 규칙 정하고, 무엇을 만들지 명세로 확정
[2] Clarify                — 애매한 부분을 AI가 질문, 사용자가 답
[3] Plan                   — 기술 설계 제시 → ★사용자 승인★
[4] Tasks                  — 작업 목록 제시 → ★사용자 승인★
[5] Analyze + Implement    — 모순 점검 후 테스트 먼저(RED→GREEN→REFACTOR)
```

모든 질문에는 **초보자가 그대로 따라 답할 수 있는 예시 답안**이 함께 제시됩니다. 완료 후에는 실행 방법 문서, 설계서(docx), GitHub 배포까지 이어서 안내합니다.

## 설치 방법

`install.bat`을 더블클릭하거나 실행합니다. 이 스크립트는 `skill\vibecoding-guide\`의 내용을 개인 스킬 폴더(`%USERPROFILE%\.claude\skills\vibecoding-guide\`)로 복사합니다 — 이후 **PC의 어느 프로젝트에서 Claude Code를 열어도** 이 스킬이 작동합니다.

```bat
install.bat
```

## 최신 버전으로 업데이트하는 법

1. 이 폴더의 `skill\vibecoding-guide\` 아래 내용을 수정합니다 (SKILL.md 또는 references/*.md).
2. `VERSION` 파일의 버전 번호를 올립니다.
3. `install.bat`을 다시 실행합니다 — 개인 스킬에 최신 내용이 덮어써집니다.
4. Claude Code를 새로 열면(또는 새 세션을 시작하면) "AI바이브코딩 작동" 명령이 최신 버전으로 동작합니다.

## 폴더 구조

```
AI바이브코딩/
├── README.md            ← 이 문서
├── VERSION               ← 현재 버전 (예: 1.1.0)
├── install.bat            ← 개인 스킬로 설치/업데이트하는 배치파일
├── skill/
│   └── vibecoding-guide/  ← 스킬 원본(최신 버전)
│       ├── SKILL.md                          핵심 지침 + 트리거
│       └── references/
│           ├── 00-guided-session-script.md   ★ 5블록·7단계 진행 대본(핵심)
│           ├── 01-why-sdd.md                 왜 절차가 필요한가
│           ├── 02-speckit-8steps.md          A코스: Spec Kit 8단계
│           ├── 03-lite-workflow.md           B코스: 경량 내장 워크플로
│           ├── 04-tdd-vertical-slice.md      TDD + 버티컬 슬라이스
│           ├── 05-troubleshooting.md         실전 트러블슈팅
│           ├── 06-collaboration-and-security.md  AI 협업 원칙·보안
│           ├── 07-run-guide-template.md      최종 산출물 구동 방법 템플릿
│           ├── 08-design-doc-template.md     설계서(~30p) 작성 템플릿
│           ├── 09-github-deploy-guide.md     GitHub 배포 방법 안내
│           └── 10-session-continuity.md      ★ (v1.2.0) progress.md 인계 + 증거 기반 완료 보고
└── docs/                  ← (선택) 이 프로젝트 자체에 대한 부가 문서
```

## 사용 예시

```
사용자: AI바이브코딩 작동
Claude: AI바이브코딩 프로젝트를 불러왔습니다. 지금부터 헌장부터 구현까지
        5단계 대화로 진행하겠습니다. 먼저 이번 프로젝트에서 절대 지켜야 할
        규칙을 정하겠습니다... (예시 답안 제시)
```

## Spec Kit과의 관계

GitHub의 정식 도구 [Spec Kit](https://github.com/github/spec-kit)이 설치되어 있으면 `/speckit.*` 명령을 활용하는 A코스로 진행합니다. 없어도 스킬에 내장된 경량 절차(B코스, 기본값)로 동일한 5블록·7단계 규율을 지킵니다. 설치는 필수가 아닙니다.
