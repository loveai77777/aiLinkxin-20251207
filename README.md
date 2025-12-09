# 新流网站项目

基于 Next.js + TypeScript 的内容与服务网站骨架。专注于 SEO 友好、大模型易抓取、性能优异。

## ✨ 特性

- ✅ **SEO 友好**: 语义化 HTML、完整 metadata、自动生成 sitemap/robots.txt
- ✅ **静态生成优先**: 所有页面使用 SSG，提升首屏速度和 SEO
- ✅ **大模型友好**: 所有内容在 HTML 中可见，便于抓取和理解
- ✅ **性能优化**: 图片优化、代码拆分、服务器组件优先
- ✅ **结构清晰**: 组件化设计，易于扩展和维护

## 技术栈

- **Next.js 14** (App Router)
- **TypeScript**
- **React Markdown** (用于渲染 Playbook 文章)
- **SSR/SSG** 优先
- 原生 HTML + CSS（无重型 UI 框架）

## 📚 文档

- **[快速开始指南](./QUICK_START.md)** - 快速上手项目
- **[项目结构说明](./PROJECT_STRUCTURE.md)** - 详细的目录结构和文件说明
- **[环境变量配置](./ENV_SETUP.md)** - 环境变量配置指南

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件并配置必要的环境变量（参考 [ENV_SETUP.md](./ENV_SETUP.md)）：

```env
N8N_WEBHOOK_URL=your_n8n_webhook_url
DIFY_API_BASE_URL=your_dify_api_base_url
DIFY_API_KEY=your_dify_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
/
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   ├── playbook/         # Playbook 文章页面
│   ├── solutions/        # 服务页面
│   └── ...
├── content/              # 内容存储
│   ├── playbook/        # MDX 文章
│   └── services.ts      # 服务配置
├── components/          # 可复用组件
├── lib/                # 工具函数
└── public/            # 静态资源
```

详细结构说明请查看 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🎯 核心功能

- **内容管理**: MDX 文章、服务配置
- **SEO 优化**: 自动生成 metadata、sitemap、robots.txt
- **API 集成**: 线索收集、AI 聊天代理
- **性能优化**: 静态生成、图片优化、代码拆分

## 📝 添加内容

### 添加新服务

编辑 `content/services.ts`，在 `SERVICES` 数组中添加新服务。

### 添加新文章

在 `content/playbook/` 目录下创建新的 `.mdx` 文件，包含 frontmatter 和内容。

详细说明请查看 [QUICK_START.md](./QUICK_START.md)

## 🔧 开发命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm run lint` - 运行代码检查
