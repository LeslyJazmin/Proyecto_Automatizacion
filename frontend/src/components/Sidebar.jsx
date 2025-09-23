import { Package, BarChart3, LogOut, Building2, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout, logoutOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getButtonClasses = (path) => {
    const isActive = (path === "logout" && logoutOpen) || location.pathname === path;
    const baseClasses = `flex items-center space-x-4 w-full px-5 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-1`;
    const activeClasses = `bg-red-900/90 text-white shadow-lg ring-2 ring-red-700`;
    const inactiveClasses = `text-gray-400 hover:text-white hover:bg-gray-800/60`;

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const getIconColor = (path) => {
    const isActive = (path === "logout" && logoutOpen) || location.pathname === path;
    return isActive ? "#ffffff" : "#b91c1c";
  };

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-gray-950 to-red-950 flex flex-col font-sans shadow-2xl fixed top-0 left-0 z-50">
      {/* Cabecera */}
      <div className="p-6 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Building2 color="#ef4444" className="w-8 h-8 animate-pulse" />
          <h2 className="text-2xl font-extrabold text-white tracking-wider drop-shadow-lg">EMPRESA</h2>
        </div>
        <p className="text-xs font-light text-gray-400 mt-1 uppercase">Sistema de Gestión</p>
        <div className="h-px bg-white/10 my-4"></div>
        <img
          src="/images/GT2.png"
          alt="Logo"
          // Clases modificadas para hacer la imagen más grande
          className="mx-auto w-64 h-56 object-contain mt-4"
        />
      </div>

      {/* Navegación - Con scroll */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <button className={getButtonClasses("/AdminDashboard")} onClick={() => navigate("/AdminDashboard")}>
          <Info color={getIconColor("/AdminDashboard")} className="w-5 h-5" />
          <span className="font-semibold text-sm tracking-wide">Información de empresa</span>
        </button>
        <button className={getButtonClasses("/GInventario")} onClick={() => navigate("/GInventario")}>
          <Package color={getIconColor("/GInventario")} className="w-5 h-5" />
          <span className="font-semibold text-sm tracking-wide">Gestion de inventario</span>
        </button>
        <button className={getButtonClasses("/Reportes")} onClick={() => navigate("/Reportes")}>
          <BarChart3 color={getIconColor("/Reportes")} className="w-5 h-5" />
          <span className="font-semibold text-sm tracking-wide">Reportes</span>
        </button>
      </div>

      {/* Botón de cerrar sesión - Fijo abajo */}
      <div className="p-4 mt-8">
        <div className="h-px bg-white/20 my-4"></div>
        <button onClick={onLogout} className={getButtonClasses("logout")}>
          <LogOut color={getIconColor("logout")} className="w-5 h-5" />
          <span className="font-semibold text-sm tracking-wide">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}