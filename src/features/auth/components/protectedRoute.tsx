import { Navigate, useLocation } from "react-router-dom";
interface ProtectedRouteProps {
  children: React.ReactNode;
}
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const mustChange = localStorage.getItem("mustChangePassword") === "true";
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (mustChange) {
    return <Navigate to="/changePass" replace />;
  }

  return <>{children}</>;
}
