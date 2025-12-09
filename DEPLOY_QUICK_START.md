# 🚀 快速部署指南（5分钟完成）

## 最简单的方法：使用 Vercel（推荐）

### 第一步：推送到 GitHub（2分钟）

1. **在 GitHub 上创建仓库**
   - 访问 https://github.com/new
   - 仓库名：`ailinkxin-website`
   - 选择 Public 或 Private
   - **不要**勾选 README
   - 点击 "Create repository"

2. **使用 GitHub Desktop 推送**
   - 打开 GitHub Desktop
   - 如果项目还没初始化：
     - File → Add Local Repository
     - 选择项目文件夹
   - 如果已有 Git：
     - Repository → Repository Settings → Remote
     - 添加 GitHub 仓库地址
   - 填写提交信息："Initial commit"
   - 点击 "Commit to main"
   - 点击 "Push origin"

### 第二步：部署到 Vercel（3分钟）

1. **注册 Vercel**
   - 访问 https://vercel.com
   - 点击 "Sign Up"
   - 选择 "Continue with GitHub"

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择您的 GitHub 仓库
   - 点击 "Import"

3. **配置（使用默认设置即可）**
   - Framework Preset: Next.js（自动检测）
   - Build Command: `npm run build`（默认）
   - Output Directory: `.next`（默认）
   - 点击 "Deploy"

4. **等待部署完成**
   - 通常 1-3 分钟
   - 完成后会显示临时域名

### 第三步：绑定域名 www.ailinkxin.com（5分钟）

1. **在 Vercel 中添加域名**
   - 项目页面 → Settings → Domains
   - 输入：`www.ailinkxin.com`
   - 点击 "Add"

2. **配置 DNS**
   - Vercel 会显示需要添加的 DNS 记录
   - 登录您的域名注册商（GoDaddy、Namecheap 等）
   - 在 DNS 设置中添加：
     - **类型**: CNAME
     - **名称**: www
     - **值**: `cname.vercel-dns.com`
   - 保存

3. **等待生效**
   - 通常几分钟到几小时
   - Vercel 会自动配置 HTTPS

## ✅ 完成！

现在每次您：
1. 修改代码
2. 在 GitHub Desktop 中提交并推送
3. Vercel 会自动部署到 www.ailinkxin.com

**就这么简单！** 🎉

---

## 需要帮助？

查看完整指南：[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

