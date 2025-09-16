import { useState, useEffect } from "react";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  // 🔥 Siempre forzar login al inicio
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  if (!token) {
    return <Login setToken={setToken} setUser={setUser} />;
  }

  if (user?.rol === "admin") {
    return <AdminDashboard />;
  }

  return <div>Bienvenido {user?.username}</div>;
}

export default App;
