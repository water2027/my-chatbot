import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/auth/error?error=exchangeFail&error_detail=${encodeURIComponent(error.message)}&redirect_uri=/auth/login`)
    }
  }

  return NextResponse.redirect(`${origin}/`)
}
