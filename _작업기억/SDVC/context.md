# context.md — SDVC 플랫폼

## 주요 결정 (2026-09-07)
- **SDVC = Structured Document & Vibe Coding.** "구조화된 문서가 AI 코딩을 이끈다"는 뜻.
  기존 AI-VC(AI 바이브코딩)의 새 이름이자, 유료 웹서비스 제품의 이름.
- 위치: `AI Vibecoding\SDVC\` — **AI Vibecoding 루트 전체를 복제**해서 만듦.
  기존 자료는 루트에 **그대로 보존**(사용자 지침). SDVC는 독립 트랙으로 진화시킨다.
- 스킬 이름 `vibecoding-guide` → `sdvc-guide`, 버전 1.2.0 → **2.0.0**.
  방법론 본체(5블록 7단계·승인 게이트·TDD·progress.md 인계)는 변경하지 않음 — 이름/트리거/배포만 분기.
- 개인 스킬은 두 개가 공존한다: `~\.claude\skills\vibecoding-guide\`(기존, 유지) + `~\.claude\skills\sdvc-guide\`(신규).
  기존 트리거("AI바이브코딩 작동")와 신규 트리거("SDVC 최신버전 작동")가 서로 간섭하지 않게 description을 분리했다.
- 스킬 원본(source of truth)은 `SDVC\skill\sdvc-guide\`. 배포 슬롯 3곳(`plugins\...`, `.claude\skills\...`, 개인 스킬)은
  `sync-skill.bat` 으로 한 번에 맞춘다 — 손으로 3곳을 고치다 어긋나는 사고를 막기 위함.
- GitHub 저장소는 **private**로 생성. 유료 제품 소스이고 도서 원고 docx가 함께 들어 있기 때문.
  공개 전환은 사용자 판단으로 언제든 가능(`gh repo edit --visibility public`).
- 복제 시 `repo_vibecoding-*` 작업사본의 `.git` 은 제외했다(중첩 git 저장소 문제 회피).
  히스토리는 같은 폴더의 `*.bundle` 에 온전히 남아 있어 복원 가능.

## 참고
- 옛 스킬의 "원본 경로 안내" 문구가 폴더명 `AI바이브코딩`(현재는 `AI Vibecoding`)으로 어긋나 있던 문제는
  SDVC판 SKILL.md에서 정확한 경로로 정정했다.
- 웹서비스 제품화 사전조사 결론은 `10_SDVC_웹서비스\20260907_웹서비스_제품화_논의요약.md`.
