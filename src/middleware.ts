import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 使用服务端密钥
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

export async function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'token无效' }, { status: 401 })
  }

  const token = authHeader.substring(7)

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token)
    const user = data.user
    if (error || !user) {
      return NextResponse.json({ error: 'token无效' }, { status: 401 })
    }
    return NextResponse.next()
  }
  catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'token无效' }, { status: 401 })
  }
}

export const config = {
  matcher: '/api/:path*',
}
