import { useId, type InputHTMLAttributes } from 'react'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string | null
}

// Labelled input from the mockup: grey label, 52px field, black border on focus.
export function TextField({ label, error, className = '', ...props }: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className="mb-5 w-full">
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-grey-500">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
        className={`h-[52px] w-full rounded-xl border bg-white px-4 text-base text-black outline-none transition-colors placeholder:text-grey-500 focus:border-black ${
          error ? 'border-black' : 'border-grey-200'
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-[13px] font-medium text-black">
          {error}
        </p>
      ) : null}
    </div>
  )
}
