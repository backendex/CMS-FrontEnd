import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  // Convertimos el string de localStorage a booleano
  const mustChange = localStorage.getItem("mustChangePassword") === "true";
  const location = useLocation();

  // 1. Si no hay token, no está logueado -> Al Login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Si tiene token pero DEBE cambiar contraseña -> A la vista de cambio
  // Evitamos un bucle infinito verificando que no estemos ya en esa ruta
  if (mustChange && location.pathname !== "/changePass") {
    return <Navigate to="/changePass" replace />;
  }

  // 3. Si todo está bien, renderiza el Dashboard (o la ruta hija)
  return <>{children}</>;
}