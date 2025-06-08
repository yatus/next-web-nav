# 导航数据 SQL 脚本说明

本目录包含了导航数据管理的完整 SQL 脚本集合，用于 Supabase PostgreSQL 数据库。

## 📋 文件说明

### 1. `create_nav_configs_table.sql` - 数据表创建脚本
**用途**: 创建导航配置数据表和相关索引  
**何时使用**: 项目初始化时，在 Supabase 中首次创建数据表  
**内容包含**:
- 创建 `nav_configs` 表
- 添加索引以提高查询性能
- 创建自动更新时间戳的触发器
- RLS (Row Level Security) 策略设置

### 2. `insert_complete_nav_data.sql` - 完整数据初始化脚本
**用途**: 插入完整的默认导航数据  
**何时使用**: 数据表创建后，初始化默认导航数据  
**内容包含**:
- 删除现有默认配置（如果存在）
- 插入完整的导航分类和链接数据
- 数据验证查询
- 统计信息查询

**数据统计**:
- 5 个主要分类
- 34 个导航链接
- 包含常用开发工具、React生态、分析工具等

### 3. `export_nav_data.sql` - 数据导出脚本
**用途**: 导出现有导航数据为不同格式  
**何时使用**: 需要备份数据或迁移数据时  
**内容包含**:
- JSON 格式导出
- 分类列表导出
- 扁平化链接列表导出

### 4. `data_management.sql` - 数据管理工具集
**用途**: 数据维护、监控、分析的综合工具  
**何时使用**: 日常数据维护和问题排查  
**内容包含**:
- 表结构和索引查询
- 数据统计和分析
- 备份和恢复操作
- 数据验证和清理
- 性能优化建议
- 健康检查报告
- 故障排除工具

## 🚀 使用顺序

### 初次部署
1. **创建数据表**: 执行 `create_nav_configs_table.sql`
2. **初始化数据**: 执行 `insert_complete_nav_data.sql`
3. **验证结果**: 使用 `data_management.sql` 中的验证查询

### 日常维护
1. **健康检查**: 定期执行 `data_management.sql` 中的监控查询
2. **数据备份**: 使用 `export_nav_data.sql` 导出数据
3. **问题排查**: 使用 `data_management.sql` 中的故障排除工具

## 💡 使用方法

### 在 Supabase 中执行
1. 登录 Supabase 项目控制台
2. 进入 **SQL Editor**
3. 复制需要的 SQL 语句
4. 点击 **Run** 执行

### 安全注意事项
⚠️ **危险操作标识**: 
- 所有可能删除数据的操作都用注释 `/**/` 包围
- 执行前请仔细阅读注释说明
- 建议先在测试环境验证

## 📊 数据结构说明

### 主表结构 (`nav_configs`)
```sql
CREATE TABLE nav_configs (
    id VARCHAR(255) NOT NULL,              -- 配置ID
    user_id VARCHAR(255) NOT NULL,         -- 用户ID  
    config_name VARCHAR(255) NOT NULL,     -- 配置名称
    categories JSONB NOT NULL,             -- 分类数据(JSON格式)
    created_at TIMESTAMP WITH TIME ZONE,   -- 创建时间
    updated_at TIMESTAMP WITH TIME ZONE,   -- 更新时间
    PRIMARY KEY (id, user_id)
);
```

### JSON 数据结构
```typescript
interface NavCategory {
  title: string;           // 分类标题
  items: NavLinkItem[];   // 链接列表
}

interface NavLinkItem {
  icon: string;    // 图标URL
  title: string;   // 链接标题
  desc: string;    // 链接描述  
  link: string;    // 链接URL
}
```

## 🔧 常用操作快速参考

### 查看数据统计
```sql
SELECT 
    jsonb_array_length(categories) as category_count,
    (
        SELECT SUM(jsonb_array_length(value->'items'))
        FROM jsonb_array_elements(categories)
    ) as total_links
FROM nav_configs 
WHERE id = 'default-config' AND user_id = 'anonymous-user';
```

### 搜索特定链接
```sql
SELECT 
    cat.value->>'title' as category_name,
    link.value->>'title' as link_title,
    link.value->>'link' as link_url
FROM nav_configs nc,
     jsonb_array_elements(nc.categories) cat,
     jsonb_array_elements(cat.value->'items') link
WHERE link.value->>'title' ILIKE '%关键词%'
  AND nc.id = 'default-config' 
  AND nc.user_id = 'anonymous-user';
```

### 创建备份
```sql
CREATE TABLE nav_configs_backup AS
SELECT *, NOW() as backup_time
FROM nav_configs;
```

## 🔍 故障排除

### 常见问题

1. **权限错误**
   - 确认 Supabase 项目的 API 权限设置
   - 检查 RLS 策略配置

2. **数据格式错误**  
   - 确认 JSON 数据格式正确
   - 使用 `jsonb_pretty()` 查看格式化后的数据

3. **性能问题**
   - 检查索引是否正确创建
   - 使用 `EXPLAIN ANALYZE` 分析查询性能

4. **数据丢失**
   - 检查是否有备份表
   - 使用恢复脚本从备份恢复数据

### 联系支持
如果遇到问题，请：
1. 首先执行 `data_management.sql` 中的诊断查询
2. 查看 Supabase 项目日志
3. 检查网络连接和权限设置

## 📝 更新日志

- **v1.0.0** (2025-06-08): 初始版本，包含完整的数据管理脚本
- 支持 5 个主要分类，34 个导航链接
- 包含完整的备份、恢复、监控功能
- 添加性能优化和故障排除工具

## 📄 许可证

本项目采用 MIT 许可证，详见项目根目录的 LICENSE 文件。 