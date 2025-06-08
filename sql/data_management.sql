-- ================================================
-- 导航数据管理脚本集合
-- ================================================
-- 此文件包含所有数据管理相关的SQL操作
-- 使用方法: 复制需要的部分到 Supabase SQL Editor 中执行
-- ================================================

-- ================================================
-- 1. 数据表管理
-- ================================================

-- 查看表结构
\d nav_configs;

-- 查看表索引
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'nav_configs';

-- 查看表大小
SELECT 
    pg_size_pretty(pg_total_relation_size('nav_configs')) as total_size,
    pg_size_pretty(pg_relation_size('nav_configs')) as table_size,
    pg_size_pretty(pg_indexes_size('nav_configs')) as indexes_size;

-- ================================================
-- 2. 数据查询和统计
-- ================================================

-- 基础数据统计
SELECT 
    '📊 基础统计信息' as info,
    COUNT(*) as total_configs,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT config_name) as unique_config_names
FROM nav_configs;

-- 分类和链接统计
SELECT 
    '📈 内容统计' as info,
    nc.id,
    nc.user_id,
    nc.config_name,
    jsonb_array_length(nc.categories) as category_count,
    (
        SELECT SUM(jsonb_array_length(value->'items'))
        FROM jsonb_array_elements(nc.categories)
    ) as total_links,
    nc.created_at,
    nc.updated_at
FROM nav_configs nc
ORDER BY nc.created_at DESC;

-- 详细分类统计
SELECT 
    '📋 分类详情' as info,
    nc.id,
    nc.user_id,
    (row_number() OVER (PARTITION BY nc.id, nc.user_id ORDER BY ordinality)) as category_index,
    cat.value->>'title' as category_name,
    jsonb_array_length(cat.value->'items') as links_count
FROM nav_configs nc,
     jsonb_array_elements(nc.categories) WITH ORDINALITY cat
ORDER BY nc.id, nc.user_id, category_index;

-- 链接统计分析
SELECT 
    '🔗 链接分析' as info,
    COUNT(*) as total_links,
    COUNT(DISTINCT link.value->>'link') as unique_urls,
    COUNT(CASE WHEN link.value->>'icon' != '' THEN 1 END) as links_with_icons,
    COUNT(CASE WHEN link.value->>'icon' = '' THEN 1 END) as links_without_icons
FROM nav_configs nc,
     jsonb_array_elements(nc.categories) cat,
     jsonb_array_elements(cat.value->'items') link;

-- ================================================
-- 3. 数据备份操作
-- ================================================

-- 创建完整备份表
CREATE TABLE IF NOT EXISTS nav_configs_backup AS
SELECT 
    *,
    NOW() as backup_time
FROM nav_configs
WHERE FALSE; -- 创建空表结构

-- 执行备份
INSERT INTO nav_configs_backup
SELECT 
    *,
    NOW() as backup_time
FROM nav_configs;

-- 查看备份
SELECT 
    '💾 备份信息' as info,
    COUNT(*) as backup_count,
    MIN(backup_time) as earliest_backup,
    MAX(backup_time) as latest_backup
FROM nav_configs_backup;

-- ================================================
-- 4. 数据验证和清理
-- ================================================

-- 验证数据完整性
SELECT 
    '✅ 数据验证' as check_type,
    id,
    user_id,
    CASE 
        WHEN categories IS NULL THEN '❌ 分类数据为空'
        WHEN jsonb_array_length(categories) = 0 THEN '⚠️  分类数据为空数组'
        ELSE '✅ 分类数据正常'
    END as categories_status,
    CASE 
        WHEN config_name IS NULL OR config_name = '' THEN '❌ 配置名称为空'
        ELSE '✅ 配置名称正常'
    END as config_name_status
FROM nav_configs;

-- 查找重复配置
SELECT 
    '🔍 重复检查' as check_type,
    id,
    user_id,
    config_name,
    COUNT(*) as duplicate_count
FROM nav_configs
GROUP BY id, user_id, config_name
HAVING COUNT(*) > 1;

-- 查找异常数据
SELECT 
    '⚠️  异常数据检查' as check_type,
    id,
    user_id,
    config_name,
    CASE 
        WHEN created_at > updated_at THEN '创建时间晚于更新时间'
        WHEN created_at > NOW() THEN '创建时间在未来'
        WHEN updated_at > NOW() THEN '更新时间在未来'
        ELSE '时间戳正常'
    END as time_status
FROM nav_configs
WHERE created_at > updated_at 
   OR created_at > NOW() 
   OR updated_at > NOW();

-- ================================================
-- 5. 数据维护操作
-- ================================================

-- 清理旧版本数据（保留最新的）
-- 注意：这是危险操作，请谨慎使用
/*
DELETE FROM nav_configs 
WHERE id IN (
    SELECT id 
    FROM (
        SELECT 
            id,
            user_id,
            ROW_NUMBER() OVER (PARTITION BY id, user_id ORDER BY updated_at DESC) as rn
        FROM nav_configs
    ) ranked
    WHERE rn > 1
);
*/

-- 更新所有配置的时间戳
/*
UPDATE nav_configs 
SET updated_at = NOW()
WHERE updated_at < NOW() - INTERVAL '1 day';
*/

-- ================================================
-- 6. 性能优化建议
-- ================================================

-- 分析查询性能
EXPLAIN ANALYZE 
SELECT * FROM nav_configs 
WHERE id = 'default-config' AND user_id = 'anonymous-user';

-- 检查索引使用情况
SELECT 
    schemaname,
    tablename,
    attname as column_name,
    n_distinct,
    correlation
FROM pg_stats
WHERE tablename = 'nav_configs';

-- 推荐的索引（如果性能有问题）
/*
CREATE INDEX CONCURRENTLY idx_nav_configs_updated_at 
ON nav_configs(updated_at DESC);

CREATE INDEX CONCURRENTLY idx_nav_configs_config_name 
ON nav_configs(config_name) 
WHERE config_name IS NOT NULL;
*/

-- ================================================
-- 7. 监控和报告
-- ================================================

-- 生成数据健康报告
SELECT 
    '📋 数据健康报告' as report_type,
    jsonb_build_object(
        'total_configs', COUNT(*),
        'unique_users', COUNT(DISTINCT user_id),
        'avg_categories_per_config', AVG(jsonb_array_length(categories)),
        'avg_links_per_config', AVG((
            SELECT SUM(jsonb_array_length(value->'items'))
            FROM jsonb_array_elements(categories)
        )),
        'configs_updated_today', COUNT(CASE WHEN updated_at::date = CURRENT_DATE THEN 1 END),
        'configs_updated_this_week', COUNT(CASE WHEN updated_at > NOW() - INTERVAL '7 days' THEN 1 END),
        'oldest_config', MIN(created_at),
        'newest_config', MAX(created_at)
    ) as health_report
FROM nav_configs;

-- 分类使用频率统计
SELECT 
    '📊 分类使用统计' as report_type,
    cat.value->>'title' as category_name,
    COUNT(*) as usage_count,
    AVG(jsonb_array_length(cat.value->'items')) as avg_links_per_category,
    MIN(jsonb_array_length(cat.value->'items')) as min_links,
    MAX(jsonb_array_length(cat.value->'items')) as max_links
FROM nav_configs nc,
     jsonb_array_elements(nc.categories) cat
GROUP BY cat.value->>'title'
ORDER BY usage_count DESC, avg_links_per_category DESC;

-- 用户活跃度分析
SELECT 
    '👥 用户活跃度' as report_type,
    user_id,
    COUNT(*) as config_count,
    MIN(created_at) as first_config,
    MAX(updated_at) as last_activity,
    EXTRACT(DAYS FROM (MAX(updated_at) - MIN(created_at))) as active_days
FROM nav_configs
GROUP BY user_id
ORDER BY last_activity DESC;

-- ================================================
-- 8. 故障排除
-- ================================================

-- 检查数据库连接
SELECT 
    '🔗 连接状态' as status,
    current_database() as database_name,
    current_user as connected_user,
    version() as postgres_version,
    NOW() as current_time;

-- 检查表权限
SELECT 
    '🔐 权限检查' as check_type,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges
WHERE table_name = 'nav_configs'
  AND grantee = current_user;

-- 检查最近的错误（如果有日志表）
/*
SELECT * FROM logs 
WHERE table_name = 'nav_configs' 
  AND log_time > NOW() - INTERVAL '1 hour'
ORDER BY log_time DESC;
*/

-- ================================================
-- 9. 实用查询模板
-- ================================================

-- 搜索包含特定关键词的链接
SELECT 
    '🔍 关键词搜索' as search_type,
    nc.id,
    nc.user_id,
    cat.value->>'title' as category_name,
    link.value->>'title' as link_title,
    link.value->>'desc' as link_desc,
    link.value->>'link' as link_url
FROM nav_configs nc,
     jsonb_array_elements(nc.categories) cat,
     jsonb_array_elements(cat.value->'items') link
WHERE link.value->>'title' ILIKE '%关键词%'
   OR link.value->>'desc' ILIKE '%关键词%'
   OR link.value->>'link' ILIKE '%关键词%';

-- 查找缺少图标的链接
SELECT 
    '🖼️  图标检查' as check_type,
    nc.id,
    nc.user_id,
    cat.value->>'title' as category_name,
    link.value->>'title' as link_title,
    CASE 
        WHEN link.value->>'icon' = '' OR link.value->>'icon' IS NULL 
        THEN '❌ 缺少图标'
        ELSE '✅ 有图标'
    END as icon_status
FROM nav_configs nc,
     jsonb_array_elements(nc.categories) cat,
     jsonb_array_elements(cat.value->'items') link
WHERE link.value->>'icon' = '' OR link.value->>'icon' IS NULL;

-- 统计域名分布
SELECT 
    '🌐 域名统计' as stats_type,
    SUBSTRING(link.value->>'link' FROM 'https?://([^/]+)') as domain,
    COUNT(*) as link_count
FROM nav_configs nc,
     jsonb_array_elements(nc.categories) cat,
     jsonb_array_elements(cat.value->'items') link
WHERE link.value->>'link' ~ '^https?://'
GROUP BY domain
ORDER BY link_count DESC
LIMIT 20;

-- ================================================
-- 脚本使用说明
-- ================================================

SELECT '
📖 使用说明:
1. 根据需要复制相应的SQL语句到 Supabase SQL Editor
2. 危险操作已用注释包围，使用前请仔细阅读
3. 建议在生产环境操作前先在测试环境验证
4. 定期执行数据健康检查和备份操作
5. 如有问题，请查看故障排除部分

🔧 常用操作快速索引:
- 数据统计: 查看第2部分
- 数据备份: 查看第3部分  
- 数据验证: 查看第4部分
- 性能分析: 查看第6部分
- 健康报告: 查看第7部分
' as instructions; 