@echo off
cd /d "%~dp0"
echo 正在安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo 依赖安装失败，请检查 Node.js 和 npm 是否正确安装
    pause
    exit /b 1
)
echo.
echo 正在启动开发服务器...
call npm run dev
pause
