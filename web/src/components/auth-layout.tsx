import type { FormEvent, ReactNode } from 'react'

// Shared layout for the login and sign-up pages.
// Phones: full-screen like the mockup, button pinned to the bottom.
// Larger screens: the same form in a centered card.
export function AuthLayout({
  title,
  subtitle,
  onSubmit,
  children,
  footer,
}: {
  title: string
  subtitle: string
  onSubmit: () => void
  children: ReactNode
  footer: ReactNode
}) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <main className="flex min-h-dvh flex-col bg-white sm:items-center sm:justify-center sm:bg-grey-100 sm:px-6 sm:py-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full flex-1 flex-col px-6 pb-6 pt-12 sm:max-w-md sm:flex-none sm:rounded-2xl sm:border sm:border-grey-200 sm:bg-white sm:p-10"
      >
        <div className="flex-1">
          <h1 className="mb-2 text-[32px] font-bold tracking-tight text-black">{title}</h1>
          <p className="mb-10 text-base leading-6 text-grey-500">{subtitle}</p>
          {children}
        </div>
        <div className="pt-4">{footer}</div>
      </form>
    </main>
  )
}
