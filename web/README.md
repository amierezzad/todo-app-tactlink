# Todo – Web

React + TypeScript web app (Vite, Tailwind CSS v4, Apollo Client, React Router).
Same features as the mobile app: sign up, log in, and a to-do list (create, view, complete, delete).

## Run locally

```bash
npm install
npm run dev
```

Opens on http://localhost:5173 and talks to the backend at `http://localhost:4000/`
(start it with `npm start` in `../backend`).

To use another API, copy `.env.example` to `.env.local` and set `VITE_API_URL`.

## Deploy (Vercel)

- Root directory: `web`
- Framework preset: Vite (build `npm run build`, output `dist`)
- Environment variable: `VITE_API_URL` = your deployed GraphQL API (must be HTTPS)
- `vercel.json` rewrites all routes to `index.html` so links like `/signup` work on refresh.
