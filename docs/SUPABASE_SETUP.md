# Supabase 配置说明

本文档介绍如何将项目从 localStorage 迁移到 Supabase 数据库存储。

## 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/) 并登录
2. 点击 "New Project" 创建新项目
3. 选择组织和设置项目名称
4. 等待项目初始化完成

## 2. 获取项目配置

在 Supabase 项目面板中：

1. 进入 Settings > API
2. 复制以下信息：
   - `Project URL` (用于 NEXT_PUBLIC_SUPABASE_URL)
   - `anon public key` (用于 NEXT_PUBLIC_SUPABASE_ANON_KEY)

## 3. 配置环境变量

创建 `.env.local` 文件并添加以下配置：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_项目_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_anon_key

# 管理员密码配置（注意：不使用 NEXT_PUBLIC_ 前缀，确保安全性）
ADMIN_PASSWORD=你的强密码
```

## 4. 创建数据库表

1. 在 Supabase 项目面板中，进入 SQL Editor
2. 执行 `sql/create_nav_configs_table.sql` 中的 SQL 脚本
3. 确认表创建成功

## 5. 配置安全策略（可选）

如果需要更严格的安全控制：

1. 启用 Row Level Security (RLS)
2. 根据需求创建适当的策略
3. 参考 SQL 文件中的注释部分

## 6. 管理员功能

### 管理员密码
- 默认密码：`admin123`（仅在未设置环境变量时）
- 可通过环境变量 `ADMIN_PASSWORD` 自定义
- **重要**：使用 `ADMIN_PASSWORD`（不是 `NEXT_PUBLIC_ADMIN_PASSWORD`）确保密码不会暴露在前端
- 建议在生产环境中使用强密码

### 管理员功能
- 编辑导航配置
- 添加/删除分类和链接
- 重置为默认配置
- 所有更改会同步保存到 Supabase

## 7. 数据迁移

如果从 localStorage 版本迁移：

1. 导出现有的 localStorage 数据
2. 使用设置面板手动重新配置
3. 或者编写迁移脚本导入数据

## 8. 部署注意事项

### Vercel 部署
1. 在 Vercel 项目设置中添加环境变量
2. 确保所有 `NEXT_PUBLIC_*` 变量都已配置
3. 重新部署项目

### 其他平台
确保在部署平台的环境变量设置中添加所需配置。

## 9. 故障排除

### 常见问题

1. **连接失败**
   - 检查 Supabase URL 和 API Key 是否正确
   - 确认 Supabase 项目是否正常运行

2. **权限错误**
   - 检查 RLS 策略设置
   - 确认 anon key 权限

3. **数据加载失败**
   - 检查表结构是否正确
   - 查看浏览器控制台错误信息

4. **管理员验证失败**
   - 确认 `ADMIN_PASSWORD` 环境变量设置
   - 检查密码是否正确
   - 确保使用的是 `ADMIN_PASSWORD` 而不是 `NEXT_PUBLIC_ADMIN_PASSWORD`

### 调试模式

在开发环境中，可以通过浏览器控制台查看详细的错误信息和数据加载状态。

## 10. 安全建议

1. **生产环境**
   - 使用强管理员密码
   - 考虑实现更复杂的认证系统
   - 定期备份数据库

2. **开发环境**
   - 不要将敏感信息提交到版本控制
   - 使用 `.env.local` 存储本地配置

## 支持

如有问题，请查看：
- [Supabase 官方文档](https://supabase.com/docs)
- [Next.js 环境变量文档](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables) 