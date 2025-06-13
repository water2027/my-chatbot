import { supabase } from './supabase'

async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      return null
    }

    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      console.error('token刷新失败了', error.message)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      return null
    }

    const session = data.session
    if (session) {
      const newAccessToken = session.access_token
      const newRefreshToken = session.refresh_token

      localStorage.setItem('access_token', newAccessToken)
      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken)
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
  const token = localStorage.getItem('access_token')
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
      throw new Error('需要登录', {cause: 401})
    }
    return await request(url, requestInit, retryCount + 1)
  }

  return resp
}
