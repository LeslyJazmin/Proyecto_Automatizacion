import { Package, BarChart3, LogOut, Building2, Info, TrendingUp, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ onLogout, logoutOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActiveRoute = (path) => {
    if (path === "logout") return logoutOpen;
    return location.pathname.toLowerCase().startsWith(path.toLowerCase());
  };

  const getButtonClasses = (path) => {
    const active = isActiveRoute(path);
    const baseClasses =
      "flex items-center space-x-3 w-full px-5 py-2.5 rounded-md transition-all duration-300 hover:translate-x-0.5";
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
    <>
      {/* Botón hamburguesa solo en móvil */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-red-700 text-white p-2 rounded-md shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* 🔲 Overlay oscuro */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-screen w-60 bg-gradient-to-b 
          from-gray-900 via-red-950 to-black shadow-2xl flex flex-col 
          font-sans transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-64 md:translate-x-0"}
        `}
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
            onClick={() => {
              navigate("/AdminDashboard");
              setOpen(false);
            }}
          >
            <Info {...getIconProps("/AdminDashboard")} />
            <span className="text-[12.5px] tracking-wide">Dashboard Principal</span>
          </button>

          <button
            className={getButtonClasses("/GInventario")}
            onClick={() => {
              navigate("/GInventario");
              setOpen(false);
            }}
          >
            <Package {...getIconProps("/GInventario")} />
            <span className="text-[12.5px] tracking-wide">Gestión de Inventario</span>
          </button>

          <button
            className={getButtonClasses("/Movimientos")}
            onClick={() => {
              navigate("/Movimientos");
              setOpen(false);
            }}
          >
            <TrendingUp {...getIconProps("/Movimientos")} />
            <span className="text-[12.5px] tracking-wide">Transacciones y Flujo</span>
          </button>

          <button
            className={getButtonClasses("/Reportes")}
            onClick={() => {
              navigate("/Reportes");
              setOpen(false);
            }}
          >
            <BarChart3 {...getIconProps("/Reportes")} />
            <span className="text-[12.5px] tracking-wide">Análisis</span>
          </button>
        </div>

        {/* Cerrar sesión */}
        <div className="px-5 pb-6 mt-auto">
          <div className="h-px bg-white/10 mb-4"></div>
          <button
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className={getButtonClasses("logout")}
          >
            <LogOut {...getIconProps("logout")} />
            <span className="text-[12.5px] tracking-wide">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
}
