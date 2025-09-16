import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Mensaje de error devuelto por el servidor
        setError(data?.message || "Error en el login");
        setLoading(false);
        return;
      }

      // Guardar token y user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Actualizar estado global
      setToken(data.token);
      setUser(data.user);

      // Redirigir al dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20 }}>
      <h2>Iniciar sesión</h2>

      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="email">Email</label><br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@ejemplo.com"
            required
            style={{ width: "100%", padding: 8 }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="password">Contraseña</label><br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            style={{ width: "100%", padding: 8 }}
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
