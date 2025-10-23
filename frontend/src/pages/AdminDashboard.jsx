import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Modal from "../components/ui/Modal";
import UserList from "../components/UserList";
import CreateUserModal from "../components/CreateUserModal";
import InfoEmpresa from "../components/InfoEmpresa";
import useUsers from "../hooks/useUsers";
import { UserPlus } from "lucide-react";
import { jwtDecode } from "jwt-decode";

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

  function handleLogoutConfirm() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  function handleEmailUpdatedConfirm() {
    setShowEmailUpdatedModal(false);
    handleLogoutConfirm();
  }

  function handleDeleteUserConfirm() {
    deleteUserData(deleteUserModal.userId);
    setDeleteUserModal({ open: false, userId: null });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
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

  let sidebarActive = location.pathname;

  return (
    <div className="bg-neutral-100 min-h-screen font-sans flex">
      {/* Sidebar */}
      <Sidebar onLogout={() => setLogoutModalOpen(true)} active={sidebarActive} />

      {/* Contenido principal más a la izquierda */}
      <main className="ml-64 px-5 py-6 w-full space-y-6 transition-all duration-300">
        {/* Encabezado principal */}
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-neutral-200 hover:shadow-2xl transition-all duration-500">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-800 via-red-600 to-amber-500 tracking-tight">
            👋 Bienvenido {currentUser.username || "Administrador"}
          </h1>
          <p className="text-gray-500 mt-2 text-base">
            Administra tu personal y la información de tu empresa fácilmente.
          </p>
        </div>

        {/* Info + Imagen */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="flex-1">
            <InfoEmpresa />
          </div>

          <div className="flex-1 relative rounded-2xl overflow-hidden shadow-lg hover:scale-[1.01] transition-transform duration-200 max-h-[300px]">
            <img
              src="/images/info.jpeg"
              alt="Gimnasio moderno"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
        </div>

        {/* Personal */}
        <div className="rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
          <div
            className="bg-gradient-to-r from-red-900 via-black to-red-950 
                       border-b border-red-700 
                       p-4 flex justify-between items-center"
          >
            <h2 className="text-white text-xl font-semibold tracking-wide">
              Personal a Cargo
            </h2>

            {currentUser.rol === "admin" && (
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg 
                           bg-gradient-to-r from-red-700 to-red-900
                           hover:from-red-600 hover:to-red-800
                           transition-all duration-300
                           text-white font-medium shadow-md hover:shadow-lg text-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Crear Trabajador</span>
              </button>
            )}
          </div>

          <div className="bg-white p-5">
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
      </main>

      {/* Modales */}
      <CreateUserModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        newUser={newUser}
        setNewUser={setNewUser}
        creating={creating}
        onCreate={createNewUser}
      />

      <Modal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} title="¿Cerrar sesión?">
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
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg"
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
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg"
          >
            Eliminar
          </button>
        </div>
      </Modal>

      <Modal isOpen={showEmailUpdatedModal} onClose={handleEmailUpdatedConfirm} title="Correo actualizado">
        <p className="text-gray-700 text-center mb-6">
          Tu correo fue actualizado. Debes volver a iniciar sesión.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleEmailUpdatedConfirm}
            className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg"
          >
            Volver a iniciar sesión
          </button>
        </div>
      </Modal>

      <Modal isOpen={tokenExpiring} onClose={handleLogoutConfirm} title="Sesión a punto de expirar">
        <p className="text-gray-700 text-center mb-4">
          Tu sesión está a punto de expirar. Por seguridad, debes iniciar sesión nuevamente.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleLogoutConfirm}
            className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg"
          >
            Iniciar Sesión Nuevamente
          </button>
        </div>
      </Modal>
    </div>
  );
}
