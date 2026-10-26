import { useState } from 'react'
import { Link } from 'react-router'

import { AuthLayout } from '../components/auth-layout'
import { Button } from '../components/button'
import { FormError } from '../components/form-error'
import { TextField } from '../components/text-field'
import { useAuth } from '../lib/auth'
import { getErrorMessage } from '../lib/errors'
import { validateEmail } from '../lib/validation'

type Errors = { email?: string; password?: string; form?: string }

// e.g. "26 October 2026"
const today = new Date().toLocaleDateString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function LoginPage() {
  const { signIn, notice } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  const handleLogin = async () => {
    const next: Errors = {
      email: validateEmail(email),
      password: password ? undefined : 'Enter your password.',
    }
    setErrors(next)
    if (next.email || next.password) return

    setSubmitting(true)
    try {
      await signIn(email, password)
      // The route guard sends us to the task list.
    } catch (e) {
      setErrors({ form: getErrorMessage(e) })
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Log in"
      subtitle="Welcome back. Enter your details to access your tasks."
      onSubmit={handleLogin}
      footer={
        <>
          <Button type="submit" loading={submitting}>
            Log in
          </Button>
          <p className="mt-5 text-center text-sm text-grey-500">
            No account?{' '}
            <Link to="/signup" className="font-semibold text-black underline underline-offset-2">
              Sign up
            </Link>
          </p>
          <p className="mt-8 border-t border-grey-200 pt-4 text-center text-xs text-grey-500">
            Developed by Amier Ezzad · {today}
          </p>
        </>
      }
    >
      <p className="-mt-4 mb-8 border-t border-grey-200 pt-4 text-sm leading-5 text-grey-500">
        Built as part of my application for the{' '}
        <span className="font-medium text-black">Junior Mobile Developer</span> role at Tactlink.
      </p>

      {notice && !errors.form ? <FormError message={notice} /> : null}

      <TextField
        label="Email address"
        type="email"
        placeholder="name@example.com"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (errors.email) setErrors((x) => ({ ...x, email: undefined }))
        }}
        error={errors.email}
      />
      <TextField
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          if (errors.password) setErrors((x) => ({ ...x, password: undefined }))
        }}
        error={errors.password}
      />

      <FormError message={errors.form} />
    </AuthLayout>
  )
}
