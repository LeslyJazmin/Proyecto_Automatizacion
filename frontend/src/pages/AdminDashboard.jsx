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

function CreateUserButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-lime-600 text-white font-semibold py-2 px-5 rounded-full shadow-lg hover:from-emerald-600 hover:to-lime-700 transition-transform duration-300 transform hover:scale-105"
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
    <div className="bg-gray-100 min-h-screen font-inter">
      <Sidebar onLogout={() => setLogoutModalOpen(true)} active={sidebarActive} />
      
      <div className="ml-72 p-8 animate-fade-in-up">
        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 mb-6">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 drop-shadow-md tracking-tight">
            👋 Panel de Administrador
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Gestión completa del personal y la información de la empresa.
          </p>
        </div>

        {/* CONTENEDOR FLEX PARA INFOEMPRESA Y LA IMAGEN */}
        <div className="flex gap-6 items-start mb-6"> {/* items-start para alinear arriba */}
          {/* InfoEmpresa ocupará un ancho limitado */}
          <div className="w-1/2"> {/* Puedes ajustar este ancho como 1/2, 2/3, etc. */}
            <InfoEmpresa />
          </div>
          
          {/* Contenedor para la imagen a la derecha */}
          <div className="w-1/2 h-auto flex items-center justify-center bg-gradient-to-br from-red-200 to-red-400 rounded-2xl shadow-xl overflow-hidden">
            {/* Aquí puedes usar la imagen que te generé o cualquier otra */}
            <img 
              src="https://tse1.mm.bing.net/th/id/OIP.B9YPaiQpg-1SLldcI8pfzgHaE8?rs=1&pid=ImgDetMain&o=7&rm=3" 
              alt="Información de la empresa de gimnasio" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 mt-6">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Personal a Cargo
          </h2>
          {currentUser.rol === "admin" && (
            <CreateUserButton onClick={() => setModalOpen(true)} />
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-4 mt-6">
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
        <p className="text-gray-700 text-center mb-6">¿Estás seguro que deseas salir de tu cuenta?</p>
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
        <p className="text-gray-700 text-center mb-6">¿Seguro que deseas eliminar este usuario?</p>
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
        <p className="text-gray-700 text-center mb-6">Tu correo fue actualizado. Debes volver a iniciar sesión.</p>
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
        <p className="text-gray-700 text-center mb-4">Tu sesión está a punto de expirar. Por seguridad, debes iniciar sesión nuevamente.</p>
        <div className="flex justify-center">
          <button
            onClick={handleLogoutConfirm}
            className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition shadow-lg"
          >
            Iniciar Sesión Nuevamente
          </button>
        </div>
      </Modal>
    </div>
  );
}