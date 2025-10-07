import { useState } from "react";
import { X } from "lucide-react";
import Button from "./ui/Button";

export default function ModalSalida({
  isOpen,
  onClose,
  usuarioId,
  title = "Registrar Salida de Producto",
  tipo,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    codigo: "",
    cantidad: "",
    motivo: "",
    usuarioId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.codigo || !formData.cantidad || !formData.motivo) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      await onSuccess(formData);
      setFormData({
        codigo: "",
        cantidad: "",
        motivo: "",
        usuarioId,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al registrar la salida: " + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          {title}
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Código / Nombre del Producto
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              placeholder="Ej: ROPA123 o COM456"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Cantidad a Retirar
            </label>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              min="1"
              placeholder="Ej: 5"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Motivo o Destino
            </label>
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="Ej: Entrega al cliente, muestra, reemplazo, etc."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botón enviar */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-5 py-2 font-bold rounded-lg shadow-[0_0_12px_#ef444466,0_0_25px_#b91c1c33] hover:shadow-[0_0_20px_#ef4444aa,0_0_45px_#b91c1c88] hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Registrar Salida
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
