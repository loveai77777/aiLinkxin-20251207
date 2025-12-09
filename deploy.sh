#!/bin/bash

# 网站部署脚本
# 使用方法: ./deploy.sh

set -e  # 遇到错误立即退出

echo "🚀 开始部署 AILINKXIN 网站..."

# 项目目录
PROJECT_DIR="/var/www/ailinkxin"
APP_NAME="ailinkxin"

# 进入项目目录
cd "$PROJECT_DIR" || exit 1

echo "📥 拉取最新代码..."
git fetch origin
git pull origin main

echo "📦 安装依赖..."
npm install

echo "🔨 构建项目..."
npm run build

echo "🔄 重启 PM2 应用..."
pm2 restart "$APP_NAME" || pm2 start ecosystem.config.js

echo "✅ 部署完成！"
echo ""
echo "查看应用状态: pm2 status"
echo "查看应用日志: pm2 logs $APP_NAME"

