import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Modal from "../components/ui/Modal";
import UserList from "../components/UserList";
import CreateUserModal from "../components/CreateUserModal";
import InfoEmpresa from "../components/InfoEmpresa";
import useUsers from "../hooks/useUsers";
import { UserPlus } from "lucide-react";

function CreateUserButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold py-2 px-5 rounded-lg shadow-lg hover:from-yellow-600 hover:to-orange-700 transition-transform duration-300 transform hover:scale-105"
    >
      <UserPlus className="w-5 h-5 text-white" />
      <span>Crear Trabajador</span>
    </button>
  );
}

export default function AdminDashboard() {
  const location = useLocation();
  const {
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
  } = useUsers();

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState({ open: false, userId: null });
  const [tokenExpiring, setTokenExpiring] = useState(false);

  // --- Manejo logout ---
  function handleLogoutConfirm() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  // --- Manejo email actualizado ---
  function handleEmailUpdatedConfirm() {
    setShowEmailUpdatedModal(false);
    handleLogoutConfirm();
  }

  // --- Modal eliminar usuario ---
  function handleDeleteUserConfirm() {
    deleteUserData(deleteUserModal.userId);
    setDeleteUserModal({ open: false, userId: null });
  }

  // --- Manejo token próximo a expirar ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { jwtDecode } = require("jwt-decode");
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - currentTime;

      if (timeLeft <= 180) setTokenExpiring(true);

      const timer = setTimeout(() => setTokenExpiring(true), (timeLeft - 180) * 1000);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Token inválido:", err);
      handleLogoutConfirm();
    }
  }, []);

  // Determinar qué botón debe estar activo en el Sidebar
  let sidebarActive = "empresa";
  if (location.pathname === "/GInventario") sidebarActive = "inventario";
  else if (location.pathname === "/Reportes") sidebarActive = "reportes";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={() => setLogoutModalOpen(true)} active={sidebarActive} />

      <div className="flex-1 p-8">
        {/* Bienvenida */}
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 shadow-md rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">
            👋 ¡Bienvenido, {currentUser.username || "Administrador"}!
          </h1>
          <p className="text-gray-600 mt-1">Gestiona tu personal y la información de tu empresa.</p>
        </div>

        {/* Información de la empresa */}
        <InfoEmpresa />

        {/* Encabezado lista de usuarios */}
        <div className="flex justify-between items-center mb-4 mt-6">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Personal a Cargo
          </h2>
          {currentUser.rol === "admin" && (
            <CreateUserButton onClick={() => setModalOpen(true)} />
          )}
        </div>

        {/* Modales */}
        <CreateUserModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          newUser={newUser}
          setNewUser={setNewUser}
          creating={creating}
          onCreate={createNewUser}
        />

        <Modal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          title="¿Cerrar sesión?"
        >
          <p className="text-gray-700 text-center mb-6">
            ¿Estás seguro que deseas salir de tu cuenta?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setLogoutModalOpen(false)}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleLogoutConfirm}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition shadow-lg"
            >
              Cerrar Sesión
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={deleteUserModal.open}
          onClose={() => setDeleteUserModal({ open: false, userId: null })}
          title="¿Eliminar usuario?"
        >
          <p className="text-gray-700 text-center mb-6">
            ¿Seguro que deseas eliminar este usuario?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setDeleteUserModal({ open: false, userId: null })}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteUserConfirm}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition shadow-lg"
            >
              Eliminar
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={showEmailUpdatedModal}
          onClose={handleEmailUpdatedConfirm}
          title="Correo actualizado"
        >
          <p className="text-gray-700 text-center mb-6">
            Tu correo fue actualizado. Debes volver a iniciar sesión.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleEmailUpdatedConfirm}
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition shadow-lg"
            >
              Volver a iniciar sesión
            </button>
          </div>
        </Modal>

        <Modal
          isOpen={tokenExpiring}
          onClose={handleLogoutConfirm}
          title="Sesión a punto de expirar"
        >
          <p className="text-gray-700 text-center mb-4">
            Tu sesión está a punto de expirar. Por seguridad, debes iniciar sesión nuevamente.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleLogoutConfirm}
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition shadow-lg"
            >
              Iniciar Sesión Nuevamente
            </button>
          </div>
        </Modal>

        {/* Lista de usuarios */}
        <div className="bg-white shadow-lg rounded-xl p-4 mt-6">
          <UserList
            users={users}
            loading={loading}
            error={error}
            currentUser={currentUser}
            onEdit={updateUserData}
            onDelete={(id) => setDeleteUserModal({ open: true, userId: id })}
          />
        </div>
      </div>
    </div>
  );
}
