import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, disabled }) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 bg-black/80 backdrop-blur-sm 
        flex items-center justify-center 
        z-50 animate-fadeIn
        px-3 sm:px-0   /* ✔ Deja márgenes seguros en móviles */
      "
    >
      <div
        className="
          relative w-full 
          max-w-md sm:max-w-lg   /* ✔ Ajusta tamaño según pantalla */
          p-4 sm:p-6 md:p-8      /* ✔ Padding responsive */
          rounded-2xl sm:rounded-3xl
          bg-white text-[#111]
          border border-neutral-300 
          shadow-[0_8px_40px_rgba(0,0,0,0.2)]
          animate-scaleIn transition-all
        "
      >
        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          disabled={disabled}
          className="
            absolute top-3 right-3 sm:top-4 sm:right-4 
            p-1.5 sm:p-2 rounded-full
            bg-rose-100 hover:bg-rose-200
            text-rose-600 hover:text-rose-800
            shadow-sm hover:shadow-md
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* TÍTULO RESPONSIVE */}
        {title && (
          <h3
            className="
              text-xl sm:text-2xl md:text-3xl 
              font-extrabold text-center mb-4 sm:mb-6
              bg-gradient-to-r from-rose-700 via-red-600 to-amber-500
              bg-clip-text text-transparent
              tracking-tight drop-shadow-[0_1px_2px_rgba(255,100,100,0.3)]
            "
          >
            {title}
          </h3>
        )}

        {/* CONTENIDO DEL MODAL */}
        <div
          className="
            text-gray-900 
            text-sm sm:text-base 
            leading-relaxed 
            space-y-3 sm:space-y-4

            [&_label]:block [&_label]:text-sm sm:[&_label]:text-base 
            [&_label]:font-semibold [&_label]:text-gray-800 [&_label]:mb-1

            [&_input]:w-full [&_input]:p-2.5 sm:[&_input]:p-3 
            [&_input]:rounded-xl [&_input]:border [&_input]:border-neutral-300
            [&_input]:bg-white [&_input]:text-gray-900 [&_input]:placeholder:text-gray-400
            [&_input]:shadow-sm [&_input]:focus:ring-2 [&_input]:focus:ring-rose-500 
            [&_input]:focus:border-rose-500 [&_input]:transition-all

            [&_textarea]:w-full [&_textarea]:p-2.5 sm:[&_textarea]:p-3
            [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-neutral-300
            [&_textarea]:bg-white [&_textarea]:text-gray-900 [&_textarea]:placeholder:text-gray-400
            [&_textarea]:shadow-sm [&_textarea]:focus:ring-2 [&_textarea]:focus:ring-rose-500 
            [&_textarea]:focus:border-rose-500 [&_textarea]:transition-all

            [&_button]:mt-3 sm:[&_button]:mt-4
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}
