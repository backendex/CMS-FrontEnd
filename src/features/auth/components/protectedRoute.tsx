// routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom"

export function ProtectedRoute() {
  const token = localStorage.getItem("token")
  const mustChangePassword =
    localStorage.getItem("mustChangePassword") === "true"

  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  // 🔥 OBLIGAR cambio de contraseña
  if (
    mustChangePassword &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />
  }

  return <Outlet />
}
