import axios from "axios";
const API_URL = "http://localhost:44351/api/auth"; // Cambia el puerto por el de tu backend

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const login = async (credentials: any) => {
  const response = await axios.post(`${API_URL}/login`, {
    Email: credentials.email,
    Password: credentials.password
  });

  const res = response.data;

  const token = res.token ?? res.Token;
  const mustChangePassword = res.mustChangePassword ?? res.MustChangePassword;

  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem(
      "mustChangePassword",
      String(mustChangePassword)
    );
  }

  return {
    token,
    mustChangePassword,
  };
};

