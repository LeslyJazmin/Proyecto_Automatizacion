import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, Shirt, CupSoda, CalendarDays, Zap, Package, Tag, Pipette, Search } from "lucide-react";

/**
 * Subcomponente de campo de formulario con mejor estilo y manejo de errores.
 */
function Campo({
  label,
  name,
  value,
  onChange,
  type = "text",
  readOnly = false,
  step,
  classNameExtra = "",
  error = "",
  optional = false,
  icon: IconComponent, // Usa un componente Lucide directamente
}) {
  const isDate = type === "date";
  
  return (
    <div className="relative">
      <label className="block text-sm font-semibold mb-1 text-gray-700">
        {label} {!optional && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {IconComponent && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">{IconComponent}</div>}
        
        <input
          type={type}
          name={name}
          value={value || (isDate && !value ? "" : "")} // Asegurar que el valor vacío sea manejado correctamente para fechas
          onChange={onChange}
          step={step}
          readOnly={readOnly}
          className={`w-full border-2 ${
            error ? "border-red-500 bg-red-50" : "border-gray-200"
          } rounded-xl px-4 py-2 transition duration-300 ${
            IconComponent ? "pl-10" : "pl-4"
          } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${classNameExtra}
          ${readOnly ? "bg-gray-100 text-gray-600 cursor-not-allowed" : "bg-white text-gray-800"}`}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-xs mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Componente principal del formulario de actualización de producto (Modal).
 */
export default function ActualizarProducto({ producto, tipo, onClose, onActualizar }) {
  const [formData, setFormData] = useState({ ...producto });
  const [errors, setErrors] = useState({});
  
  // Mantiene la lógica original para mostrar peso/litros, pero se simplifica el renderizado
  const [mostrarCampo, setMostrarCampo] = useState(() => {
    if (tipo !== "comestible") return null;
    if (producto.peso && !producto.litros) return "peso";
    if (producto.litros && !producto.peso) return "litros";
    return null; // Muestra ambos campos en un grid
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
      if (tipo === "comestible" && (name === "peso" || name === "litros")) {
        // Si el usuario edita uno de los campos, lo forzamos a mostrar solo ese si el otro está vacío.
        // Si tienen valor, permitimos que se muestre el grid (null)
        if (!!formData.peso || !!formData.litros) {
             setMostrarCampo(null);
        } else {
             setMostrarCampo(name);
        }
      }
    }
  };

  const validate = useCallback(() => {
    const newErrors = {};
    const requiredFields =
      tipo === "ropa"
        ? ["nombre", "marca", "talla", "color"]
        : ["nombre", "marca", "sabor", "fecha_vencimiento"];

    if (tipo === "comestible") {
      // Si estamos en modo "mostrar uno", requerimos ese campo
      if (mostrarCampo === "peso") {
        if (!formData.peso && formData.peso !== 0) newErrors.peso = "Este campo es obligatorio";
      } else if (mostrarCampo === "litros") {
        if (!formData.litros && formData.litros !== 0) newErrors.litros = "Este campo es obligatorio";
      }
      // Si estamos en modo "mostrar ambos", la validación es menos estricta
    }

    requiredFields.forEach((field) => {
      if (!formData[field] && formData[field] !== 0) {
        newErrors[field] = "Este campo es obligatorio";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, mostrarCampo, tipo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onActualizar(tipo, formData);
  };
  
  const iconMap = {
      ropa: { icon: <Shirt size={24} />, title: "Prenda Deportiva" },
      comestible: { icon: <CupSoda size={24} />, title: "Producto Comestible" },
  };

  // FIX: Agregamos una comprobación de fallback para evitar el error de desestructuración (Cannot destructure property 'icon' of 'iconMap[tipo]' as it is undefined)
  const { icon: MainIcon, title: MainTitle } = iconMap[tipo] || { 
      icon: <Package size={24} />, 
      title: "Producto Desconocido (Tipo Inválido)" 
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          // MODIFICADO: Aumenta el ancho a max-w-3xl y mantiene el estilo formal
          className="bg-white shadow-3xl w-full max-w-3xl relative rounded-3xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          {/* Encabezado Formal y Oscuro */}
          <div className="bg-gray-800 text-white px-6 py-6 flex flex-col items-start relative shadow-lg">
            <div className="flex items-center gap-3">
              {MainIcon}
              <h2 className="text-2xl font-extrabold tracking-tight">
                Editar {MainTitle}
              </h2>
            </div>
            <p className="text-sm mt-1 text-gray-400">Modifica los detalles del producto seleccionado.</p>
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
            >
              <XCircle className="w-7 h-7" />
            </button>
          </div>

          {/* Cuerpo del formulario */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-gray-700">
              
              {/* Campos Estándar: Nombre (Fila única, readOnly) */}
              <Campo
                label="Nombre del Producto"
                name="nombre"
                value={formData.nombre}
                readOnly
                icon={<Tag size={18} />}
                error={errors.nombre}
                classNameExtra="border-dashed" // Estilo para campo no editable
              />

              {/* Campos Estándar: Marca y Ubicación (2 Columnas) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Campo label="Marca" name="marca" value={formData.marca} onChange={handleChange} error={errors.marca} icon={<Zap size={18} />} />
                <Campo label="Ubicación de Almacén" name="ubicacion" value={formData.ubicacion} onChange={handleChange} optional icon={<Search size={18} />} />
              </div>
              
              {/* Campos Condicionales */}
              {tipo === "ropa" ? (
                /* Campos para ROPA (2 Columnas) */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Campo label="Talla (S, M, L, etc.)" name="talla" value={formData.talla} onChange={handleChange} error={errors.talla} icon={<Shirt size={18} />} />
                  <Campo label="Color" name="color" value={formData.color} onChange={handleChange} error={errors.color} icon={<Pipette size={18} />} />
                </div>
              ) : (
                /* Campos para COMESTIBLE */
                <>
                  {/* Sabor/Variedad y Fecha de Vencimiento (2 Columnas) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Campo label="Sabor/Variedad" name="sabor" value={formData.sabor} onChange={handleChange} error={errors.sabor} icon={<CupSoda size={18} />} />
                    
                    <Campo
                      label="Fecha de Vencimiento"
                      name="fecha_vencimiento"
                      type="date"
                      icon={<CalendarDays size={18} />}
                      // El valor debe ser el slice para que el input type="date" lo maneje correctamente
                      value={formData.fecha_vencimiento ? formData.fecha_vencimiento.slice(0, 10) : ""}
                      onChange={handleChange}
                      error={errors.fecha_vencimiento}
                    />
                  </div>


                  {/* Lógica de Peso/Litros en Grid Dinámico (Se mantiene el grid interno) */}
                  <div className={`grid ${!mostrarCampo ? 'grid-cols-2 gap-4' : 'grid-cols-1'}`}>
                    {/* Muestra Peso si aplica o si está en modo grid */}
                    {(!mostrarCampo || mostrarCampo === "peso") && (
                        <Campo label="Peso (kg)" name="peso" type="number" step="0.01" value={formData.peso} onChange={handleChange} error={errors.peso} optional={mostrarCampo !== "peso"} />
                    )}
                    {/* Muestra Litros si aplica o si está en modo grid */}
                    {(!mostrarCampo || mostrarCampo === "litros") && (
                        <Campo label="Litros (L)" name="litros" type="number" step="0.01" value={formData.litros} onChange={handleChange} error={errors.litros} optional={mostrarCampo !== "litros"} />
                    )}
                  </div>
                </>
              )}

              {/* Imagen opcional - Mejor estilo para el input file */}
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  <Package size={18} className="inline mr-1 -mt-0.5" /> Imagen (opcional)
                </label>
                <input
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={handleChange}
                  // MODIFICADO: Estilo formal para el input file
                  className="w-full text-sm file:rounded-xl file:border-none file:bg-indigo-600 file:text-white file:px-4 file:py-2 hover:file:bg-indigo-700 cursor-pointer transition-all"
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  // MODIFICADO: Estilo secundario más formal
                  className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl font-bold text-gray-800 transition duration-300 hover:scale-[1.02]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  // MODIFICADO: Estilo principal formal (Indigo)
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-300/50 transition-all duration-300 hover:scale-[1.03] active:scale-100"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
