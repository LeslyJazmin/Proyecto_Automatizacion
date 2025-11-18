import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TrabajadorDashboard from "./pages/TrabajadorDashboard";
import GInventario from "./pages/GInventario";
import Movimientos from "./pages/Movimientos";
import Reportes from "./pages/Reportes";
import { jwtDecode } from "jwt-decode";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar SOLO el token desde sessionStorage
  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);

      try {
        const decoded = jwtDecode(savedToken);
        setUser({
          id_usuario: decoded.id_usuario,
          username: decoded.username,
          rol: decoded.rol,
        });
      } catch (error) {
        console.error("Token inválido:", error);
      }
    }

    setLoading(false);
  }, []);

  // ⛔ YA NO GUARDAMOS USER EN SESSIONSTORAGE
  // ❌ useEffect eliminado

  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  if (!token) return <Login setToken={setToken} setUser={setUser} />;

  return (
    <Routes>
      {/* RUTAS ADMIN */}
      {user?.rol === "admin" && (
        <>
          <Route
            path="/AdminDashboard"
            element={<AdminDashboard user={user} setUser={setUser} setToken={setToken} />}
          />
          <Route path="/GInventario" element={<GInventario />} />
          <Route path="/Movimientos" element={<Movimientos />} />
          <Route path="/Reportes" element={<Reportes />} />
          <Route path="*" element={<Navigate to="/AdminDashboard" replace />} />
        </>
      )}

      {/* RUTAS TRABAJADOR */}
      {(user?.rol === "trabajador" || user?.rol === "user") && (
        <>
          <Route
            path="/TrabajadorDashboard"
            element={<TrabajadorDashboard user={user} setUser={setUser} setToken={setToken} />}
          />
          <Route path="*" element={<Navigate to="/TrabajadorDashboard" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
