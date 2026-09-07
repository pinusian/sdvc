@echo off
setlocal

set "SRC=%~dp0skill\vibecoding-guide"
set "DST=%USERPROFILE%\.claude\skills\vibecoding-guide"

echo ============================================
echo  AI-Vibecoding : install vibecoding-guide skill
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
echo Install complete. (v1.2.0)
echo In any Claude Code project, use the Korean trigger phrase:
echo   AI바이브코딩 최신버전 작동
echo   (also works: AI바이브코딩 작동 / 바이브코딩 시작 / OO 만들고 싶어)
echo Open a new Claude Code session for this to take effect.
echo.
pause
