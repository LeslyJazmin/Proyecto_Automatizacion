import { useState, useEffect } from "react";
import ModalGInventario from "../components/ui/ModalGInventario";
import ModalSeleccionProducto from "./ModalSeleccionProducto";

export default function ModalEntrada({ isOpen, onClose, tipo, usuarioId, title, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [generatedId, setGeneratedId] = useState("");
  const [step, setStep] = useState("inicio"); // inicio | nuevo | existente_form
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadRegistrar, setCantidadRegistrar] = useState(0); // NUEVO ESTADO

  // --- Resetear modal al cerrar ---
  const handleClose = () => {
    setStep("inicio");
    setFormData({});
    setProductoSeleccionado(null);
    setGeneratedId("");
    setCantidadRegistrar(0);
    onClose();
  };

  // Generar ID automáticamente solo en nuevo producto
  useEffect(() => {
    if (isOpen && step === "nuevo") {
      const id = tipo === "ropa"
        ? "IR" + Math.floor(1000 + Math.random() * 9000)
        : "IC" + Math.floor(1000 + Math.random() * 9000);

      setGeneratedId(id);
      setFormData((prev) => ({
        ...prev,
        id_ropa: tipo === "ropa" ? id : prev.id_ropa,
        id_comestible: tipo === "comestible" ? id : prev.id_comestible,
      }));
    }
  }, [isOpen, step, tipo]);

  // Autocompletar datos si se selecciona producto existente
  useEffect(() => {
    if (productoSeleccionado) {
      setFormData(productoSeleccionado);
      setCantidadRegistrar(0); // Reiniciamos cantidad a registrar
    }
  }, [productoSeleccionado]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (name === "cantidad") {
      setCantidadRegistrar(Number(value)); // Solo modificamos la cantidad a registrar
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData, cantidad: cantidadRegistrar }; // cantidad a sumar
    if (onSuccess) onSuccess(dataToSend);
    handleClose();
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition mb-3";

  return (
    <ModalGInventario isOpen={isOpen} onClose={handleClose} title={title}>
      {/* Pantalla inicial */}
      {step === "inicio" && (
        <div className="text-center">
          <p className="mb-6 text-gray-600">
            Selecciona el tipo de entrada que deseas registrar:
          </p>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => setStep("nuevo")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-lg shadow-md transition"
            >
              ➕ Nuevo Producto
            </button>
            <button
              onClick={() => setStep("existente_form")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg shadow-md transition"
            >
              📦 Producto Existente
            </button>
          </div>
        </div>
      )}

      {/* Formulario Nuevo Producto */}
      {step === "nuevo" && (
        <form onSubmit={handleSubmit}>
          {/* --- Todo tu formulario de nuevo producto intacto --- */}
          {tipo === "ropa" ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <input value={generatedId} disabled className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input name="nombre" onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input name="marca" onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Talla</label>
                <input name="talla" onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input name="color" onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input name="precio" type="number" onChange={handleChange} className={inputClass} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <input value={generatedId} disabled className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input name="nombre" onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input name="marca" onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sabor</label>
                <input name="sabor" onChange={handleChange} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Registrar por</label>
                <select
                  name="unidad_medida"
                  value={formData.unidad_medida || ""}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">-- Seleccionar --</option>
                  <option value="peso">Peso</option>
                  <option value="litros">Litros</option>
                </select>
              </div>
              {formData.unidad_medida === "peso" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input name="peso" type="number" onChange={handleChange} className={inputClass} />
                </div>
              )}
              {formData.unidad_medida === "litros" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Litros</label>
                  <input name="litros" type="number" onChange={handleChange} className={inputClass} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input name="precio" type="number" onChange={handleChange} className={inputClass} />
              </div>
            </div>
          )}

          {/* Datos de compra */}
          <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-900">Datos de Compra</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
              <input name="cantidad" type="number" onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Comprobante</label>
              <input name="tipo_comprobante" onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número Comprobante</label>
              <input name="numero_comprobante" onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Venta</label>
              <input name="tipo_venta" onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Opcionales */}
          <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-900">Opcionales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
              <input
                type="file"
                name="imagen"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación en almacén</label>
              <input name="ubicacion" onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition">
              Registrar
            </button>
            <button type="button" onClick={handleClose} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-lg shadow transition">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Producto existente */}
      {step === "existente_form" && !productoSeleccionado && (
        <ModalSeleccionProducto
          tipo={tipo}
          onClose={() => setStep("inicio")}
          onSelect={(producto) => setProductoSeleccionado(producto)}
        />
      )}

      {step === "existente_form" && productoSeleccionado && (
        <form onSubmit={handleSubmit}>
          {/* Datos bloqueados */}
          {tipo === "ropa" ? (
            <div className="grid grid-cols-2 gap-4">
              {["id_ropa","nombre","marca","talla","color","precio"].map((campo) => (
                <div key={campo}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{campo.toUpperCase()}</label>
                  <input value={formData[campo]} disabled className={inputClass} />
                </div>
              ))}
              {/* Cantidad Actual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Actual</label>
                <input value={formData.cantidad || 0} disabled className={inputClass} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <input value={formData.id_comestible} disabled className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input value={formData.nombre} disabled className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input value={formData.marca} disabled className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sabor</label>
                <input value={formData.sabor} disabled className={inputClass} />
              </div>

              {formData.peso ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                  <input value={formData.peso} disabled className={inputClass} />
                </div>
              ) : formData.litros ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Litros</label>
                  <input value={formData.litros} disabled className={inputClass} />
                </div>
              ) : null}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input value={formData.precio} disabled className={inputClass} />
              </div>

              {/* Cantidad Actual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Actual</label>
                <input value={formData.cantidad || 0} disabled className={inputClass} />
              </div>
            </div>
          )}

          {/* Datos editables para registrar nueva entrada */}
          <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-900">Registrar Nueva Entrada</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad a Registrar</label>
              <input
                type="number"
                name="cantidad"
                value={cantidadRegistrar}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Comprobante</label>
              <input name="tipo_comprobante" defaultValue={formData.tipo_comprobante} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número Comprobante</label>
              <input name="numero_comprobante" defaultValue={formData.numero_comprobante} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Venta</label>
              <input name="tipo_venta" defaultValue={formData.tipo_venta} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition">
              Actualizar
            </button>
            <button type="button" onClick={handleClose} className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-lg shadow transition">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </ModalGInventario>
  );
}
