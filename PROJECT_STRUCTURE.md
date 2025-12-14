# 项目结构说明

## 目录结构

```
/
├── app/                        # Next.js App Router 页面目录
│   ├── api/                    # API 路由
│   │   ├── ai-chat/           # AI 聊天代理接口
│   │   └── lead/              # 线索收集接口
│   ├── playbook/              # Playbook 文章相关页面
│   │   ├── [slug]/           # 文章详情页（动态路由）
│   │   └── page.tsx          # 文章列表页
│   ├── solutions/             # 服务相关页面
│   │   ├── [slug]/           # 服务详情页（动态路由）
│   │   └── page.tsx          # 服务列表页
│   ├── about/                 # 关于页面
│   ├── contact/               # 联系页面
│   ├── tools/                 # 工具导航页
│   ├── layout.tsx             # 根布局
│   ├── page.tsx               # 首页
│   ├── globals.css            # 全局样式
│   ├── not-found.tsx          # 404 页面
│   ├── robots.ts              # robots.txt 生成
│   └── sitemap.ts             # sitemap.xml 生成
│
├── components/                 # 可复用组件
│   ├── Layout/                # 布局相关组件
│   │   ├── Header.tsx         # 页头导航
│   │   └── Footer.tsx         # 页脚
│   ├── AppImage.tsx           # 统一的图片组件
│   ├── CTASection.tsx         # CTA 引导区块
│   ├── LeadForm.tsx           # 线索收集表单
│   └── MarkdownContent.tsx    # Markdown 内容渲染
│
├── content/                    # 内容存储
│   ├── playbook/              # MDX 文章文件
│   │   └── *.mdx             # 每篇文章一个文件
│   └── services.ts            # 服务配置数据
│
├── lib/                        # 工具函数库
│   ├── mdx.ts                 # MDX 文件读取和处理
│   └── seo.ts                 # SEO metadata 生成工具
│
├── public/                     # 静态资源（图片、文件等）
│
└── [配置文件]
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    └── ...
```

## 关键文件说明

### 内容管理

- **`content/services.ts`**: 所有服务配置，使用 TypeScript 对象定义
- **`content/playbook/*.mdx`**: Playbook 文章，使用 MDX 格式，包含 frontmatter

### 组件

- **`components/AppImage.tsx`**: 统一的图片组件，强制要求 alt 属性，默认质量 75
- **`components/LeadForm.tsx`**: 线索收集表单，自动提交到 `/api/lead`
- **`components/CTASection.tsx`**: CTA 引导区块，支持多种变体
- **`components/MarkdownContent.tsx`**: Markdown 内容渲染，确保只使用 h2+ 标题

### 工具函数

- **`lib/seo.ts`**: `createSeoMetadata()` 函数，统一生成 SEO metadata
- **`lib/mdx.ts`**: MDX 文件读取函数，支持按分类/标签过滤

### API 路由

- **`app/api/lead/route.ts`**: 线索收集接口，转发到 N8N Webhook
- **`app/api/ai-chat/route.ts`**: AI 聊天代理，转发到 Dify API

## 路由结构

| 路径 | 说明 | 渲染方式 |
|------|------|---------|
| `/` | 首页 | SSG |
| `/solutions` | 服务列表页 | SSG |
| `/solutions/[slug]` | 服务详情页 | SSG（使用 generateStaticParams） |
| `/playbook` | Playbook 列表页 | SSG |
| `/playbook/[slug]` | Playbook 详情页 | SSG（使用 generateStaticParams） |
| `/tools` | 工具导航页 | SSG |
| `/about` | 关于页面 | SSG |
| `/contact` | 联系页面 | SSG |
| `/api/lead` | 线索收集 API | API Route |
| `/api/ai-chat` | AI 聊天 API | API Route |

## SEO 特性

1. **语义化 HTML**: 使用 `<main>`, `<article>`, `<section>` 等语义标签
2. **单 H1 规则**: 每个页面只有一个 `<h1>` 标签
3. **Metadata**: 所有页面都有完整的 SEO metadata（title, description, Open Graph）
4. **Sitemap**: 自动生成 `/sitemap.xml`
5. **Robots.txt**: 自动生成 `/robots.txt`
6. **静态生成**: 所有页面尽可能使用 SSG，提升性能和 SEO

## 性能优化

1. **静态生成优先**: 所有内容页面使用 `generateStaticParams` 预生成
2. **图片优化**: 使用 Next.js Image 组件，自动 WebP/AVIF 转换
3. **代码拆分**: 按路由自动拆分，减少初始 JS 体积
4. **服务器组件**: 优先使用服务器组件，减少客户端 JS

## 扩展性

- **内容管理**: 在 `content/` 目录添加新内容即可
- **API 集成**: 修改 `/app/api/` 下的路由即可切换后端服务
- **样式**: 在 `globals.css` 或组件内部添加样式，不影响结构
- **功能**: 在组件目录添加新组件，保持结构清晰


























