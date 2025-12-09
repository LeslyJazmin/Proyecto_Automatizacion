"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/SidebarAlmacenero";
import Modal from "../components/ui/Modal";
import InfoEmpresa from "../components/InfoEmpresa";
import { jwtDecode } from "jwt-decode";

export default function AlmaceneroDashboard() {
  const location = useLocation();

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [tokenExpiring, setTokenExpiring] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");

  // Cerrar sesión
  const handleLogoutConfirm = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Modal email actualizado
  const [showEmailUpdatedModal, setShowEmailUpdatedModal] = useState(false);
  const handleEmailUpdatedConfirm = () => {
    setShowEmailUpdatedModal(false);
    handleLogoutConfirm();
  };

  // Leer token y rol dinámico
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      handleLogoutConfirm();
      return;
    }

    try {
      const decoded = jwtDecode(token);

      setNombreUsuario(decoded.username || decoded.name || "Usuario");
      setCurrentUserRole(decoded.rol || "almacenero");

      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - currentTime;

      // Si ya está por expirar
      if (timeLeft <= 180) {
        setTokenExpiring(true);
        return;
      }

      // Timer correcto que no genere valores negativos
      const timer = setTimeout(() => {
        setTokenExpiring(true);
      }, Math.max((timeLeft - 180) * 1000, 0));

      return () => clearTimeout(timer);

    } catch (err) {
      console.error("Token inválido:", err);
      handleLogoutConfirm();
    }
  }, []);

  const sidebarActive = location.pathname;

  return (
    <div className="bg-neutral-100 min-h-screen font-sans flex">

      {/* SIDEBAR */}
      <Sidebar
        onLogout={() => setLogoutModalOpen(true)}
        active={sidebarActive}
      />

      {/* MAIN CONTENT */}
      <main
        className="
          flex-1 w-full
          px-3 sm:px-5 md:px-8
          py-4 sm:py-6
          space-y-4 sm:space-y-6
          transition-all duration-300
          md:ml-64
        "
      >
        {/* ENCABEZADO */}
        <div
          className="
            bg-white 
            rounded-xl sm:rounded-2xl 
            shadow-lg 
            p-3 sm:p-5 
            border border-neutral-200 
            hover:shadow-2xl 
            transition-all duration-500
          "
        >
          <h1 className="text-xl sm:text-3xl font-extrabold text-gray-800 flex items-center gap-2 sm:gap-3 flex-wrap">
            👋 Bienvenido {nombreUsuario}
            <span
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold 
                border shadow-sm
                ${
                  currentUserRole === "admin"
                    ? "bg-red-100 text-red-700 border-red-300"
                    : currentUserRole === "recepcionista"
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-green-100 text-green-700 border-green-300" // 💚 ALMACENERO VERDE
                }
              `}
            >
              {currentUserRole === "admin"
                ? "Administrador"
                : currentUserRole === "recepcionista"
                ? "Recepcionista"
                : "Almacenero"}
            </span>
          </h1>

          <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
            {currentUserRole === "admin"
              ? "Administra la información de tu empresa fácilmente."
              : "Panel del trabajador — gestiona empresa, inventario y análisis."}
          </p>
        </div>

        {/* INFO + IMAGEN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="w-full">
            <InfoEmpresa readOnly={currentUserRole !== "admin"} />
          </div>

          <div
            className="
              flex-1 relative rounded-xl sm:rounded-2xl 
              overflow-hidden shadow-lg 
              hover:scale-[1.01] transition-transform duration-200
              h-48 sm:h-56 md:h-64 lg:h-[300px] xl:h-[320px]
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
      </main>

      {/* MODALES */}
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
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleLogoutConfirm}
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg"
          >
            Cerrar Sesión
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
            className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg"
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
          Tu sesión está a punto de expirar. Inicia nuevamente.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleLogoutConfirm}
            className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg"
          >
            Iniciar Sesión Nuevamente
          </button>
        </div>
      </Modal>

    </div>
  );
}
