import { useState } from 'react'
import { Link } from 'react-router'

import { AuthLayout } from '../components/auth-layout'
import { Button } from '../components/button'
import { FormError } from '../components/form-error'
import { TextField } from '../components/text-field'
import { useAuth } from '../lib/auth'
import { getErrorMessage } from '../lib/errors'
import { MIN_PASSWORD_LENGTH, validateEmail } from '../lib/validation'

type Errors = { email?: string; password?: string; confirm?: string; form?: string }

export function SignupPage() {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  const clear = (key: keyof Errors) => {
    if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }))
  }

  const handleSignup = async () => {
    const next: Errors = {
      email: validateEmail(email),
      password:
        password.length < MIN_PASSWORD_LENGTH
          ? `Use at least ${MIN_PASSWORD_LENGTH} characters.`
          : undefined,
      confirm: confirm !== password ? 'Passwords do not match.' : undefined,
    }
    setErrors(next)
    if (next.email || next.password || next.confirm) return

    setSubmitting(true)
    try {
      await signUp(email, password)
    } catch (e) {
      setErrors({ form: getErrorMessage(e) })
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Sign up"
      subtitle="Create an account to start keeping track of your tasks."
      onSubmit={handleSignup}
      footer={
        <>
          <Button type="submit" loading={submitting}>
            Create account
          </Button>
          <p className="mt-5 text-center text-sm text-grey-500">
            Have an account?{' '}
            <Link to="/login" className="font-semibold text-black underline underline-offset-2">
              Log in
            </Link>
          </p>
        </>
      }
    >
      <TextField
        label="Email address"
        type="email"
        placeholder="name@example.com"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          clear('email')
        }}
        error={errors.email}
      />
      <TextField
        label="Password"
        type="password"
        placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
        autoComplete="new-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          clear('password')
        }}
        error={errors.password}
      />
      <TextField
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => {
          setConfirm(e.target.value)
          clear('confirm')
        }}
        error={errors.confirm}
      />

      <FormError message={errors.form} />
    </AuthLayout>
  )
}
