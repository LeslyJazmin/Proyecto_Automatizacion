import { X, Package, Settings } from "lucide-react";

export default function ModalGInventario({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div 
        className="w-full max-w-[880px] shadow-2xl shadow-green-500/30 ring-1 ring-green-400/50 transition-all duration-300 rounded-3xl font-sans"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Contenedor principal */}
        <div className="shadow-inner shadow-black/10 rounded-3xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-600 via-green-500 to-black shadow-md shadow-black/30 rounded-t-3xl">
            
            {/* Título con ícono */}
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-wide text-green-100">
              <Package size={24} className="text-green-300" />
              {title}
            </h2>

            {/* Botón cerrar */}
            <button 
              onClick={onClose} 
              className="text-green-200 hover:text-white hover:bg-green-600/20 rounded-full p-2 transition-all duration-300 ease-in-out"
              aria-label="Cerrar modal"
            >
              <X size={22} />
            </button>
          </div>

          {/* Contenido */}
          <div className="p-7 text-gray-900 bg-white max-h-[75vh] overflow-y-auto text-[15px] leading-relaxed">
            {children}
          </div>

          {/* Footer (alineado a la derecha) */}
          <div className="border-t border-green-400/20 p-4 bg-gradient-to-r from-black to-green-600 rounded-b-3xl flex justify-end">
            <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-green-300">
              <Settings size={16} className="text-green-400" />
              INVENTARIO | AUTOMATIZACIÓN DE PROCESOS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
