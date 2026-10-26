import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { AsyncStorageWrapper, CachePersistor } from 'apollo3-cache-persist';

import { API_URL } from './config';

// --- Auth token used by every request ------------------------------------
let authToken: string | null = null;
export function setAuthToken(token: string | null) {
  authToken = token;
}

// Called when the server rejects our token (e.g. the in-memory backend restarted).
let handleUnauthenticated: (() => void) | null = null;
export function setUnauthenticatedHandler(fn: (() => void) | null) {
  handleUnauthenticated = fn;
}

// --- Links ----------------------------------------------------------------
const REQUEST_TIMEOUT_MS = 10_000;

// Fail fast instead of hanging when the API can't be reached.
const fetchWithTimeout: typeof fetch = (input, init) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
};

const httpLink = new HttpLink({ uri: API_URL, fetch: fetchWithTimeout });

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  },
}));

const AUTH_OPERATIONS = new Set(['Login', 'Signup']);

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  // A wrong password on the login screen is also UNAUTHENTICATED; that one is
  // shown on the form instead of logging the user out.
  if (AUTH_OPERATIONS.has(operation.operationName)) return;

  // The backend sends auth errors with HTTP 401 (a "network" error to Apollo).
  const status = (networkError as { statusCode?: number } | null)?.statusCode;
  const unauthenticated =
    status === 401 || graphQLErrors?.some((e) => e.extensions?.code === 'UNAUTHENTICATED');
  if (unauthenticated) handleUnauthenticated?.();
});

// --- Cache (persisted to AsyncStorage for offline viewing) ------------------
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // The server always returns the full list, so just replace it.
        todos: { merge: false },
      },
    },
  },
});

export const persistor = new CachePersistor({
  cache,
  storage: new AsyncStorageWrapper(AsyncStorage),
  key: 'todo-apollo-cache',
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
});
