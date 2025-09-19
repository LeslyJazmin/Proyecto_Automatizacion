import { useState, useEffect } from "react";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

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
  if (!token) {
    return <Login setToken={setToken} setUser={setUser} />;
  }

  // Dashboard según rol
  if (user?.rol === "admin") {
    return <AdminDashboard user={user} setUser={setUser} setToken={setToken} />;
  }

  if (user?.rol === "user") {
    return <div>Bienvenido {user.username}, esta es la vista de trabajador</div>;
  }

  // Vista por defecto
  return <div>Bienvenido {user?.username}</div>;
}

export default App;
