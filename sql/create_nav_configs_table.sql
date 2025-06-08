-- 创建导航配置表
CREATE TABLE nav_configs (
    id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    config_name VARCHAR(255) NOT NULL DEFAULT 'default',
    categories JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (id, user_id)
);

-- 创建索引以提高查询性能
CREATE INDEX idx_nav_configs_user_id ON nav_configs(user_id);
CREATE INDEX idx_nav_configs_config_name ON nav_configs(config_name);

-- 创建更新时间自动更新的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nav_configs_updated_at 
    BEFORE UPDATE ON nav_configs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 插入默认配置示例（可选）
-- INSERT INTO nav_configs (id, user_id, config_name, categories) 
-- VALUES ('default-config', 'anonymous-user', 'default', '[]');

-- 设置 RLS (Row Level Security) 策略（如果需要）
-- ALTER TABLE nav_configs ENABLE ROW LEVEL SECURITY;

-- 创建策略允许匿名用户访问（根据实际需求调整）
-- CREATE POLICY "Allow anonymous access" ON nav_configs
--     FOR ALL USING (true); 