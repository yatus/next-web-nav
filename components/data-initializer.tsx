'use client'

import { useInitializeData } from '@/hooks/useInitializeData'
import { useConfigStore } from '@/stores/useConfigStore'
import { useEffect } from 'react'

export function DataInitializer() {
  const { isLoading, error } = useInitializeData()
  const { error: storeError } = useConfigStore()

  // 在控制台显示错误信息（可选）
  useEffect(() => {
    if (error || storeError) {
      console.warn('数据加载警告:', error || storeError)
    }
  }, [error, storeError])

  // 这个组件不渲染任何内容，只负责数据初始化
  return null
} 