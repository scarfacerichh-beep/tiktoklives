@echo off
setlocal
cd /d "%~dp0"
if exist "INTERALIVES_QI_STUDIO.exe" (
    echo Esta pasta contem o executavel de outra edicao.
    echo Extraia a edicao em codigo-fonte em uma PASTA NOVA.
    echo Nao restaure nem permita o arquivo bloqueado pelo antivirus.
    exit /b 1
)
if exist ".venv\Scripts\python.exe" (
    .venv\Scripts\python.exe %*
    exit /b
)
where py >nul 2>nul
if not errorlevel 1 (
    py -3 -c "import sys; sys.exit(0 if sys.version_info >= (3,11) else 1)" >nul 2>nul
    if not errorlevel 1 (
        py -3 %*
        exit /b
    )
)
where python >nul 2>nul
if not errorlevel 1 (
    python -c "import sys; sys.exit(0 if sys.version_info >= (3,11) else 1)" >nul 2>nul
    if not errorlevel 1 (
        python %*
        exit /b
    )
)
echo Instale Python 3.11 ou superior pelo site OFICIAL:
echo https://www.python.org/downloads/windows/
echo Depois, feche e abra este arquivo novamente.
echo Este script nao baixa programas nem altera o antivirus.
exit /b 1
