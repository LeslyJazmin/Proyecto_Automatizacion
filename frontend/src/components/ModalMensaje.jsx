import React from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

export default function ModalMensaje({ isOpen, tipo, mensaje, onClose }) {
  if (!isOpen) return null;

  const iconos = {
    exito: <CheckCircle className="text-green-600 w-10 h-10" />,
    error: <XCircle className="text-red-600 w-10 h-10" />,
    info: <Info className="text-blue-600 w-10 h-10" />,
  };

  const colores = {
    exito: "border-green-500",
    error: "border-red-500",
    info: "border-blue-500",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn">
      <div
        className={`bg-white p-6 rounded-2xl shadow-lg border-t-4 ${colores[tipo]} max-w-sm w-full text-center animate-scaleIn`}
      >
        <div className="flex justify-center mb-3">{iconos[tipo]}</div>
        <p className="text-gray-800 font-medium text-lg mb-4">{mensaje}</p>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-red-700 via-red-800 to-black text-white px-6 py-2 rounded-lg font-semibold hover:from-black hover:via-red-900 hover:to-black transition-all"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}