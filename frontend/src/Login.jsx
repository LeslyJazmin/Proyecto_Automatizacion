import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setMsg(`✅ Login correcto. Token: ${data.token}`);
      } else {
        const err = await res.json();
        setMsg(`❌ ${err.message || "Credenciales incorrectas"}`);
      }
    } catch (error) {
      setMsg("⚠️ Error de conexión con el backend");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit" style={{ marginTop: "10px" }}>
          Entrar
        </button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

export default Login;
