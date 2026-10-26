import '../../global.css';

import { ApolloProvider } from '@apollo/client';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { fontAssets } from '@/constants/fonts';
import { client, persistor, setAuthToken } from '@/lib/apollo';
import { AuthProvider, useAuth } from '@/lib/auth';
import { loadSession, type Session } from '@/lib/session';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}>
      {/* Only reachable when logged out */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
      </Stack.Protected>

      {/* Only reachable when logged in */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="index" />
        <Stack.Screen name="new-task" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  // Restore the saved login and the offline task cache before showing anything.
  useEffect(() => {
    (async () => {
      const [saved] = await Promise.all([loadSession(), persistor.restore().catch(() => {})]);
      setAuthToken(saved?.token ?? null);
      setSession(saved);
    })();
  }, []);

  const ready = (fontsLoaded || !!fontError) && session !== undefined;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ApolloProvider client={client}>
      <AuthProvider initialSession={session}>
        <StatusBar style="dark" />
        <RootNavigator />
      </AuthProvider>
    </ApolloProvider>
  );
}
