'use client'

import { siteConfig } from '@/config/site'

export function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com',
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    mainEntity: {
      '@type': 'ItemList',
      name: '建站工具导航',
      description: '精选的建站工具和资源集合',
      numberOfItems: 100,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '需求收集和关键词调研',
          description: '帮助分析用户需求和关键词的专业工具',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '上站工具',
          description: '域名注册、网站部署和分析工具',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: '竞品调研分析',
          description: '分析竞争对手和市场情况的专业工具',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: '上站模板资源',
          description: '各种类型的网站模板和样板项目',
        },
      ],
    },
  }

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
    </>
  )
} 