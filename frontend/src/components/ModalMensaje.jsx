import React from "react";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

export default function ModalMensaje({ isOpen, tipo = "info", mensaje, onClose }) {
  if (!isOpen) return null;

  // 1. Tipos de Mensajes: Iconos, Colores y Títulos automáticos
  const estilosMensaje = {
    exito: {
      icon: <CheckCircle className="text-green-500 w-12 h-12" />,
      colorClasses: "border-t-green-500",
      buttonClasses: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
      title: "Operación Exitosa",
    },
    error: {
      icon: <XCircle className="text-red-500 w-12 h-12" />,
      colorClasses: "border-t-red-500",
      buttonClasses: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      title: "Error Detectado",
    },
    info: {
      icon: <Info className="text-blue-500 w-12 h-12" />,
      colorClasses: "border-t-blue-500",
      buttonClasses: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      title: "Información Importante",
    },
    alerta: { // Se añade un tipo "alerta" para mayor versatilidad
      icon: <AlertTriangle className="text-yellow-500 w-12 h-12" />,
      colorClasses: "border-t-yellow-500",
      buttonClasses: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      title: "Advertencia",
    },
  };

  const estiloActual = estilosMensaje[tipo] || estilosMensaje.info; // Default a 'info'

  return (
    // 2. Fondo con opacidad más suave y mejor transición
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-out" onClick={onClose}>
      
      {/* 3. Modal central con diseño mejorado */}
      <div
        className={`bg-white p-8 rounded-xl shadow-2xl ${estiloActual.colorClasses} border-t-4 max-w-sm w-full text-center transform transition-all duration-300 ease-out scale-100 hover:scale-[1.01]`}
        onClick={e => e.stopPropagation()} // Evita que el clic en el modal lo cierre
      >
        
        {/* Ícono central */}
        <div className="flex justify-center mb-4">
            {estiloActual.icon}
        </div>

        {/* 4. Título automático */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 tracking-wide">
            {estiloActual.title}
        </h3>
        
        {/* Mensaje principal */}
        <p className="text-gray-600 text-base mb-6 font-light leading-relaxed">
            {mensaje}
        </p>
        
        {/* 5. Botón de acción con estilo que coincide con el tipo de mensaje */}
        <button
          onClick={onClose}
          className={`w-full text-white px-4 py-2.5 rounded-lg font-semibold transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${estiloActual.buttonClasses}`}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}