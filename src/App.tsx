import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/loginPage"
import ChangePasswordPage from "@/pages/changePasswordPage"
import DashboardLayout from "@/pages/dashboard/dashboardLayout"
import DashboardHome from "@/pages/dashboard/dashboardHome"
import UsersPage from "@/pages/userPages"
import  {ProtectedRoute}  from "@/features/auth/components/protectedRoute"
import RegisterPage from "@/pages/registerPage"
import Register from "@/pages/registerPage"
import CreatePostPage   from "@/pages/post/postCreatePage"
import {CMSContentEditor} from "@/pages/cmsContentPage"
import MediaPage from "@/pages/dashboard/mediaPage"
export default function App() {
  return (
    <BrowserRouter>
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/changePass" element={<ChangePasswordPage />} />
  <Route element={<ProtectedRoute children={""}/>}>
    <Route element={<DashboardLayout />}>
     <Route path="/dash" element={<DashboardHome />} />
     <Route path="/dash/post/create" element={<CreatePostPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/users/new" element={<RegisterPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/content" element={<CMSContentEditor/>} />
      <Route path="/mediaPage" element={<MediaPage/>} />
    </Route>
     <Route path="*" element={<Navigate to="/login" replace />} />
  </Route>
</Routes>
</BrowserRouter>
  )
}


