import { Package, BarChart3, LogOut, Building2, Info, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout, logoutOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveRoute = (path) => {
    if (path === "logout") return logoutOpen;
    return location.pathname.toLowerCase().startsWith(path.toLowerCase());
  };

  const getButtonClasses = (path) => {
    const active = isActiveRoute(path);
    const baseClasses =
      "flex items-center space-x-3 w-full px-5 py-2.5 rounded-md transition-all duration-300 transform hover:translate-x-0.5";
    const activeClasses =
      "bg-red-700 text-white shadow-lg shadow-red-900/40 font-medium";
    const inactiveClasses =
      "text-gray-300 hover:text-white hover:bg-red-900/60 font-medium";
    return `${baseClasses} ${active ? activeClasses : inactiveClasses}`;
  };

  const getIconProps = (path) => ({
    className: `w-4 h-4 transition-colors duration-300 ${
      isActiveRoute(path) ? "text-white" : "text-red-400"
    }`,
  });

  return (
    <div
      className="w-60 h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black shadow-2xl flex flex-col font-sans fixed top-0 left-0 z-50"
    >
      {/* Cabecera */}
      <div className="p-7 text-center mb-3 pt-9">
        <div className="flex items-center justify-center space-x-2.5">
          <Building2 color="#dc2626" className="w-5 h-5" />
          <h2 className="text-[1.25rem] font-semibold text-white tracking-widest drop-shadow-md">
            EMPRESA
          </h2>
        </div>
        <p className="text-[11px] font-normal text-red-300 mt-1 uppercase tracking-widest">
          Panel de Administración
        </p>

        <img
          src="/images/GT2.png"
          alt="Logo"
          className="mx-auto w-40 h-30 object-contain mt-5"
        />
        <div className="h-px bg-white/10 mt-5"></div>
      </div>

      {/* Navegación */}
      <div className="flex-1 px-5 space-y-1 overflow-y-auto">
        <button
          className={getButtonClasses("/AdminDashboard")}
          onClick={() => navigate("/AdminDashboard")}
        >
          <Info {...getIconProps("/AdminDashboard")} />
          <span className="text-[12.5px] tracking-wide">Dashboard Principal</span>
        </button>

        <button
          className={getButtonClasses("/GInventario")}
          onClick={() => navigate("/GInventario")}
        >
          <Package {...getIconProps("/GInventario")} />
          <span className="text-[12.5px] tracking-wide">Gestión de Inventario</span>
        </button>

        <button
          className={getButtonClasses("/Movimientos")}
          onClick={() => navigate("/Movimientos")}
        >
          <TrendingUp {...getIconProps("/Movimientos")} />
          <span className="text-[12.5px] tracking-wide">Transacciones y Flujo</span>
        </button>

        <button
          className={getButtonClasses("/Reportes")}
          onClick={() => navigate("/Reportes")}
        >
          <BarChart3 {...getIconProps("/Reportes")} />
          <span className="text-[12.5px] tracking-wide">Análisis</span>
        </button>
      </div>

      {/* Cerrar sesión */}
      <div className="px-5 pb-6 mt-auto">
        <div className="h-px bg-white/10 mb-4"></div>
        <button onClick={onLogout} className={getButtonClasses("logout")}>
          <LogOut {...getIconProps("logout")} />
          <span className="text-[12.5px] tracking-wide">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
