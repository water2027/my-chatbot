import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onInputChange: (value: string) => void
  label?: string
}

function FormInput({ ref, value, onInputChange, label, className = '', ...props }: FormInputProps & { ref?: React.RefObject<HTMLInputElement | null> }) {
  return (
    <div className="relative my-4 h-10 w-full">
      <input
        ref={ref}
        value={value}
        onChange={e => onInputChange(e.target.value)}
        className={`peer h-full w-full border-b-2 border-blue-300 border-none bg-[#ffffff84] text-base ${className}`}
        required
        {...props}
      />
      <div className="autofill-indicator absolute bottom-0 h-[2px] w-full scale-x-0 from-[#eb6b26] to-[#eb6b26] bg-gradient-to-r transition-all duration-300 ease peer-focus:scale-x-100 peer-valid:scale-x-100" />
      <label
        className="input-label pointer-events-none absolute bottom-[10px] left-0 text-gray-500 transition-all duration-300 ease peer-focus:scale-x-90 peer-valid:scale-x-90 peer-focus:border-0 peer-valid:border-0 peer-focus:text-base peer-valid:text-base peer-focus:text-[#eb6b26] peer-valid:text-[#eb6b26] peer-focus:font-bold peer-valid:font-bold peer-focus:-translate-y-[100%] peer-valid:-translate-y-[100%]"
        htmlFor={props.id}
      >
        {label}
      </label>
      <style jsx>
        {`
          .peer:-webkit-autofill ~ .autofill-indicator {
            transform: scaleX(1);
          }

          .peer:-webkit-autofill ~ .input-label {
            transform: translateY(-100%) scaleX(0.9);
            color: #eb6b26;
            font-weight: bold;
            font-size: 1rem;
          }
        `}
      </style>
    </div>
  )
}

FormInput.displayName = 'FormInput'

export default FormInput
