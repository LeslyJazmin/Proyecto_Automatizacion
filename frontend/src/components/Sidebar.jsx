import { Package, BarChart3, LogOut, Building2, Info, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout, logoutOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Función para determinar si la ruta está activa
  const isActiveRoute = (path) => {
    if (path === "logout") return logoutOpen;
    return location.pathname.toLowerCase().startsWith(path.toLowerCase());
  };

  // Clases de botón según si está activo
  const getButtonClasses = (path) => {
    const active = isActiveRoute(path);
    // Tipografía: Textos de navegación más pequeños (text-sm) pero con mejor peso (font-medium)
    const baseClasses =
      "flex items-center space-x-4 w-full px-5 py-2.5 rounded-lg transition-all duration-300 transform hover:translate-x-0.5";
    
    // Tonos Borgoña/Vino para el estado activo, con un color de fondo más sólido
    const activeClasses = "bg-red-700 text-white shadow-xl shadow-red-900/50 font-medium"; 
    // Hover nítido: fondo sólido más oscuro
    const inactiveClasses = "text-gray-200 hover:text-white hover:bg-red-900/60 font-medium"; 
    
    return `${baseClasses} ${active ? activeClasses : inactiveClasses}`;
  };

  // Props dinámicos para iconos
  const getIconProps = (path) => ({
    // Íconos activos en blanco puro, inactivos en un Rojo Vino definido
    className: `w-4 h-4 transition-colors duration-300 ${isActiveRoute(path) ? 'text-white' : 'text-red-400'}`, 
  });

  return (
    <div
      // Fondo Borgoña Oscuro con buen contraste y sin borde lateral
      className="w-72 h-screen bg-gradient-to-b from-gray-900 via-red-950 to-black shadow-2xl flex flex-col font-sans fixed top-0 left-0 z-50" 
    >
      {/* Cabecera */}
      <div className="p-8 text-center mb-4 pt-10">
        <div className="flex items-center justify-center space-x-3"> {/* Espacio aumentado */}
          {/* Título nítido y visible */}
          <Building2 color="#dc2626" className="w-6 h-6" /> {/* Rojo más brillante para visibilidad */}
          <h2 className="text-2xl font-semibold text-white tracking-widest drop-shadow-md">
            EMPRESA
          </h2>
        </div>
        <p className="text-xs font-normal text-red-300 mt-2 uppercase tracking-widest">
          Panel de Administración
        </p>
        
        {/* Imagen más visible y definida (opacidad eliminada o muy alta) */}
        <img
          src="/images/GT2.png" 
          alt="Logo"
          className="mx-auto w-44 h-32 object-contain mt-6" 
        />
        {/* Línea divisoria nítida (blanco muy tenue) */}
        <div className="h-px bg-white/10 mt-6"></div>
      </div>

      {/* Navegación */}
      <div className="flex-1 p-6 space-y-2 overflow-y-auto">
        <button
          className={getButtonClasses("/AdminDashboard")}
          onClick={() => navigate("/AdminDashboard")}
        >
          <Info {...getIconProps("/AdminDashboard")} />
          <span className="text-sm tracking-wide">Dashboard Principal</span>
        </button>

        <button
          className={getButtonClasses("/GInventario")}
          onClick={() => navigate("/GInventario")}
        >
          <Package {...getIconProps("/GInventario")} />
          <span className="text-sm tracking-wide">Gestión de Inventario</span>
        </button>

        <button
          className={getButtonClasses("/Movimientos")}
          onClick={() => navigate("/Movimientos")}
        >
          <TrendingUp {...getIconProps("/Movimientos")} />
          <span className="text-sm tracking-wide">Transacciones y Flujo</span>
        </button>

        <button
          className={getButtonClasses("/Reportes")}
          onClick={() => navigate("/Reportes")}
        >
          <BarChart3 {...getIconProps("/Reportes")} />
          <span className="text-sm tracking-wide">Análisis y Reportes</span>
        </button>
      </div>

      {/* Botón cerrar sesión */}
      <div className="p-6 mt-auto"> 
        {/* Línea divisoria nítida (blanco muy tenue) */}
        <div className="h-px bg-white/10 mb-4"></div>
        <button onClick={onLogout} className={getButtonClasses("logout")}>
          <LogOut {...getIconProps("logout")} />
          <span className="text-sm tracking-wide">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}