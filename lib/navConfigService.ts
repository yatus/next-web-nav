import { supabase, TABLES, NavConfigRow } from './supabase'
import { NavCategory } from '@/stores/useConfigStore'

export class NavConfigService {
  // 获取默认配置 ID（如果没有用户系统，使用固定ID）
  private getDefaultConfigId() {
    return 'default-config'
  }

  // 获取用户ID（如果没有用户系统，使用固定值）
  private getUserId() {
    return 'anonymous-user'
  }

  // 获取导航配置
  async getNavConfig(): Promise<NavCategory[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.NAV_CONFIGS)
        .select('categories')
        .eq('id', this.getDefaultConfigId())
        .eq('user_id', this.getUserId())
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // 记录不存在，返回空配置
          return []
        }
        throw error
      }

      return data?.categories || []
    } catch (error) {
      console.error('获取导航配置失败:', error)
      throw new Error('获取导航配置失败')
    }
  }

  // 保存导航配置
  async saveNavConfig(categories: NavCategory[]): Promise<void> {
    try {
      const configData = {
        id: this.getDefaultConfigId(),
        user_id: this.getUserId(),
        config_name: 'default',
        categories,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from(TABLES.NAV_CONFIGS)
        .upsert(configData, {
          onConflict: 'id,user_id'
        })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('保存导航配置失败:', error)
      throw new Error('保存导航配置失败')
    }
  }

  // 初始化默认配置
  async initDefaultConfig(defaultCategories: NavCategory[]): Promise<void> {
    try {
      const existingConfig = await this.getNavConfig()
      
      // 如果没有配置，则创建默认配置
      if (existingConfig.length === 0) {
        await this.saveNavConfig(defaultCategories)
      }
    } catch (error) {
      // 如果获取失败（比如表不存在），直接创建默认配置
      try {
        await this.saveNavConfig(defaultCategories)
      } catch (saveError) {
        console.error('初始化默认配置失败:', saveError)
        throw new Error('初始化默认配置失败')
      }
    }
  }

  // 重置到默认配置
  async resetToDefault(defaultCategories: NavCategory[]): Promise<void> {
    await this.saveNavConfig(defaultCategories)
  }
}

export const navConfigService = new NavConfigService() 