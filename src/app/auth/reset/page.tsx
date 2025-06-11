'use client'
import type { CustomFormData } from '@/components/FormContainer'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import FormContainer from '@/components/FormContainer'

const LoginPage: React.FC = () => {
  const [form, setForm] = useState<CustomFormData[]>([
    {
      id: 'email',
      value: '',
      label: 'email',
      type: 'email',
      autocomplete: 'email',
    //   reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i,
    },
    {
      id: 'password',
      value: '',
      label: 'password',
      type: 'password',
      autocomplete: 'new-password',
    //   reg: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[\s\S]{8,12}/,
    },
    {
      id: 'password2',
      value: '',
      label: 'password2',
      type: 'password',
    //   reg: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[\s\S]{8,12}/,
    },
    {
      id: 'code',
      value: '',
      label: 'code',
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
    const formDataObj = form.reduce((acc, field) => {
      acc[field.id] = field.value
      return acc
    }, {} as Record<string, string>)

    console.log('Login data:', {
      ...formDataObj,
      rememberMe,
    })
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
