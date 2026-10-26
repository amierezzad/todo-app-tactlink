import type { ButtonHTMLAttributes } from 'react'

// 44x44 square tap target, as in the mockup.
export function IconButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-black transition-colors hover:bg-grey-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${className}`}
    />
  )
}
