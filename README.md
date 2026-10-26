# Todo App – Tactlink Junior Mobile Developer Assessment

A simple to-do app with a shared GraphQL backend, a mobile app and a web app.
Users can sign up, log in, and create, view, complete and delete their own tasks.

| Part    | Tech                                        | Folder     |
| ------- | ------------------------------------------- | ---------- |
| Backend | Node.js, Apollo Server (GraphQL)            | `backend/` |
| Mobile  | React Native, Expo, Expo Router, NativeWind | `mobile/`  |
| Web     | React, Vite, Tailwind CSS, React Router     | `web/`     |

**Live links**

- Web app: https://todo-app-tactlink.vercel.app/login
- API: https://3-27-219-254.sslip.io/ (AWS EC2)

---

## Setup

You need **Node.js 20+**. For the mobile app, install **Expo Go** on your phone.

### 1. Backend

```bash
cd backend
npm install
npm start
```

Runs on http://localhost:4000. Open it in a browser to try queries in the Apollo Sandbox.

### 2. Mobile

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go. Your phone and computer must be on the same Wi-Fi.

By default the app uses the backend on the same computer that runs Expo (port 4000).
To use the live API instead, create `mobile/.env.local`:

```
EXPO_PUBLIC_API_URL=https://3-27-219-254.sslip.io/
```

### 3. Web

```bash
cd web
npm install
npm run dev
```

Opens on http://localhost:5173 and uses `http://localhost:4000/` by default.
To use another API, create `web/.env.local` with `VITE_API_URL=...`.

**Tip:** data is kept in memory, so it resets when the backend restarts. Just sign up again.

---

## Architecture decisions

**One API for both apps.** The mobile and web apps call the same GraphQL API and use the same
queries, so the logic only lives in one place.

**Backend**

- Apollo Server with an in-memory store. The brief allows it, and it keeps the backend small.
  The trade-off: data is lost on restart.
- Dummy auth: signing up or logging in returns a random token. The apps send it as
  `Authorization: Bearer <token>`, and every task query only returns that user's tasks.
- Passwords are stored as plain text. That's fine for a demo, but not for real use.

**Mobile**

- Expo Router for navigation. It is built on React Navigation and gives file-based routes.
  Logged-out users can only see Log in / Sign up; logged-in users can only see their tasks.
- NativeWind v4 (Tailwind for React Native) for styling. I first tried gluestack-ui with NativeWind v5,
  but those versions are still in preview and crashed on Expo SDK 58, so I moved to the stable version.
- Apollo Client for the API. The login token is saved in `expo-secure-store`.
- **Offline (bonus):** the task list is cached on the phone, so saved tasks still show with no
  connection. Adding, completing or deleting tasks still needs the internet.

**Web**

- Vite + React + Tailwind CSS v4, with React Router for pages.
- Same features and design as mobile. Responsive: full-screen on phones, centered layout on desktop.
- The login token is saved in `localStorage`. Deployed on Vercel.

**Design**

- Minimal black-and-white design with the Metropolis font, the same on mobile and web.

**Deployment (AWS)**

- The backend runs on an **EC2** t3.micro (Ubuntu) in the Sydney region.
- `pm2` keeps the server running and restarts it after a crash or reboot.
- Caddy adds HTTPS (free certificate) using an `sslip.io` address. The web app needs HTTPS to call the API.
- Why EC2 and not Lambda: Lambda starts and stops copies of the server, so in-memory data
  would be lost between requests. EC2 keeps one server running.

**What I would add next:** a real database, hashed passwords with proper tokens (JWT),
offline editing that syncs later, and tests.

---

## Time taken

About **3.5 hours** in total.

## Use of AI

I used Claude (an AI assistant) during this project, to help write and debug code and to set up
the AWS deployment. The product and design decisions are my own: the features, the UI design,
the tech choices and the overall structure.
