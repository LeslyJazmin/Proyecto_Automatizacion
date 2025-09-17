import { useState, useEffect } from "react";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ Recuperar token y usuario guardado al cargar la app
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // 🔐 Si no hay token, mostrar login
  if (!token) {
    return <Login setToken={setToken} setUser={setUser} />;
  }

  // 👤 Si el usuario es admin, mostrar dashboard
  if (user?.rol === "admin") {
    return <AdminDashboard />;
  }

  // 🏠 Vista por defecto para otros roles
  return <div>Bienvenido {user?.username}</div>;
}

export default App;
