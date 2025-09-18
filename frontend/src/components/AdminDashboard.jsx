import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listUsers, createUser, deleteUser, updateUser } from "../api/users";
import { Package, BarChart3, LogOut, Building2, Info, UserPlus, X } from "lucide-react";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ username: "", celular: "", email: "", password: "", rol: "user" });
  const [creating, setCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Verifica si el usuario sigue activo
  useEffect(() => {
    if (!currentUser.id_usuario) {
      navigate("/login");
      return;
    }

    const checkUser = async () => {
      try {
        const data = await listUsers();
        const exists = Array.isArray(data) && data.some(u => u.id_usuario === currentUser.id_usuario);
        if (!exists) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          fetchUsers();
        }
      } catch (err) {
        console.error("Error al verificar usuario:", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    checkUser();
  }, [currentUser.id_usuario, navigate]);

  // Obtener lista de usuarios
  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");
      const data = await listUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }

  // Crear nuevo trabajador
  async function handleCreateUser() {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert("Todos los campos son obligatorios");
      return;
    }
    try {
      setCreating(true);
      await createUser({ ...newUser, rol: "user" });
      setNewUser({ username: "", celular: "", email: "", password: "", rol: "user" });
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error al crear usuario");
    } finally {
      setCreating(false);
    }
  }

  // Modificar usuario
  async function handleEditUser(user) {
    const newName = prompt("Nuevo nombre:", user.username);
    const newCelular = prompt("Nuevo celular:", user.celular);
    const newEmail = prompt("Nuevo email:", user.email);

    if (!newName || !newEmail) return alert("Nombre y email son obligatorios");

    try {
      await updateUser(user.id_usuario, { username: newName, celular: newCelular, email: newEmail });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error al modificar usuario");
    }
  }

  // Eliminar usuario
  async function handleDeleteUser(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  }

  // Cerrar sesión
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* PANEL IZQUIERDO */}
      <div className="w-72 bg-white shadow-xl flex flex-col">
        <div className="p-6 border-b border-gray-200 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <Building2 className="text-orange-500 w-8 h-8" />
            <h2 className="text-xl font-bold text-gray-800">Mi Empresa</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Sistema de Gestión de Inventario</p>
          <img src="/images/GT.png" alt="Logo" className="mx-auto w-48 h-48 object-contain" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-orange-100 transition">
            <Info className="text-orange-500" />
            <span className="font-medium text-gray-700">Información de la Empresa</span>
          </button>
          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-orange-100 transition">
            <Package className="text-orange-500" />
            <span className="font-medium text-gray-700">Registro e Inventario</span>
          </button>
          <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-orange-100 transition">
            <BarChart3 className="text-orange-500" />
            <span className="font-medium text-gray-700">Reportes</span>
          </button>
          <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-100 text-red-600 transition">
            <LogOut />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="flex-1 p-8">
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">👋 ¡Bienvenido, {currentUser.username || "Administrador"}!</h1>
          <p className="text-gray-600">Rol: {currentUser.rol || "admin"}</p>
        </div>

        {/* Botón Crear Trabajador */}
        {currentUser.rol === "admin" && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-6"
          >
            <UserPlus />
            <span>Crear Trabajador</span>
          </button>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                <X />
              </button>
              <h3 className="text-xl font-semibold mb-4">Crear Nuevo Trabajador</h3>
              <div className="space-y-3">
                <input
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Nombre"
                  className="w-full p-2 border rounded"
                />
                <input
                  value={newUser.celular}
                  onChange={(e) => setNewUser({ ...newUser, celular: e.target.value })}
                  placeholder="Celular"
                  className="w-full p-2 border rounded"
                />
                <input
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Contraseña"
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleCreateUser}
                  disabled={creating}
                  className={`w-full py-2 px-4 rounded text-white ${creating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  {creating ? "Creando..." : "Crear Trabajador"}
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Lista de Usuarios</h1>
        {loading && <p className="text-gray-600">Cargando usuarios...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && users.length > 0 ? (
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u.id_usuario} className="bg-white shadow rounded p-3 flex justify-between items-center">
                <span><strong>{u.username}</strong> — {u.rol}</span>
                {currentUser.rol === "admin" && (
                  <div className="space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                      onClick={() => handleEditUser(u)}
                    >
                      Modificar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 font-semibold"
                      onClick={() => handleDeleteUser(u.id_usuario)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (!loading && <p>No hay usuarios registrados.</p>)}
      </div>
    </div>
  );
}

export default AdminDashboard;
