import { useUserStore } from '@/store/userStore'
import { supabase } from './supabase'

async function refreshToken() {
  try {
    const { userInfo, clearUserInfo, updateAccessToken, updateRefreshToken } = useUserStore.getState()
    const { refreshToken } = userInfo!
    if (!refreshToken) {
      return null
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken })

    if (error) {
      console.error('token刷新失败了', error.message)
      clearUserInfo()
      return null
    }

    const session = data.session
    if (session) {
      const newAccessToken = session.access_token
      const newRefreshToken = session.refresh_token

      updateAccessToken(newAccessToken)
      if (newRefreshToken) {
        updateRefreshToken(newRefreshToken)
      }

      return newAccessToken
    }
    return null
  }
  catch (error) {
    console.error(error)
    return null
  }
}

export default async function request(url: string, requestInit: RequestInit, retryCount = 0) {
  if (url.startsWith('/')) {
    url = process.env.NEXT_PUBLIC_API_URL + url
  }
  console.log('request url', url)
  const { userInfo } = useUserStore.getState()
  console.log('request', url, requestInit, userInfo)
  const { accessToken: token } = userInfo!
  if (token) {
    requestInit = {
      ...requestInit,
      headers: {
        ...requestInit.headers,
        Authorization: `Bearer ${token}`,
      },
    }
  }

  const resp = await fetch(url, requestInit)
  if (resp.status === 401 && retryCount === 0) {
    // 登录失效了, 应该刷新token再发送一次请求
    const result = await refreshToken()
    if (!result) {
      throw new Error('需要登录', { cause: 401 })
    }
    return await request(url, requestInit, retryCount + 1)
  }

  return resp
}
