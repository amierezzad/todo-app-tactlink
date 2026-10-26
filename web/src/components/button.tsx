import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }

// Full-width black button from the mockup (52px tall, 12px radius).
export function Button({ loading, disabled, children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`flex h-[52px] w-full items-center justify-center rounded-xl bg-black px-4 text-base font-medium text-white transition-colors hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {loading ? (
        <span
          className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
          aria-label="Loading"
        />
      ) : (
        children
      )}
    </button>
  )
}
