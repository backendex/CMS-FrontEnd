import axios from 'axios';

export const api = axios.create({
  // Asegúrate de tener VITE_API_URL=https://localhost:44351/api en tu archivo .env
  baseURL: import.meta.env.VITE_API_URL, 
});

// 1. EL ENVÍO: Añade el token a todas las peticiones salientes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. LA RESPUESTA: Maneja errores globales (como el 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el backend responde 401 (No autorizado)
    if (error.response?.status === 401) {
      console.warn("Sesión expirada o inválida. Redirigiendo...");
      localStorage.removeItem("token");
      localStorage.removeItem("mustChangePassword"); // Limpia todo el rastro
      
      // Solo redirigimos si no estamos ya en la página de login para evitar bucles
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;