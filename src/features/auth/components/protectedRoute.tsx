import { Navigate, Outlet, useLocation } from "react-router-dom";
interface ProtectedRouteProps {
  children?: React.ReactNode; // El '?' lo hace opcional para que no de error
}
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  // Usamos JSON.parse o simplemente comparamos con el string exacto
  const mustChange = localStorage.getItem("mustChangePassword") === "true";
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si debe cambiar contraseña y NO está en la página de cambio
  if (mustChange && location.pathname !== "/changePass") {
    return <Navigate to="/changePass" replace />;
  }
  
  // Si NO debe cambiar contraseña pero intenta entrar a /changePass (opcional)
  if (!mustChange && location.pathname === "/changePass") {
    return <Navigate to="/site" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
