import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

      // 🔥 LIMPIAMOS COMPLETAMENTE SESSIONSTORAGE
      sessionStorage.clear();

      // Guardamos SOLO token
      sessionStorage.setItem("token", data.token);
      setToken(data.token);

      // Decodificamos token
      const decoded = jwtDecode(data.token);

      const userData = {
        id_usuario: decoded.id_usuario,
        username: decoded.username,
        rol: decoded.rol,
      };

      // Guardamos SOLO el rol
      sessionStorage.setItem("rol", decoded.rol);

      // Guardamos info de usuario SOLO en memoria del estado
      setUser(userData);

      // Redirección por rol
      if (userData.rol === "admin") navigate("/AdminDashboard");
      else if (userData.rol === "almacenero") navigate("/AlmaceneroDashboard");
      else navigate("/TrabajadorDashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  };
}
