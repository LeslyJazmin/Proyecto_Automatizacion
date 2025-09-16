import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const images = [
  "/images/1Imagen.jpg",
  "/images/2Imagen.jpg",
  "/images/3Imagen.jpg",
];

export default function Login({ setUser, setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
        setError(data?.message || "Error en el login");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
   <div
      className="min-h-screen flex justify-end items-center transition-all duration-1000"
      style={{
        backgroundImage: `url(${images[bgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Panel de login */}
      <div className="relative w-full max-w-sm h-[500px] mr-10 p-8 rounded-xl bg-black bg-opacity-70 overflow-hidden">
        {/* Borde animado */}
        <div className="absolute inset-0 rounded-xl pointer-events-none">
          <div className="w-full h-full border-4 border-orange-500 rounded-xl animate-spin-slow shadow-[0_0_20px_rgba(255,165,0,0.7)]"></div>
        </div>

        <h2 className="relative text-3xl font-bold mb-6 text-center text-orange-500 drop-shadow-lg z-10">
          Iniciar sesión
        </h2>

        {error && (
          <div className="relative bg-orange-600 text-white p-3 mb-4 rounded shadow-lg z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10 flex flex-col justify-between h-[350px]">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-black text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-300">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-600 rounded bg-black text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-orange-500 text-black font-semibold rounded hover:bg-orange-600
                       disabled:bg-gray-700 transition-colors duration-300"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}