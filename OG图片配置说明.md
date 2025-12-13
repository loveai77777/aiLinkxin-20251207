# Open Graph 图片配置说明

## 当前配置

已为网站添加完整的 Open Graph 标签，用于社交媒体分享。

## 需要添加的图片

### 步骤 1：准备图片

创建或准备一张用于分享的图片：
- **推荐尺寸**：1200 x 630 像素（OG 图片标准尺寸）
- **格式**：PNG 或 JPG
- **文件大小**：建议小于 1MB
- **内容**：包含你的 logo、网站名称和简短描述

### 步骤 2：上传图片

将图片文件保存到 `public` 目录：
```
public/og-image.png
```

或者：
```
public/og-image.jpg
```

### 步骤 3：更新配置（如果需要）

如果图片文件名不是 `og-image.png`，需要在以下文件中更新：

**app/layout.tsx** - 更新图片路径：
```typescript
images: [
  {
    url: "https://www.ailinkxin.com/你的图片文件名.png",
    // ...
  },
],
```

**lib/seo.ts** - 更新默认图片路径：
```typescript
const defaultImage = image || "https://www.ailinkxin.com/你的图片文件名.png";
```

## 已配置的 Open Graph 标签

- ✅ `og:title` - 网站标题
- ✅ `og:description` - 网站描述
- ✅ `og:image` - 分享图片（需要你上传）
- ✅ `og:url` - 网站 URL
- ✅ `og:type` - 网站类型
- ✅ `og:site_name` - 网站名称
- ✅ `og:locale` - 语言设置

## Twitter Card 标签

- ✅ `twitter:card` - 卡片类型（large_image）
- ✅ `twitter:title` - 标题
- ✅ `twitter:description` - 描述
- ✅ `twitter:image` - 图片

## 验证

添加图片后，可以使用以下工具验证 Open Graph 标签：

1. **Facebook 分享调试器**：https://developers.facebook.com/tools/debug/
2. **Twitter Card 验证器**：https://cards-dev.twitter.com/validator
3. **LinkedIn 分享检查**：在 LinkedIn 中分享你的网站链接

## 当前配置详情

- **网站 URL**：https://www.ailinkxin.com
- **图片 URL**：https://www.ailinkxin.com/og-image.png（需要上传）
- **标题**：AILINKXIN | AI marketing automation | intelligent customer service
- **描述**：AILINKXIN | AI automation | intelligent customer service | automated marketing solutions.






