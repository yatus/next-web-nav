-- ================================================
-- 导航数据完整初始化脚本
-- ================================================
-- 生成时间: 2025-06-08T02:57:45.579Z
-- 数据统计: 5 个分类，34 个链接
-- 使用方法: 在 Supabase SQL Editor 中执行此脚本
-- ================================================

-- 开始事务
BEGIN;

-- 删除现有的默认配置（如果存在）
DELETE FROM nav_configs 
WHERE id = 'default-config' AND user_id = 'anonymous-user';

-- 插入完整的默认导航配置
INSERT INTO nav_configs (
    id,
    user_id,
    config_name,
    categories,
    created_at,
    updated_at
) VALUES (
    'default-config',
    'anonymous-user',
    'default',
    '[{"title":"需求收集和关键词调研","items":[{"icon":"","title":"Google 下拉词工具","desc":"获取Google搜索下拉提示词，发现用户真实搜索需求","link":"https://howtobuildwebsite.club/google-suggest"},{"icon":"","title":"Toolify AI工具榜单","desc":"AI工具收入排行榜，了解热门AI工具市场表现","link":"https://howtobuildwebsite.club/toolify"},{"icon":"","title":"AI工具需求列表","desc":"用户提交的AI工具需求，发现市场空白和机会","link":"https://howtobuildwebsite.club/ai-demand"},{"icon":"","title":"Ahrefs 关键词难度","desc":"分析关键词竞争难度，制定SEO策略的重要工具","link":"https://howtobuildwebsite.club/ahrefs-keyword"}]},{"title":"上站工具","items":[{"icon":"","title":"Lean Domain Search","desc":"快速查找可用域名，支持多种创意组合建议","link":"https://howtobuildwebsite.club/lean-domain-search"},{"icon":"","title":"Query Domains","desc":"批量域名查询工具，支持多种顶级域名","link":"https://howtobuildwebsite.club/query-domains"},{"icon":"","title":"Instant Domain Search","desc":"实时域名可用性检查，界面简洁响应快速","link":"https://howtobuildwebsite.club/instant-domain-search"},{"icon":"","title":"Spaceship","desc":"专业域名注册商，价格透明无隐藏费用","link":"https://howtobuildwebsite.club/spaceship"},{"icon":"","title":"Porkbun","desc":"实惠的域名注册服务，支持多种支付方式","link":"https://howtobuildwebsite.club/porkbun"},{"icon":"","title":"GitHub","desc":"全球最大代码托管平台，支持静态网站部署","link":"https://howtobuildwebsite.club/github"},{"icon":"","title":"Cloudflare","desc":"CDN和安全服务提供商，免费套餐功能强大","link":"https://howtobuildwebsite.club/cloudflare"},{"icon":"","title":"Vercel","desc":"现代化前端部署平台，支持多种框架自动部署","link":"https://howtobuildwebsite.club/vercel"},{"icon":"","title":"Google Search Console","desc":"Google官方SEO工具，监控网站搜索表现","link":"https://howtobuildwebsite.club/google-search-console"},{"icon":"","title":"Google Analytics","desc":"网站流量分析神器，深入了解用户行为","link":"https://howtobuildwebsite.club/google-analytics"},{"icon":"","title":"Bing Webmaster","desc":"必应搜索引擎的网站管理工具","link":"https://howtobuildwebsite.club/bing-webmaster"}]},{"title":"竞品调研分析","items":[{"icon":"","title":"AITDK","desc":"查看网站流量和关键词数据，分析竞争对手表现","link":"https://howtobuildwebsite.club/aitdk"},{"icon":"","title":"Ahrefs 免费SEO工具","desc":"专业的外链分析工具，了解竞品链接建设策略","link":"https://howtobuildwebsite.club/ahrefs"},{"icon":"","title":"SEMrush","desc":"全面的网站关键词分析平台，竞品研究必备","link":"https://howtobuildwebsite.club/semrush"}]},{"title":"常用工具","items":[{"icon":"https://caniuse.com/img/favicon-128.png","title":"Can I use","desc":"前端 API 兼容性查询","link":"https://caniuse.com"},{"icon":"https://tinypng.com/images/apple-touch-icon.png","title":"TinyPNG","desc":"在线图片压缩工具","link":"https://tinypng.com"},{"icon":"https://tool.lu/favicon.ico","title":"在线工具","desc":"开发人员的工具箱","link":"https://tool.lu"},{"icon":"https://processon.com/favicon.ico","title":"ProcessOn","desc":"免费在线流程图思维导图","link":"https://processon.com/"},{"icon":"/icons/json-cn.ico","title":"Json 中文网","desc":"JSON 在线解析及格式化验证","link":"https://www.json.cn"},{"icon":"https://www.terminalgif.com/favicon.ico","title":"Terminal Gif Maker","desc":"在线生成 Terminal GIF","link":"https://www.terminalgif.com"},{"icon":"https://astexplorer.net/favicon.png","title":"AST Explorer","desc":"一个 Web 工具，用于探索由各种解析器生成的 AST 语法树","link":"https://astexplorer.net/"},{"icon":"https://transform.tools/static/favicon.png","title":"transform","desc":"各类数据格式与对象转换","link":"https://transform.tools"},{"icon":"/icons/hoppscotch.png","title":"Hoppscotch","desc":"开源 API 开发生态系统","link":"https://hoppscotch.io/"},{"icon":"/icons/apifox.png","title":"Apifox","desc":"API 文档、API 调试、API Mock、API 自动化测试","link":"https://www.apifox.cn/"}]},{"title":"React","items":[{"icon":"https://zh-hans.reactjs.org/favicon.ico","title":"React","desc":"用于构建用户界面的 JavaScript 库","link":"https://zh-hans.reactjs.org"},{"icon":"https://reactrouter.com/favicon-light.png","title":"React Router","desc":"React 的声明式路由","link":"https://reactrouter.com"},{"icon":"https://nextjs.org/static/favicon/safari-pinned-tab.svg","title":"Next.js","desc":"一个用于 Web 的 React 框架","link":"https://nextjs.org"},{"icon":"https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg","title":"UmiJS","desc":"插件化的企业级前端应用框架","link":"https://umijs.org"},{"icon":"https://gw.alipayobjects.com/zos/rmsportal/rlpTLlbMzTNYuZGGCVYM.png","title":"Ant Design","desc":"一套企业级 UI 设计语言和 React 组件库","link":"https://ant.design"},{"icon":"https://docs.pmnd.rs/apple-touch-icon.png","title":"Zustand","desc":"一个小型、快速、可扩展的 React 状态管理解决方案","link":"https://docs.pmnd.rs/zustand/getting-started/introduction"}]}]'::jsonb,
    '2025-06-08T02:57:45.579Z',
    '2025-06-08T02:57:45.579Z'
);

-- 提交事务
COMMIT;

-- ================================================
-- 验证和查询脚本
-- ================================================

-- 验证插入结果
SELECT 
    '✅ 数据插入验证' as status,
    id,
    user_id,
    config_name,
    jsonb_array_length(categories) as category_count,
    (
        SELECT SUM(jsonb_array_length(value->'items'))
        FROM jsonb_array_elements(categories) 
    ) as total_links,
    created_at,
    updated_at
FROM nav_configs 
WHERE id = 'default-config' AND user_id = 'anonymous-user';

-- 查看各分类的链接数量统计
SELECT 
    '📊 分类统计' as info,
    (row_number() OVER ()) as category_index,
    value->>'title' as category_name,
    jsonb_array_length(value->'items') as links_count
FROM nav_configs, 
     jsonb_array_elements(categories)
WHERE id = 'default-config' AND user_id = 'anonymous-user'
ORDER BY category_index;

-- ================================================
-- 可选：查看完整数据结构（谨慎使用，输出较多）
-- ================================================

-- 取消注释下面的查询来查看完整的分类数据
/*
SELECT 
    '🔍 完整数据预览' as info,
    id,
    user_id,
    jsonb_pretty(categories) as categories_detail
FROM nav_configs 
WHERE id = 'default-config' AND user_id = 'anonymous-user';
*/

-- ================================================
-- 备份和恢复脚本
-- ================================================

-- 创建备份（可选）
/*
CREATE TABLE nav_configs_backup AS 
SELECT * FROM nav_configs 
WHERE id = 'default-config' AND user_id = 'anonymous-user';
*/

-- 从备份恢复（可选）
/*
INSERT INTO nav_configs 
SELECT * FROM nav_configs_backup 
ON CONFLICT (id, user_id) DO UPDATE SET
    config_name = EXCLUDED.config_name,
    categories = EXCLUDED.categories,
    updated_at = EXCLUDED.updated_at;
*/

-- ================================================
-- 清理脚本（危险操作，谨慎使用）
-- ================================================

-- 删除所有配置数据（危险操作！）
-- DELETE FROM nav_configs;

-- 重置表结构（极危险操作！）
-- DROP TABLE nav_configs;

-- ================================================
-- 脚本执行完成
-- ================================================
SELECT '🎉 导航数据初始化完成！' as message;