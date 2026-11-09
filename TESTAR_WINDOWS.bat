@echo off
cd /d "%~dp0"
call RODAR_PYTHON.bat -m unittest discover -s tests -v
pause
