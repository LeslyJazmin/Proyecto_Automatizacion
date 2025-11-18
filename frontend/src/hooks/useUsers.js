import { useState, useEffect } from "react";
import { listUsers, createUser, updateUser, deleteUser } from "../api/users";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ username: "", celular: "", email: "", password: "", rol: "user" });
  const [creating, setCreating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [showEmailUpdatedModal, setShowEmailUpdatedModal] = useState(false); // 👈 nuevo estado

  const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");

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

  async function updateUserData(updatedUser) {
    if (!updatedUser.username || !updatedUser.email) {
      return alert("Nombre y email son obligatorios");
    }

    try {
      const oldUser = users.find((u) => u.id_usuario === updatedUser.id_usuario);

      await updateUser(updatedUser.id_usuario, {
        username: updatedUser.username,
        celular: updatedUser.celular,
        email: updatedUser.email,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id_usuario === updatedUser.id_usuario ? updatedUser : user
        )
      );

      // ✅ Si el usuario cambió su propio email → mostrar modal en lugar de alert()
      if (oldUser && oldUser.email !== updatedUser.email && currentUser.id_usuario === updatedUser.id_usuario) {
        setShowEmailUpdatedModal(true); // 👈 abre modal
      }

    } catch (err) {
      console.error(err);
      alert("Error al modificar usuario");
    }
  }

async function deleteUserData(id) {
  try {
    await deleteUser(id);
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
    showEmailUpdatedModal,
    setShowEmailUpdatedModal,
  };
}
