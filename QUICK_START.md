# 快速开始指南

## 1. 安装依赖

```bash
npm install
```

## 2. 配置环境变量

复制 `.env.example` 创建 `.env.local` 文件（如果存在），或手动创建：

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# Linux/Mac
touch .env.local
```

然后编辑 `.env.local`，添加必要的环境变量（参考 `ENV_SETUP.md`）：

```env
N8N_WEBHOOK_URL=your_webhook_url
DIFY_API_BASE_URL=your_dify_url
DIFY_API_KEY=your_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 4. 添加内容

### 添加新服务

编辑 `content/services.ts`，在 `SERVICES` 数组中添加新服务对象。

### 添加新文章

在 `content/playbook/` 目录下创建新的 `.mdx` 文件，例如：

```mdx
---
title: "文章标题"
slug: "article-slug"
description: "文章描述"
tags: ["标签1", "标签2"]
category: "分类名"
publishedAt: "2025-11-30"
---

## 文章内容

从这里开始写文章内容...
```

## 5. 构建生产版本

```bash
npm run build
npm start
```

## 常用命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm run lint` - 运行代码检查

## 下一步

- 查看 `PROJECT_STRUCTURE.md` 了解项目结构
- 查看 `ENV_SETUP.md` 了解环境变量配置
- 开始添加您的内容和服务































