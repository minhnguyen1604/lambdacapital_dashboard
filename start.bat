@echo off
title Lambda Capital Dashboard Server
echo ===================================================
echo   Khoi dong Lambda Capital Dashboard Server...
echo   Server se chay tai dia chi: http://localhost:3000
echo ===================================================
echo.

:: Open browser automatically
start "" "http://localhost:3000"

:: Start the python server
python server.py

if %ERRORLEVEL% neq 0 (
    echo.
    echo [LOI] Khong the khoi dong python server.py.
    echo Vui long kiem tra xem Python da duoc cai dat va them vao PATH chua.
    echo.
    pause
)
