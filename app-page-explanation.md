# app/page.tsx 文件讲解

## 高级总结

### 页面包含的主要部分

这个主页包含三个主要部分：

1. **欢迎区域（Hero Section）**：包含主标题和简介文字
2. **服务展示区**：展示前 3 个服务，每个服务以卡片形式呈现
3. **最新内容区**：展示前 3 篇 Playbook 文章，每篇文章以卡片形式呈现

### 数据来源

- **服务数据**：从 `@/content/services` 导入的 `getAllServices()` 函数获取所有服务列表，然后使用 `.slice(0, 3)` 只取前 3 个
- **文章数据**：从 `@/lib/mdx` 导入的 `getAllPlaybookPosts()` 函数获取所有 Playbook 文章（从 `content/playbook` 目录读取 MDX 文件），然后使用 `.slice(0, 3)` 只取前 3 篇

---

## JSX 结构详解

### 整体结构

```5:9:app/page.tsx
export default function HomePage() {
  const services = getAllServices().slice(0, 3);
  const recentPosts = getAllPlaybookPosts().slice(0, 3);

  return (
```

- 这是一个函数组件 `HomePage`，使用 `export default` 导出（Next.js 会自动识别为页面组件）
- 在组件渲染前，先获取数据并限制为前 3 条

### 第一部分：欢迎区域

```11:16:app/page.tsx
      <section>
        <h1>欢迎来到新流</h1>
        <p>
          我们提供专业的 AI 自动化解决方案和实用内容指南，帮助您的业务更高效、更智能。
        </p>
      </section>
```

- 使用 `<section>` 标签包裹一个内容区块
- `<h1>` 是主标题
- `<p>` 是简介段落

### 第二部分：服务展示

```18:32:app/page.tsx
      <section>
        <h2>我们的服务</h2>
        <div className="card-list">
          {services.map((service) => (
            <div key={service.slug} className="card">
              <h3>
                <Link href={`/solutions/${service.slug}`}>{service.name}</Link>
              </h3>
              <p>{service.summary}</p>
              <Link href={`/solutions/${service.slug}`}>了解更多 →</Link>
            </div>
          ))}
        </div>
        <Link href="/solutions">查看所有服务 →</Link>
      </section>
```

- `<h2>` 是区块标题
- `services.map()` 遍历服务数组，为每个服务生成一个卡片
- 每个卡片包含：
  - `<h3>` 服务名称（链接到详情页）
  - `<p>` 服务摘要
  - "了解更多"链接
- 底部有一个链接到所有服务列表页

### 第三部分：最新内容

```34:50:app/page.tsx
      <section>
        <h2>最新内容</h2>
        <div className="card-list">
          {recentPosts.map((post) => (
            <div key={post.slug} className="card">
              <h3>
                <Link href={`/playbook/${post.slug}`}>
                  {post.frontmatter.title}
                </Link>
              </h3>
              <p>{post.frontmatter.description}</p>
              <Link href={`/playbook/${post.slug}`}>阅读全文 →</Link>
            </div>
          ))}
        </div>
        <Link href="/playbook">查看所有文章 →</Link>
      </section>
```

- 结构与服务区类似
- `recentPosts.map()` 遍历文章数组
- 使用 `post.frontmatter.title` 和 `post.frontmatter.description` 获取文章的元数据（从 MDX 文件的 frontmatter 中读取）

---

## 路由说明

- 使用 Next.js 的 `Link` 组件进行客户端导航（不会刷新整个页面）
- 路由路径：
  - `/solutions/${service.slug}` - 跳转到具体服务的详情页
  - `/solutions` - 跳转到所有服务列表页
  - `/playbook/${post.slug}` - 跳转到具体文章的详情页
  - `/playbook` - 跳转到所有文章列表页

---

## 数据流

1. 组件加载时调用 `getAllServices()` 和 `getAllPlaybookPosts()` 获取数据
2. 使用 `.slice(0, 3)` 限制只显示前 3 条
3. 通过 `.map()` 方法将数据数组转换为 JSX 元素数组（卡片列表）
4. 用户点击链接时，Next.js 的路由系统会导航到对应的页面

---

## 需要翻译的中文文本

以下是所有面向用户的中文文本，需要翻译成英文：

1. "欢迎来到新流"（h1 标题）
2. "我们提供专业的 AI 自动化解决方案和实用内容指南，帮助您的业务更高效、更智能。"（欢迎段落）
3. "我们的服务"（h2 标题）
4. "了解更多 →"（服务卡片链接）
5. "查看所有服务 →"（服务区底部链接）
6. "最新内容"（h2 标题）
7. "阅读全文 →"（文章卡片链接）
8. "查看所有文章 →"（内容区底部链接）

这些文本需要翻译成英文，以便后续国际化。



























