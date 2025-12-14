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

### 管理员密码
```
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
```
用于后台管理系统登录。访问 `/admin/login` 时需要使用此密码。

### Supabase Service Role Key (Admin Only)
```
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```
用于后台管理系统的 Supabase 客户端，绕过 RLS 权限检查。仅在 admin 路由中使用。

### Admin Session Secret (Optional)
```
ADMIN_SESSION_SECRET=YOUR_ADMIN_SESSION_SECRET
```
用于加密 admin session token。如果不设置，将使用默认值。

## 示例配置

```env
# 开发环境
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
N8N_WEBHOOK_URL=http://localhost:5678/webhook/test
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_API_KEY=YOUR_DIFY_API_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
ADMIN_SESSION_SECRET=YOUR_ADMIN_SESSION_SECRET

# 生产环境
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
N8N_WEBHOOK_URL=https://your-n8n.com/webhook/lead
DIFY_API_BASE_URL=https://api.dify.ai/v1
DIFY_API_KEY=YOUR_DIFY_API_KEY
NEXT_PUBLIC_SITE_URL=https://your-domain.com
ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
ADMIN_SESSION_SECRET=YOUR_ADMIN_SESSION_SECRET
```

## 注意事项

1. **不要提交 `.env.local` 文件**：该文件已添加到 `.gitignore`
2. **生产环境**：在部署平台（如 Vercel）上配置环境变量
3. **API 密钥安全**：确保 API 密钥妥善保管，不要泄露























