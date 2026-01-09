import axios from 'axios';

// Creamos la instancia personalizada
export const api = axios.create({
  // ⚠️ IMPORTANTE: Ajusta este puerto al que use tu API de .NET (ej. 5000, 7001, 44300)
  baseURL: 'https://localhost:44351/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el Token automáticamente en el futuro
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});