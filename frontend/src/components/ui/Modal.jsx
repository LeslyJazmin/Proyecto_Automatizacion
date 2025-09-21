import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, disabled }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-red-900 via-black to-red-950 border border-red-700 rounded-2xl shadow-[0_0_35px_#ff1a1aaa] p-8 w-full max-w-lg relative animate-scaleIn">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition"
          disabled={disabled}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Título opcional */}
        {title && (
          <h3 className="text-2xl font-bold text-white mb-5 text-center">
            {title}
          </h3>
        )}

        {/* Contenido dinámico */}
        {children}
      </div>
    </div>
  );
}
