import { useState, useEffect } from "react";
import Input from "../components/ui/input";
import Button from "../components/ui/Button";
import useLogin from "../hooks/useLogin";

const images = ["/images/1Imagen.jpg","/images/2Imagen.jpg","/images/3Imagen.jpg"];

export default function Login({ setUser, setToken }) {
  const [bgIndex, setBgIndex] = useState(0);
  const { email, setEmail, password, setPassword, loading, error, handleSubmit } = useLogin(setUser, setToken);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex justify-end items-center transition-all duration-1000"
      style={{
        backgroundImage: `url(${images[bgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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
            <label htmlFor="email" className="block mb-1 font-medium text-gray-300">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-300">Contraseña</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-black">
            {loading ? "Ingresando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
