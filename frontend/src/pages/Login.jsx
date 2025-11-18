import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Input from "../components/ui/input";
import Button from "@mui/material/Button";
import useLogin from "../hooks/useLogin";

const images = ["/images/1Imagen.jpg", "/images/2Imagen.jpg", "/images/3Imagen.jpg"];

export default function Login({ setUser, setToken }) {
  const [bgIndex, setBgIndex] = useState(0);
  const { email, setEmail, password, setPassword, loading, error, handleSubmit } =
    useLogin(setUser, setToken);

  // Cambio de fondo
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex justify-center items-center relative"
      style={{
        backgroundImage: `url(${images[bgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1s ease-in-out",
      }}
    >
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md mx-4 p-8 rounded-3xl bg-white shadow-2xl flex flex-col items-center"
      >
        {/* Logo */}
        <div className="absolute -top-16 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img src="/images/GT1.png" alt="Logo" className="w-full h-full object-cover" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mt-16 mb-6">Iniciar Sesión</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded-md w-full text-center text-sm border border-red-300">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo"
            disabled={loading}
            className="p-3 rounded-full bg-gray-100 border border-gray-300 focus:border-red-700 focus:ring-2 focus:ring-red-400 text-gray-700"
          />

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            disabled={loading}
            className="p-3 rounded-full bg-gray-100 border border-gray-300 focus:border-red-700 focus:ring-2 focus:ring-red-400 text-gray-700"
          />

          <Button
            type="submit"
            disabled={loading}
            sx={{
              borderRadius: "9999px",
              fontWeight: "bold",
              fontSize: "18px",
              background: "linear-gradient(90deg,#7f1d1d,#b91c1c)",
              color: "#fff",
              py: 1.8,
              boxShadow: "0 4px 10px rgba(185,28,28,0.4)",
              "&:hover": { background: "linear-gradient(90deg,#991b1b,#dc2626)" },
            }}
          >
            {loading ? "INGRESANDO..." : "LOGIN"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
