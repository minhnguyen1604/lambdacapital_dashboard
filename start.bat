@echo off
cd /d "%~dp0"
title Lambda Capital Dashboard Launcher
echo ==================================================
echo       LAMBDA CAPITAL DASHBOARD DEVELOPER
echo ==================================================
echo.
echo [+] Dang khoi dong Local Backend Server...
echo [+] Trinh duyet se tu dong mo: http://localhost:3000
echo.
echo (Dong cua so nay de tat ung dung)
echo ==================================================
echo.

:: Mo trinh duyet den trang local host
start http://localhost:3000

:: Chay file server python
python server.py

pause
