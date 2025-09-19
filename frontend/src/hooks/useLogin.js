import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function useLogin(setUser, setToken) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    setLoading(true);
    try {
      // Login
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Error en el login");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

      // Verificar usuario
      const userRes = await fetch(`${API_BASE}/api/users/${data.user.id_usuario}`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      if (!userRes.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("El usuario ya no existe");
        setLoading(false);
        return;
      }

      const userData = await userRes.json();
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(data.token);
      setUser(userData);

      // Redirigir según rol
      if (userData.rol === "admin") navigate("/admin-dashboard");
      else if (userData.rol === "user") navigate("/trabajador-dashboard");
      else navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    loading, error,
    handleSubmit
  };
}
