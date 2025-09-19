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

  useEffect(() => {
    if (!currentUser.id_usuario) return;
    fetchUsers();
  }, [currentUser.id_usuario]);

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

  async function createNewUser() {
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
         console.error("Error al crear usuario:", err);
        alert(err.message || "Error al crear usuario");
    } finally {
      setCreating(false);
    }
  }

  async function updateUserData(user) {
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

  async function deleteUserData(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  }

  return {
    users, loading, error, currentUser,
    modalOpen, setModalOpen,
    newUser, setNewUser, creating,
    createNewUser, updateUserData, deleteUserData
  };
}
