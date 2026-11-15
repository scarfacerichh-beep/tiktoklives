@echo off
cd /d "%~dp0"
call RODAR_PYTHON.bat servidor.py --auto-port --open --view luna %*
if errorlevel 1 pause
