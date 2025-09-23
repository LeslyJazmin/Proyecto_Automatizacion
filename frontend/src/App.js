import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import GInventario from "./pages/GInventario";
import Reportes from "./pages/Reportes";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Recuperar token y usuario guardado al cargar la app
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Si no hay token, mostrar login
  if (!token) return <Login setToken={setToken} setUser={setUser} />;

  return (
    <Routes>
      {user?.rol === "admin" && (
        <>
          <Route
            path="/AdminDashboard"
            element={
              <AdminDashboard
                user={user}
                setUser={setUser}
                setToken={setToken} // 🔹 Importante para manejar logout desde Dashboard
              />
            }
          />
          <Route path="/GInventario" element={<GInventario />} />
          <Route path="/Reportes" element={<Reportes />} />
          {/* Redirigir cualquier ruta desconocida al dashboard */}
          <Route path="*" element={<Navigate to="/AdminDashboard" replace />} />
        </>
      )}

      {user?.rol === "user" && (
        <Route
          path="*"
          element={<div>Bienvenido {user.username}, esta es la vista de trabajador</div>}
        />
      )}
    </Routes>
  );
}

export default App;
