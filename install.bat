@echo off
chcp 65001 >nul
setlocal

set "SRC=%~dp0skill\sdvc-guide"
set "DST=%USERPROFILE%\.claude\skills\sdvc-guide"

echo ============================================
echo  SDVC : install sdvc-guide skill
echo  (Structured Document ^& Vibe Coding)
echo ============================================
echo.
echo Source : %SRC%
echo Install to (personal skill folder): %DST%
echo.

if not exist "%SRC%\SKILL.md" (
    echo [ERROR] Source skill folder not found: %SRC%
    pause
    exit /b 1
)

if not exist "%USERPROFILE%\.claude\skills" (
    mkdir "%USERPROFILE%\.claude\skills"
)

echo Copying latest version...
robocopy "%SRC%" "%DST%" /MIR /NFL /NDL /NJH /NJS >nul

if %ERRORLEVEL% GEQ 8 (
    echo [ERROR] Copy failed. robocopy exit code: %ERRORLEVEL%
    pause
    exit /b 1
)

echo.
echo Install complete. (v2.0.0)
echo In any Claude Code project, use the trigger phrase:
echo   SDVC 최신버전 작동
echo   (also works: SDVC 작동 / SDVC 시작 / SDVC)
echo Open a new Claude Code session for this to take effect.
echo.
echo NOTE: the previous skill "vibecoding-guide" is left untouched.
echo       Both can coexist in %USERPROFILE%\.claude\skills\.
echo.
pause
