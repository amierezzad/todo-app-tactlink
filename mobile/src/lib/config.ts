import Constants from 'expo-constants';

// Where the GraphQL API lives.
// 1. EXPO_PUBLIC_API_URL (set it in .env.local, e.g. your deployed URL), or
// 2. in development, the same computer that runs Metro, on port 4000.
//    (Expo Go already knows that computer's LAN address, so no setup needed.)
function resolveApiUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv) return fromEnv;

  const hostUri = Constants.expoConfig?.hostUri; // e.g. "192.168.68.108:8081"
  const host = hostUri?.split(':')[0];
  if (host) return `http://${host}:4000/`;

  return 'http://localhost:4000/';
}

export const API_URL = resolveApiUrl();
