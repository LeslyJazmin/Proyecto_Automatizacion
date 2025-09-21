import { useState, useEffect } from "react";
import { listUsers, createUser, updateUser, deleteUser } from "../api/users";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ username: "", celular: "", email: "", password: "", rol: "user" });
  const [creating, setCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Carga inicial de usuarios
  useEffect(() => {
    if (!currentUser.id_usuario) return;
    fetchUsers();
  }, [currentUser.id_usuario]);

  // --- Fetch usuarios ---
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

  // --- Crear usuario ---
  async function createNewUser() {
    if (!newUser.username || !newUser.email || !newUser.password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      setCreating(true);
      await createUser({ ...newUser, rol: "user" });
      // Reset del formulario
      setNewUser({ username: "", celular: "", email: "", password: "", rol: "user" });
      setModalOpen(false);
      fetchUsers(); // Refresca la lista
    } catch (err) {
      console.error("Error al crear usuario:", err);
      alert(err.message || "Error al crear usuario");
    } finally {
      setCreating(false);
    }
  }

  // --- Actualizar usuario desde modal ---
  async function updateUserData(updatedUser) {
    if (!updatedUser.username || !updatedUser.email) {
      return alert("Nombre y email son obligatorios");
    }

    try {
      // Llamada a la API
      await updateUser(updatedUser.id_usuario, {
        username: updatedUser.username,
        celular: updatedUser.celular,
        email: updatedUser.email,
      });

      // Actualiza localmente la lista sin recargar
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id_usuario === updatedUser.id_usuario ? updatedUser : user
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error al modificar usuario");
    }
  }

  // --- Eliminar usuario ---
  async function deleteUserData(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      await deleteUser(id);
      // Actualiza la lista localmente
      setUsers((prevUsers) => prevUsers.filter((user) => user.id_usuario !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  }

  return {
    users,
    loading,
    error,
    currentUser,
    modalOpen,
    setModalOpen,
    newUser,
    setNewUser,
    creating,
    createNewUser,
    updateUserData,
    deleteUserData,
  };
}
