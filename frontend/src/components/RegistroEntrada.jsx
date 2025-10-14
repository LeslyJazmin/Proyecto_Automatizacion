import { useState, useEffect } from "react";
import ModalGInventario from "../components/ui/ModalGInventario";
import ModalSeleccionProducto from "./ModalSeleccionProducto";
import { PlusSquare, Archive } from "lucide-react";

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
      }));
    }
  }, [isOpen, step, tipo]);

  useEffect(() => {
    if (productoSeleccionado) {
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
        ? [
            "nombre",
            "marca",
            "talla",
            "color",
            "precio",
            "cantidad",
            "tipo_comprobante",
            "numero_comprobante",
            "metodo_pago",
            "monto_pagado",
          ]
        : [
            "nombre",
            "marca",
            "sabor",
            "precio",
            "unidad_medida",
            "cantidad",
            "tipo_comprobante",
            "numero_comprobante",
            "metodo_pago",
            "monto_pagado",
          ];

    if (tipo === "comestible") {
      if (formData.unidad_medida === "peso") requiredFields.push("peso");
      if (formData.unidad_medida === "litros") requiredFields.push("litros");
    }

    requiredFields.forEach((field) => {
      if (
        (field === "cantidad" && !cantidadRegistrar) ||
        (!formData[field] && formData[field] !== 0 && field !== "cantidad")
      ) {
        newErrors[field] = "Este campo es obligatorio";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const dataToSend = { ...formData, cantidad: cantidadRegistrar };
    if (onSuccess) onSuccess(dataToSend);
    handleClose();
  };

  const inputClass =
    "w-full px-3 py-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 shadow-sm text-[13px] bg-white/80 backdrop-blur-sm placeholder-gray-400";
  const errorClass = "border-red-500 ring-red-500";
  const errorMsgClass = "text-red-500 text-xs mt-0.5";
  const sectionTitleClass =
    "mt-5 mb-2 text-sm font-semibold text-green-800 uppercase tracking-wide border-b border-green-200 pb-1";
  const formBtnClass =
    "font-medium text-sm px-4 py-2.5 rounded-xl shadow-sm transition duration-300 focus:outline-none";
  const primaryBtnClass =
    "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-green-800 text-white " +
    formBtnClass;
  const cancelBtnClass =
    "bg-gray-200 hover:bg-gray-300 text-gray-800 " + formBtnClass;

  const requiredLabel = (text) => (
    <>
      {text} <span className="text-red-500">*</span>
    </>
  );

  const renderInput = (name, label, type = "text", optional = false, value = null, onChange = null) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {optional ? label : requiredLabel(label)}
      </label>
      <input
        name={name}
        type={type}
        value={value !== null ? value : formData[name] || ""}
        onChange={onChange !== null ? onChange : handleChange}
        className={`${inputClass} ${errors[name] ? errorClass : ""}`}
      />
      {errors[name] && <div className={errorMsgClass}>{errors[name]}</div>}
    </div>
  );

  return (
    <ModalGInventario
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      maxWidth={step === "inicio" ? "640px" : "980px"}
    >
      {/* Pantalla Inicial */}
      {step === "inicio" && (
        <div className="text-center animate-fadeIn">
          <p className="mb-6 text-gray-600 text-sm px-8 leading-relaxed">
            {tipo === "ropa"
              ? "Registra nuevas prendas deportivas o actualiza entradas existentes en tu inventario."
              : "Agrega nuevos productos comestibles o actualiza entradas existentes en tu inventario."}
          </p>
          <div className="flex justify-center gap-8">
            <button
              onClick={() => setStep("nuevo")}
              className="flex flex-col items-center justify-center w-52 p-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <PlusSquare className="w-9 h-9 mb-2" />
              <span className="font-medium text-sm">Nuevo Producto</span>
            </button>

            <button
              onClick={() => setStep("existente_form")}
              className="flex flex-col items-center justify-center w-52 p-5 bg-gray-50 text-gray-700 rounded-2xl shadow-md hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition-all"
            >
              <Archive className="w-9 h-9 mb-2 text-green-600" />
              <span className="font-medium text-sm">Producto Existente</span>
            </button>
          </div>
        </div>
      )}

      {/* Formulario Nuevo */}
      {step === "nuevo" && (
        <form onSubmit={handleSubmit} className="animate-slideUp">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <input value={generatedId} disabled className={`${inputClass} bg-gray-100`} />
            </div>

            {renderInput("nombre", "Nombre")}
            {tipo === "ropa" ? (
              <>
                {renderInput("marca", "Marca")}
                {renderInput("talla", "Talla")}
                {renderInput("color", "Color")}
                {renderInput("precio", "Precio", "number")}
              </>
            ) : (
              <>
                {renderInput("marca", "Marca")}
                {renderInput("sabor", "Sabor")}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {requiredLabel("Registrar por")}
                  </label>
                  <select
                    name="unidad_medida"
                    value={formData.unidad_medida || ""}
                    onChange={handleChange}
                    className={`${inputClass} ${errors["unidad_medida"] ? errorClass : ""}`}
                  >
                    <option value="">-- Seleccionar --</option>
                    <option value="peso">Peso</option>
                    <option value="litros">Litros</option>
                  </select>
                  {errors["unidad_medida"] && <div className={errorMsgClass}>{errors["unidad_medida"]}</div>}
                </div>
                {formData.unidad_medida === "peso" && renderInput("peso", "Peso (kg)", "number")}
                {formData.unidad_medida === "litros" && renderInput("litros", "Litros", "number")}
                {renderInput("precio", "Precio", "number")}
              </>
            )}
          </div>

          <h3 className={sectionTitleClass}>Datos de Compra</h3>
          <div className="grid grid-cols-2 gap-4">
            {renderInput(
              "cantidad",
              "Cantidad",
              "number",
              false,
              cantidadRegistrar,
              (e) => setCantidadRegistrar(Number(e.target.value))
            )}

            {/* Tipo de Comprobante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {requiredLabel("Tipo de Comprobante")}
              </label>
              <select
                name="tipo_comprobante"
                value={formData.tipo_comprobante || ""}
                onChange={handleChange}
                className={`${inputClass} ${errors["tipo_comprobante"] ? errorClass : ""}`}
              >
                <option value="">-- Seleccionar --</option>
                <option value="Boleta">Boleta</option>
                <option value="Factura">Factura</option>
              </select>
              {errors["tipo_comprobante"] && <div className={errorMsgClass}>{errors["tipo_comprobante"]}</div>}
            </div>

            {/* Método de Pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {requiredLabel("Método de Pago")}
              </label>
              <select
                name="metodo_pago"
                value={formData.metodo_pago || ""}
                onChange={handleChange}
                className={`${inputClass} ${errors["metodo_pago"] ? errorClass : ""}`}
              >
                <option value="">-- Seleccionar --</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Yape">Yape</option>
              </select>
              {errors["metodo_pago"] && <div className={errorMsgClass}>{errors["metodo_pago"]}</div>}
            </div>

            {renderInput("numero_comprobante", "Número Comprobante")}
            {renderInput("monto_pagado", "Monto Pagado (S/)", "number")}
          </div>

          <h3 className={sectionTitleClass}>Opcionales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-2">
  <label className="block text-sm font-medium text-gray-700">
    Imagen
  </label>
  <input
    type="file"
    name="imagen"
    accept="image/*"
    onChange={handleChange}
    className="block w-full text-sm text-gray-900 border border-green-300 rounded-xl cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 p-2"
  />
  {formData.imagen && (
    <span className="text-green-700 text-xs">
      {formData.imagen.name}
    </span>
  )}
</div>

            {renderInput("ubicacion", "Ubicación en almacén", "text", true)}
          </div>

          <div className="flex justify-end mt-5 gap-3">
            <button type="submit" className={primaryBtnClass}>
              Registrar
            </button>
            <button type="button" onClick={handleClose} className={cancelBtnClass}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Producto Existente */}
      {step === "existente_form" && !productoSeleccionado && (
        <ModalSeleccionProducto
          tipo={tipo}
          onClose={() => setStep("inicio")}
          onSelect={(producto) => setProductoSeleccionado(producto)}
        />
      )}

      {step === "existente_form" && productoSeleccionado && (
        <form onSubmit={handleSubmit} className="animate-slideUp">
          <div className="grid grid-cols-2 gap-4">
            {(tipo === "ropa"
              ? ["id_ropa", "nombre", "marca", "talla", "color", "precio"]
              : ["id_comestible", "nombre", "marca", "sabor", "precio"]
            ).map((campo) => (
              <div key={campo}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {campo.toUpperCase()}
                </label>
                <input value={formData[campo]} disabled className={`${inputClass} bg-gray-100`} />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Actual</label>
              <input value={formData.cantidad || 0} disabled className={`${inputClass} bg-gray-100`} />
            </div>
          </div>

          <h3 className={sectionTitleClass}>Registrar Nueva Entrada</h3>
          <div className="grid grid-cols-2 gap-4">
            {renderInput(
              "cantidad",
              "Cantidad a Registrar",
              "number",
              false,
              cantidadRegistrar,
              (e) => setCantidadRegistrar(Number(e.target.value))
            )}

            {/* Tipo de Comprobante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {requiredLabel("Tipo de Comprobante")}
              </label>
              <select
                name="tipo_comprobante"
                value={formData.tipo_comprobante || ""}
                onChange={handleChange}
                className={`${inputClass} ${errors["tipo_comprobante"] ? errorClass : ""}`}
              >
                <option value="">-- Seleccionar --</option>
                <option value="Boleta">Boleta</option>
                <option value="Factura">Factura</option>
              </select>
              {errors["tipo_comprobante"] && <div className={errorMsgClass}>{errors["tipo_comprobante"]}</div>}
            </div>

            {/* Método de Pago */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {requiredLabel("Método de Pago")}
              </label>
              <select
                name="metodo_pago"
                value={formData.metodo_pago || ""}
                onChange={handleChange}
                className={`${inputClass} ${errors["metodo_pago"] ? errorClass : ""}`}
              >
                <option value="">-- Seleccionar --</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Yape">Yape</option>
              </select>
              {errors["metodo_pago"] && <div className={errorMsgClass}>{errors["metodo_pago"]}</div>}
            </div>

            {renderInput("numero_comprobante", "Número Comprobante")}
            {renderInput("monto_pagado", "Monto Pagado (S/)", "number")}
          </div>

          <div className="flex justify-end mt-5 gap-3">
            <button type="submit" className={primaryBtnClass}>
              Actualizar
            </button>
            <button type="button" onClick={handleClose} className={cancelBtnClass}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </ModalGInventario>
  );
}
