import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

import { API_URL } from './config'
import { loadSession } from './session'

// --- Auth token used by every request ------------------------------------
let authToken: string | null = loadSession()?.token ?? null
export function setAuthToken(token: string | null) {
  authToken = token
}

// Called when the server rejects our token (e.g. the in-memory backend restarted).
let handleUnauthenticated: (() => void) | null = null
export function setUnauthenticatedHandler(fn: (() => void) | null) {
  handleUnauthenticated = fn
}

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  },
}))

const AUTH_OPERATIONS = new Set(['Login', 'Signup'])

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  // A wrong password is also UNAUTHENTICATED; that one is shown on the form.
  if (AUTH_OPERATIONS.has(operation.operationName)) return
  // The backend sends auth errors with HTTP 401 (a "network" error to Apollo).
  const status = (networkError as { statusCode?: number } | null)?.statusCode
  const unauthenticated =
    status === 401 || graphQLErrors?.some((e) => e.extensions?.code === 'UNAUTHENTICATED')
  if (unauthenticated) handleUnauthenticated?.()
})

export const client = new ApolloClient({
  link: from([errorLink, authLink, new HttpLink({ uri: API_URL })]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // The server always returns the full list, so just replace it.
          todos: { merge: false },
        },
      },
    },
  }),
})
