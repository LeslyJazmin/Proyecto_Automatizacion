import { Package, BarChart3, LogOut, Building2, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout, logoutOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getButtonClasses = (path) =>
    `flex items-center space-x-3 w-full p-3 rounded-lg border transition-all
    ${
      (path === "logout" && logoutOpen) || location.pathname === path
        ? "bg-red-800 border-red-500 text-white shadow-[0_0_15px_#ff4d4d]"
        : "border-transparent hover:bg-red-900/40 hover:border-red-700"
    }`;

  const getIconColor = (path) => {
    // Icono activo = blanco, inactivo = color vino
    if ((path === "logout" && logoutOpen) || location.pathname === path) return "#ffffff";
    return "#a83232"; // color vino
  };

  return (
    <div className="w-72 bg-gradient-to-b from-[#4a0e0e] via-[#2e0505] to-black shadow-[0_0_20px_#4a0e0e] flex flex-col">
      <div className="p-6 border-b border-[#2e0505] text-center">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <Building2 color="#ff4d4d" className="w-8 h-8" />
          <h2 className="text-xl font-bold text-white drop-shadow-[0_0_5px_#a83232]">
            Mi Empresa
          </h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">Sistema de Gestión de Inventario</p>
        <img
          src="/images/GT2.png"
          alt="Logo"
          className="mx-auto w-70 h-48 object-contain drop-shadow-[0_0_10px_#a83232]"
        />
      </div>

      <div className="flex-1 p-4 space-y-4">
        <button
          className={getButtonClasses("/AdminDashboard")}
          onClick={() => navigate("/AdminDashboard")}
        >
          <Info color={getIconColor("/AdminDashboard")} />
          <span className="font-semibold text-white">Información de la Empresa</span>
        </button>

        <button
          className={getButtonClasses("/GInventario")}
          onClick={() => navigate("/GInventario")}
        >
          <Package color={getIconColor("/GInventario")} />
          <span className="font-medium text-white">Gestión de Inventario</span>
        </button>

        <button
          className={getButtonClasses("/Reportes")}
          onClick={() => navigate("/Reportes")}
        >
          <BarChart3 color={getIconColor("/Reportes")} />
          <span className="font-medium text-white">Reportes</span>
        </button>

        {/* Botón de Cerrar Sesión */}
        <button
          onClick={onLogout}
          className={getButtonClasses("logout")}
        >
          <LogOut color={getIconColor("logout")} />
          <span className="font-medium text-white">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
