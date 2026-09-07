@echo off
chcp 65001 >nul
setlocal

rem ============================================================
rem  SDVC : sync skill source of truth to all distribution slots
rem  1) plugins\sdvc-guide\skills\sdvc-guide  (GitHub plugin)
rem  2) .claude\skills\sdvc-guide             (repo-embedded, works on claude.ai/code)
rem  3) %USERPROFILE%\.claude\skills\sdvc-guide (personal skill)
rem ============================================================

set "SRC=%~dp0skill\sdvc-guide"
set "P1=%~dp0plugins\sdvc-guide\skills\sdvc-guide"
set "P2=%~dp0.claude\skills\sdvc-guide"
set "P3=%USERPROFILE%\.claude\skills\sdvc-guide"

if not exist "%SRC%\SKILL.md" (
    echo [ERROR] Source skill folder not found: %SRC%
    pause
    exit /b 1
)

echo Source : %SRC%
echo.

for %%D in ("%P1%" "%P2%" "%P3%") do (
    echo Syncing -^> %%~D
    robocopy "%SRC%" "%%~D" /MIR /NFL /NDL /NJH /NJS >nul
    if errorlevel 8 (
        echo [ERROR] Copy failed for %%~D
        pause
        exit /b 1
    )
)

echo.
echo Sync complete.
echo Next: bump VERSION + plugins\sdvc-guide\.claude-plugin\plugin.json, then commit and push.
echo.
pause
