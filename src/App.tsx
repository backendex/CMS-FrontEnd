import { HashRouter, Routes, Route, Navigate } from "react-router-dom" // <-- 1. Cambiado a HashRouter
import LoginPage from "@/pages/auth/loginPage"
import ChangePasswordPage from "@/pages/auth/changePasswordPage"
import DashboardLayout from "@/pages/dashboard/dashboardLayout"
import DashboardHome from "@/pages/dashboard/dashboardHome"
import UsersPage from "@/pages/auth/userPages"
import RegisterPage from "@/pages/auth/registerPage"
import MediaPage from "@/pages/content/mediaPage"
import SitePage from "./pages/sitePage"
import TourPage from "@/pages/content/Tour/tourPage"
import AddTourPage from "./pages/content/Tour/addTourPage"
import TourEditPage  from "./pages/content/Tour/tourEditPage"
import BlogPage from "./pages/content/blog/blogPage"
import AddBlogPage  from "./pages/content/blog/addBlogPage"
import EditBlogPage  from "./pages/content/blog/editBlogPage"
import PageContentManager from "./pages/content/pageContentManager"
import { ProtectedRoute } from "@/features/auth"
import { SiteProvider } from "@/features/sites"
import { MediaProvider } from "@/features/media"
import { Toaster } from "@/components/ui/toaster";
import { ImageKitProvider } from "@imagekit/react"

export default function App() {
  const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || "public_test_key";
  const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/test";
  const authenticationEndpoint = `${import.meta.env.VITE_API_URL}/auth/imagekit`;

  return (
    <ImageKitProvider 
      urlEndpoint={urlEndpoint}
    >
      <HashRouter> {/* <-- 2. Cambiado de <BrowserRouter> a <HashRouter> */}
      <SiteProvider>
        <MediaProvider>
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
                <Route path="register" element={<RegisterPage />} />
                <Route path="mediaPage" element={<MediaPage />} />
                <Route path="tour" element={<TourPage/>} />
                <Route path="tour/new" element={<AddTourPage/>} />
                <Route path="tour/edit/:id" element={<TourEditPage/>} />
                <Route path="blog" element={<BlogPage/>} />
                <Route path="blog/new" element={<AddBlogPage/>}/>
                <Route path="blog/edit/:id" element={<EditBlogPage/>} />
                <Route path="contenido" element={<PageContentManager />} />
              </Route>
              <Route path="*" element={<Navigate to="/site" replace />} />
            </Route>
          </Routes>
          <Toaster />
        </MediaProvider>
      </SiteProvider>
    </HashRouter> {/* <-- 2. Cambiado de </BrowserRouter> a </HashRouter> */}
  </ImageKitProvider>
  );
}