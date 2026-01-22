import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/loginPage"
import ChangePasswordPage from "@/pages/changePasswordPage"
import DashboardLayout from "@/pages/dashboard/dashboardLayout"
import DashboardHome from "@/pages/dashboard/dashboardHome"
import UsersPage from "@/pages/userPages"
import  {ProtectedRoute}  from "@/features/auth/components/protectedRoute"
import RegisterPage from "@/pages/registerPage"
import Register from "@/pages/registerPage"
import PostForm from "@/features/post/components/postForm"

export default function App() {
  return (
    <BrowserRouter>
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<ProtectedRoute />}>
    <Route path="/changePass" element={<ChangePasswordPage />} />
    <Route element={<DashboardLayout />}>
      <Route path="/dash" element={<DashboardHome />} />s
      <Route path="/postForm" element={<PostForm/>} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/new" element={<RegisterPage />} />
      <Route path="/register" element={<Register />} />
    </Route>
     <Route path="*" element={<Navigate to="/login" replace />} />
  </Route>
</Routes>
</BrowserRouter>
  )
}


