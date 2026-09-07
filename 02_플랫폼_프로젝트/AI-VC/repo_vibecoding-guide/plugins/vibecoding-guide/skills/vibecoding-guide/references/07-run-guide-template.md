# 07. 최종 산출물 구동 방법 — 작성 템플릿

> 구현(Implement)이 끝나고 실제로 동작하는 결과물이 생기면, 이 템플릿을 채워 프로젝트 폴더에 `RUN.md`(또는 `docs/run-guide.md`)로 저장한다. 초보자가 몇 달 뒤 다시 열어봐도 그대로 따라할 수 있게 쓴다.

## 채워야 할 항목

### 1. 사전 준비물

실제 사용한 기술에 맞춰 구체적인 설치 링크와 버전을 적는다. 예시(Python+Node 조합 기준):

```markdown
## 사전 준비물
- Python 3.11 이상 — https://www.python.org/downloads/
- Node.js 20 이상 — https://nodejs.org/
- (선택) Git — https://git-scm.com/
```

### 2. 프로젝트 내려받기

```markdown
## 프로젝트 내려받기
### GitHub에서 받는 경우
git clone https://github.com/<계정명>/<저장소명>.git
cd <저장소명>

### 압축파일로 받은 경우
받은 zip을 원하는 폴더에 풀고, 그 폴더로 이동합니다.
```

### 3. 백엔드 실행하기

가상환경 생성 → 의존성 설치 → 서버 실행, 3단계로 구체적인 명령을 적는다. 예시:

```markdown
## 백엔드(서버) 실행하기
1. backend 폴더로 이동: `cd backend`
2. 가상환경 만들기: `python -m venv venv`
3. 가상환경 켜기 (Windows): `venv\Scripts\activate`
4. 필요한 패키지 설치: `pip install -r requirements.txt`
5. (필요 시) .env 파일 준비: `.env.example`을 복사해 `.env`로 만들고 값 채우기
6. 서버 실행: `uvicorn main:app --reload --port 8000`
7. 정상 실행 확인: 브라우저에서 http://localhost:8000/docs 접속
```

### 4. 프론트엔드 실행하기

```markdown
## 프론트엔드(화면) 실행하기
1. 새 터미널을 하나 더 엽니다 (백엔드는 계속 켜둔 채로)
2. frontend 폴더로 이동: `cd frontend`
3. 패키지 설치: `npm install`
4. 실행: `npm run dev`
5. 브라우저에서 안내된 주소(예: http://localhost:5173) 접속
```

### 5. 백엔드/프론트엔드 한 번에 실행하는 배치파일 만들기

**초보자가 매번 터미널 2개를 열고 명령을 치는 것은 번거롭다.** 구현이 끝나면 반드시 원클릭 실행용 배치파일을 함께 만들어준다.

**Windows용 `start-servers.bat` 예시**:

```bat
@echo off
chcp 65001 >nul
echo AI바이브코딩 프로젝트를 시작합니다...

start "Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul
start http://localhost:5173

echo 두 개의 터미널 창이 열렸습니다. 이 창은 닫아도 됩니다.
pause
```

**포인트**:
- `%~dp0`은 배치파일이 있는 폴더 경로를 자동으로 가리킨다 — 사용자가 경로를 직접 수정할 필요가 없다.
- 각 서버를 `start "이름" cmd /k ...`로 별도 창에 띄워야 로그를 각각 확인할 수 있다.
- 마지막에 브라우저를 자동으로 열어주면 초보자가 주소를 몰라도 된다.
- `chcp 65001`은 한글 깨짐을 방지한다.
- 종료 방법도 함께 안내한다: "각 터미널 창에서 Ctrl+C를 누르거나 창을 닫으면 서버가 종료됩니다."

**macOS/Linux용이 필요하면** `start-servers.sh`도 동일한 논리로 만든다 (`&`로 백그라운드 실행, `open` 또는 `xdg-open`으로 브라우저 열기).

### 6. 종료할 때

```markdown
## 종료할 때
1. 프론트엔드 터미널 창에서 Ctrl+C
2. 백엔드 터미널 창에서 Ctrl+C
3. (배치파일로 실행했다면) 열린 터미널 창을 그냥 닫아도 됩니다
```

### 7. 자동화된 테스트 실행하기 (선택)

```markdown
## 테스트 실행하기
cd backend
pytest
```

## 문서 배치 규칙

- 파일명: `RUN.md` (프로젝트 루트) 또는 `docs/run-guide.md`
- 배치파일: 프로젝트 루트에 `start-servers.bat`로 저장하고 RUN.md에서 "5분 안에 실행하기" 같은 절 제목으로 가장 먼저 안내한다.
