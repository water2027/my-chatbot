import React, { useEffect, useRef } from 'react'
import FormInput from './FormInput'

export interface CustomFormData {
  id: string
  label: string
  value: string
  type?: string
  autocomplete?: string
}

interface CustomFormProps extends React.InputHTMLAttributes<HTMLFormElement> {
  formName?: string
  disabled?: boolean
  formData: CustomFormData[]
  onSubmitForm: () => void
  onFormDataChange: (updatedData: CustomFormData[]) => void
  children?: React.ReactNode
}

const CustomForm: React.FC<CustomFormProps> = ({
  formName = '提交',
  disabled = false,
  formData,
  onSubmitForm,
  onFormDataChange,
  children,
  className,
}) => {
  const formRef = useRef<HTMLFormElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus()
    }
  }, [])

  const handleInputChange = (index: number, value: string) => {
    const updatedData = formData.map((item, i) =>
      i === index ? { ...item, value } : item,
    )
    onFormDataChange(updatedData)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmitForm()
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`${className} flex flex-col rounded-lg shadow-md p-16`}
    >
      {formData.map((item, index) => (
        <FormInput
          key={item.id}
          ref={index === 0 ? firstInputRef : undefined}
          id={item.id}
          value={item.value}
          onInputChange={value => handleInputChange(index, value)}
          label={item.label}
          type={item.type || 'text'}
          autoComplete={item.autocomplete || 'off'}
        />
      ))}
      {children}
      <button
        disabled={disabled}
        className="mt-5 h-10 w-full flex cursor-pointer items-center justify-center border-0 rounded-[20px] bg-[#eb6b26] text-lg text-white disabled:bg-zinc-600 hover:bg-[#ff7e3b]"
        type="submit"
      >
        {disabled ? '请填写完整信息' : formName}
      </button>
    </form>
  )
}

export default CustomForm
