import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, disabled, step }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="
          relative w-full max-w-2xl
          bg-white
          border border-red-200
          shadow-[0_8px_30px_rgba(139,0,0,0.25)]
          hover:shadow-[0_10px_40px_rgba(139,0,0,0.35)]
          transition-all duration-300 ease-out
          animate-scaleIn
          rounded-none
        "
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-3 bg-red-100 border-b border-red-200">
          {/* Título con indicadores al lado */}
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-red-700">{title}</h3>
            {/* Indicadores de paso */}
            <div className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${step === 1 ? "bg-red-600" : "bg-gray-300"}`}></div>
              <div className={`w-3 h-3 rounded-full ${step === 2 ? "bg-red-600" : "bg-gray-300"}`}></div>
            </div>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            disabled={disabled}
            className="p-1.5 text-red-700 hover:text-red-900 transition-all duration-200"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 text-gray-900 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
