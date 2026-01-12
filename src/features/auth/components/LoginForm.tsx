//Aqui se describe el codigo para la funcionalidad
import { useState } from "react";
import { login } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ email, password });

      localStorage.setItem("token", res.token);
      navigate("/dash");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="text-red-500">{error}</p>}

      <button type="submit">Iniciar sesión</button>
    </form>
  );
}



