'use client'
import type { CustomFormData } from '@/components/FormContainer'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import FormContainer from '@/components/FormContainer'

const LoginPage: React.FC = () => {
  const [form, setForm] = useState<CustomFormData[]>([
    {
      id: 'username',
      value: '',
      label: '用户名',
      autocomplete: 'username',
    },
    {
      id: 'email',
      value: '',
      label: '邮箱',
      type: 'email',
      autocomplete: 'email',
    },
    {
      id: 'password',
      value: '',
      label: '密码',
      type: 'password',
      autocomplete: 'new-password',
    },
    {
      id: 'password2',
      value: '',
      label: '确认密码',
      type: 'password',
    },
    {
      id: 'v_code',
      value: '',
      label: '验证码',
    },
    {
      id: 'cd_key',
      value: '',
      label: '邀请码',
    },
  ])

  const [rememberMe, setRememberMe] = useState<boolean>(false)

  const isFormValid = useMemo(() => {
    return form.every(field => field.value.trim() !== '')
  }, [form])

  const handleFormDataChange = (updatedData: CustomFormData[]) => {
    setForm(updatedData)
  }

  const handleLogin = () => {
    // const formDataObj = form.reduce((acc, field) => {
    //   acc[field.id] = field.value
    //   return acc
    // }, {} as Record<string, string>)

    // console.log('Login data:', {
    //   ...formDataObj,
    //   rememberMe,
    // })
  }

  return (
    <FormContainer
      className="w-1/2 h-a"
      formData={form}
      disabled={!isFormValid}
      onSubmitForm={handleLogin}
      onFormDataChange={handleFormDataChange}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={e => setRememberMe(e.target.checked)}
          className="mr-2"
        />
        <label className="text-black">记住我</label>
      </div>

      <div className="flex flex-row justify-around">
        <Link href="/auth/register">
          还没账号？
        </Link>
        <Link href="/auth/reset">
          忘记密码了？
        </Link>
      </div>
    </FormContainer>
  )
}

export default LoginPage
