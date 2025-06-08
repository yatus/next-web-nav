import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { NavConfigService } from '@/lib/navConfigService'

// 验证管理员权限
async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get('admin-token')
  
  if (!adminToken?.value) {
    return false
  }
  
  try {
    // 简单的 token 验证（在生产环境中应使用更安全的 JWT）
    const decoded = Buffer.from(adminToken.value, 'base64').toString()
    const [user, timestamp] = decoded.split(':')
    
    if (user !== 'admin') {
      return false
    }
    
    // 检查 token 是否过期（24小时）
    const tokenTime = parseInt(timestamp)
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000
    
    return (now - tokenTime) < twentyFourHours
  } catch (error) {
    console.error('Token 验证失败:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      )
    }
    
    const { categories } = await request.json()
    
    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json(
        { error: '无效的配置数据' },
        { status: 400 }
      )
    }
    
    // 使用服务保存配置
    const navConfigService = new NavConfigService()
    await navConfigService.saveNavConfig(categories)
    
    return NextResponse.json({ 
      success: true,
      message: '配置保存成功' 
    })
    
  } catch (error) {
    console.error('保存配置失败:', error)
    return NextResponse.json(
      { error: '保存配置失败' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // 获取配置不需要权限验证，任何人都可以查看
    const navConfigService = new NavConfigService()
    const categories = await navConfigService.getNavConfig()
    
    return NextResponse.json({ categories })
    
  } catch (error) {
    console.error('获取配置失败:', error)
    return NextResponse.json(
      { error: '获取配置失败' },
      { status: 500 }
    )
  }
} 