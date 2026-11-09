@echo off
cd /d "%~dp0"
echo Inicie o jogo antes. Este teste REINICIA a sessao e usa eventos simulados.
runtime\python.exe tests\soak_real.py --seconds 3600 > teste-60-minutos.txt 2>&1
type teste-60-minutos.txt
pause
