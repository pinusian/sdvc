# 09. GitHub 배포 방법 — 안내 템플릿

> 구현이 끝난 프로젝트를 GitHub에 올리고 싶어하는 사용자에게 이 절차를 안내한다.
> **저장소 생성·푸시는 사용자 확인 없이 실행하지 않는다** — Claude Code의 안전 원칙상 GitHub에 새 저장소를 만들고 코드를 올리는 행위는 눈에 보이는 공개 행위이므로, 실행 전 반드시 사용자에게 무엇을 어디에 올릴지 명확히 말하고 승인을 받는다.

## 사전 확인 사항 (배포 전 필수 점검)

배포를 진행하기 전, 다음을 반드시 확인하고 사용자에게도 알린다:

1. **`.gitignore`에 `.env`가 포함되어 있는가?** — API 키·비밀번호가 커밋되지 않도록.
2. **`.env` 파일 자체가 git에 이미 추적되고 있지 않은가?** (`git status`로 확인. 이미 추적 중이면 `git rm --cached .env` 먼저 실행)
3. **공개(Public)로 올려도 되는 내용인가?** — 개인정보·회사 정보가 섞여 있지 않은지 확인.
4. **저장소를 공개(Public)로 할지 비공개(Private)로 할지** 사용자에게 직접 묻는다.

## 단계별 절차

### 1단계 — GitHub CLI(gh) 설치 확인

```bash
gh --version
```

설치되어 있지 않다면:

```powershell
winget install --id GitHub.cli -e
```

**winget이 인식되지 않을 때**: PATH가 아직 갱신되지 않은 세션일 수 있다. 전체 경로로 직접 실행한다.

```powershell
& "$env:LOCALAPPDATA\Microsoft\WindowsApps\winget.exe" install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements --disable-interactivity
```

설치 후에는 **새 터미널 창을 열어야** `gh` 명령이 짧게 인식된다. 급하면 설치 경로(`C:\Program Files\GitHub CLI\gh.exe`)를 전체 경로로 직접 실행한다.

### 2단계 — GitHub 로그인

```bash
gh auth login
```

선택 항목: GitHub.com → HTTPS → Git 자격증명 연동 Yes → "Login with a web browser" → 브라우저에 8자리 코드 입력.

확인:
```bash
gh auth status
```

### 3단계 — 로컬 저장소 준비 (git 초기화·커밋)

```bash
cd 프로젝트폴더
git init -b main
git add -A
git commit -m "feat: 초기 버전"
```

(이미 git 프로젝트라면 이 단계는 건너뛴다.)

### 4단계 — 사용자 승인 받기

**아래처럼 명확히 확인한 뒤에만 다음 명령을 실행한다.**

> "지금 `프로젝트폴더`의 내용을 GitHub에 `{계정명}/{저장소명}`이라는 이름으로 새로 만들어 올리려고 합니다. 공개(Public)로 할까요, 비공개(Private)로 할까요? 진행해도 될까요?"

### 5단계 — 저장소 생성 및 푸시

```bash
gh repo create <저장소명> --public --source . --push
```
(비공개로 하려면 `--public` 대신 `--private`)

### 6단계 — 결과 확인

```bash
gh repo view <계정명>/<저장소명>
```

브라우저에서 실제 저장소 페이지를 열어 파일이 잘 올라갔는지, `.env`가 실수로 올라가지 않았는지 최종 확인한다.

## 이후 업데이트 방법 (코드를 고친 뒤 다시 올리기)

```bash
git add -A
git commit -m "fix: 버그 수정"
git push
```

## 수강생에게 나눠줄 수 있는 간단 배포 가이드 (요약 카드)

프로젝트가 끝나면, 위 절차를 아래처럼 A4 1페이지 요약 카드 형태로 만들어 `docs/github-deploy-guide.md`로 함께 남겨준다:

```markdown
# GitHub에 내 프로젝트 올리기 (5분 요약)

1. gh --version 으로 설치 확인 (없으면 winget install --id GitHub.cli -e)
2. gh auth login 으로 로그인 (브라우저 인증)
3. git init -b main && git add -A && git commit -m "feat: 초기 버전"
4. gh repo create 내저장소이름 --public --source . --push
5. gh repo view 로 확인

주의: .env 파일은 .gitignore에 반드시 포함! (API 키 노출 방지)
```
