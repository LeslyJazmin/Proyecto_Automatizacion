import { Package, BarChart3, LogOut, Building2, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout, logoutOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Clases para los botones según si están activos o no
  const getButtonClasses = (path) => {
    const isActive = (path === "logout" && logoutOpen) || location.pathname === path;
    const baseClasses = `flex items-center space-x-4 w-full px-5 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-1`;
    const activeClasses = `bg-red-700/95 text-white shadow-lg ring-2 ring-red-500`;
    const inactiveClasses = `text-red-300 hover:text-white hover:bg-gray-800/60`;
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // Color y efecto glow de los iconos
  const getIconProps = (path) => {
    const isActive = (path === "logout" && logoutOpen) || location.pathname === path;
    return {
      color: isActive ? "#ffffff" : "#f87171",
      className: isActive ? "w-5 h-5 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" : "w-5 h-5"
    };
  };

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-gray-950 to-red-950 flex flex-col font-sans shadow-2xl fixed top-0 left-0 z-50">
      {/* Cabecera */}
      <div className="p-6 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Building2 color="#ef4444" className="w-8 h-8 animate-pulse" />
          <h2 className="text-2xl font-extrabold text-white tracking-wider drop-shadow-lg">
            EMPRESA
          </h2>
        </div>
        <p className="text-xs font-light text-gray-400 mt-1 uppercase">Sistema de Gestión</p>
        <div className="h-px bg-white/50 my-4"></div>
        <img
          src="/images/GT2.png"
          alt="Logo"
          className="mx-auto w-64 h-56 object-contain mt-4"
        />
      </div>

      {/* Navegación */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <button className={getButtonClasses("/AdminDashboard")} onClick={() => navigate("/AdminDashboard")}>
          <Info {...getIconProps("/AdminDashboard")} />
          <span className="font-semibold text-sm tracking-wide">Información de empresa</span>
        </button>

        <button className={getButtonClasses("/GInventario")} onClick={() => navigate("/GInventario")}>
          <Package {...getIconProps("/GInventario")} />
          <span className="font-semibold text-sm tracking-wide">Gestión de inventario</span>
        </button>

        <button className={getButtonClasses("/Reportes")} onClick={() => navigate("/Reportes")}>
          <BarChart3 {...getIconProps("/Reportes")} />
          <span className="font-semibold text-sm tracking-wide">Reportes</span>
        </button>
      </div>

      {/* Botón cerrar sesión */}
      <div className="p-4 mt-8">
        <div className="h-px bg-white/20 my-4"></div>
        <button onClick={onLogout} className={getButtonClasses("logout")}>
          <LogOut {...getIconProps("logout")} />
          <span className="font-semibold text-sm tracking-wide">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
