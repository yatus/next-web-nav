import { NavCategory } from '@/stores/useConfigStore'

export class SecureNavConfigService {
  // 获取导航配置（公开接口，不需要权限）
  async getNavConfig(): Promise<NavCategory[]> {
    try {
      const response = await fetch('/api/admin/config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('获取配置失败')
      }

      const data = await response.json()
      return data.categories || []
    } catch (error) {
      console.error('获取导航配置失败:', error)
      throw new Error('获取导航配置失败')
    }
  }

  // 保存导航配置（需要管理员权限）
  async saveNavConfig(categories: NavCategory[]): Promise<void> {
    try {
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '保存配置失败')
      }
    } catch (error) {
      console.error('保存导航配置失败:', error)
      throw error
    }
  }

  // 重置到默认配置（需要管理员权限）
  async resetToDefault(defaultCategories: NavCategory[]): Promise<void> {
    await this.saveNavConfig(defaultCategories)
  }
}

// 导出实例
export const secureNavConfigService = new SecureNavConfigService() 