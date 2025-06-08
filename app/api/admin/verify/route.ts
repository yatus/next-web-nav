import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // 从服务器端环境变量获取管理员密码（不是 NEXT_PUBLIC_）
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
    
    if (!password) {
      return NextResponse.json(
        { error: '密码不能为空' },
        { status: 400 }
      )
    }
    
    if (password === ADMIN_PASSWORD) {
      // 验证成功，生成一个简单的 token（在生产环境中应使用 JWT）
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64')
      
      // 设置 httpOnly cookie
      const response = NextResponse.json({ 
        success: true,
        message: '验证成功' 
      })
      
      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24小时
        path: '/'
      })
      
      return response
    } else {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('管理员验证失败:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
} 