'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, FormEvent, useEffect } from 'react'
import { supabase } from '@/utils/supabase'

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          setValidSession(false)
        } else if (data.session) {
          console.log('Valid session found')
          setValidSession(true)
        } else {
          console.log('No valid session')
          setValidSession(false)
        }
      } catch (err) {
        console.error('Error checking session:', err)
        setValidSession(false)
      } finally {
        setCheckingSession(false)
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session ? 'session exists' : 'no session')
        
        if (event === 'PASSWORD_RECOVERY') {
          setValidSession(true)
          setCheckingSession(false)
        } else if (session) {
          setValidSession(true)
          setCheckingSession(false)
        } else {
          setValidSession(false)
          setCheckingSession(false)
        }
      }
    )

    checkSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const el = e.target as HTMLFormElement
      if (!el) return
      const form = new FormData(el)
      const password = form.get('password')?.toString()
      const confirmPassword = form.get('confirmPassword')?.toString()
      
      if (!password || !confirmPassword) {
        setError('需要填写完整')
        return
      }

      if (password.length < 6) {
        setError('至少六个字符')
        return
      }

      if (password !== confirmPassword) {
        setError('两次密码不同')
        return
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw error
      }

      setSuccess(true)
      
      setTimeout(() => {
        router.push('/auth/login')
      }, 1000)

    } catch (error: any) {
      setError(error.message || 'fail')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              验证中...
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              正在验证重置链接
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!validSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              链接无效或已过期
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              请重新申请重置密码
            </p>
          </div>

          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="text-sm">
              重置密码链接无效或已过期，请返回登录页面重新申请。
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              返回登录
            </Link>
            
            <Link
              href="/auth/forgot"
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              重新申请重置密码
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              密码重置成功
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              您的密码已成功重置
            </p>
          </div>

          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="text-sm">
              密码已成功更新，即将自动跳转到登录页面...
            </p>
          </div>

          <div>
            <Link
              href="/auth/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              立即登录
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            设置新密码
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            请输入您的新密码
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password" className="sr-only">
                新密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="新密码（至少6位）"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                确认新密码
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="确认新密码"
              />
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <ul className="list-disc list-inside space-y-1">
              <li>密码长度至少为6位</li>
              <li>建议包含字母、数字和特殊字符</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '重置中...' : '重置密码'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              返回登录页面
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}