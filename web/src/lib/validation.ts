const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Enter your email address.'
  if (!EMAIL_RE.test(email.trim())) return 'Enter a valid email address.'
}

export const MIN_PASSWORD_LENGTH = 6
