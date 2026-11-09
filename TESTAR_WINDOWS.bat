@echo off
cd /d "%~dp0"
runtime\python.exe -m unittest discover -s tests -v
pause
