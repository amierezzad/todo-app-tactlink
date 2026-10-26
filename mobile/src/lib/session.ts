import * as SecureStore from 'expo-secure-store';

import type { User } from './graphql';

// The login token lives in the device keychain / keystore, not plain storage.
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export type Session = { token: string; user: User };

export async function loadSession(): Promise<Session | null> {
  try {
    const [token, userJson] = await Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      SecureStore.getItemAsync(USER_KEY),
    ]);
    if (!token || !userJson) return null;
    return { token, user: JSON.parse(userJson) as User };
  } catch {
    return null;
  }
}

export async function saveSession(session: Session) {
  await Promise.all([
    SecureStore.setItemAsync(TOKEN_KEY, session.token),
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(session.user)),
  ]);
}

export async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
}
