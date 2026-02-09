import {Navigate, Outlet, useLocation} from "react-router-dom"
interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute ({children} : ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const mustChange = localStorage.getItem("mustChangePassword") === "true";
  const location = useLocation();

  console.log("Ruta actual:", location.pathname);
  console.log("¿Hay Token?:", !!token);
  console.log("¿Debe cambiar pass?:", mustChange);

  if(!token)
  {
    console.warn("Bloqueado por falta de token");
    return <Navigate to="/login"  state={{from: location}} replace />;
  }

  if(mustChange && location.pathname !== "/changePass") {
    return <Navigate to="/changePass" replace />;
  }

  if(!mustChange && location.pathname === "/changePass") {
    return <Navigate to="/site" replace />;
  }

  return children ? <>{children}</> : <Outlet />
}
