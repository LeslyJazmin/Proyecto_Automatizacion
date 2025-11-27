import { useState, useEffect } from "react";
import ModalGInventario from "../components/ui/ModalGInventario";
import ModalSeleccionProducto from "./ModalSeleccionProducto";
import ModalMensaje from "../components/ModalMensaje";
import {
  ArrowLeft,
  TrendingDown,
  Info,
  Package,
  Tag,
  FileText,
} from "lucide-react";
import {
  registrarSalidaRopa,
  registrarSalidaComestible,
} from "../api/inventario";

export default function ModalSalidaProducto({
  isOpen,
  onClose,
  tipo,
  title,
  onSuccess,
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidadRegistrar, setCantidadRegistrar] = useState(0);
  const [mensaje, setMensaje] = useState({ open: false, tipo: "", texto: "" });

  const mostrarMensaje = (tipoM, texto) =>
    setMensaje({ open: true, tipo: tipoM, texto });

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
        stock_actual: stock,
      }));

      setCantidadRegistrar(0);
    }
  }, [productoSeleccionado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "tipo_comprobante",
      "numero_comprobante",
      "metodo_pago",
      "monto_pagado",
    ];

    if (!cantidadRegistrar || Number(cantidadRegistrar) <= 0)
      newErrors.cantidad = "La cantidad debe ser mayor a 0";

    if (
      productoSeleccionado &&
      Number(cantidadRegistrar) > Number(productoSeleccionado.stock_actual)
    ) {
      newErrors.cantidad = "No puedes retirar más de lo disponible en stock";
    }

    requiredFields.forEach((f) => {
      if (!formData[f]) newErrors[f] = "Este campo es obligatorio";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSend = {
      cantidad: Number(cantidadRegistrar),
      tipo_comprobante: formData.tipo_comprobante,
      numero_comprobante: formData.numero_comprobante,
      metodo_pago: formData.metodo_pago,
      monto_pagado: Number(formData.monto_pagado) || 0,
      id_usuario: sessionStorage.getItem("id_usuario") || "US0001",
      ...(tipo === "ropa"
        ? { id_ropa: productoSeleccionado.id_ropa }
        : { id_comestible: productoSeleccionado.id_comestible }),
    };

    try {
      if (tipo === "ropa") await registrarSalidaRopa(dataToSend);
      else await registrarSalidaComestible(dataToSend);

      setTimeout(() => {
        handleClose();
        if (onSuccess) onSuccess();
      }, 600);
    } catch (error) {
      console.error("❌ Error al registrar la salida:", error);
      mostrarMensaje(
        "error",
        error?.message || "❌ Ocurrió un error al registrar la salida."
      );
    }
  };

  // --- estilos ---
  const cardClass = "bg-white p-3 rounded-lg shadow-sm border border-gray-100";
  const inputBaseClass =
    "w-full px-2 py-1 border rounded-md text-xs focus:ring-1 shadow-sm";
  const errorMsgClass = "text-red-600 text-xxs mt-0.5 font-medium";

  const renderDetailCard = (label, value) => (
    <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex flex-col justify-center min-h-[50px]">
      <label className="text-xxs font-medium text-gray-500 mb-0">{label}</label>
      <p className="text-xs font-semibold text-gray-800 truncate">
        {value ?? "N/A"}
      </p>
    </div>
  );

  const renderInput = (name, label, type = "text", isPrimary = false) => {
    const val = name === "cantidad" ? cantidadRegistrar : formData[name] ?? "";
    const onChange =
      name === "cantidad"
        ? (e) => {
            const v = e.target.value;
            if (v === "" || (/^\d+$/.test(v) && Number(v) >= 0))
              setCantidadRegistrar(v === "" ? "" : Number(v));
          }
        : handleChange;

    return (
      <div className="mb-2">
        <label
          className={`block ${
            isPrimary ? "text-xs" : "text-xxs"
          } font-semibold text-gray-700 mb-0.5`}
        >
          {label} <span className="text-red-500">*</span>
        </label>
        <input
          name={name}
          type={type}
          value={val}
          onChange={onChange}
          min={name === "cantidad" ? "1" : undefined}
          className={`${inputBaseClass} ${
            errors[name] ? "!border-red-500 !ring-red-500" : ""
          } ${isPrimary ? "text-base font-bold text-red-700" : ""}`}
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
        value={formData[name] ?? ""}
        onChange={handleChange}
        className={`${inputBaseClass} border-gray-300 focus:border-red-500 bg-white`}
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
        title={`Registrar Salida de ${tipo === "ropa" ? "Ropa" : "Comestible"}`}
        tipo="salida" // 🔴 esto hace que el header sea rojo
        headerIcon={TrendingDown}
        >

        {!productoSeleccionado ? (
          <ModalSeleccionProducto
            tipo={tipo}
            modo="salida" // 🔴 esto activa encabezado y botones rojos
            onClose={handleClose}
            onSelect={setProductoSeleccionado}
          />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="animate-slideUp bg-gray-50 p-3 -m-3 rounded-b-lg space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* izquierda */}
              <div className="col-span-3">
                <div className={cardClass + " bg-white p-4 h-full shadow-lg border-none"}>
                  <div className="flex justify-between items-start gap-3 mb-4 pb-3 border-b border-gray-100">
                    <div className="flex flex-col flex-grow min-w-0">
                      <h3 className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        <Info size={14} className="text-red-500" /> Detalles del Producto
                      </h3>
                      <h4 className="text-lg font-bold text-gray-900 mt-0.5 leading-snug truncate">
                        {formData.nombre ?? "Producto sin nombre"}
                      </h4>
                    </div>
                    <div className="text-right flex-shrink-0 min-w-[70px]">
                      <span className="text-xxs font-semibold text-gray-500 uppercase tracking-wide">
                        STOCK
                      </span>
                      <p className="text-2xl font-extrabold text-red-600 leading-none">
                        {formData.stock_actual ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div>{renderDetailCard("ID", formData.id_ropa || formData.id_comestible)}</div>
                    <div>{renderDetailCard("Precio", `S/ ${formData.precio}`)}</div>
                    <div>{renderDetailCard("Ubicación", formData.ubicacion)}</div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      <Tag size={14} className="text-gray-400" /> Ficha Técnica
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>{renderDetailCard("Marca", formData.marca)}</div>
                      {tipo === "ropa" ? (
                        <>
                          <div>{renderDetailCard("Talla", formData.talla)}</div>
                          <div>{renderDetailCard("Color", formData.color)}</div>
                        </>
                      ) : (
                        <>
                          <div>{renderDetailCard("Sabor/Tipo", formData.sabor)}</div>
                          <div>
                            {renderDetailCard(
                              "Peso/Volumen",
                              formData.peso ?? formData.litros
                            )}
                          </div>
                          {/* ✅ NUEVO: Mostrar lote */}
                          <div>{renderDetailCard("Lote", formData.lote)}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* derecha */}
              <div className="col-span-2 space-y-2">
                <div className={cardClass + " p-3"}>
                  <h3 className="flex items-center gap-1 text-xs font-extrabold text-gray-800 border-b border-gray-200 pb-1 mb-2">
                    <TrendingDown size={16} className="text-red-600" /> Datos de la Salida
                  </h3>

                  {renderInput("cantidad", "Cantidad a Retirar", "number", true)}
                  {renderInput("monto_pagado", "Monto asociado (S/)", "number")}
                </div>

                <div className={cardClass + " p-3"}>
                  <h3 className="flex items-center gap-1 text-xs font-extrabold text-gray-800 border-b border-gray-200 pb-1 mb-2">
                    <FileText size={15} className="text-red-600" /> Detalles de Facturación
                  </h3>

                  {renderSelect("tipo_comprobante", "Tipo de Comprobante", [
                    { value: "Boleta", label: "Boleta" },
                    { value: "Factura", label: "Factura" },
                    { value: "Nota", label: "Nota" },
                  ])}
                  {renderInput("numero_comprobante", "N° Comprobante")}
                  {renderSelect("metodo_pago", "Método de Pago", [
                    { value: "Efectivo", label: "Efectivo" },
                    { value: "Yape", label: "Yape" },
                    { value: "Transferencia", label: "Transferencia Bancaria" },
                  ])}
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg shadow-md shadow-red-500/50 transition duration-300 focus:outline-none focus:ring-4 focus:ring-red-500/50 gap-1"
                >
                  <Package size={14} /> CONFIRMAR SALIDA
                </button>
              </div>
            </div>

            <div className="flex justify-start mt-3 pt-2 border-t border-gray-200 gap-2">
              <button
                type="button"
                onClick={() => setProductoSeleccionado(null)}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xxs rounded-md transition duration-200"
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
