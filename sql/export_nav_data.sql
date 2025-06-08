-- ================================================
-- 导航数据导出脚本
-- ================================================
-- 使用方法: 在 Supabase SQL Editor 中执行此脚本
-- ================================================

-- 导出为 JSON 格式
SELECT 
    'nav_config_export' as export_type,
    jsonb_pretty(
        jsonb_build_object(
            'id', id,
            'user_id', user_id,
            'config_name', config_name,
            'categories', categories,
            'export_time', NOW(),
            'metadata', jsonb_build_object(
                'total_categories', jsonb_array_length(categories),
                'total_links', (
                    SELECT SUM(jsonb_array_length(value->'items'))
                    FROM jsonb_array_elements(categories)
                )
            )
        )
    ) as exported_data
FROM nav_configs 
WHERE id = 'default-config' AND user_id = 'anonymous-user';

-- 导出分类列表
SELECT 
    'categories_list' as export_type,
    jsonb_agg(
        jsonb_build_object(
            'index', row_number() OVER (),
            'title', value->>'title',
            'items_count', jsonb_array_length(value->'items')
        )
    ) as categories_summary
FROM nav_configs, 
     jsonb_array_elements(categories)
WHERE id = 'default-config' AND user_id = 'anonymous-user';

-- 导出所有链接的扁平列表
SELECT 
    'links_flat_list' as export_type,
    jsonb_agg(
        jsonb_build_object(
            'category', cat.value->>'title',
            'title', link.value->>'title',
            'desc', link.value->>'desc',
            'link', link.value->>'link',
            'icon', link.value->>'icon'
        )
    ) as all_links
FROM nav_configs nc,
     jsonb_array_elements(nc.categories) cat,
     jsonb_array_elements(cat.value->'items') link
WHERE nc.id = 'default-config' AND nc.user_id = 'anonymous-user';