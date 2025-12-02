"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/SidebarTrabajador";
import Modal from "../components/ui/Modal";
import InfoEmpresa from "../components/InfoEmpresa";
import { jwtDecode } from "jwt-decode";

export default function TrabajadorDashboard() {
  const location = useLocation();

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [tokenExpiring, setTokenExpiring] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");

  // Logout
  const handleLogoutConfirm = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  // Email actualizado modal
  const [showEmailUpdatedModal, setShowEmailUpdatedModal] = useState(false);
  const handleEmailUpdatedConfirm = () => {
    setShowEmailUpdatedModal(false);
    handleLogoutConfirm();
  };

  // Leer token y rol
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      handleLogoutConfirm();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setNombreUsuario(decoded.username || decoded.name || "Trabajador");
      setCurrentUserRole(decoded.rol || "trabajador");

      // Expiración de token
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

  const sidebarActive = location.pathname;

  return (
    <div className="bg-neutral-100 min-h-screen font-sans flex">
      {/* Sidebar */}
      <Sidebar onLogout={() => setLogoutModalOpen(true)} active={sidebarActive} />

      <main className="ml-64 px-5 py-6 w-full space-y-6 transition-all duration-300">
        {/* Encabezado */}
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-neutral-200 hover:shadow-2xl transition-all duration-500">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            👋 Bienvenido {nombreUsuario}
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold 
                         border shadow-sm ${
                           currentUserRole === "admin"
                             ? "bg-red-100 text-red-700 border-red-300"
                             : "bg-blue-100 text-blue-700 border-blue-300"
                         }`}
            >
              {currentUserRole === "admin" ? "Administrador" : "Trabajador"}
            </span>
          </h1>
          <p className="text-gray-500 mt-2 text-base">
            {currentUserRole === "admin"
              ? "Administra la información de tu empresa fácilmente."
              : "Vista del trabajador."}
          </p>
        </div>

        {/* InfoEmpresa + Imagen */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="flex-1">
            <InfoEmpresa readOnly={currentUserRole !== "admin"} />
          </div>

          <div className="flex-1 relative rounded-2xl overflow-hidden shadow-lg hover:scale-[1.01] transition-transform duration-200 max-h-[300px]">
            <img
              src="/images/info.jpeg"
              alt="Información de la empresa"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
        </div>
      </main>

      {/* Modales */}
      <Modal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} title="¿Cerrar sesión?">
        <p className="text-gray-700 text-center mb-6">¿Estás seguro que deseas salir de tu cuenta?</p>
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
