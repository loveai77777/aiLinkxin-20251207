# 环境变量配置

创建 `.env.local` 文件（已在 `.gitignore` 中排除，不会被提交），并配置以下环境变量：

## 必需的环境变量

### N8N Webhook URL
```
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxx
```
用于 `/api/lead` 接口，转发线索收集表单数据。

### Dify AI API 配置
```
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_API_KEY=your-dify-api-key
```
用于 `/api/ai-chat` 接口，提供 AI 聊天功能。

### 站点 URL
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```
用于 SEO metadata 中的 Open Graph URL。开发环境可以使用 `http://localhost:3000`。

## 示例配置

```env
# 开发环境
N8N_WEBHOOK_URL=http://localhost:5678/webhook/test
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_API_KEY=app-xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 生产环境
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/lead
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_API_KEY=app-xxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 注意事项

1. **不要提交 `.env.local` 文件**：该文件已添加到 `.gitignore`
2. **生产环境**：在部署平台（如 Vercel）上配置环境变量
3. **API 密钥安全**：确保 API 密钥妥善保管，不要泄露





















