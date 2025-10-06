import { useState, useEffect } from "react";
import ModalGInventario from "../components/ui/ModalGInventario";
import { PackagePlus, ClipboardPlus } from "lucide-react"; // iconos bonitos

export default function ModalEntrada({ isOpen, onClose, tipo, usuarioId, title, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [generatedId, setGeneratedId] = useState("");
  const [step, setStep] = useState(0); // 0 = selección, 1 = formulario

  // Generar ID automáticamente
  useEffect(() => {
    if (isOpen) {
      const id =
        tipo === "ropa"
          ? "IR" + Math.floor(1000 + Math.random() * 9000)
          : "IC" + Math.floor(1000 + Math.random() * 9000);
      setGeneratedId(id);
      setFormData((prev) => ({
        ...prev,
        id_ropa: tipo === "ropa" ? id : prev.id_ropa,
        id_comestible: tipo === "comestible" ? id : prev.id_comestible,
      }));
      setStep(0); // siempre empieza en selección
    }
  }, [isOpen, tipo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSuccess) onSuccess(formData);
    onClose();
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition mb-3";

  return (
    <ModalGInventario isOpen={isOpen} onClose={onClose} title={title}>
      {/* Paso 0: Selección */}
      {step === 0 && (
        <div className="text-center space-y-6">
          <p className="text-gray-700 text-lg">
            Aquí puedes registrar una nueva entrada de{" "}
            <span className="font-semibold text-red-600">{tipo === "ropa" ? "ropa deportiva" : "producto de consumo"}</span>.  
            Elige una de las siguientes opciones:
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              <PackagePlus className="w-5 h-5" />
              Nuevo Producto
            </button>
            <button
              onClick={() => alert("Aquí abrirías modal de producto existente")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
            >
              <ClipboardPlus className="w-5 h-5" />
              Producto Existente
            </button>
          </div>
        </div>
      )}

      {/* Paso 1: Formulario */}
      {step === 1 && (
        <form onSubmit={handleSubmit}>
          {/* Campos producto */}
          {tipo === "ropa" ? (
            <div className="grid grid-cols-2 gap-4">
              <input value={generatedId} disabled className={inputClass} />
              <input name="nombre" placeholder="Nombre" onChange={handleChange} className={inputClass} />
              <input name="marca" placeholder="Marca" onChange={handleChange} className={inputClass} />
              <input name="talla" placeholder="Talla" onChange={handleChange} className={inputClass} />
              <input name="color" placeholder="Color" onChange={handleChange} className={inputClass} />
              <input name="precio" placeholder="Precio" type="number" onChange={handleChange} className={inputClass} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <input value={generatedId} disabled className={inputClass} />
              <input name="nombre" placeholder="Nombre" onChange={handleChange} className={inputClass} />
              <input name="marca" placeholder="Marca" onChange={handleChange} className={inputClass} />
              <input name="sabor" placeholder="Sabor" onChange={handleChange} className={inputClass} />
              <input name="peso" placeholder="Peso" type="number" onChange={handleChange} className={inputClass} />
              <input name="litros" placeholder="Litros" type="number" onChange={handleChange} className={inputClass} />
              <input name="precio" placeholder="Precio" type="number" onChange={handleChange} className={inputClass} />
            </div>
          )}

          {/* Datos de compra */}
          <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-900">Datos de Compra</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="cantidad" placeholder="Cantidad" type="number" onChange={handleChange} className={inputClass} />
            <input name="tipo_comprobante" placeholder="Tipo Comprobante" onChange={handleChange} className={inputClass} />
            <input name="numero_comprobante" placeholder="Número Comprobante" onChange={handleChange} className={inputClass} />
            <input name="tipo_venta" placeholder="Tipo Venta" onChange={handleChange} className={inputClass} />
          </div>

          {/* Imagen y ubicación */}
          <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-900">Opcionales</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleChange}
              className="col-span-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            <input
              name="ubicacion"
              placeholder="Ubicación en almacén"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-6 gap-3">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
            >
              Volver
            </button>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
              >
                Registrar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}
    </ModalGInventario>
  );
}
