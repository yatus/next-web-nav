import { useEffect } from 'react'
import { useConfigStore } from '@/stores/useConfigStore'

export function useInitializeData() {
  const { loadCategories, isLoading, error } = useConfigStore()

  useEffect(() => {
    // 应用启动时加载数据
    loadCategories()
  }, [loadCategories])

  return {
    isLoading,
    error
  }
} 