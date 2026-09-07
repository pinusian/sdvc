---
name: vibecoding-guide
description: AI바이브코딩 프로젝트 — "AI바이브코딩 최신버전 작동", "AI바이브코딩 작동", "AI바이브코딩", "바이브코딩 시작", "앱 만들고 싶어", "웹사이트 만들어줘"처럼 무언가를 새로 만들려는 요청이나 명시적 실행 명령을 받으면 발동. 세션 시작 시 progress.md로 이전 맥락을 이어받고, Constitution→Specify→Clarify→Plan(승인)→Tasks(승인)→Analyze→Implement(TDD)의 7단계를 예시 답안과 함께 진행하며, 완료 보고에는 반드시 실제 실행 증거를 첨부하는 초보자용 바이브코딩 코칭 스킬.
---

# AI바이브코딩 프로젝트 (v1.2.0)

이 스킬이 발동되면, 사용자가 "AI바이브코딩 최신버전 작동"이라고 했든 그냥 "~만들고 싶어"라고 했든, **가장 먼저 `docs/progress.md`가 있는지 확인한다** (아래 0단계). 그런 다음 **반드시 `references/00-guided-session-script.md`를 읽고 그 대본 순서·승인 게이트·예시 답안 형식을 그대로 따른다.** 이 파일이 이 스킬의 핵심 실행 로직이다.

## 0단계 — 세션 시작 시 맥락 이어받기 (다른 어떤 작업보다 먼저)

1. `docs/progress.md`를 찾아 **읽는다.**
2. **있으면**: 내용을 요약해 보여주고 "여기서 이어서 진행할까요?"라고 확인받은 뒤, 기록된 "다음 할 일"부터 재개한다. 처음부터 다시 시작하지 않는다.
3. **없으면**: 새 프로젝트로 보고 아래 안내 후 블록 1(헌장)부터 시작한다.

> "AI바이브코딩 프로젝트를 불러왔습니다. 지금부터 헌장부터 구현까지 5단계 대화로 진행하겠습니다."

상세 규율은 `references/10-session-continuity.md`를 따른다.

## 최우선 규칙 (요약 — 상세는 00번, 10번 문서)

1. **세션 시작 시 progress.md를 먼저 읽고, 세션 종료 시 반드시 갱신한다.** (v1.2.0 신규)
2. **7단계를 5개 블록으로 진행한다**: [헌장+명세] → [명확화] → [계획→승인] → [작업분해→승인] → [분석+구현(TDD)]
3. **Plan과 Tasks 뒤에는 사용자의 명시적 승인 없이 다음 단계로 넘어가지 않는다.** 협상 불가능한 게이트다.
4. **모든 질문에는 예시 답안을 함께 제시한다.** 초보자가 그대로 따라 답할 수 있어야 한다.
5. **TDD 규율(RED→GREEN→REFACTOR, 단계별 별도 커밋)을 구현 내내 지킨다.**
6. **"완료" 보고에는 반드시 실제 실행한 명령과 출력을 근거로 붙인다.** 실행하지 않았으면 통과했다고 말하지 않는다. (v1.2.0 신규)
7. **API 키·비밀번호는 절대 AI가 값을 채우지 않는다.** 빈 `.env` 틀만 만들고 사용자가 직접 입력.

## 4가지 함정 → 4가지 규칙 (이 프로젝트가 막으려는 것)

| 함정 | 규칙 |
|---|---|
| 애매하게 요청하면 애매하게 만들어진다 | 명세(Specify) 없이 구현 시작 금지 — 블록 1에서 반드시 확정 |
| 제대로 동작하는지 확인할 방법이 없다 | 테스트 없이 "완성" 선언 금지 — RED→GREEN→REFACTOR + **실행 증거 첨부** |
| 왜 이렇게 만들었는지 기록이 안 남는다 | 모든 결정을 spec.md/plan.md/tasks.md와 커밋 메시지에 기록 |
| **세션이 끊기면 맥락이 사라진다** (v1.2.0) | **`docs/progress.md`로 세션 간 인계 — 시작 시 읽고, 종료 시 갱신** |

## Spec Kit 본체와의 관계

프로젝트 폴더에 `.specify/` 폴더나 `/speckit.*` 명령이 있으면, `references/02-speckit-8steps.md`를 참고해 그 명령을 활용해도 된다 (A코스). 없으면 `references/00-guided-session-script.md`와 `references/03-lite-workflow.md`에 따라 문서를 직접 만들며 동일한 규율을 지킨다 (B코스, 기본값). 어느 쪽이든 5블록 대화 순서, 승인 게이트, progress.md 인계, 증거 기반 보고는 동일하게 적용한다.

## 참고 문서 (필요할 때 읽는다)

| 파일 | 언제 읽나 |
|---|---|
| `references/00-guided-session-script.md` | **항상 — 세션 시작 즉시** (핵심 진행 대본) |
| `references/10-session-continuity.md` | **항상 — 세션 시작/종료 시** (progress.md 인계, 증거 기반 보고) |
| `references/01-why-sdd.md` | "왜 이렇게 복잡하게 해야 해?"라는 질문을 받았을 때 |
| `references/02-speckit-8steps.md` | Spec Kit(A코스)이 설치되어 있어 그 명령을 쓸 때 |
| `references/03-lite-workflow.md` | Spec Kit 없이(B코스, 기본) 문서를 직접 만들 때 |
| `references/04-tdd-vertical-slice.md` | 블록 4(작업분해)·블록 5(구현) 진입 시 |
| `references/05-troubleshooting.md` | 에러·이상 동작을 만났을 때 |
| `references/06-collaboration-and-security.md` | 결정 위임 범위나 보안 이슈가 생겼을 때 |
| `references/07-run-guide-template.md` | 구현이 끝나 "실행 방법" 문서와 원클릭 배치파일을 만들 때 |
| `references/08-design-doc-template.md` | 구현이 끝나 최종 설계서(docx, ~30페이지)를 작성할 때 |
| `references/09-github-deploy-guide.md` | 사용자가 결과물을 GitHub에 올리고 싶어할 때 (실행 전 반드시 승인받을 것) |

## 버전

v1.2.0 — 세션 연속성(progress.md)과 증거 기반 완료 보고 규율 추가.

배포처: github.com/pinusian/vibecoding-guide (플러그인) · github.com/pinusian/vibecoding-starter (시작 템플릿). 스킬을 수정했다면 사용 중인 프로젝트의 `.claude/skills/vibecoding-guide/` 또는 개인 스킬 폴더(`~/.claude/skills/vibecoding-guide/`)에 반영한 뒤 새 세션을 열어야 적용된다.
