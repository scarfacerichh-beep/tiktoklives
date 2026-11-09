@echo off
setlocal
cd /d "%~dp0"
if exist "INTERALIVES_QI_STUDIO.exe" (
    "INTERALIVES_QI_STUDIO.exe" %*
    exit /b
)
if exist "runtime\python.exe" (
    "runtime\python.exe" servidor.py --open %*
    if errorlevel 1 pause
    exit /b
)
where py >nul 2>nul
if not errorlevel 1 (
    py -3 servidor.py --open %*
) else (
    python servidor.py --open %*
)
if errorlevel 1 (
    echo Falha ao iniciar. Extraia o ZIP completo com a pasta runtime.
    pause
)
