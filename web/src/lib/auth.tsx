import { useApolloClient } from '@apollo/client'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { setAuthToken, setUnauthenticatedHandler } from './apollo'
import { LOGIN_MUTATION, SIGNUP_MUTATION, type AuthPayload, type User } from './graphql'
import { clearSession, loadSession, saveSession } from './session'

type AuthContextValue = {
  user: User | null
  /** A message to show on the login page, e.g. after the session expired. */
  notice: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: (notice?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient()
  const [user, setUser] = useState<User | null>(() => loadSession()?.user ?? null)
  const [notice, setNotice] = useState<string | null>(null)

  const startSession = useCallback((payload: AuthPayload) => {
    saveSession({ token: payload.token, user: payload.user })
    setAuthToken(payload.token)
    setNotice(null)
    setUser(payload.user)
  }, [])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data } = await client.mutate<{ login: AuthPayload }>({
        mutation: LOGIN_MUTATION,
        variables: { email: email.trim(), password },
      })
      if (data) startSession(data.login)
    },
    [client, startSession],
  )

  const signUp = useCallback(
    async (email: string, password: string) => {
      const { data } = await client.mutate<{ signup: AuthPayload }>({
        mutation: SIGNUP_MUTATION,
        variables: { email: email.trim(), password },
      })
      if (data) startSession(data.signup)
    },
    [client, startSession],
  )

  const signOut = useCallback(
    async (message?: string) => {
      setAuthToken(null)
      clearSession()
      setUser(null)
      setNotice(message ?? null)
      await client.clearStore() // drop this user's cached tasks
    },
    [client],
  )

  // If the server rejects the token (e.g. the backend restarted and lost its
  // in-memory sessions), send the user back to the login page.
  useEffect(() => {
    setUnauthenticatedHandler(() => {
      void signOut('Your session has expired. Please log in again.')
    })
    return () => setUnauthenticatedHandler(null)
  }, [signOut])

  const value = useMemo(
    () => ({ user, notice, signIn, signUp, signOut }),
    [user, notice, signIn, signUp, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
