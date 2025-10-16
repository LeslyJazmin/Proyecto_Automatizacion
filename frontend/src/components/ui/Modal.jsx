import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, disabled }) {
  if (!isOpen) return null;

  return (
    <div
      // Fondo del modal más oscuro, con desenfoque
      className="
        fixed inset-0 bg-black/80 backdrop-blur-sm
        flex items-center justify-center z-50 
        animate-fadeIn
      "
    >
      <div
        // Contenedor del modal (blanco, limpio y con transición suave)
        className="
          relative w-full max-w-lg p-8 rounded-3xl
          bg-white text-[#111]
          border border-neutral-300 shadow-[0_8px_40px_rgba(0,0,0,0.2)]
          transition-all duration-300 ease-in-out
          animate-scaleIn
        "
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          disabled={disabled}
          className="
            absolute top-4 right-4 p-2 rounded-full
            bg-rose-100 hover:bg-rose-200
            text-rose-600 hover:text-rose-800
            shadow-sm hover:shadow-md
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título con gradiente */}
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

        {/* Contenido del modal (con estilos globales para formularios) */}
        <div
          className="
            text-gray-900 text-base leading-relaxed space-y-4
            [&_label]:block [&_label]:text-base [&_label]:font-semibold [&_label]:text-gray-800 [&_label]:mb-1
            [&_input]:w-full [&_input]:p-3 [&_input]:rounded-xl [&_input]:border [&_input]:border-neutral-300
            [&_input]:bg-white [&_input]:text-gray-900 [&_input]:placeholder:text-gray-400
            [&_input]:shadow-sm [&_input]:focus:ring-2 [&_input]:focus:ring-rose-500 [&_input]:focus:border-rose-500
            [&_input]:transition-all [&_input]:duration-300 [&_input]:ease-in-out
            [&_textarea]:w-full [&_textarea]:p-3 [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-neutral-300
            [&_textarea]:bg-white [&_textarea]:text-gray-900 [&_textarea]:placeholder:text-gray-400
            [&_textarea]:shadow-sm [&_textarea]:focus:ring-2 [&_textarea]:focus:ring-rose-500 [&_textarea]:focus:border-rose-500
            [&_textarea]:transition-all [&_textarea]:duration-300 [&_textarea]:ease-in-out
            [&_button]:mt-4
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}
