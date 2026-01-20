import axios from "axios";

const API_URL = "http://localhost:44351/api/auth"; // Cambia el puerto por el de tu backend

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const login = async (credentials: any) => {
  // 1. Llamada real al backend de C#
  // Nota: Usamos Email y Password con mayúscula inicial para coincidir con tu LoginDto
  const response = await axios.post(`${API_URL}/login`, {
    Email: credentials.email,
    Password: credentials.password
  });

  const res = response.data;

  // 2. Persistencia en el navegador
  if (res.token) {
    localStorage.setItem("token", res.token);
    // Guardamos el flag que viene de user.IsTemporaryPassword en el backend
    localStorage.setItem("mustChangePassword", String(res.mustChangePassword));
  }

  return res;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("mustChangePassword");
  window.location.href = "/login"; 
};