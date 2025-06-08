import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库表名
export const TABLES = {
  NAV_CONFIGS: 'nav_configs'
} as const

// 数据库类型定义
export interface NavConfigRow {
  id: string
  user_id: string
  config_name: string
  categories: any[] // JSON 类型
  created_at: string
  updated_at: string
} 