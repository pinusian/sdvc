# progress.md — SDVC 플랫폼

> 이 파일은 SDVC 스킬의 **세션 간 맥락 인계** 파일이다.
> 세션 시작 시 가장 먼저 읽고, 세션 종료 시 반드시 갱신한다.
> 규율 상세: `skill/sdvc-guide/references/10-session-continuity.md`

## 프로젝트

**SDVC (Structured Document & Vibe Coding)** — 구조화된 문서가 AI 코딩을 이끄는 방법론,
그리고 그것을 유료 웹서비스로 제품화하는 프로젝트.

## 현재 단계

**단계 0 — 플랫폼 셋업 완료. 아직 헌장(Constitution) 이전.**

## 여기까지 한 일

- 2026-09-07 — `AI Vibecoding\` 전체(구조·md·docx·번들·작업기억)를 `AI Vibecoding\SDVC\` 로 복제. 기존 원본은 그대로 보존.
- 2026-09-07 — 스킬 `vibecoding-guide` → **`sdvc-guide` (v2.0.0)** 로 개명·리브랜딩. 트리거 `SDVC 최신버전 작동`.
- 2026-09-07 — GitHub 플러그인/마켓플레이스 구조 생성 (`.claude-plugin/marketplace.json`, `plugins/sdvc-guide/`, `.claude/skills/sdvc-guide/`).
- 2026-09-07 — 웹서비스 제품화 트랙 `10_SDVC_웹서비스\` 개설 + `_제품_개요.md` 작성.
- 2026-09-07 — GitHub 저장소 `pinusian/sdvc` 로 업로드.

## 다음 할 일

1. `SDVC 최신버전 작동` 으로 세션을 열어 **블록 1(헌장 + 명세)** 부터 시작한다.
2. 헌장에서 확정할 것: 백엔드 언어(Python/TS), 스택(Next.js+Supabase+Stripe 등), 요금제 골격.
3. 명세(spec.md)에서 확정할 것: MVP 범위 — "로그인 → 트라이얼 판정 → 명세 생성 1회전"까지로 좁힐지 여부.
4. 미결 사항 목록은 `10_SDVC_웹서비스\_제품_개요.md` §4 참조.

## 열려 있는 결정 / 확인 필요

- Anthropic 구독-기반 Agent SDK 사용 정책은 2026-06-15 변경이 보류(pause)된 상태 → **서비스 착수 직전 재확인 필요**
  (https://support.claude.com/en/articles/15036540)
- EULA·환불정책·개인정보처리방침은 법률 검토 영역 (AI가 단정하지 않음).
