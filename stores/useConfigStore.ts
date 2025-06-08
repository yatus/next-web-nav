import { NavData as DefaultNavConfig } from "@/config/site"
import { create } from "zustand"
import { secureNavConfigService } from "@/lib/secureNavConfigService"

// Export initial data for reset functionality
export const initialNavData = DefaultNavConfig

// 类型命名优化：使用更明确的命名
export interface NavLinkItem {
  icon: string
  title: string
  desc: string
  link: string
}

export interface NavCategory {
  title: string
  items: NavLinkItem[]
}

interface NavConfigState {
  // 状态属性
  categories: NavCategory[]
  isLoading: boolean
  error: string | null
  
  // 操作方法
  setCategories: (data: NavCategory[]) => void
  addCategory: (category: NavCategory) => void
  updateCategory: (index: number, category: NavCategory) => void
  removeCategory: (index: number) => void
  addLink: (categoryIndex: number, link: NavLinkItem) => void
  updateLink: (categoryIndex: number, linkIndex: number, link: NavLinkItem) => void
  removeLink: (categoryIndex: number, linkIndex: number) => void
  
  // 异步操作方法
  loadCategories: () => Promise<void>
  saveCategories: () => Promise<void>
  resetToDefault: () => Promise<void>
  
  // 状态管理方法
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useConfigStore = create<NavConfigState>((set, get) => ({
  // 初始状态
  categories: [],
  isLoading: false,
  error: null,

  // 同步操作方法（只更新本地状态）
  setCategories: (data) => set({ categories: data }),
  
  addCategory: (category) => set((state) => ({ 
    categories: [...state.categories, category] 
  })),
  
  updateCategory: (index, category) =>
    set((state) => {
      const updated = [...state.categories]
      updated[index] = category
      return { categories: updated }
    }),
    
  removeCategory: (index) =>
    set((state) => ({
      categories: state.categories.filter((_, i) => i !== index)
    })),
    
  addLink: (categoryIndex, link) =>
    set((state) => {
      const updated = [...state.categories]
      updated[categoryIndex] = {
        ...updated[categoryIndex],
        items: [...updated[categoryIndex].items, link]
      }
      return { categories: updated }
    }),
    
  updateLink: (categoryIndex, linkIndex, link) =>
    set((state) => {
      const updated = [...state.categories]
      updated[categoryIndex] = {
        ...updated[categoryIndex],
        items: updated[categoryIndex].items.map((item, i) => (i === linkIndex ? link : item))
      }
      return { categories: updated }
    }),
    
  removeLink: (categoryIndex, linkIndex) =>
    set((state) => {
      const updated = [...state.categories]
      updated[categoryIndex] = {
        ...updated[categoryIndex],
        items: updated[categoryIndex].items.filter((_, i) => i !== linkIndex)
      }
      return { categories: updated }
    }),

  // 异步操作方法
  loadCategories: async () => {
    set({ isLoading: true, error: null })
    try {
      const categories = await secureNavConfigService.getNavConfig()
      
      // 如果获取的数据为空，使用默认配置
      if (categories.length === 0) {
        set({ categories: initialNavData })
      } else {
        set({ categories })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载配置失败'
      set({ error: errorMessage, categories: initialNavData }) // 失败时使用默认配置
      console.error('加载配置失败:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  saveCategories: async () => {
    const { categories } = get()
    set({ isLoading: true, error: null })
    try {
      await secureNavConfigService.saveNavConfig(categories)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '保存配置失败'
      set({ error: errorMessage })
      throw error // 重新抛出错误，让调用方处理
    } finally {
      set({ isLoading: false })
    }
  },

  resetToDefault: async () => {
    set({ isLoading: true, error: null })
    try {
      await secureNavConfigService.resetToDefault(initialNavData)
      set({ categories: initialNavData })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '重置配置失败'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  // 状态管理方法
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}))
