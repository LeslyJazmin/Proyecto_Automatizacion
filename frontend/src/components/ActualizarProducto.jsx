import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Shirt, CupSoda } from "lucide-react";

export default function ActualizarProducto({ producto, tipo, onClose, onActualizar }) {
  const [formData, setFormData] = useState({ ...producto });
  const [errors, setErrors] = useState({});
  const [mostrarCampo, setMostrarCampo] = useState(() => {
    if (tipo !== "comestible") return null;
    if (producto.peso && !producto.litros) return "peso";
    if (producto.litros && !producto.peso) return "litros";
    return null;
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
      if (tipo === "comestible" && (name === "peso" || name === "litros")) {
        setMostrarCampo(name);
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = tipo === "ropa"
      ? ["nombre", "marca", "talla", "color"]
      : ["nombre", "marca", "sabor"];

    if (tipo === "comestible") {
      if (mostrarCampo === "peso") requiredFields.push("peso");
      if (mostrarCampo === "litros") requiredFields.push("litros");
    }

    requiredFields.forEach(field => {
      if (!formData[field] && formData[field] !== 0) {
        newErrors[field] = "Este campo es obligatorio";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onActualizar(tipo, formData);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white shadow-2xl w-[90%] max-w-lg relative overflow-hidden"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: 'spring', duration: 0.4 }}
        >
          {/* Encabezado */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white px-6 py-4 flex flex-col items-center justify-center relative shadow-md">
            <div className="flex items-center gap-2">
              {tipo === "ropa" ? <Shirt className="w-7 h-7 text-white" /> : <CupSoda className="w-7 h-7 text-white" />}
              <h2 className="text-xl font-bold tracking-wide">
                Editar {tipo === "ropa" ? "Prenda Deportiva" : "Producto Comestible"}
              </h2>
            </div>
            <div className="mt-2 w-20 h-1 bg-white/80 rounded-full shadow-md animate-pulse"></div>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-white/80 hover:text-white transition"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-gray-700">
              <Campo label="Nombre" name="nombre" value={formData.nombre} readOnly classNameExtra="bg-gray-100 text-gray-600 cursor-not-allowed" error={errors.nombre} />
              
              {tipo === "ropa" ? (
                <>
                  <Campo label="Marca" name="marca" value={formData.marca} onChange={handleChange} error={errors.marca} />
                  <Campo label="Talla" name="talla" value={formData.talla} onChange={handleChange} error={errors.talla} />
                  <Campo label="Color" name="color" value={formData.color} onChange={handleChange} error={errors.color} />
                  <Campo label="Ubicación" name="ubicacion" value={formData.ubicacion} onChange={handleChange} optional />
                </>
              ) : (
                <>
                  <Campo label="Marca" name="marca" value={formData.marca} onChange={handleChange} error={errors.marca} />
                  <Campo label="Sabor" name="sabor" value={formData.sabor} onChange={handleChange} error={errors.sabor} />

                  {/* Peso/Litros */}
                  {mostrarCampo === "peso" && <Campo label="Peso (kg)" name="peso" type="number" step="0.01" value={formData.peso} onChange={handleChange} error={errors.peso} />}
                  {mostrarCampo === "litros" && <Campo label="Litros" name="litros" type="number" step="0.01" value={formData.litros} onChange={handleChange} error={errors.litros} />}
                  {!mostrarCampo && (
                    <div className="grid grid-cols-2 gap-3">
                      <Campo label="Peso (kg)" name="peso" type="number" step="0.01" value={formData.peso} onChange={handleChange} error={errors.peso} />
                      <Campo label="Litros" name="litros" type="number" step="0.01" value={formData.litros} onChange={handleChange} error={errors.litros} />
                    </div>
                  )}

                  <Campo label="Ubicación" name="ubicacion" value={formData.ubicacion} onChange={handleChange} optional />
                </>
              )}

              {/* Imagen opcional */}
              <div>
                <label className="block text-sm font-semibold mb-1">Imagen (opcional)</label>
                <input type="file" name="imagen" accept="image/*" onChange={handleChange} className="w-full text-sm" />
              </div>

              {/* BOTONES */}
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold text-gray-800 transition">Cancelar</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white rounded-lg font-semibold shadow-md hover:scale-105 transition-all">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* Subcomponente para inputs */
function Campo({ label, name, value, onChange, type = "text", readOnly = false, step, classNameExtra = "", error = "", optional = false }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">
        {label} {!optional && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        step={step}
        readOnly={readOnly}
        className={`w-full border ${error ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${classNameExtra}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
