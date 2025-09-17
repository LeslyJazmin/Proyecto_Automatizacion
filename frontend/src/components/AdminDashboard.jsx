import { useEffect, useState } from "react";
import { listUsers, createUser, deleteUser } from "../api/users";
import { Package, BarChart3, LogOut, Building2, Info } from "lucide-react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    rol: "user",
  });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");
      const data = await listUsers();
      if (Array.isArray(data)) setUsers(data);
      else setUsers([]);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("No se pudieron cargar los usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser() {
    try {
      await createUser(newUser);
      setNewUser({ username: "", email: "", password: "", rol: "user" });
      fetchUsers();
    } catch {
      alert("Error al crear usuario");
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch {
      alert("Error al eliminar usuario");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 🟧 PANEL IZQUIERDO */}
      <div className="w-72 bg-white shadow-xl flex flex-col">
        {/* 🔹 Encabezado Empresa */}
        <div className="p-6 border-b border-gray-200 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <Building2 className="text-orange-500 w-8 h-8" />
            <h2 className="text-xl font-bold text-gray-800">Mi Empresa</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Sistema de Gestión de Inventario
          </p>
          {/* 🖼️ Logo de la empresa (MUY GRANDE, sin borde ni contenedor) */}
          <img
            src="/images/GT.png"
            alt="Logo de la empresa"
            className="mx-auto w-48 h-48 object-contain"
          />
        </div>

        {/* 🔹 Navegación + Cerrar Sesión */}
        <div className="flex-1 p-4 space-y-4">
          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-orange-100 transition">
            <Info className="text-orange-500" />
            <span className="font-medium text-gray-700">
              Información de la Empresa
            </span>
          </button>

          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-orange-100 transition">
            <Package className="text-orange-500" />
            <span className="font-medium text-gray-700">
              Registro e Inventario
            </span>
          </button>

          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-orange-100 transition">
            <BarChart3 className="text-orange-500" />
            <span className="font-medium text-gray-700">Reportes</span>
          </button>

          {/* 🔴 Botón de Cerrar Sesión ahora aquí */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-100 text-red-600 transition"
          >
            <LogOut />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* 🟦 PANEL DERECHO */}
      <div className="flex-1 p-8">
        {/* Bienvenida */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            👋 ¡Bienvenido, {currentUser.username || "Administrador"}!
          </h1>
          <p className="text-gray-600">Rol: {currentUser.rol || "admin"}</p>
        </div>

        {/* Formulario de creación de usuario */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Crear Nuevo Usuario
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              placeholder="Nombre"
              className="p-2 border rounded"
            />
            <input
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Email"
              className="p-2 border rounded"
            />
            <input
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              placeholder="Contraseña"
              className="p-2 border rounded"
            />
            <select
              value={newUser.rol}
              onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="user">Usuario</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button
            onClick={handleCreateUser}
            className="mt-4 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
          >
            Crear Usuario
          </button>
        </div>

        {/* Lista de usuarios */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Lista de Usuarios
        </h1>

        {loading && <p className="text-gray-600">Cargando usuarios...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && users.length > 0 ? (
          <ul className="space-y-3">
            {users.map((u) => (
              <li
                key={u.id_usuario}
                className="bg-white shadow rounded p-3 flex justify-between items-center"
              >
                <span>
                  <strong>{u.username}</strong> — {u.rol}
                </span>
                <button
                  className="text-red-600 hover:text-red-800 font-semibold"
                  onClick={() => handleDeleteUser(u.id_usuario)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No hay usuarios registrados.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
