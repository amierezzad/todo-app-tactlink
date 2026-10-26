import type { User } from './graphql'

// The web app keeps the login token in localStorage (the mobile app uses SecureStore).
const KEY = 'todo_session'

export type Session = { token: string; user: User }

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function saveSession(session: Session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    // Storage can be unavailable (e.g. private mode); the session still works until reload.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
