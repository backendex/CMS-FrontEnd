import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login";
// import { DashboardLayout } from "./components/layout/DashboardLayout";
import UserManagementPage from "./pages/userManagementPage";

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          {/* <Route path="/dashboard" element={<div>Resumen del CMS</div>} /> */}
          {/* Si entras a /admin, te redirige a usuarios */}
          <Route path="/" element={<Navigate to="/users" />} />


        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  ); 

}
export default App;