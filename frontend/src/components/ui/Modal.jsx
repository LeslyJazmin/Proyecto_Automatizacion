import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, disabled }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
      <div
        className="
          relative w-full max-w-lg p-8 rounded-3xl
          bg-gradient-to-br from-white via-neutral-50 to-neutral-100
          border border-neutral-300/70
          shadow-[0_8px_40px_rgba(0,0,0,0.15)]
          hover:shadow-[0_12px_50px_rgba(0,0,0,0.2)]
          transition-all duration-500 ease-out
          animate-scaleIn
        "
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          disabled={disabled}
          className="
            absolute top-4 right-4 p-2 rounded-full
            bg-white/70 hover:bg-rose-100
            text-neutral-600 hover:text-rose-600
            shadow-sm hover:shadow-md
            transition-all duration-300
          "
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título con degradado premium */}
        {title && (
          <h3
            className="
              text-3xl font-extrabold text-center mb-6
              bg-gradient-to-r from-rose-700 via-red-600 to-amber-500
              bg-clip-text text-transparent
              tracking-tight drop-shadow-[0_1px_2px_rgba(255,100,100,0.3)]
            "
          >
            {title}
          </h3>
        )}

        {/* Contenido dinámico en negro */}
        <div className="text-[#111] text-lg leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
