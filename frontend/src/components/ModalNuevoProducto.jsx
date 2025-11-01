import { useState, useEffect } from "react";
import ModalGInventario from "./ui/ModalGInventario";
import { Tag, TrendingUp, DollarSign, ArrowLeft, Image, Package, CheckSquare } from "lucide-react"; 
import { buscarRopa, buscarComestibles } from "../api/inventario";

export default function ModalNuevoProducto({ isOpen, onClose, tipo, title, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [generatedId, setGeneratedId] = useState("");
  const [cantidadRegistrar, setCantidadRegistrar] = useState(0);
  const [nombreExiste, setNombreExiste] = useState(false);

  const handleClose = () => {
    setFormData({});
    setErrors({});
    setGeneratedId("");
    setCantidadRegistrar(0);
    setNombreExiste(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      const id = tipo === "ropa"
        ? "IR" + Math.floor(1000 + Math.random() * 9000)
        : "IC" + Math.floor(1000 + Math.random() * 9000);
      setGeneratedId(id);
      setFormData(prev => ({
        ...prev,
        id_ropa: tipo === "ropa" ? id : prev.id_ropa,
        id_comestible: tipo === "comestible" ? id : prev.id_comestible,
      }));
    }
  }, [isOpen, tipo]);

  useEffect(() => {
    const checkNombre = async () => {
      if (!formData.nombre) return setNombreExiste(false);
      try {
        const results = tipo === "ropa"
          ? await buscarRopa(formData.nombre)
          : await buscarComestibles(formData.nombre);
        setNombreExiste(results.length > 0);
      } catch {
        setNombreExiste(false);
      }
    };
    const timer = setTimeout(checkNombre, 500);
    return () => clearTimeout(timer);
  }, [formData.nombre, tipo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = tipo === "ropa"
      ? ["nombre","marca","talla","color","precio","stock_actual","tipo_comprobante","numero_comprobante","metodo_pago","monto_pagado"]
      : ["nombre","marca","sabor","precio","stock_actual","unidad_medida","tipo_comprobante","numero_comprobante","metodo_pago","monto_pagado"];

    requiredFields.forEach(field => {
      if ((field === "stock_actual" && (!cantidadRegistrar || cantidadRegistrar <= 0)) ||
          (!formData[field] && formData[field] !== 0 && field !== "stock_actual")) {
        newErrors[field] = field === "stock_actual" ? "Debe ser mayor a 0" : "Este campo es obligatorio";
      }
    });

    if (tipo === "comestible") {
      if (formData.unidad_medida && formData.unidad_medida === "peso" && (!formData.peso || formData.peso <= 0))
        newErrors.peso = "Debe indicar el peso del producto (Kg)";
      if (formData.unidad_medida && formData.unidad_medida === "litro" && (!formData.litros || formData.litros <= 0))
        newErrors.litros = "Debe indicar el volumen del producto (L)";
      if (!formData.unidad_medida) newErrors.unidad_medida = "Este campo es obligatorio";
    }

    if (nombreExiste) newErrors.nombre = "Este producto ya existe en el sistema";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSuccess({ ...formData, stock_actual: cantidadRegistrar });
    handleClose();
  };

  const FieldLabel = ({ text, required = false }) => (
    <div className="block text-xs font-semibold text-gray-700 mb-0.5"> 
      {text} {required && <span className="text-red-500 font-extrabold">*</span>}
    </div>
  );

const renderInput = (name, label, type="text", optional=false, valueOverride=null, disabled=false, customStyle="") => {
  const currentValue = name === "stock_actual" ? cantidadRegistrar : (valueOverride ?? formData[name] ?? "");
  const currentOnChange = name === "stock_actual" 
    ? (e) => setCantidadRegistrar(Number(e.target.value)) 
    : handleChange;
  
  const isImportantNumber = (name === "stock_actual" || name === "monto_pagado" || name === "precio");

  return (
    <div className="mb-2 w-full">
      <FieldLabel text={label} required={!optional && !disabled} />
      <input
        name={name}
        type={type}
        step={name === "stock_actual" ? "1" : type === "number" ? "any" : undefined}
        min={isImportantNumber ? 0 : undefined}
        inputMode={name === "stock_actual" ? "numeric" : undefined}
        pattern={name === "stock_actual" ? "[0-9]*" : undefined}
        onKeyDown={(e) => {
          if (name === "stock_actual" && (e.key === '.' || e.key === '-' || e.key === 'e')) e.preventDefault();
          if (isImportantNumber && e.key === '-') e.preventDefault();
        }}
        value={currentValue}
        onChange={currentOnChange}
        disabled={disabled}
        className={`
          w-full px-2.5 py-1.5 border rounded-md text-sm placeholder-gray-400 
          shadow-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 
          transition duration-150 ease-in-out
          ${customStyle} 
          ${isImportantNumber ? 'font-bold text-base text-emerald-800' : 'text-sm'} 
          ${errors[name] ? "border-red-500 ring-red-500" : "border-gray-300"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        `}
      />
      {errors[name] && <div className="text-red-600 text-xs mt-0.5 font-medium">{errors[name]}</div>}
    </div>
  );
};


  const renderSelect = (name, label, options) => (
    <div className="mb-2 w-full"> 
      <FieldLabel text={label} required={true} />
      <select
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        className={`
          w-full px-2.5 py-1.5 border rounded-md text-sm shadow-sm 
          focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 
          transition duration-150 ease-in-out
          ${errors[name] ? "border-red-500 ring-red-500" : "border-gray-300"}
          bg-white appearance-none cursor-pointer
        `}
      >
        <option value="" disabled className="text-gray-400">-- Seleccionar --</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {errors[name] && <div className="text-red-600 text-xs mt-0.5 font-medium">{errors[name]}</div>} 
    </div>
  );

  return (
    <ModalGInventario
      isOpen={isOpen}
      onClose={handleClose} title={title}
      tipo="entrada" // 🟢 header verde
      headerIcon={TrendingUp}
    >

      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg shadow-inner space-y-4"> 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> 

          {/* Columna 1: Identificación y Características */}
          <div className="lg:col-span-2 space-y-4"> 
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200"> 
              <h3 className="flex items-center gap-2 font-extrabold text-base text-emerald-700 mb-3 border-b border-emerald-100 pb-2"> 
                <Tag size={18} className="text-emerald-500" /> Información Principal del Producto
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-3 items-end"> 
                <div className="col-span-1">
                  <FieldLabel text="ID Generado" />
                  <input value={generatedId} disabled className="w-full px-2 py-1.5 text-xs font-mono font-extrabold text-white bg-emerald-600 rounded-md border-emerald-700 text-center shadow-inner" /> 
                </div>
                <div className="col-span-4">
                  {renderInput("nombre", "Nombre/Descripción", "text", false, null, false, "bg-emerald-50/50")}
                  {nombreExiste && <div className="flex items-center text-xs font-medium text-red-600 bg-red-100 p-1 rounded-sm mt-0.5">⚠️ Este producto ya existe en el sistema.</div>} 
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> 
                {renderInput("marca", "Marca", "text", false, null, false, "bg-blue-50")}
                {renderInput("precio", "Precio Unitario de Venta (S/)", "number", false, null, false, "bg-blue-50")}
              </div>

              <div className="mt-3 border-t border-gray-200 pt-3"> 
                <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1.5"><CheckSquare size={14} className="text-gray-500"/> Especificaciones:</h4> 
                {tipo === "ropa" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> 
                    {renderInput("talla", "Talla", "text", false, null, false, "bg-blue-50")}
                    {renderInput("color", "Color", "text", false, null, false, "bg-blue-50")}
                  </div>
                )}

                {tipo === "comestible" && (
                  <>
                    {renderInput("sabor", "Sabor/Tipo", "text", false, null, false, "bg-blue-50")}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> 
                      {renderSelect("unidad_medida", "Unidad de Medida", [{ value: "peso", label: "Peso (Kg)" }, { value: "litro", label: "Litro (L)" }])}
                      {formData.unidad_medida && (
                        formData.unidad_medida === "peso"
                          ? renderInput("peso", "Peso (Kg)", "number", false, null, false, "bg-blue-50")
                          : renderInput("litros", "Volumen (L)", "number", false, null, false, "bg-blue-50")
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200"> 
              <h3 className="flex items-center gap-2 font-bold text-base text-gray-800 mb-3 border-b border-gray-200 pb-2"> 
                <Image size={18} className="text-emerald-500" /> Información Adicional y Archivos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> 
                {renderInput("ubicacion", "Ubicación en almacén", "text", true)}
                <div>
                  <FieldLabel text="Cargar Imagen (Opcional)" optional={true} />
                  <input 
                    type="file" 
                    name="imagen" 
                    accept="image/*" 
                    onChange={handleChange} 
                    className="block w-full text-sm text-gray-700 
                    file:mr-1.5 file:py-1.5 file:px-2 file:rounded-md file:border-0 
                    file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-700 
                    hover:file:bg-emerald-200 transition duration-150 
                    border border-gray-300 rounded-md cursor-pointer bg-white 
                    focus:outline-none focus:ring-1 focus:ring-emerald-500/70"
                  />
                  {formData.imagen && <span className="text-emerald-600 text-xs italic block mt-0.5">Archivo: {formData.imagen.name}</span>} 
                </div>
              </div>
            </div>
          </div>

          {/* Columna 2: Stock y Pago */}
          <div className="lg:col-span-1 space-y-4"> 
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-fit"> 
              <h3 className="flex items-center gap-2 font-bold text-base text-gray-800 mb-3 border-b border-gray-200 pb-2"> 
                <TrendingUp size={18} className="text-emerald-500" /> Gestión de Inventario
              </h3>
              {renderInput("stock_actual", "Cantidad Inicial (Stock)", "number")}
              {renderInput("monto_pagado", "Costo Total de Compra (S/)", "number")}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 h-fit"> 
              <h3 className="flex items-center gap-2 font-bold text-base text-gray-800 mb-3 border-b border-gray-200 pb-2"> 
                <DollarSign size={18} className="text-emerald-500" /> Detalles de la Transacción
              </h3>
              {renderSelect("tipo_comprobante", "Tipo Comprobante", [{ value: "Boleta", label: "Boleta" }, { value: "Factura", label: "Factura" }])}
              {renderInput("numero_comprobante", "N° Comprobante")}
              {renderSelect("metodo_pago", "Método de Pago", [{ value: "Efectivo", label: "Efectivo" }, { value: "Yape", label: "Yape" }])}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-200"> 
          <button 
            type="button" 
            onClick={handleClose} 
            className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-1.5 font-semibold text-sm transition duration-150 shadow-sm"
          >
            <ArrowLeft size={16} /> Cancelar
          </button>
          <button 
            type="submit" 
            disabled={nombreExiste} 
            className={`px-4 py-1.5 rounded-md text-white flex items-center gap-1.5 font-semibold text-sm transition duration-150 shadow-md
              ${nombreExiste ? "bg-red-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
          >
            <Package size={16} /> Registrar Producto
          </button>
        </div>
      </form>
    </ModalGInventario>
  );
}
