import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Sesión expirada o inválida. Redirigiendo...");
      localStorage.removeItem("token");
      localStorage.removeItem("mustChangePassword"); 
      
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    if (error.response?.status === 403) {
      console.error("No tienes permisos para realizar esta acción (403).");
    }
    return Promise.reject(error);
  }
);

export default api;