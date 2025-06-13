'use client'

import type { FormEvent } from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '@/utils/supabase'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const el = e.target as HTMLFormElement
      if (!el)
        return
      const form = new FormData(el)
      const email = form.get('email')?.toString()

      if (!email) {
        setError('请输入邮箱地址')
        return
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    }
    catch (error: any) {
      setError(error.message || '发送重置邮件失败')
    }
    finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              邮件已发送
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              我们已经向您的邮箱发送了重置密码的链接
            </p>
          </div>

          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="text-sm">
              请检查您的邮箱并点击链接重置密码。如果您没有收到邮件，请检查垃圾邮件文件夹。
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              返回登录
            </Link>

            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              重新发送邮件
            </button>
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
            重置密码
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            输入您的邮箱地址，我们将发送重置密码的链接
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                邮箱地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="邮箱地址"
              />
            </div>
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
              {loading ? '发送中...' : '发送重置邮件'}
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
