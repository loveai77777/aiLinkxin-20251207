# 推送到 GitHub 脚本
# 仓库名: aiLinkxin-20251207

Write-Host "=== 推送到 GitHub ===" -ForegroundColor Green
Write-Host ""

# 检查是否在正确的目录
$currentDir = Get-Location
Write-Host "当前目录: $currentDir" -ForegroundColor Yellow

# 检查 Git 状态
Write-Host "`n检查 Git 状态..." -ForegroundColor Cyan
git status --short

# 检查是否有未提交的更改
$status = git status --porcelain
if ($status) {
    Write-Host "`n发现未提交的更改，正在添加..." -ForegroundColor Yellow
    git add .
    git commit -m "Update: AILINKXIN website changes"
}

# 检查远程仓库
Write-Host "`n检查远程仓库配置..." -ForegroundColor Cyan
$remote = git remote get-url origin 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n未找到远程仓库，需要添加..." -ForegroundColor Yellow
    Write-Host "请输入您的 GitHub 用户名:" -ForegroundColor Green
    $username = Read-Host
    
    if ($username) {
        $repoUrl = "https://github.com/$username/aiLinkxin-20251207.git"
        Write-Host "`n添加远程仓库: $repoUrl" -ForegroundColor Cyan
        git remote add origin $repoUrl
    } else {
        Write-Host "`n错误: 需要提供 GitHub 用户名" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "远程仓库已配置: $remote" -ForegroundColor Green
}

# 确保分支名为 main
Write-Host "`n检查分支名称..." -ForegroundColor Cyan
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "重命名分支为 main..." -ForegroundColor Yellow
    git branch -M main
}

# 推送到 GitHub
Write-Host "`n推送到 GitHub..." -ForegroundColor Cyan
Write-Host "仓库: aiLinkxin-20251207" -ForegroundColor Yellow
Write-Host "分支: main" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ 推送成功！" -ForegroundColor Green
    Write-Host "`n您的代码已推送到: https://github.com/$username/aiLinkxin-20251207" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ 推送失败，请检查错误信息" -ForegroundColor Red
    Write-Host "`n提示: 如果这是第一次推送，可能需要:" -ForegroundColor Yellow
    Write-Host "1. 确认 GitHub 仓库已创建" -ForegroundColor Yellow
    Write-Host "2. 检查网络连接" -ForegroundColor Yellow
    Write-Host "3. 确认 GitHub 用户名和仓库名正确" -ForegroundColor Yellow
}

