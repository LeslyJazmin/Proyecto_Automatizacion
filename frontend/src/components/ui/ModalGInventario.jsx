import { X, Package, Settings } from "lucide-react";

export default function ModalGInventario({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "760px", // 🔹 Más pequeño y equilibrado
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-3">
      <div
        className="relative bg-gradient-to-b from-white via-green-50 to-white shadow-2xl shadow-emerald-600/30 ring-1 ring-green-400/30 transition-all duration-300 font-sans w-full"
        style={{ maxWidth, borderRadius: "0px" }} // ⬅️ Bordes cuadrados
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🔷 Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-900 shadow-md">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-wide text-green-100">
            <span className="p-1.5 bg-green-600/20 rounded-lg">
              <Package size={18} className="text-green-300" />
            </span>
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-green-200 hover:text-white hover:bg-green-700/30 rounded-full p-2 transition-all duration-300"
            aria-label="Cerrar modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* 🧾 Contenido */}
        <div className="p-5 bg-white/95 text-gray-900 max-h-[70vh] overflow-y-auto text-[13px] leading-relaxed scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-100">
          <div className="animate-slideUp">{children}</div>
        </div>

        {/* ⚙️ Footer */}
        <div className="border-t border-green-300/30 p-3 bg-gradient-to-r from-emerald-900 via-green-800 to-black flex justify-between items-center shadow-inner">
          <p className="flex items-center gap-2 text-[11px] font-medium tracking-wide text-green-200">
            <Settings size={12} className="text-green-400" />
            INVENTARIO | AUTOMATIZACIÓN DE PROCESOS
          </p>
          <span className="text-[10px] text-green-400/80 italic">
            © {new Date().getFullYear()} Sistema Inteligente
          </span>
        </div>
      </div>

      {/* 🔹 Animaciones suaves */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
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
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
