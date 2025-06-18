// import type { NextRequest } from 'next/server'
// import { createClient } from '@supabase/supabase-js'
// import { NextResponse } from 'next/server'

// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!, // 使用服务端密钥
//   {
//     auth: {
//       autoRefreshToken: false,
//       persistSession: false,
//     },
//   },
// )

// export async function middleware(request: NextRequest) {
//   const authHeader = request.headers.get('authorization')
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return NextResponse.json({ error: 'token无效' }, { status: 401 })
//   }

//   const token = authHeader.substring(7)

//   try {
//     const { data, error } = await supabaseAdmin.auth.getUser(token)
//     const user = data.user
//     if (error || !user) {
//       return NextResponse.json({ error: 'token无效' }, { status: 401 })
//     }
//     return NextResponse.next()
//   }
//   catch (error) {
//     console.error(error)
//     return NextResponse.json({ error: 'token无效' }, { status: 401 })
//   }
// }

import type { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了以下开头的：
     * - api (API 路由)
     * - _next/static (静态文件)
     * - _next/image (图像优化)
     * - favicon.ico (网站图标)
     * - 其他静态资源文件
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico)$).*)',
  ],
}
