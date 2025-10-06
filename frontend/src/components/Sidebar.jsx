import { Package, BarChart3, LogOut, Building2, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout, logoutOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Clases para los botones según si están activos o no
  const getButtonClasses = (path) => {
    const isActive = (path === "logout" && logoutOpen) || location.pathname === path;
    const baseClasses =
      `flex items-center space-x-4 w-full px-5 py-3 rounded-lg
       transition-all duration-300 transform hover:translate-x-1`;
    const activeClasses =
      `bg-red-800/80 text-white shadow-md`;
    const inactiveClasses =
      `text-gray-300 hover:text-white hover:bg-red-900/30`;
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // Iconos con color dinámico
  const getIconProps = (path) => {
    const isActive = (path === "logout" && logoutOpen) || location.pathname === path;
    return {
      color: isActive ? "#ffffff" : "#f87171",
      className: "w-5 h-5"
    };
  };

  return (
    <div
      className="w-72 h-screen 
                 bg-gradient-to-b from-black via-red-950 to-black
                 shadow-[0_0_25px_#ff1a1a66]
                 flex flex-col font-sans fixed top-0 left-0 z-50
                 border-r border-red-800/50"
    >
      {/* Cabecera */}
      <div className="p-6 text-center">
        <div className="flex items-center justify-center space-x-2">
          <Building2 color="#ef4444" className="w-8 h-8 animate-pulse" />
          <h2 className="text-2xl font-extrabold text-white tracking-wider drop-shadow-md">
            EMPRESA
          </h2>
        </div>
        <p className="text-xs font-light text-gray-400 mt-1 uppercase">
          Sistema de Gestión
        </p>
        <div className="h-px bg-red-600/40 my-4"></div>
        <img
          src="/images/GT2.png"
          alt="Logo"
          className="mx-auto w-56 h-44 object-contain mt-4"
        />
      </div>

      {/* Navegación */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <button
          className={getButtonClasses("/AdminDashboard")}
          onClick={() => navigate("/AdminDashboard")}
        >
          <Info {...getIconProps("/AdminDashboard")} />
          <span className="font-semibold text-sm tracking-wide">
            Información de empresa
          </span>
        </button>

        <button
          className={getButtonClasses("/GInventario")}
          onClick={() => navigate("/GInventario")}
        >
          <Package {...getIconProps("/GInventario")} />
          <span className="font-semibold text-sm tracking-wide">
            Gestión de inventario
          </span>
        </button>

        <button
          className={getButtonClasses("/Reportes")}
          onClick={() => navigate("/Reportes")}
        >
          <BarChart3 {...getIconProps("/Reportes")} />
          <span className="font-semibold text-sm tracking-wide">
            Reportes
          </span>
        </button>
      </div>

      {/* Botón cerrar sesión */}
      <div className="p-4 mt-8">
        <div className="h-px bg-red-600/30 my-4"></div>
        <button onClick={onLogout} className={getButtonClasses("logout")}>
          <LogOut {...getIconProps("logout")} />
          <span className="font-semibold text-sm tracking-wide">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
