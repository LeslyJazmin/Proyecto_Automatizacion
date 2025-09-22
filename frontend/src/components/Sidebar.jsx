import { useState, useEffect } from "react";
import { Package, BarChart3, LogOut, Building2, Info } from "lucide-react";
import Modal from "./ui/Modal";
import { jwtDecode } from "jwt-decode";

export default function Sidebar({ onLogout, active }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [tokenExpiring, setTokenExpiring] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  // --- Verificar token ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - currentTime;

      // Si faltan menos de 3 minutos, avisar
      if (timeLeft <= 180) {
        setTokenExpiring(true);
      }

      // Setear un timer para avisar 3 minutos antes
      const timer = setTimeout(() => setTokenExpiring(true), (timeLeft - 180) * 1000);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Token inválido:", err);
      onLogout();
    }
  }, [onLogout]);

  const getButtonClasses = (section) =>
    `flex items-center space-x-3 w-full p-3 rounded-lg border transition-all
    ${
      active === section
        ? "bg-red-800 border-red-500 text-white shadow-[0_0_15px_#ff4d4d]" 
        : "border-transparent hover:bg-red-900/40 hover:border-red-700"
    }`;

  return (
    <div className="w-72 bg-gradient-to-b from-[#4a0e0e] via-[#2e0505] to-black shadow-[0_0_20px_#4a0e0e] flex flex-col">
      <div className="p-6 border-b border-[#2e0505] text-center">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <Building2 className="text-[#ff4d4d] w-8 h-8" />
          <h2 className="text-xl font-bold text-white drop-shadow-[0_0_5px_#a83232]">
            Mi Empresa
          </h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">Sistema de Gestión de Inventario</p>
        <img src="/images/GT2.png" alt="Logo" className="mx-auto w-70 h-48 object-contain drop-shadow-[0_0_10px_#a83232]" />
      </div>

      <div className="flex-1 p-4 space-y-4">
        <button className={getButtonClasses("empresa")}>
          <Info className="text-white" />
          <span className="font-semibold text-white">Información de la Empresa</span>
        </button>
        <button className={getButtonClasses("inventario")}>
          <Package className="text-[#a83232]" />
          <span className="font-medium text-white">Registro e Inventario</span>
        </button>
        <button className={getButtonClasses("reportes")}>
          <BarChart3 className="text-[#a83232]" />
          <span className="font-medium text-white">Reportes</span>
        </button>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-700/30 text-red-400 transition"
        >
          <LogOut />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>

      {/* Modal Cerrar Sesión */}
      {showLogoutModal && (
        <Modal
          title="¿Cerrar sesión?"
          onClose={() => setShowLogoutModal(false)}
          actions={
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white">
                Cancelar
              </button>
              <button onClick={handleLogoutConfirm} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                Cerrar Sesión
              </button>
            </div>
          }
        >
          <p className="text-gray-300">
            ¿Estás seguro que deseas cerrar sesión? Perderás el acceso hasta volver a iniciar.
          </p>
        </Modal>
      )}

      {/* Modal Token Expirando */}
      {tokenExpiring && (
        <Modal
          title="Sesión a punto de expirar"
          onClose={handleLogoutConfirm}
          actions={
            <div className="flex justify-center">
              <button onClick={handleLogoutConfirm} className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition shadow-lg">
                Iniciar Sesión Nuevamente
              </button>
            </div>
          }
        >
          <p className="text-gray-300 text-center mb-4">
            Tu sesión está a punto de expirar. Por seguridad, debes iniciar sesión nuevamente.
          </p>
        </Modal>
      )}
    </div>
  );
}
