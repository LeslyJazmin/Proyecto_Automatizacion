import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Modal from "../components/ui/Modal";
import UserList from "../components/UserList";
import CreateUserModal from "../components/CreateUserModal";
import CreateAlmaceneroModal from "../components/CreateAlmaceneroModal";
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
    newUser,
    setNewUser,
    creating,
    createNewUser,
    createAlmacenero,
    updateUserData,
    deleteUserData,
    showEmailUpdatedModal,
    setShowEmailUpdatedModal,
  } = useUsers();

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState({
    open: false,
    userId: null,
  });
  const [tokenExpiring, setTokenExpiring] = useState(false);

  const [modalTrabajadorOpen, setModalTrabajadorOpen] = useState(false);
  const [modalAlmaceneroOpen, setModalAlmaceneroOpen] = useState(false);

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");

  function handleLogoutConfirm() {
    sessionStorage.removeItem("token");
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

  // Leer token
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      setNombreUsuario(decoded.username || decoded.name || "Administrador");
      setCurrentUserRole(decoded.rol || "");

      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - currentTime;

      if (timeLeft <= 180) setTokenExpiring(true);

      const timer = setTimeout(
        () => setTokenExpiring(true),
        (timeLeft - 180) * 1000
      );
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Token inválido:", err);
      handleLogoutConfirm();
    }
  }, []);

  let sidebarActive = location.pathname;

  return (
  <div className="bg-neutral-100 min-h-screen font-sans flex">

    {/* SIDEBAR RESPONSIVE */}
    <Sidebar onLogout={() => setLogoutModalOpen(true)} active={sidebarActive} />

    {/* CONTENIDO PRINCIPAL RESPONSIVE */}
    <main
      className="
        flex-1 
        px-3 sm:px-5 md:px-7 
        py-4 sm:py-6 
        space-y-4 sm:space-y-6
        transition-all duration-300
        md:ml-64
      "
    >
      {/* ENCABEZADO */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-5 border border-neutral-200">
        <h1 className="text-xl sm:text-3xl font-extrabold text-gray-800 flex flex-wrap gap-2 sm:gap-3">
          👋 Bienvenido {nombreUsuario}

          <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold 
              bg-red-100 text-red-700 border border-red-300 shadow-sm">
            {currentUserRole === "admin" ? "Administrador" : "Recepcionista"}
          </span>
        </h1>

        <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
          Administra tu personal y la información de tu empresa fácilmente.
        </p>
      </div>

      {/* INFO + IMAGEN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="w-full">
          <InfoEmpresa />
        </div>

        <div
        className="
          flex-1 
          relative 
          rounded-xl sm:rounded-2xl 
          overflow-hidden 
          shadow-lg 
          hover:scale-[1.01] 
          transition-transform 
          duration-200

          h-48          /* 📱 móviles */
          sm:h-56       /* 📱 pantallas algo más grandes */
          md:h-64       /* 🖥 tablets */
          lg:h-[300px]  /* 🖥 tamaño original PC */
          xl:h-[320px]  /* 🖥 PC grande */
        "
      >
        <img
          src="/images/info.jpeg"
          alt="Gimnasio moderno"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      </div>

      {/* TABLA DE USUARIOS */}
      <div className="rounded-xl sm:rounded-2xl shadow-lg border overflow-hidden">
        <div
          className="
            bg-gradient-to-r from-red-900 via-black to-red-950 
            border-b border-red-700 
            p-3 sm:p-4 
            flex flex-wrap justify-between gap-3 sm:gap-4 items-center
          "
        >
          <h2 className="text-white text-lg sm:text-xl font-semibold tracking-wide">
            Personal a Cargo
          </h2>

          {/* ACCIONES */}
          {currentUserRole === "admin" && (
            <div className="flex flex-wrap gap-2 sm:gap-3">

              {/* Trabajador */}
              <button
                onClick={() => {
                  setNewUser({ rol: "trabajador" });
                  setModalTrabajadorOpen(true);
                }}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg 
                bg-gradient-to-r from-red-700 to-red-900
                text-white text-xs sm:text-sm shadow-md"
              >
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Crear Trabajador</span>
              </button>

              {/* Almacenero */}
              <button
                onClick={() => {
                  setNewUser({ rol: "almacenero" });
                  setModalAlmaceneroOpen(true);
                }}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg 
                        bg-gradient-to-r from-blue-700 to-blue-900
                        text-white text-xs sm:text-sm shadow-md"
              >
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Crear Almacenero</span>
              </button>

            </div>
          )}
        </div>

        {/* TABLA RESPONSIVE */}
        <div className="bg-white p-2 sm:p-4 overflow-x-auto">
          <UserList
            users={users}
            loading={loading}
            error={error}
            currentUser={{ username: nombreUsuario, rol: currentUserRole }}
            onEdit={updateUserData}
            onDelete={(id) =>
              setDeleteUserModal({ open: true, userId: id })
            }
          />
        </div>
      </div>
    </main>


    {/* MODALES */}
    <CreateUserModal
      modalOpen={modalTrabajadorOpen}
      setModalOpen={setModalTrabajadorOpen}
      newUser={newUser}
      setNewUser={setNewUser}
      creating={creating}
      onCreate={createNewUser}
    />

    <CreateAlmaceneroModal
      modalOpen={modalAlmaceneroOpen}
      setModalOpen={setModalAlmaceneroOpen}
      newUser={newUser}
      setNewUser={setNewUser}
      creating={creating}
      onCreate={createAlmacenero}
    />

    <Modal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} title="¿Cerrar sesión?">
      <p className="text-gray-700 text-center mb-6">¿Estás seguro que deseas salir?</p>
      <div className="flex justify-center space-x-4">
        <button onClick={() => setLogoutModalOpen(false)} className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800">Cancelar</button>
        <button onClick={handleLogoutConfirm} className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg">Cerrar Sesión</button>
      </div>
    </Modal>

    <Modal isOpen={deleteUserModal.open} onClose={() => setDeleteUserModal({ open: false, userId: null })} title="¿Eliminar usuario?">
      <p className="text-gray-700 text-center mb-6">¿Seguro que deseas eliminar este usuario?</p>
      <div className="flex justify-center space-x-4">
        <button onClick={() => setDeleteUserModal({ open: false, userId: null })} className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Cancelar</button>
        <button onClick={handleDeleteUserConfirm} className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg">Eliminar</button>
      </div>
    </Modal>

    <Modal isOpen={showEmailUpdatedModal} onClose={handleEmailUpdatedConfirm} title="Correo actualizado">
      <p className="text-gray-700 text-center mb-6">Tu correo fue actualizado. Debes volver a iniciar sesión.</p>
      <div className="flex justify-center">
        <button onClick={handleEmailUpdatedConfirm} className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg">
          Volver a iniciar sesión
        </button>
      </div>
    </Modal>

    <Modal isOpen={tokenExpiring} onClose={handleLogoutConfirm} title="Sesión a punto de expirar">
      <p className="text-gray-700 text-center mb-4">Tu sesión está a punto de expirar. Inicia nuevamente.</p>
      <div className="flex justify-center">
        <button onClick={handleLogoutConfirm} className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg">
          Iniciar Sesión Nuevamente
        </button>
      </div>
    </Modal>
    </div>
  );
}
