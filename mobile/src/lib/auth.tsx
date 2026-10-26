import { useApolloClient } from '@apollo/client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { persistor, setAuthToken, setUnauthenticatedHandler } from './apollo';
import {
  LOGIN_MUTATION,
  SIGNUP_MUTATION,
  type AuthPayload,
  type User,
} from './graphql';
import { clearSession, saveSession, type Session } from './session';

type AuthContextValue = {
  user: User | null;
  /** A message to show on the login screen, e.g. after the session expired. */
  notice: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: (notice?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  initialSession,
  children,
}: {
  initialSession: Session | null;
  children: ReactNode;
}) {
  const client = useApolloClient();
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null);
  const [notice, setNotice] = useState<string | null>(null);
  const signingOut = useRef(false);

  const startSession = useCallback(async (payload: AuthPayload) => {
    const session = { token: payload.token, user: payload.user };
    await saveSession(session);
    setAuthToken(session.token);
    setNotice(null);
    setUser(session.user);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data } = await client.mutate<{ login: AuthPayload }>({
        mutation: LOGIN_MUTATION,
        variables: { email: email.trim(), password },
      });
      if (data) await startSession(data.login);
    },
    [client, startSession],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const { data } = await client.mutate<{ signup: AuthPayload }>({
        mutation: SIGNUP_MUTATION,
        variables: { email: email.trim(), password },
      });
      if (data) await startSession(data.signup);
    },
    [client, startSession],
  );

  const signOut = useCallback(
    async (message?: string) => {
      if (signingOut.current) return;
      signingOut.current = true;
      try {
        setAuthToken(null);
        setUser(null);
        setNotice(message ?? null);
        await clearSession();
        // Drop this user's cached tasks, in memory and on disk.
        await client.clearStore();
        await persistor.purge();
      } finally {
        signingOut.current = false;
      }
    },
    [client],
  );

  // If the server rejects the token (e.g. the backend restarted and lost its
  // in-memory sessions), send the user back to the login screen.
  useEffect(() => {
    setUnauthenticatedHandler(() => {
      signOut('Your session has expired. Please log in again.');
    });
    return () => setUnauthenticatedHandler(null);
  }, [signOut]);

  const value = useMemo(
    () => ({ user, notice, signIn, signUp, signOut }),
    [user, notice, signIn, signUp, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
