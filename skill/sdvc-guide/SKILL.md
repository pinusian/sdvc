---
name: sdvc-guide
description: SDVC(Structured Document & Vibe Coding) 프로젝트 — "SDVC 최신버전 작동", "SDVC 작동", "SDVC 시작", "SDVC", "SDVC서버 구축"처럼 명시적 실행 명령을 받거나, 구조화된 문서로 AI 코딩을 이끄는 절차로 무언가를 새로 만들려는 요청("앱 만들고 싶어", "웹서비스 만들어줘")을 받으면 발동. 세션 시작 시 progress.md로 이전 맥락을 이어받고, Constitution→Specify→Clarify→Plan(승인)→Tasks(승인)→Analyze→Implement(TDD)의 7단계를 예시 답안과 함께 진행하며, 완료 보고에는 반드시 실제 실행 증거를 첨부하는 구조화 문서 기반 바이브코딩 코칭 스킬.
---

# SDVC — Structured Document & Vibe Coding (v2.1.0)

> **SDVC = 구조화된 문서가 AI 코딩을 이끈다.**
> 기존 AI-VC(AI 바이브코딩) 방법론 v1.2.0을 계승·개명한 것이며,
> 앞으로 **유료 웹서비스 제품**으로 개발해 나가는 플랫폼의 이름이기도 하다.

이 스킬이 발동되면, 사용자가 "SDVC 최신버전 작동"이라고 했든 그냥 "~만들고 싶어"라고 했든, **가장 먼저 `docs/progress.md`가 있는지 확인한다** (아래 0단계). 그런 다음 **반드시 `references/00-guided-session-script.md`를 읽고 그 대본 순서·승인 게이트·예시 답안 형식을 그대로 따른다.** 이 파일이 이 스킬의 핵심 실행 로직이다.

## 0단계 — 세션 시작 시 맥락 이어받기 (다른 어떤 작업보다 먼저)

1. `docs/progress.md`를 찾아 **읽는다.**
2. **있으면**: 내용을 요약해 보여주고 "여기서 이어서 진행할까요?"라고 확인받은 뒤, 기록된 "다음 할 일"부터 재개한다. 처음부터 다시 시작하지 않는다.
3. **없으면**: 새 프로젝트로 보고 아래 안내 후 블록 1(헌장)부터 시작한다.

> "SDVC 프로젝트를 불러왔습니다. 구조화된 문서로 AI 코딩을 이끄는 5단계 대화로, 헌장부터 구현까지 진행하겠습니다."

상세 규율은 `references/10-session-continuity.md`를 따른다.

## SDVC 플랫폼 루트에서 발동된 경우 (추가 0.5단계)

작업 폴더가 SDVC 플랫폼 루트(`...\AI Vibecoding\SDVC\`)이거나 그 하위이면, **SDVC 제품 자체를 개발하는 세션**이다. 이때는 0단계에 이어 다음을 먼저 읽는다.

| 파일 | 내용 |
|---|---|
| `10_SDVC_웹서비스/_제품_개요.md` | 유료 웹서비스로서의 SDVC 제품 정의·범위 |
| `10_SDVC_웹서비스/20260907_웹서비스_제품화_논의요약.md` | Agent SDK·과금·결제·트라이얼 사전조사 결론 |
| `_작업기억/SDVC/context.md` · `plan.md` · `checklist.md` | 직전 세션 인계 사항 |

그 외 폴더에서 발동된 경우에는 이 단계를 건너뛰고 일반 프로젝트 코칭으로 진행한다.

### 이 트랙(SDVC 웹서비스 구축) 전용 트리거 문구

"SDVC 웹서비스를 만드는 작업" 자체를 진행할 때는 아래 전용 문구를 쓴다. 최초 시작도 재개도 같은 문구다 — 0단계가 `docs/progress.md` 유무로 알아서 "새 프로젝트"와 "이어서 진행"을 구분한다.

| 문구 | 동작 |
|---|---|
| `SDVC서버 구축` | 세션 시작/재개. `docs/progress.md`를 읽고, 있으면 이어서·없으면 블록 1부터 시작 |
| `작업 휴식` | 세션 일시 중단. 지금까지 진행 내용을 `docs/progress.md`에 저장(6블록 형식)하고 커밋 후 종료 — 09번(GitHub 배포) 같은 별도 승인이 필요한 절차는 건너뛴다 |

일반 트리거(`SDVC 최신버전 작동` 등)도 이 폴더에서는 동일하게 동작하지만, 이 프로젝트를 계속 이어갈 때는 `SDVC서버 구축` / `작업 휴식` 쌍을 우선 사용한다.

## 최우선 규칙 (요약 — 상세는 00번, 10번 문서)

1. **세션 시작 시 progress.md를 먼저 읽고, 세션 종료 시 반드시 갱신한다.**
2. **7단계를 5개 블록으로 진행한다**: [헌장+명세] → [명확화] → [계획→승인] → [작업분해→승인] → [분석+구현(TDD)]
3. **Plan과 Tasks 뒤에는 사용자의 명시적 승인 없이 다음 단계로 넘어가지 않는다.** 협상 불가능한 게이트다.
4. **모든 질문에는 예시 답안을 함께 제시한다.** 초보자가 그대로 따라 답할 수 있어야 한다.
5. **TDD 규율(RED→GREEN→REFACTOR, 단계별 별도 커밋)을 구현 내내 지킨다.**
6. **"완료" 보고에는 반드시 실제 실행한 명령과 출력을 근거로 붙인다.** 실행하지 않았으면 통과했다고 말하지 않는다.
7. **API 키·비밀번호는 절대 AI가 값을 채우지 않는다.** 빈 `.env` 틀만 만들고 사용자가 직접 입력.

## 4가지 함정 → 4가지 규칙 (이 방법론이 막으려는 것)

| 함정 | 규칙 |
|---|---|
| 애매하게 요청하면 애매하게 만들어진다 | 명세(Specify) 없이 구현 시작 금지 — 블록 1에서 반드시 확정 |
| 제대로 동작하는지 확인할 방법이 없다 | 테스트 없이 "완성" 선언 금지 — RED→GREEN→REFACTOR + **실행 증거 첨부** |
| 왜 이렇게 만들었는지 기록이 안 남는다 | 모든 결정을 spec.md/plan.md/tasks.md와 커밋 메시지에 기록 |
| 세션이 끊기면 맥락이 사라진다 | **`docs/progress.md`로 세션 간 인계 — 시작 시 읽고, 종료 시 갱신** |

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

## 트리거 문구

`SDVC 최신버전 작동` · `SDVC 작동` · `SDVC 시작` · `SDVC`
(그 밖에 "앱 만들고 싶어", "웹서비스 만들어줘" 같은 신규 제작 요청에도 발동)

SDVC 플랫폼 루트에서 웹서비스 구축 작업을 이어갈 때는 `SDVC서버 구축`(시작/재개) · `작업 휴식`(저장 후 중단) 전용 쌍을 쓴다 — 위 "SDVC 플랫폼 루트에서 발동된 경우" 절 참고.

## 버전

**v2.1.0** — SDVC 웹서비스 구축 트랙 전용 시작/중단 문구 추가 (`SDVC서버 구축` / `작업 휴식`).
**v2.0.0** — AI-VC v1.2.0을 SDVC(Structured Document & Vibe Coding)로 개명·계승.
스킬 이름 `vibecoding-guide` → `sdvc-guide`, 유료 웹서비스 제품화 트랙(`10_SDVC_웹서비스\`) 추가.
방법론 본체(5블록 7단계, 승인 게이트, TDD, progress.md 인계)는 v1.2.0과 동일하다.

## 원본 위치

이 스킬의 원본(source of truth)은
`C:\Users\USER\Claude작업용폴더\AI Vibecoding\SDVC\skill\sdvc-guide\` 이다.
이 폴더의 내용을 고치면 `install.bat`을 다시 실행해야 개인 스킬(`~\.claude\skills\sdvc-guide\`)에 반영된다.
GitHub 저장소(`pinusian/sdvc`)의 `plugins/sdvc-guide/skills/sdvc-guide/`와 `.claude/skills/sdvc-guide/`에도
같은 내용이 배포되어 있으며, 수정 시 `sync-skill.bat`으로 세 곳을 한 번에 맞춘다.
