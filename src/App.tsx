import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/auth/loginPage"
import ChangePasswordPage from "@/pages/auth/changePasswordPage"
import DashboardLayout from "@/pages/dashboard/dashboardLayout"
import DashboardHome from "@/pages/dashboard/dashboardHome"
import UsersPage from "@/pages/auth/userPages"
import  {ProtectedRoute}  from "@/features/auth/components/protectedRoute"
import RegisterPage from "@/pages/auth/registerPage"
import Register from "@/pages/auth/registerPage"
import MediaPage from "@/pages/content/mediaPage"
import { Toaster } from "@/components/ui/toaster";
import SitePage from "./pages/sitePage"
import { SiteProvider } from "./features/sites/components/siteContext"
import {TourPage} from "@/pages/content/Tour/tourPage"
import AddTourPage from "./pages/content/Tour/addTourPage"
import { TourEditPage } from "./pages/content/Tour/tourEditPage"

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/changePass" element={<ChangePasswordPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/site" element={<SitePage />} />
            <Route path="/dash/:siteId" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/new" element={<RegisterPage />} />
              <Route path="register" element={<Register />} />
              <Route path="mediaPage" element={<MediaPage />} />
              <Route path="tour" element={<TourPage/>} />
              <Route path="tour/new" element={<AddTourPage/>} />
              <Route path="tour/edit" element={<TourEditPage/>} />
            </Route>
            <Route path="*" element={<Navigate to="/site" replace />} />
          </Route>
        </Routes>
        <Toaster />
      </SiteProvider>
    </BrowserRouter>
  );
}

