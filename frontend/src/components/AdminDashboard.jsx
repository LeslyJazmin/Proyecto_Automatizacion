import { useEffect, useState } from "react";
import { listUsers, createUser, updateUser, deleteUser } from "../api/users";

function AdminDashboard() {
  const [users, setUsers] = useState([]);       // Lista de usuarios
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState("");       // Errores si los hay

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    rol: "user"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await listUsers();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.warn("⚠️ La API no devolvió un array. Data:", data);
        setUsers([]); // Evita romper el map
      }
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
    } catch (err) {
      alert("Error al crear usuario");
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert("Error al eliminar usuario");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Usuarios</h2>

      {/* Estado de carga */}
      {loading && <p>Cargando usuarios...</p>}

      {/* Mensaje de error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Lista de usuarios */}
      {!loading && users.length > 0 ? (
        <ul>
          {users.map((u) => (
            <li key={u.id_usuario}>
              {u.username} - {u.rol}
              <button
                style={{ marginLeft: "10px", color: "red" }}
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

      <h3>Crear usuario</h3>
      <input
        value={newUser.username}
        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        placeholder="Nombre"
      />
      <input
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        placeholder="Email"
      />
      <input
        type="password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        placeholder="Contraseña"
      />
      <select
        value={newUser.rol}
        onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
      >
        <option value="user">Usuario</option>
        <option value="supervisor">Supervisor</option>
      </select>
      <button onClick={handleCreateUser}>Crear Usuario</button>
    </div>
  );
}

export default AdminDashboard;
