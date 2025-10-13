import { X, Package, Settings } from "lucide-react";

export default function ModalGInventario({ isOpen, onClose, title, children, maxWidth = "880px" }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      // onClick={onClose} ← se quita para que clic fuera no cierre
    >
      <div
        className="bg-white rounded-3xl shadow-2xl shadow-green-500/30 ring-1 ring-green-400/50 transition-all duration-300 font-sans w-full"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()} // previene cierre al click dentro
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-green-600 via-green-500 to-black shadow-md shadow-black/30">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-wide text-green-100">
            <Package size={20} className="text-green-300" />
            {title}
          </h2>
          <button
            onClick={onClose} // ← solo la X cierra
            className="text-green-200 hover:text-white hover:bg-green-600/20 rounded-full p-1.5 transition-all duration-300 ease-in-out"
            aria-label="Cerrar modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 text-gray-900 bg-white max-h-[75vh] overflow-y-auto text-[14px] leading-relaxed scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-gray-100">
          {children}
        </div>

        {/* Footer */}
        <div className="border-t border-green-400/20 p-3 bg-gradient-to-r from-black to-green-600 flex justify-end items-center">
          <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-green-300">
            <Settings size={14} className="text-green-400" />
            INVENTARIO | AUTOMATIZACIÓN DE PROCESOS
          </p>
        </div>
      </div>
    </div>
  );
}
