import { useState, useEffect } from "react";
import ModalGInventario from "../components/ui/ModalGInventario";
import ModalSeleccionProducto from "./ModalSeleccionProducto";
import ModalMensaje from "../components/ModalMensaje";
import {
  ArrowLeft,
  TrendingUp,
  Info,
  Package,
  DollarSign,
  Hash,
  MapPin,
  Tag
} from "lucide-react";
import {
  registrarEntradaRopaExistente,
  registrarEntradaComestibleExistente
} from "../api/inventario";

export default function ModalProductoExistente({
  isOpen,
  onClose,
  tipo,
  title,
  onSuccess
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadRegistrar, setCantidadRegistrar] = useState(0);
  const [mensaje, setMensaje] = useState({ open: false, tipo: "", texto: "" });

  const mostrarMensaje = (tipo, texto) => setMensaje({ open: true, tipo, texto });

  const handleClose = () => {
    setProductoSeleccionado(null);
    setFormData({});
    setErrors({});
    setCantidadRegistrar(0);
    onClose();
  };

  useEffect(() => {
    if (productoSeleccionado) {
      const stock =
        productoSeleccionado.stock_actual ??
        productoSeleccionado.cantidad ??
        productoSeleccionado.stock ??
        0;

      setFormData((prev) => ({
        ...prev,
        ...productoSeleccionado,
        stock_actual: stock
      }));

      setCantidadRegistrar(0);
    }
  }, [productoSeleccionado]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "monto_pagado",
      "tipo_comprobante",
      "numero_comprobante",
      "metodo_pago"
    ];
    if (!productoSeleccionado) {
      newErrors.productoSeleccionado = "Debe seleccionar un producto";
    } else {
      if (tipo === "ropa" && !productoSeleccionado.id_ropa) {
        newErrors.id_producto = "El ID de la ropa seleccionada es requerido";
      } else if (tipo === "comestible" && !productoSeleccionado.id_comestible) {
        newErrors.id_producto = "El ID del comestible seleccionado es requerido";
      }
    }

    if (!cantidadRegistrar || Number(cantidadRegistrar) <= 0)
      newErrors.cantidad = "La cantidad a registrar debe ser mayor a 0";

    requiredFields.forEach((f) => {
      if (!formData[f]) newErrors[f] = "Este campo es obligatorio";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      mostrarMensaje("error", "Por favor, complete todos los campos obligatorios y seleccione un producto válido.");
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append("cantidad", Number(cantidadRegistrar));
    dataToSend.append("tipo_comprobante", formData.tipo_comprobante);
    dataToSend.append("numero_comprobante", formData.numero_comprobante);
    dataToSend.append("metodo_pago", formData.metodo_pago);
    dataToSend.append("monto_pagado", formData.monto_pagado);
    dataToSend.append("id_usuario", sessionStorage.getItem("id_usuario") || "US0001");

    if (formData.archivo_comprobante) {
      dataToSend.append("img_comp", formData.archivo_comprobante);
    }

    if (tipo === "ropa") {
      dataToSend.append("id_producto", productoSeleccionado.id_ropa);
    } else {
      dataToSend.append("id_producto", productoSeleccionado.id_comestible);
    }

    try {
      if (tipo === "ropa") {
        await registrarEntradaRopaExistente(dataToSend);
      } else {
        await registrarEntradaComestibleExistente(dataToSend);
      }

      setTimeout(() => {
        handleClose();
        if (onSuccess) onSuccess();
      }, 800);
    } catch (error) {
      console.log("Error al registrar entrada", error);
      mostrarMensaje("error", "Ocurrió un error al registrar la entrada");
    }
  };

  const cardClass = "bg-white p-3 rounded-lg shadow-sm border border-gray-100";
  const inputBaseClass =
    "w-full px-2 py-1 border rounded-md text-xs focus:ring-1 shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed";
  const errorMsgClass = "text-red-600 text-xxs mt-0.5 font-medium";

  const renderDetailCard = (label, value) => (
    <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex flex-col justify-center min-h-[50px]">
      <label className="mb-0 font-medium text-gray-500 text-xxs">{label}</label>
      <p className="text-xs font-semibold text-gray-800 truncate">{value || "N/A"}</p>
    </div>
  );

  const renderInput = (name, label, type = "text", isPrimary = false) => {
    const val = name === "cantidad" ? cantidadRegistrar : formData[name] || "";
    const onChange =
      name === "cantidad"
        ? (e) => {
            const v = e.target.value;
            if (v === "" || (/^\d+$/.test(v) && Number(v) >= 0))
              setCantidadRegistrar(v === "" ? "" : Number(v));
          }
        : name === "monto_pagado"
        ? (e) => {
            const v = e.target.value;
            if (v === "" || (!isNaN(v) && Number(v) >= 0))
              setFormData((p) => ({ ...p, [name]: v }));
          }
        : handleChange;

    return (
      <div className="mb-2">
        <label className={`block ${isPrimary ? "text-xs" : "text-xxs"} font-semibold text-gray-700 mb-0.5`}>
          {label} <span className="text-red-500">*</span>
        </label>
        <input
          name={name}
          type={type}
          value={val}
          onChange={onChange}
          min={name === "monto_pagado" ? "0" : name === "cantidad" ? "1" : undefined}
          className={`${inputBaseClass} ${
            errors[name] ? "!border-red-500 !ring-red-500" : ""
          } ${isPrimary ? "text-base font-bold text-emerald-800 border-emerald-400" : ""}`}
        />
        {errors[name] && <div className={errorMsgClass}>{errors[name]}</div>}
      </div>
    );
  };

  const renderSelect = (name, label, options) => (
    <div className="mb-2">
      <label className="block text-xxs font-semibold text-gray-700 mb-0.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        className={`${inputBaseClass} border-gray-300 focus:border-emerald-500 bg-white`}
      >
        <option value="" disabled>
          -- Seleccionar --
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-xs">
            {opt.label}
          </option>
        ))}
      </select>
      {errors[name] && <div className={errorMsgClass}>{errors[name]}</div>}
    </div>
  );

  return (
    <>
      <ModalGInventario
        isOpen={isOpen}
        onClose={handleClose}
        title={title}
        maxWidth="750px"
        tipo="existente"
        headerIcon={TrendingUp}
      >
        {!productoSeleccionado ? (
          <ModalSeleccionProducto
            tipo={tipo}
            modo="existente"
            onClose={handleClose}
            onSelect={setProductoSeleccionado}
          />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-3 -m-3 space-y-3 bg-white rounded-b-lg shadow-inner animate-slideUp"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
              <div className="col-span-3">
                <div className={cardClass + " bg-white p-4 h-full shadow-lg border-none"}>
                  <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-gray-100">
                    <div className="flex flex-col flex-grow min-w-0">
                      <h3 className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        <Info size={14} className="text-emerald-500" />
                        Detalles del Producto
                      </h3>
                      <h4 className="text-lg font-bold text-gray-900 mt-0.5 leading-snug truncate">
                        {formData.nombre || "Producto sin nombre"}
                      </h4>
                    </div>

                    <div className="text-right flex-shrink-0 min-w-[70px]">
                      <span className="font-semibold tracking-wide text-gray-500 uppercase text-xxs">
                        STOCK
                      </span>
                      <p className="text-2xl font-extrabold leading-none text-emerald-600">
                        {formData.stock_actual || 0}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="p-2 border border-gray-200 rounded-md bg-gray-50">
                      <label className="flex items-center gap-1 text-[10px] font-medium uppercase text-gray-500">
                        <Hash size={11} className="text-gray-400" /> ID
                      </label>
                      <p className="mt-0.5 text-[11px] font-semibold text-gray-800 truncate">
                        {formData[tipo === "ropa" ? "id_ropa" : "id_comestible"] || "N/A"}
                      </p>
                    </div>

                    <div className="p-2 border border-blue-200 rounded-md bg-blue-50">
                      <label className="flex items-center gap-1 text-[10px] font-medium uppercase text-blue-700">
                        <DollarSign size={11} className="text-blue-500" /> PRECIO
                      </label>
                      <p className="mt-0.5 text-sm font-bold text-blue-800">
                        S/ {formData.precio || "0.00"}
                      </p>
                    </div>

                    <div className="p-2 border border-yellow-200 rounded-md bg-yellow-50">
                      <label className="flex items-center gap-1 text-[10px] font-medium uppercase text-yellow-700">
                        <MapPin size={11} className="text-yellow-500" /> UBICACIÓN
                      </label>
                      <p className="mt-0.5 text-[11px] font-semibold text-yellow-800 truncate">
                        {formData.ubicacion || "No definida"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      <Tag size={14} className="text-gray-400" />
                      Ficha Técnica
                    </h4>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      <div>{renderDetailCard("Marca", formData.marca)}</div>

                      {tipo === "ropa" && (
                        <>
                          <div>{renderDetailCard("Talla", formData.talla)}</div>
                          <div>{renderDetailCard("Color", formData.color)}</div>
                        </>
                      )}

                      {tipo === "comestible" && (
                        <>
                          <div>{renderDetailCard("Sabor/Tipo", formData.sabor)}</div>
                          <div>{renderDetailCard("Peso/Volumen", formData.peso || formData.litros)}</div>
                          <div>{renderDetailCard("Lote", formData.lote)}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2 space-y-2">
                <div className={cardClass + " p-3"}>
                  <h3 className="flex items-center gap-1 pb-1 mb-2 text-xs font-extrabold text-gray-800 border-b">
                    <TrendingUp size={16} className="text-emerald-600" />
                    Datos de la Nueva Entrada
                  </h3>
                  {renderInput("cantidad", "Cantidad a Registrar", "number", true)}
                  {renderInput("monto_pagado", "Costo de Compra Total (S/)", "number")}
                </div>

                <div className={cardClass + " p-3"}>
                  <h3 className="flex items-center gap-1 pb-1 mb-2 text-xs font-extrabold text-gray-800 border-b">
                    <DollarSign size={16} className="text-emerald-600" />
                    Detalles de Facturación
                  </h3>

                  {renderSelect("tipo_comprobante", "Tipo de Comprobante", [
                    { value: "Boleta", label: "Boleta" },
                    { value: "Factura", label: "Factura" }
                  ])}

                  {renderInput("numero_comprobante", "N° Comprobante", "text")}

                  {renderSelect("metodo_pago", "Método de Pago", [
                    { value: "Efectivo", label: "Efectivo" },
                    { value: "Yape", label: "Yape" },
                    { value: "Tarjeta de Crédito", label: "Tarjeta de Crédito" },
                    { value: "Plin", label: "Plin" }
                  ])}

                  <div className="mb-2">
                    <label className="block text-xxs font-semibold text-gray-700 mb-0.5">
                      Comprobante PDF o Imagen
                    </label>
                    <input
                      name="archivo_comprobante"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                      className={inputBaseClass}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center w-full gap-1 px-3 py-2 text-xs font-extrabold text-white rounded-lg shadow-md bg-emerald-600"
                >
                  <Package size={14} /> CONFIRMAR RECARGA
                </button>
              </div>
            </div>

            <div className="flex justify-start gap-2 pt-2 mt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setProductoSeleccionado(null)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 font-semibold text-xxs rounded-md"
              >
                <ArrowLeft size={12} /> Cambiar Producto
              </button>
            </div>
          </form>
        )}
      </ModalGInventario>

      <ModalMensaje
        isOpen={mensaje.open}
        tipo={mensaje.tipo}
        texto={mensaje.texto}
        onClose={() => setMensaje({ open: false, tipo: "", texto: "" })}
      />
    </>
  );
}
