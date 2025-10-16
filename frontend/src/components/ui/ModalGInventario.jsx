import { X, Package, Settings } from "lucide-react";

export default function ModalGInventario({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "760px",
}) {
  if (!isOpen) return null;

  return (
    // Fondo: Gris muy oscuro, profesional y con blur ligeramente más fuerte
    <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
      <div
        // Contenedor Principal: Blanco con sombra definida, esquinas más redondeadas y efecto flotante
        className="relative bg-white shadow-2xl shadow-gray-900/40 transition-all duration-300 font-sans w-full rounded-2xl transform scale-100 border border-gray-200"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🔷 Header Premium: Sutil Gradiente y Iconografía */}
        <div className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-t-2xl">
          
          <h2 className="flex items-center gap-3 text-xl font-extrabold tracking-wide text-white uppercase"> 
            {/* Icono más prominente y limpio */}
            <span className="p-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-900/30 border border-emerald-400">
              <Package size={22} className="text-white" /> 
            </span>
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-white hover:text-emerald-100 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2 transition-all duration-300"
            aria-label="Cerrar modal"
          >
            <X size={20} /> {/* Icono de cierre */}
          </button>
        </div>

        {/* 🧾 Contenido: Área de scroll mejorada */}
        {/* Se usa p-8 aquí para hacer juego con el header, y max-h-[75vh] para permitir más contenido */}
        <div className="p-8 bg-white text-gray-900 max-h-[75vh] overflow-y-auto text-base leading-relaxed scrollbar-thin scrollbar-thumb-emerald-500/70 scrollbar-track-gray-100 rounded-b-xl">
          <div className="animate-slideUp">{children}</div>
        </div>

        {/* ⚙️ Footer Ejecutivo: Línea de estado sutil y profesional */}
        <div className="sticky bottom-0 left-0 right-0 border-t border-gray-200 px-8 py-2 bg-gray-50/70 backdrop-blur-sm flex justify-between items-center rounded-b-2xl">
          {/* Texto de información */}
          <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-gray-600">
            <Settings size={14} className="text-emerald-700" />
            SISTEMA DE GESTIÓN DE INVENTARIO | V{new Date().getFullYear()}
          </p>
          <span className="text-xs text-gray-500 font-light italic">
            Propiedad de la Organización
          </span>
        </div>
      </div>

      {/* 🔹 Animaciones (se mantienen sin cambios) */}
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
            transform: translateY(15px);
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
          animation: slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
}
