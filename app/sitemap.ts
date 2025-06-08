import { MetadataRoute } from 'next'
import { NavData } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'
  
  // 基础页面
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ]

  // 动态添加导航分类页面
  NavData.forEach((category) => {
    routes.push({
      url: `${baseUrl}/#${encodeURIComponent(category.title)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  })

  return routes
} 