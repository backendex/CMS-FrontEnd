import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/loginPage"
import ChangePasswordPage from "@/pages/changePasswordPage"
import DashboardLayout from "@/pages/dashboard/dashboardLayout"
import DashboardHome from "@/pages/dashboard/dashboardHome"
import UsersPage from "@/pages/userPages"
import  {ProtectedRoute}  from "@/features/auth/components/protectedRoute"
import RegisterPage from "@/pages/registerPage"
import Register from "@/pages/registerPage"
import MediaPage from "@/pages/content/mediaPage"
import { Toaster } from "@/components/ui/toaster";
import {ToursTable} from "./features/tours/components/tourTable"
import SitePage from "./pages/sitePage"
export default function App() {
  return (
    <BrowserRouter>
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/" element={<LoginPage />} />
  <Route path="/changePass" element={<ChangePasswordPage/>} />
  <Route path="/site" element = {<SitePage/>} />
  <Route element={<ProtectedRoute/>}>
    <Route element={<DashboardLayout />}>
     <Route path="/dash" element={<DashboardHome />} />
     <Route path="/users" element={<UsersPage />} />
     <Route path="/users/new" element={<RegisterPage />} />
     <Route path="/register" element={<Register />} />
     <Route path="/mediaPage" element={<MediaPage/>} />
     <Route path="/tour" element={<ToursTable/>} />
    </Route>
     <Route path="*" element={<Navigate to="/login" replace />} />
  </Route>
</Routes>
<Toaster />
</BrowserRouter>
  )
}
