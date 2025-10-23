import { useState, useEffect } from "react";
import ModalGInventario from "../components/ui/ModalGInventario";
import ModalSeleccionProducto from "./ModalSeleccionProducto";
import { PlusSquare, Archive, DollarSign, Tag, ListChecks, ArrowLeft, TrendingUp, Info } from "lucide-react";

export default function ModalEntrada({ isOpen, onClose, tipo, usuarioId, title, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [generatedId, setGeneratedId] = useState("");
  const [step, setStep] = useState("inicio");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadRegistrar, setCantidadRegistrar] = useState(0);

  const handleClose = () => {
    setStep("inicio");
    setFormData({});
    setErrors({});
    setProductoSeleccionado(null);
    setGeneratedId("");
    setCantidadRegistrar(0);
    onClose();
  };

  useEffect(() => {
    if (isOpen && step === "nuevo") {
      const id =
        tipo === "ropa"
          ? "IR" + Math.floor(1000 + Math.random() * 9000)
          : "IC" + Math.floor(1000 + Math.random() * 9000);
      setGeneratedId(id);
      setFormData((prev) => ({
        ...prev,
        id_ropa: tipo === "ropa" ? id : prev.id_ropa,
        id_comestible: tipo === "comestible" ? id : prev.id_comestible,
        stock_actual: 0, // inicializar stock_actual en nuevo producto
      }));
    }
  }, [isOpen, step, tipo]);

  useEffect(() => {
    if (productoSeleccionado) {
      // Al seleccionar, se cargan todos los datos del producto
      setFormData(productoSeleccionado);
      setCantidadRegistrar(0);
    }
  }, [productoSeleccionado]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setFormData((prev) => ({ ...prev, [name]: files[0] }));
    else setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  
  const validate = () => {
    const newErrors = {};
    const requiredFields =
      tipo === "ropa"
        ? ["nombre", "marca", "talla", "color", "precio", "tipo_comprobante", "numero_comprobante", "metodo_pago", "monto_pagado"]
        : ["nombre", "marca", "sabor", "precio", "tipo_comprobante", "numero_comprobante", "metodo_pago", "monto_pagado"];

    if (!cantidadRegistrar || cantidadRegistrar <= 0) newErrors.cantidad = "Debe ser mayor a 0";

    requiredFields.forEach((field) => {
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
    // Enviar cantidad a añadir al stock
    const dataToSend = { ...formData, cantidad: cantidadRegistrar }; 
    if (onSuccess) onSuccess(dataToSend);
    handleClose();
  };

  const cardClass = "bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6 transition-all duration-300 hover:shadow-xl";
  const inputClass =
    "w-full px-4 py-2.5 border border-gray-300/80 rounded-xl focus:ring-3 focus:ring-emerald-500/50 focus:border-emerald-500/80 transition-all duration-300 text-sm placeholder-gray-400 shadow-sm disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed disabled:border-gray-200 hover:border-gray-400/80";
  const requiredInputClass = "bg-emerald-50 border-emerald-300";
  const specificationInputClass = "bg-blue-50/70 border-blue-300/80 hover:border-blue-400/80 focus:ring-blue-500/50 focus:border-blue-500/80";
  const errorClass = "!border-red-500 !ring-red-500";
  const errorMsgClass = "text-red-600 text-xs mt-1 font-medium";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1"; 
  const sectionTitleClass =
    "mt-0 mb-4 flex items-center gap-3 text-base font-extrabold text-gray-800 border-b border-emerald-500/50 pb-2";
  const formBtnClass =
    "font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2";
  const primaryBtnClass =
    "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 " + formBtnClass;
  const cancelBtnClass =
    "bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-400 " + formBtnClass;

  const FieldLabel = ({ text, required = false }) => (
    <div className={labelClass}>
      {text} {required && <span className="text-red-500">*</span>}
    </div>
  );

  const renderInput = (name, label, type = "text", optional = false, valueOverride = null, onChangeOverride = null, disabled = false, customStyle = '') => {
    const isCantidadField = name === "cantidad";
    const currentValue = isCantidadField ? cantidadRegistrar : (valueOverride !== null ? valueOverride : formData[name] || "");
    const currentOnChange = isCantidadField ? (e) => setCantidadRegistrar(Number(e.target.value)) : (onChangeOverride !== null ? onChangeOverride : handleChange);

    const isRequired = !optional && !disabled;
    const baseRequiredStyle = isRequired && !disabled ? requiredInputClass : '';
    const disabledTextClass = disabled ? 'font-semibold' : '';

    return (
      <div className="mb-4">
        <FieldLabel text={label} required={isRequired} />
        <input
          name={name}
          type={type}
          step={type === "number" ? "any" : undefined}
          value={currentValue}
          onChange={currentOnChange}
          disabled={disabled}
          className={`${inputClass} ${baseRequiredStyle} ${customStyle} ${errors[name] ? errorClass : ''} ${disabledTextClass}`}
        />
        {errors[name] && <div className={errorMsgClass}>{errors[name]}</div>}
      </div>
    );
  };

  const renderSelect = (name, label, options) => (
    <div className="mb-4">
      <FieldLabel text={label} required={true} />
      <select
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        className={`${inputClass} appearance-none ${errors[name] ? errorClass : ""} ${requiredInputClass}`}
      >
        <option value="" disabled>-- Seleccionar --</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && <div className={errorMsgClass}>{errors[name]}</div>}
    </div>
  );

  const renderReadOnlyField = (key, label, style = "") => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
        {label}
      </label>
      <input 
        value={formData[key] || "N/A"} 
        disabled 
        className={`${inputClass} font-semibold ${style}`} 
      />
    </div>
  );

  return (
    <ModalGInventario
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      maxWidth={step === "inicio" ? "520px" : "1100px"}
    >
      {/* Pantalla Inicial */}
      {step === "inicio" && (
        <div className="text-center py-8 animate-fadeIn">
          <h3 className="mb-2 text-gray-800 text-2xl font-black tracking-tighter">
            PROCESO DE INGRESO DE STOCK
          </h3>
          <p className="mb-12 text-gray-600 text-base px-6 leading-snug">
            Defina el tipo de operación: Registrar un nuevo artículo en el catálogo o aumentar la cantidad de un producto ya existente.
          </p>
          <div className="flex justify-center gap-6">
            <button onClick={() => setStep("nuevo")} className="relative flex flex-col items-center justify-center w-52 p-6 bg-emerald-50 text-emerald-800 rounded-2xl shadow-xl hover:shadow-emerald-300/60 hover:bg-emerald-100 transition-all duration-300 border-4 border-emerald-400/50 transform hover:scale-[1.03] active:scale-100">
              <PlusSquare className="w-8 h-8 mb-2" /> 
              <span className="font-extrabold text-base tracking-tight">Nuevo Producto</span> 
              <span className="text-xs text-emerald-600 mt-1">Alta de Catálogo</span>
            </button>
            <button onClick={() => setStep("existente_form")} className="flex flex-col items-center justify-center w-52 p-6 bg-white text-gray-800 rounded-2xl shadow-xl hover:shadow-gray-300/60 hover:ring-2 hover:ring-gray-200 transition-all duration-300 border-4 border-gray-300/50 transform hover:scale-[1.03] active:scale-100">
              <Archive className="w-8 h-8 mb-2 text-gray-600" /> 
              <span className="font-extrabold text-base tracking-tight">Producto Existente</span>
              <span className="text-xs text-gray-500 mt-1">Reabastecimiento de Stock</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Formulario Nuevo Producto */}
      {/* ---------------------------------------------------- */}
      {step === "nuevo" && (
        <form onSubmit={handleSubmit} className="animate-slideUp bg-gray-50 p-8 -m-5 rounded-b-xl space-y-6">
          
          <div className="grid grid-cols-3 gap-8">
            
            {/* Columna 1: Producto Core (2/3 del ancho) */}
            <div className="col-span-2 space-y-6">
              <div className={cardClass + " h-full"}>
                <h3 className={sectionTitleClass}>
                  <Tag size={20} className="text-emerald-600" />
                  Información del Nuevo Artículo
                </h3>
                
                {/* GRUPO 1: ID y Nombre (Fila principal) */}
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {/* ID (Columna 1) */}
                  <div className="col-span-1">
                    <FieldLabel text="ID" required={false} />
                    <input 
                      value={generatedId} 
                      disabled 
                      // Estilo personalizado para ID: fondo más fuerte, mono y negrita
                      className={`${inputClass} font-mono font-extrabold text-emerald-700 bg-emerald-100/70 border-emerald-200`} 
                    />
                  </div>
                  {/* Nombre/Descripción (Columnas 2-5) */}
                  <div className="col-span-4">
                    {renderInput("nombre", "Nombre/Descripción del Artículo")}
                  </div>
                </div>

                {/* GRUPO 2: Marca y Precio (Fila secundaria esencial) */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {/* Marca (Columnas 1-2) */}
                    <div className="col-span-2">
                        {renderInput("marca", "Marca")}
                    </div>
                    {/* Precio de Venta (Columnas 3-4) */}
                    <div className="col-span-2">
                        {renderInput("precio", "Precio de Venta (S/)", "number")}
                    </div>
                </div>

                {/* GRUPO 3: Especificaciones por Tipo (AHORA VERTICAL) */}
                <h4 className="text-sm font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1">ESPECIFICACIONES DEL PRODUCTO</h4>
                
                {/* Contenedor Flex para la apilación vertical */}
                <div className="flex flex-col gap-0"> 
                  
                  {tipo === "ropa" ? (
                    <>
                      {/* Ropa: Talla, Color - UNO DEBAJO DEL OTRO */}
                      <div className="w-full">
                        {renderInput("talla", "Talla (S, M, L, XL, etc.)", "text", false, null, null, false, specificationInputClass)}
                      </div>
                      <div className="w-full">
                        {renderInput("color", "Color Principal", "text", false, null, null, false, specificationInputClass)}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* --- COMESTIBLES AHORA VERTICAL (SOLO SABOR) --- */}
                      
                      <div className="w-full">
                        {renderInput("sabor", "Sabor/Tipo", "text", false, null, null, false, specificationInputClass)}
                      </div>

                      {/* ELIMINADO: Unidad de Medida y campos condicionales (peso/litros) */}
                      
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Columna 2: Detalles de Compra (1/3 del ancho) */}
            <div className="col-span-1 space-y-6">
              <div className={cardClass}>
                <h3 className={sectionTitleClass}>
                  <TrendingUp size={20} className="text-emerald-600" />
                  Entrada de Stock
                </h3>
                {/* Eliminamos el div flex-col gap-4 ya que renderInput ya tiene mb-4 */}
                <div className="flex flex-col gap-0">
                  {renderInput("cantidad", "Cantidad Inicial a Ingresar", "number")}
                  {renderInput("monto_pagado", "Costo de Compra Total (S/)", "number")}
                </div>
              </div>

              <div className={cardClass}>
                <h3 className={sectionTitleClass}>
                  <DollarSign size={20} className="text-emerald-600" />
                  Comprobante y Pago
                </h3>
                {/* Eliminamos el div flex-col gap-4 ya que renderInput/Select ya tiene mb-4 */}
                <div className="flex flex-col gap-0">
                  {renderSelect("tipo_comprobante", "Tipo de Comprobante", [
                    { value: "Boleta", label: "Boleta" },
                    { value: "Factura", label: "Factura" },
                  ])}
                  {renderInput("numero_comprobante", "N° Comprobante")}
                  {renderSelect("metodo_pago", "Método de Pago", [
                    { value: "Efectivo", label: "Efectivo" },
                    { value: "Yape", label: "Yape" },
                  ])}
                </div>
              </div>
            </div>
          </div>
          
          {/* Fila de Opcionales y Botones (Alineación con espacio) */}
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              {/* Tarjeta 3: Opcionales */}
              <div className={cardClass + " mb-0"}>
                <h3 className={sectionTitleClass.replace("mb-4", "mb-6")}>
                  <ListChecks size={20} className="text-emerald-600" />
                  Información Adicional (Opcional)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {renderInput("ubicacion", "Ubicación en almacén", "text", true)}
                  </div>
                  <div className="mb-4">
                    <FieldLabel text="Imagen del Producto" required={false} />
                    <input
                      type="file"
                      name="imagen"
                      accept="image/*"
                      onChange={handleChange}
                      // Clase mejorada para el input de archivo
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 transition duration-150 border border-gray-300 rounded-xl cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/70 p-1"
                    />
                    {formData.imagen && (
                      <span className="text-emerald-600 text-xs italic block mt-1">
                        Archivo seleccionado: {formData.imagen.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-1 flex items-end justify-end gap-4">
              <button type="button" onClick={() => setStep("inicio")} className={cancelBtnClass + " flex items-center gap-2"}>
                <ArrowLeft size={16} /> Volver
              </button>
              <button type="submit" className={primaryBtnClass}>
                Finalizar Registro
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ---------------------------------------------------- */}
      {/* Producto Existente - Selección */}
      {/* ---------------------------------------------------- */}
      {step === "existente_form" && !productoSeleccionado && (
        <ModalSeleccionProducto
          tipo={tipo}
          onClose={() => setStep("inicio")}
          onSelect={(producto) => setProductoSeleccionado(producto)}
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* Producto Existente - Formulario de Recarga */}
      {/* ---------------------------------------------------- */}
      {step === "existente_form" && productoSeleccionado && (
        <form onSubmit={handleSubmit} className="animate-slideUp bg-gray-50 p-8 -m-5 rounded-b-xl space-y-6">

          <div className="grid grid-cols-3 gap-8">
            
            {/* Columna 1 (Detalles del Producto - SOLO LECTURA) - 2/3 ancho */}
            <div className="col-span-2">
              <div className={cardClass + " bg-emerald-50/20 p-8 h-full"}>
                
                {/* Nuevo: Título y Stock en línea */}
                <div className="flex justify-between items-start mb-6 border-b border-emerald-500/70 pb-2">
                    <h3 className="flex items-center gap-3 text-base font-extrabold text-gray-800">
                      <Info size={20} className="text-emerald-700" />
                      Detalles del Producto Seleccionado
                    </h3>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-gray-500 uppercase block">Stock Actual</span>
                      {/* Aquí se usa formData.cantidad porque es el stock que trae el producto de la base de datos */}
                      <p className="text-3xl font-black text-emerald-800 leading-none">{formData.cantidad || 0}</p>
                    </div>
                </div>
                
                {/* Indicadores Clave Destacados (tamaño ajustado) */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {/* ID */}
                  <div className="col-span-1 p-4 bg-white rounded-xl shadow-md border-l-4 border-gray-400">
                    <span className="text-sm font-semibold text-gray-500 uppercase">ID</span>
                    <p className="text-lg font-bold text-gray-700 mt-1 font-mono">{formData[tipo === "ropa" ? "id_ropa" : "id_comestible"]}</p>
                  </div>
                  {/* Precio de Venta */}
                  <div className="col-span-1 p-4 bg-white rounded-xl shadow-md border-l-4 border-blue-400">
                    <span className="text-sm font-semibold text-gray-500 uppercase">Precio de Venta</span>
                    <p className="text-2xl font-black text-blue-700 mt-1">S/ {parseFloat(formData.precio).toFixed(2) || '0.00'}</p>
                  </div>
                  {/* Ubicación (Si existe) */}
                  <div className="col-span-1 p-4 bg-white rounded-xl shadow-md border-l-4 border-yellow-500">
                    <span className="text-sm font-semibold text-gray-500 uppercase">Ubicación</span>
                    <p className="text-lg font-bold text-gray-700 mt-1">{formData.ubicacion || 'N/A'}</p>
                  </div>
                </div>

                {/* Ficha Técnica (Otros Datos) - ORDEN MEJORADO */}
                <h4 className="text-sm font-bold text-gray-700 mb-3 border-b border-gray-300 pb-1">FICHA TÉCNICA</h4>
                <div className="grid grid-cols-4 gap-4">
                  
                  {/* Campos Fijos */}
                  {renderReadOnlyField("nombre", "Nombre")}
                  {renderReadOnlyField("marca", "Marca")}
                  
                  {/* Campos Condicionales Ropa (Talla y Color) */}
                  {tipo === "ropa" && (
                    <>
                      {renderReadOnlyField("talla", "Talla", specificationInputClass)}
                      {renderReadOnlyField("color", "Color Principal", specificationInputClass)}
                    </>
                  )}

                  {/* Campos Condicionales Comestible (SOLO SABOR) */}
                  {tipo === "comestible" && (
                    <>
                      {renderReadOnlyField("sabor", "Sabor/Tipo", specificationInputClass)}
                      {/* Se deja un espacio de relleno ya que solo queda un campo de especificación */}
                      <div className="col-span-1"></div>
                      <div className="col-span-2"></div> 
                    </>
                  )}

                </div>

              </div>
            </div>

            {/* Columna 2 (Formulario de Entrada - EDITABLE) - 1/3 ancho */}
            <div className="col-span-1 space-y-6">
              <div className={cardClass + " p-6 h-full"}>
                <h3 className={sectionTitleClass.replace("mb-4", "mb-6")}>
                  <TrendingUp size={24} className="text-emerald-600" />
                  Datos de la Nueva Entrada
                </h3>
                
                {/* Eliminamos el div flex-col gap-4 ya que renderInput ya tiene mb-4 */}
                <div className="flex flex-col gap-0">
                  {/* Este campo usa la variable de estado 'cantidadRegistrar' */}
                  {renderInput("cantidad", "Cantidad a Registrar", "number")} 
                  {renderInput("monto_pagado", "Costo de Compra Total (S/)", "number")}
                </div>

                <h3 className={sectionTitleClass.replace("mt-0", "mt-8").replace("mb-4", "mb-4").replace("text-base", "text-sm")}>
                  Detalles de Facturación
                </h3>
                
                {/* Eliminamos el div flex-col gap-4 ya que renderInput/Select ya tiene mb-4 */}
                <div className="flex flex-col gap-0">
                  {renderSelect("tipo_comprobante", "Tipo de Comprobante", [
                    { value: "Boleta", label: "Boleta" },
                    { value: "Factura", label: "Factura" },
                  ])}
                  {renderInput("numero_comprobante", "N° Comprobante")}
                  {renderSelect("metodo_pago", "Método de Pago", [
                    { value: "Efectivo", label: "Efectivo" },
                    { value: "Yape", label: "Yape" },
                  ])}
                </div>

                {/* Botón de Confirmación Flotante */}
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <button type="submit" className={primaryBtnClass + " w-full"}>
                    Confirmar Recarga de Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Botón de volver a seleccionar producto */}
          <div className="flex justify-start mt-4 pt-4 border-t border-gray-200 gap-4">
            <button 
              type="button" 
              onClick={() => { setProductoSeleccionado(null); }} 
              className={cancelBtnClass + " flex items-center gap-2"}>
              <ArrowLeft size={16} /> Cambiar Producto
            </button>
          </div>
        </form>
      )}
    </ModalGInventario>
  );
}