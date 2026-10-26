import { Navigate, Outlet, Route, Routes } from 'react-router'

import { useAuth } from './lib/auth'
import { LoginPage } from './pages/login-page'
import { NewTaskPage } from './pages/new-task-page'
import { SignupPage } from './pages/signup-page'
import { TasksPage } from './pages/tasks-page'

// Only for logged-in users; everyone else goes to /login.
function RequireAuth() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

// Only for logged-out users; logged-in users go to their tasks.
function GuestOnly() {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/" element={<TasksPage />} />
        <Route path="/new" element={<NewTaskPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
