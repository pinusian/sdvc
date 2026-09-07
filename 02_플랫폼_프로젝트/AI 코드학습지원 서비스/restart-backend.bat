@echo off
REM ============================================================================
REM  restart-backend.bat  -  "화면에 502 Request failed with status 502" 가
REM  뜰 때 실행하는 백엔드 복구 스크립트.
REM
REM  하는 일:
REM   1) 멈췄거나 좀비가 된 백엔드 uvicorn 프로세스를 강제 종료
REM   2) requirements.txt 기준으로 파이썬 패키지 재설치 - 누락 자동 보충
REM   3) 백엔드를 새 창에서 다시 실행하고 /docs 로 정상 여부 확인
REM
REM  프런트엔드 5173 / 5174 는 그대로 두어도 됩니다. 백엔드만 되살리면
REM  502 는 사라집니다.
REM
REM  NOTE: cmd.exe 는 if/else 괄호 블록 안의 "(" ")" 를 구문으로 해석하므로
REM  블록 안 echo 문에는 소괄호를 쓰지 않는다. 여기서는 goto 구조로 회피함.
REM ============================================================================

cd /d "%~dp0"

echo.
echo [1/4] 기존 백엔드 uvicorn 프로세스 정리 중...
REM backend.src.main 을 실행 중인 python 을 모두 종료 - 좀비 포함.
REM --reload 감시 프로세스는 포트를 물고 있어도 netstat 에 안 보이므로
REM 포트가 아니라 명령줄 내용으로 찾아 종료한다.
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | Where-Object { $_.CommandLine -like '*backend.src.main*' -or $_.CommandLine -like '*uvicorn*backend*' } | ForEach-Object { Write-Host ('  - kill PID ' + $_.ProcessId); Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"

REM 8000 포트를 아직 물고 있는 다른 프로세스가 있으면 그것도 종료.
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":8000 .*LISTENING"') do taskkill /F /PID %%p >nul 2>&1

timeout /t 2 /nobreak >nul

echo.
echo [2/4] 파이썬 패키지 확인/설치 중 - requirements.txt
if not exist "backend\.venv\Scripts\activate.bat" goto NOVENV
call backend\.venv\Scripts\activate.bat
python -m pip install -q -r requirements.txt
if errorlevel 1 goto PIPFAIL

echo.
echo [3/4] 백엔드 새 창에서 실행...
start "AI Learning - Backend - port 8000" powershell -NoExit -ExecutionPolicy Bypass -Command "cd '%~dp0'; backend\.venv\Scripts\Activate.ps1; python -m uvicorn backend.src.main:app --port 8000 --reload"

echo.
echo [4/4] 정상 실행 확인 중 - 최대 20초 대기...
set OK=
for /L %%i in (1,1,20) do call :CHECK
goto RESULT

:CHECK
if defined OK goto :eof
timeout /t 1 /nobreak >nul
curl -s -o nul --max-time 2 http://127.0.0.1:8000/docs
if not errorlevel 1 set OK=1
goto :eof

:RESULT
echo.
if defined OK goto GOOD
echo   ----------------------------------------------------
echo    아직 응답이 없습니다. 새로 열린 Backend 창의
echo    빨간 오류 메시지를 확인하세요 - 대개 import 오류나
echo    문법 오류입니다.  docs\run-guide.md 9번 항목 참고.
echo   ----------------------------------------------------
goto END

:GOOD
echo   ====================================================
echo    백엔드 정상 - http://localhost:8000/docs 응답 확인됨
echo    이제 브라우저에서 5173 / 5174 를 새로고침하세요.
echo   ====================================================
goto END

:NOVENV
echo.
echo [오류] backend\.venv 가상환경이 없습니다.
echo        먼저 아래를 실행하세요:
echo            python -m venv backend\.venv
echo            backend\.venv\Scripts\activate
echo            pip install -r requirements.txt
goto END

:PIPFAIL
echo.
echo [오류] 패키지 설치에 실패했습니다. 위 메시지를 확인하세요.
goto END

:END
echo.
pause
