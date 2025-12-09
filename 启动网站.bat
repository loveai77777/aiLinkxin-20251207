@echo off
chcp 65001 >nul
title 启动开发服务器
color 0A

echo ========================================
echo    启动 Next.js 开发服务器
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查 Node.js 环境...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Node.js！
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo.

echo [2/3] 检查并安装依赖...
if not exist "node_modules" (
    echo 正在安装依赖，请稍候...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败！
        pause
        exit /b 1
    )
    echo 依赖安装完成！
) else (
    echo 依赖已存在，跳过安装
)
echo.

echo [3/3] 启动开发服务器...
echo.
echo ========================================
echo  服务器地址: http://localhost:3000
echo  按 Ctrl+C 停止服务器
echo ========================================
echo.

call npm run dev

pause
