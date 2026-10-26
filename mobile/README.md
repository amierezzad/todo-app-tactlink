# Todo – Mobile

React Native app built with Expo (SDK 58), Expo Router, NativeWind v4 and Apollo Client.
Features: sign up, log in, and a to-do list (create, view, complete, delete), with offline viewing.

## Run locally

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go**. Your phone and computer must be on the same Wi-Fi.

## API

By default the app calls the backend on the computer running Expo, port 4000
(start it with `npm start` in `../backend`).

To use the live API instead, create `.env.local`:

```
EXPO_PUBLIC_API_URL=https://3-27-219-254.sslip.io/
```

Then restart with `npx expo start -c`.

## Folder structure

```
src/
  app/          screens (Expo Router): login, signup, index (task list), new-task
  components/   shared UI: text, button, input, icons
  lib/          API client, auth, GraphQL queries, session storage
  constants/    font files
assets/fonts/   Metropolis font
```

## Notes

- The login token is stored with `expo-secure-store`.
- The task list is cached with AsyncStorage, so saved tasks still show offline.
  Changes (add, complete, delete) need a connection.
