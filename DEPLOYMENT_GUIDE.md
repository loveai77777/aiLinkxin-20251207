# 网站部署指南 - www.ailinkxin.com

本指南将帮助您将网站推送到 GitHub，并设置自动部署到 www.ailinkxin.com。

## 📋 目录
1. [推送到 GitHub](#1-推送到-github)
2. [自动部署方案选择](#2-自动部署方案选择)
3. [方案 A: 使用 Vercel（推荐）](#方案-a-使用-vercel推荐)
4. [方案 B: 使用 Netlify](#方案-b-使用-netlify)
5. [方案 C: 使用 GitHub Actions + 自己的服务器](#方案-c-使用-github-actions--自己的服务器)

---

## 1. 推送到 GitHub

### 步骤 1.1: 在 GitHub 上创建新仓库

1. 登录 GitHub (https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `ailinkxin-website` (或您喜欢的名称)
   - **Description**: `AILINKXIN 官方网站`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为项目已有文件）
4. 点击 "Create repository"

### 步骤 1.2: 使用 GitHub Desktop 推送代码

1. 打开 GitHub Desktop
2. 如果项目还没有初始化 Git：
   - 点击 "File" → "Add Local Repository"
   - 选择项目文件夹：`c:\Users\mirag\Desktop\my project\xinyuliu-main\main-aili8nkxin-1130`
   - 如果提示需要初始化，点击 "Create a repository"

3. 如果项目已有 Git 历史：
   - 点击 "Repository" → "Repository Settings" → "Remote"
   - 添加远程仓库 URL（从 GitHub 复制的仓库地址）
   - 例如：`https://github.com/您的用户名/ailinkxin-website.git`

4. 提交并推送：
   - 在 GitHub Desktop 中，您会看到所有更改的文件
   - 在左下角填写提交信息，例如："Initial commit: AILINKXIN website"
   - 点击 "Commit to main"
   - 点击 "Push origin" 将代码推送到 GitHub

### 步骤 1.3: 验证推送成功

- 访问您的 GitHub 仓库页面，确认所有文件都已上传

---

## 2. 自动部署方案选择

### 方案对比

| 方案 | 优点 | 缺点 | 适合场景 |
|------|------|------|----------|
| **Vercel** | ✅ 专为 Next.js 优化<br>✅ 自动 HTTPS<br>✅ 全球 CDN<br>✅ 完全免费（个人项目） | 需要绑定域名 | **推荐：大多数情况** |
| **Netlify** | ✅ 简单易用<br>✅ 自动 HTTPS<br>✅ 免费额度充足 | 对 Next.js 支持略逊于 Vercel | 备选方案 |
| **GitHub Actions + 服务器** | ✅ 完全控制<br>✅ 可以使用自己的服务器 | ❌ 需要配置服务器<br>❌ 需要维护 | 有技术团队时 |

---

## 方案 A: 使用 Vercel（推荐）

Vercel 是 Next.js 的创建者开发的平台，对 Next.js 支持最好。

### 步骤 A1: 注册 Vercel 账号

1. 访问 https://vercel.com
2. 点击 "Sign Up"
3. 选择 "Continue with GitHub"（使用 GitHub 账号登录）

### 步骤 A2: 导入项目

1. 登录后，点击 "Add New..." → "Project"
2. 在 "Import Git Repository" 中，选择您的 GitHub 仓库
3. 点击 "Import"

### 步骤 A3: 配置项目

1. **Project Name**: `ailinkxin-website`（或自定义）
2. **Framework Preset**: 自动检测为 Next.js（无需修改）
3. **Root Directory**: `./`（默认）
4. **Build Command**: `npm run build`（默认）
5. **Output Directory**: `.next`（默认）
6. **Install Command**: `npm install`（默认）

### 步骤 A4: 配置环境变量（如果需要）

如果项目使用了环境变量（如 API keys），在这里添加。

### 步骤 A5: 部署

1. 点击 "Deploy"
2. 等待构建完成（通常 1-3 分钟）
3. 部署完成后，Vercel 会提供一个临时域名，例如：`ailinkxin-website.vercel.app`

### 步骤 A6: 绑定自定义域名 www.ailinkxin.com

1. 在 Vercel 项目页面，点击 "Settings" → "Domains"
2. 输入域名：`www.ailinkxin.com`
3. 按照提示配置 DNS：
   - 在您的域名注册商（如 GoDaddy、Namecheap）的 DNS 设置中添加：
   - **类型**: CNAME
   - **名称**: www
   - **值**: `cname.vercel-dns.com`
4. 等待 DNS 生效（通常几分钟到几小时）

### 步骤 A7: 自动部署已启用！

✅ **完成！** 现在每次您推送到 GitHub 的 `main` 分支，Vercel 会自动：
- 检测到更改
- 重新构建网站
- 自动部署到 www.ailinkxin.com

---

## 方案 B: 使用 Netlify

### 步骤 B1: 注册 Netlify 账号

1. 访问 https://www.netlify.com
2. 点击 "Sign up"
3. 选择 "Sign up with GitHub"

### 步骤 B2: 导入项目

1. 点击 "Add new site" → "Import an existing project"
2. 选择 "Deploy with GitHub"
3. 授权 Netlify 访问您的 GitHub 仓库
4. 选择仓库：`ailinkxin-website`

### 步骤 B3: 配置构建设置

1. **Branch to deploy**: `main`
2. **Build command**: `npm run build`
3. **Publish directory**: `.next`

### 步骤 B4: 部署

1. 点击 "Deploy site"
2. 等待构建完成

### 步骤 B5: 绑定域名

1. 在 Netlify 项目页面，点击 "Domain settings"
2. 点击 "Add custom domain"
3. 输入：`www.ailinkxin.com`
4. 按照提示配置 DNS（添加 CNAME 记录指向 Netlify）

---

## 方案 C: 使用 GitHub Actions + 自己的服务器

如果您有自己的云端服务器，可以使用 GitHub Actions 实现自动部署。

### 步骤 C1: 创建 GitHub Actions 工作流

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Server

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to server
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        source: ".next,public,package.json,next.config.js"
        target: "/var/www/ailinkxin"
        
    - name: Restart PM2
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd /var/www/ailinkxin
          pm2 restart ailinkxin
```

### 步骤 C2: 配置 GitHub Secrets

在 GitHub 仓库中：
1. 点击 "Settings" → "Secrets and variables" → "Actions"
2. 添加以下 Secrets：
   - `SERVER_HOST`: 您的服务器 IP 或域名
   - `SERVER_USER`: SSH 用户名
   - `SERVER_SSH_KEY`: SSH 私钥

### 步骤 C3: 在服务器上设置

1. 安装 Node.js 和 PM2
2. 配置 Nginx 反向代理
3. 设置 SSL 证书（Let's Encrypt）

---

## 🔄 日常更新流程

设置完成后，每次更新网站只需：

1. **在本地修改代码**
2. **使用 GitHub Desktop 提交并推送**：
   - 填写提交信息
   - 点击 "Commit to main"
   - 点击 "Push origin"
3. **自动部署**：
   - Vercel/Netlify 会自动检测到推送
   - 自动构建和部署
   - 几分钟后，www.ailinkxin.com 就会更新

---

## 📝 注意事项

1. **环境变量**：如果项目使用了敏感信息（API keys），请使用平台的环境变量功能，不要提交到 GitHub
2. **构建时间**：首次部署可能需要 2-5 分钟，后续更新通常 1-3 分钟
3. **域名 DNS**：DNS 更改可能需要几小时才能生效
4. **HTTPS**：Vercel 和 Netlify 都自动提供免费的 SSL 证书

---

## 🆘 遇到问题？

### 构建失败
- 检查 `package.json` 中的依赖是否正确
- 查看构建日志中的错误信息
- 确保所有环境变量都已配置

### 域名无法访问
- 检查 DNS 配置是否正确
- 等待 DNS 传播（最多 48 小时）
- 确认域名已正确绑定到部署平台

### 网站更新不及时
- 确认代码已成功推送到 GitHub
- 检查部署平台的构建日志
- 清除浏览器缓存后重试

---

## ✅ 推荐方案

**对于大多数用户，我们强烈推荐使用 Vercel**，因为：
- ✅ 专为 Next.js 优化
- ✅ 设置最简单
- ✅ 完全免费（个人项目）
- ✅ 自动 HTTPS 和 CDN
- ✅ 部署速度最快

---

**祝您部署顺利！** 🚀

