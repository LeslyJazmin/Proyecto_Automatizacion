import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TrabajadorDashboard from "./pages/TrabajadorDashboard";
import GInventario from "./pages/GInventario";
import TInventario from "./pages/TInventario";
import Movimientos from "./pages/Movimientos";
import Reportes from "./pages/Reportes";
import TReportes from "./pages/TReportes";
import { jwtDecode } from "jwt-decode";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="text-center mt-10">Cargando...</div>;
  if (!token) return <Login setToken={setToken} setUser={setUser} />;

  return (
    <Routes>
      {/* RUTAS ADMIN */}
      {user?.rol === "admin" && (
        <>
          <Route
            path="/AdminDashboard"
            element={
              <AdminDashboard user={user} setUser={setUser} setToken={setToken} />
            }
          />
          <Route
            path="/GInventario"
            element={<GInventario user={user} setUser={setUser} setToken={setToken} />}
          />
          <Route
            path="/Movimientos"
            element={<Movimientos user={user} setUser={setUser} setToken={setToken} />}
          />
          <Route
            path="/Reportes"
            element={<Reportes user={user} setUser={setUser} setToken={setToken} />}
          />
          <Route path="*" element={<Navigate to="/AdminDashboard" replace />} />
        </>
      )}

      {/* RUTAS TRABAJADOR */}
      {(user?.rol === "trabajador" || user?.rol === "user") && (
        <>
          <Route
            path="/trabajador-dashboard"
            element={
              <TrabajadorDashboard user={user} setUser={setUser} setToken={setToken} />
            }
          />
          <Route
            path="/tinventario"
            element={<TInventario user={user} setUser={setUser} setToken={setToken} />}
          />
          <Route
            path="/treportes"
            element={<TReportes user={user} setUser={setUser} setToken={setToken} />}
          />
          <Route path="*" element={<Navigate to="/trabajador-dashboard" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
