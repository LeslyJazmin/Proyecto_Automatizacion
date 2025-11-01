import { X, Package, AppWindow } from "lucide-react";

export default function ModalGInventario({
  isOpen,
  onClose,
  title,
  children,
  tipo = "default", // entrada | salida | existente
  maxWidth = "760px",
  headerIcon: HeaderIcon = Package,
}) {
  if (!isOpen) return null;

  // 🎨 Configuración de colores por tipo de modal
  const colorConfig = {
    entrada: {
      gradient: "from-emerald-600 to-emerald-500",
      border: "border-emerald-500/50",
      icon: "text-emerald-600",
      scrollThumb: "scrollbar-thumb-emerald-500/70",
    },
    salida: {
      gradient: "from-red-600 to-red-500",
      border: "border-red-500/50",
      icon: "text-red-600",
      scrollThumb: "scrollbar-thumb-red-500/70",
    },
    existente: {
      gradient: "from-gray-700 to-gray-500", // 💠 Plomo elegante
      border: "border-gray-500/50",
      icon: "text-gray-700",
      scrollThumb: "scrollbar-thumb-gray-500/60",
    },
    default: {
      gradient: "from-blue-600 to-blue-500",
      border: "border-blue-500/50",
      icon: "text-blue-600",
      scrollThumb: "scrollbar-thumb-blue-400/70",
    },
  };

  const style = colorConfig[tipo] || colorConfig.default;

  return (
    <div
      className="fixed inset-0 bg-gray-900/70 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white shadow-xl shadow-gray-900/30 transition-all duration-300 font-sans w-full rounded-xl transform scale-100 border border-gray-100"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 💎 Header dinámico */}
        <div
          className={`flex items-center justify-between px-6 py-3 rounded-t-xl border-b ${style.border} bg-gradient-to-r ${style.gradient}`}
        >
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white uppercase">
            <span className="p-1.5 bg-white/20 rounded-lg shadow-sm">
              <HeaderIcon size={20} className="text-white" />
            </span>
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-white opacity-90 hover:opacity-100 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1.5 transition-all duration-300"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* 📄 Contenido con scroll dinámico */}
        <div
          className={`p-6 bg-white text-gray-800 max-h-[75vh] overflow-y-auto text-sm leading-relaxed scrollbar-thin ${style.scrollThumb} scrollbar-track-gray-100 rounded-b-xl`}
        >
          <div className="animate-slideUp">{children}</div>
        </div>

        {/* 💡 Footer informativo */}
        <div className="sticky bottom-0 left-0 right-0 border-t border-gray-200 px-6 py-2 bg-gray-50/70 backdrop-blur-sm flex justify-between items-center rounded-b-xl">
          <p className="flex items-center gap-2 text-xs font-medium text-gray-600">
            <AppWindow size={14} className={style.icon} />
            SISTEMA DE GESTIÓN DE INVENTARIO | {new Date().getFullYear()}
          </p>
          <span className="text-xs text-gray-500 font-light italic">
            Aplicación Web
          </span>
        </div>
      </div>

      {/* 🔹 Animaciones */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
}
