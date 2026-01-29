import { Navigate, Outlet, useLocation } from "react-router-dom";
interface ProtectedRouteProps {
  children?: React.ReactNode; // El '?' lo hace opcional para que no de error
}
// export function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const token = localStorage.getItem("token");
//   const mustChange = localStorage.getItem("mustChangePassword") === "true";
//   const location = useLocation();

//   // PRIORIDAD 1: Si no hay token, SIEMPRE al login.
//   if (!token) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // PRIORIDAD 2: Si tiene token pero debe cambiar contraseña.
//   // Añadimos la protección para no redirigir si YA está en /changePass
//   // En tu archivo ProtectedRoute.tsx
// if (mustChange && location.pathname !== "/changePass") {
//   return <Navigate to="/changePass" replace />;
// }

//   return <>{children}</>;
// }

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
    return <Navigate to="/dash" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
