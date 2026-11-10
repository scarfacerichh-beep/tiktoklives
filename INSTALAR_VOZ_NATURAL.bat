@echo off
setlocal
cd /d "%~dp0"
echo Instalacao OPCIONAL da voz natural online.
echo Baixa edge-tts e dependencias do PyPI para uma pasta .venv local.
echo As falas so sao enviadas a Microsoft depois da autorizacao no painel.
echo Nao altera o antivirus. Requer Python 3.11+ instalado oficialmente.
pause
if exist ".venv\Scripts\python.exe" goto instalar
call RODAR_PYTHON.bat -m venv .venv
if errorlevel 1 goto erro
:instalar
.venv\Scripts\python.exe -m pip install -r requirements-voz.txt
if errorlevel 1 goto erro
echo Pronto. Feche o servidor da arena e abra INICIAR_INTERALIVES_QI.bat.
pause
exit /b 0
:erro
echo A instalacao falhou. Confira Python e conexao. A voz local continua disponivel.
pause
exit /b 1
