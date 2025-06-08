/**
 * 生成导航数据的SQL插入脚本
 * 使用方法: node scripts/generate-sql-data.js
 */

const fs = require('fs');
const path = require('path');

// 模拟导入配置数据（因为这是CommonJS环境）
const navData = [
  {
    "title": "需求收集和关键词调研",
    "items": [
      {
        "icon": "",
        "title": "Google 下拉词工具",
        "desc": "获取Google搜索下拉提示词，发现用户真实搜索需求",
        "link": "https://howtobuildwebsite.club/google-suggest"
      },
      {
        "icon": "",
        "title": "Toolify AI工具榜单",
        "desc": "AI工具收入排行榜，了解热门AI工具市场表现",
        "link": "https://howtobuildwebsite.club/toolify"
      },
      {
        "icon": "",
        "title": "AI工具需求列表",
        "desc": "用户提交的AI工具需求，发现市场空白和机会",
        "link": "https://howtobuildwebsite.club/ai-demand"
      },
      {
        "icon": "",
        "title": "Ahrefs 关键词难度",
        "desc": "分析关键词竞争难度，制定SEO策略的重要工具",
        "link": "https://howtobuildwebsite.club/ahrefs-keyword"
      }
    ]
  },
  {
    "title": "上站工具",
    "items": [
      {
        "icon": "",
        "title": "Lean Domain Search",
        "desc": "快速查找可用域名，支持多种创意组合建议",
        "link": "https://howtobuildwebsite.club/lean-domain-search"
      },
      {
        "icon": "",
        "title": "Query Domains", 
        "desc": "批量域名查询工具，支持多种顶级域名",
        "link": "https://howtobuildwebsite.club/query-domains"
      },
      {
        "icon": "",
        "title": "Instant Domain Search",
        "desc": "实时域名可用性检查，界面简洁响应快速",
        "link": "https://howtobuildwebsite.club/instant-domain-search"
      },
      {
        "icon": "",
        "title": "Spaceship",
        "desc": "专业域名注册商，价格透明无隐藏费用",
        "link": "https://howtobuildwebsite.club/spaceship"
      },
      {
        "icon": "",
        "title": "Porkbun",
        "desc": "实惠的域名注册服务，支持多种支付方式",
        "link": "https://howtobuildwebsite.club/porkbun"
      },
      {
        "icon": "",
        "title": "GitHub",
        "desc": "全球最大代码托管平台，支持静态网站部署",
        "link": "https://howtobuildwebsite.club/github"
      },
      {
        "icon": "",
        "title": "Cloudflare",
        "desc": "CDN和安全服务提供商，免费套餐功能强大",
        "link": "https://howtobuildwebsite.club/cloudflare"
      },
      {
        "icon": "",
        "title": "Vercel",
        "desc": "现代化前端部署平台，支持多种框架自动部署",
        "link": "https://howtobuildwebsite.club/vercel"
      },
      {
        "icon": "",
        "title": "Google Search Console",
        "desc": "Google官方SEO工具，监控网站搜索表现",
        "link": "https://howtobuildwebsite.club/google-search-console"
      },
      {
        "icon": "",
        "title": "Google Analytics",
        "desc": "网站流量分析神器，深入了解用户行为",
        "link": "https://howtobuildwebsite.club/google-analytics"
      },
      {
        "icon": "",
        "title": "Bing Webmaster",
        "desc": "必应搜索引擎的网站管理工具",
        "link": "https://howtobuildwebsite.club/bing-webmaster"
      }
    ]
  },
  {
    "title": "竞品调研分析",
    "items": [
      {
        "icon": "",
        "title": "AITDK",
        "desc": "查看网站流量和关键词数据，分析竞争对手表现",
        "link": "https://howtobuildwebsite.club/aitdk"
      },
      {
        "icon": "",
        "title": "Ahrefs 免费SEO工具",
        "desc": "专业的外链分析工具，了解竞品链接建设策略",
        "link": "https://howtobuildwebsite.club/ahrefs"
      },
      {
        "icon": "",
        "title": "SEMrush",
        "desc": "全面的网站关键词分析平台，竞品研究必备",
        "link": "https://howtobuildwebsite.club/semrush"
      }
    ]
  }
  // 这里是示例数据，完整数据需要从实际文件中读取
];

/**
 * 转义SQL字符串中的特殊字符
 */
function escapeSqlString(str) {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

/**
 * 生成SQL插入语句
 */
function generateSqlInsert() {
  const timestamp = new Date().toISOString();
  const categoriesJson = JSON.stringify(navData).replace(/'/g, "''");
  
  return `-- 导航数据初始化脚本
-- 生成时间: ${timestamp}
-- 使用方法: 在 Supabase SQL Editor 中执行此脚本

-- 删除现有的默认配置（如果存在）
DELETE FROM nav_configs WHERE id = 'default-config' AND user_id = 'anonymous-user';

-- 插入默认导航配置
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
    '${categoriesJson}'::jsonb,
    '${timestamp}',
    '${timestamp}'
);

-- 验证插入结果
SELECT 
    id,
    user_id,
    config_name,
    jsonb_array_length(categories) as category_count,
    created_at,
    updated_at
FROM nav_configs 
WHERE id = 'default-config' AND user_id = 'anonymous-user';

-- 查看分类详情（可选）
-- SELECT 
--     id,
--     user_id,
--     jsonb_pretty(categories) as categories_detail
-- FROM nav_configs 
-- WHERE id = 'default-config' AND user_id = 'anonymous-user';`;
}

/**
 * 主函数
 */
function main() {
  try {
    console.log('🚀 开始生成导航数据SQL脚本...');
    
    const sqlContent = generateSqlInsert();
    const outputPath = path.join(__dirname, '..', 'sql', 'insert_default_nav_data.sql');
    
    // 确保目录存在
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // 写入文件
    fs.writeFileSync(outputPath, sqlContent, 'utf8');
    
    console.log('✅ SQL脚本生成成功!');
    console.log(`📁 输出路径: ${outputPath}`);
    console.log(`📊 数据统计: ${navData.length} 个分类`);
    
    // 统计链接总数
    const totalLinks = navData.reduce((sum, category) => sum + category.items.length, 0);
    console.log(`🔗 链接总数: ${totalLinks} 个链接`);
    
  } catch (error) {
    console.error('❌ 生成SQL脚本失败:', error);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { generateSqlInsert, escapeSqlString }; 