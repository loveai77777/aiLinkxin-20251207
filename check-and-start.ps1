# 检查并启动开发服务器
Write-Host "=== 检查开发环境 ===" -ForegroundColor Cyan

# 检查 Node.js
Write-Host "`n检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js 已安装: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js 未安装或不在 PATH 中" -ForegroundColor Red
    Write-Host "请访问 https://nodejs.org/ 下载并安装 Node.js" -ForegroundColor Yellow
    pause
    exit 1
}

# 检查 npm
Write-Host "`n检查 npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm 已安装: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm 未安装或不在 PATH 中" -ForegroundColor Red
    pause
    exit 1
}

# 检查 node_modules
Write-Host "`n检查依赖..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ 依赖已安装" -ForegroundColor Green
} else {
    Write-Host "✗ 依赖未安装，开始安装..." -ForegroundColor Yellow
    Write-Host "这可能需要几分钟时间，请耐心等待...`n" -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n✗ 依赖安装失败" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "`n✓ 依赖安装完成" -ForegroundColor Green
}

# 启动开发服务器
Write-Host "`n=== 启动开发服务器 ===" -ForegroundColor Cyan
Write-Host "服务器将在 http://localhost:3000 启动" -ForegroundColor Yellow
Write-Host "按 Ctrl+C 停止服务器`n" -ForegroundColor Gray
npm run dev
