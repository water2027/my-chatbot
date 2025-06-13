'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { supabase } from '@/utils/supabase'

function LoginCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const { setUserInfo } = useUserStore()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error: authError } = await supabase.auth.getSession()

        if (authError) {
          console.error('Auth callback error:', authError.message)
          setError('Authentication failed')
          return
        }
        if (data.session) {
          const accessToken = data.session.access_token
          const refreshToken = data.session.refresh_token
          setUserInfo({ accessToken, refreshToken: refreshToken || '' })
          const redirectTo = searchParams.get('redirect') || '/'
          router.push(redirectTo)
        }
        else {
          setError('No authentication session found')
        }
      }
      catch (err) {
        console.error('Unexpected error during auth callback:', err)
        setError('An unexpected error occurred')
      }
    }

    handleAuthCallback()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, searchParams])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">认证错误</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            返回登录
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">认证中...</p>
      </div>
    </div>
  )
}

export default function LoginCallback() {
  return (
    <Suspense fallback={(
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )}
    >
      <LoginCallbackContent />
    </Suspense>
  )
}
