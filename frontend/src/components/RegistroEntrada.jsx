import { useState, useEffect } from "react";
import ModalGInventario from "../components/ui/ModalGInventario";
import ModalSeleccionProducto from "./ModalSeleccionProducto";
import { PlusSquare, Archive } from "lucide-react";

export default function ModalEntrada({ isOpen, onClose, tipo, usuarioId, title, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [generatedId, setGeneratedId] = useState("");
  const [step, setStep] = useState("inicio"); // inicio | nuevo | existente_form
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
    const requiredFields = tipo === "ropa"
      ? ["nombre", "marca", "talla", "color", "precio", "cantidad", "tipo_comprobante", "numero_comprobante", "tipo_venta"]
      : ["nombre", "marca", "sabor", "precio", "unidad_medida", "cantidad", "tipo_comprobante", "numero_comprobante", "tipo_venta"];

    if (tipo === "comestible") {
      if (formData.unidad_medida === "peso") requiredFields.push("peso");
      if (formData.unidad_medida === "litros") requiredFields.push("litros");
    }

    requiredFields.forEach(field => {
      if ((field === "cantidad" && !cantidadRegistrar) || (!formData[field] && formData[field] !== 0 && field !== "cantidad")) {
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

  // Estilos
  const inputClass = "w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition mb-1 text-sm";
  const errorClass = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const errorMsgClass = "text-red-500 text-xs mb-2";

  const sectionTitleClass = "mt-4 mb-2 text-sm font-medium text-gray-900";
  const initBtnClass = "font-medium text-sm px-6 py-3 rounded-lg shadow transition w-48"; 
  const primaryInitBtnClass = "bg-green-600 hover:bg-green-700 text-white " + initBtnClass;
  const secondaryInitBtnClass = "bg-blue-600 hover:bg-blue-700 text-white " + initBtnClass;
  const formBtnClass = "font-medium text-sm px-4 py-2 rounded-lg shadow transition";
  const primaryBtnClass = "bg-green-600 hover:bg-green-700 text-white " + formBtnClass;
  const cancelBtnClass = "bg-gray-400 hover:bg-gray-500 text-white " + formBtnClass;

  const requiredLabel = (text) => (
    <>{text} <span className="text-red-500">*</span></>
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
      closeOnOverlayClick={false} 
      title={title}
      maxWidth={title === "Registrar Nuevo Producto Comestible" ? "950px" : step === "inicio" ? "400px" : "880px"}
      titleClass={title === "Registrar Nuevo Producto Comestible" ? "text-base" : "text-lg"}
    >
      {/* Pantalla inicial */}
      {step === "inicio" && (
        <div className="text-center">
          <p className="mb-4 text-gray-600 text-sm">
            Selecciona el tipo de entrada que deseas registrar:
          </p>
          <div className="flex flex-col gap-2 items-center">
            <button onClick={() => setStep("nuevo")} className={primaryInitBtnClass}>
              <PlusSquare className="w-5 h-5" /> Nuevo Producto
            </button>
            <button onClick={() => setStep("existente_form")} className={secondaryInitBtnClass}>
              <Archive className="w-5 h-5" /> Producto Existente
            </button>
          </div>
        </div>
      )}

      {/* Formulario Nuevo Producto */}
      {step === "nuevo" && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
              <input value={generatedId} disabled className={inputClass} />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel("Registrar por")}</label>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel("Cantidad")}</label>
              <input
                name="cantidad"
                type="number"
                value={cantidadRegistrar}
                onChange={(e) => setCantidadRegistrar(Number(e.target.value))}
                className={`${inputClass} ${errors["cantidad"] ? errorClass : ""}`}
              />
              {errors["cantidad"] && <div className={errorMsgClass}>{errors["cantidad"]}</div>}
            </div>
            {renderInput("tipo_comprobante", "Tipo Comprobante")}
            {renderInput("numero_comprobante", "Número Comprobante")}
            {renderInput("tipo_venta", "Tipo Venta")}
          </div>

          <h3 className={sectionTitleClass}>Opcionales</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
              <input
                type="file"
                name="imagen"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none mb-3"
              />
            </div>
            {renderInput("ubicacion", "Ubicación en almacén", "text", true)}
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <button type="submit" className={primaryBtnClass}>Registrar</button>
            <button type="button" onClick={handleClose} className={cancelBtnClass}>Cancelar</button>
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
          <div className="grid grid-cols-2 gap-3">
            {(tipo === "ropa"
              ? ["id_ropa","nombre","marca","talla","color","precio"]
              : ["id_comestible","nombre","marca","sabor","precio"]
            ).map((campo) => (
              <div key={campo}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{campo.toUpperCase()}</label>
                <input value={formData[campo]} disabled className={inputClass} />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Actual</label>
              <input value={formData.cantidad || 0} disabled className={inputClass} />
            </div>
          </div>

          <h3 className={sectionTitleClass}>Registrar Nueva Entrada</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{requiredLabel("Cantidad a Registrar")}</label>
              <input
                type="number"
                name="cantidad"
                value={cantidadRegistrar}
                onChange={(e) => setCantidadRegistrar(Number(e.target.value))}
                className={`${inputClass} ${errors["cantidad"] ? errorClass : ""}`}
              />
              {errors["cantidad"] && <div className={errorMsgClass}>{errors["cantidad"]}</div>}
            </div>
            {renderInput("tipo_comprobante", "Tipo Comprobante")}
            {renderInput("numero_comprobante", "Número Comprobante")}
            {renderInput("tipo_venta", "Tipo Venta")}
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <button type="submit" className={primaryBtnClass}>Actualizar</button>
            <button type="button" onClick={handleClose} className={cancelBtnClass}>Cancelar</button>
          </div>
        </form>
      )}
    </ModalGInventario>
  );
}
