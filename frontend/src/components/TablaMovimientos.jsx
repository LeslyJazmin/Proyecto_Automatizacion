import React, { useState } from "react";
import { TrendingUp, TrendingDown, Image as ImageIcon, X } from "lucide-react";

export default function TablaMovimientos({ datos, API_URL = "http://localhost:5000" }) {
  const [modalImagen, setModalImagen] = useState({ open: false, url: "" });

  const tableContainerClass = "overflow-x-auto rounded-xl shadow-lg border border-gray-100 bg-white";
  const tableClass = "w-full text-xs text-left text-gray-700";
  const headClass = "bg-gradient-to-r from-red-950 via-red-800 to-black text-white uppercase text-2xs tracking-wider font-extrabold";
  const thClass = "px-3 py-2 font-extrabold border-r border-red-950/50 last:border-r-0";
  const trClass = "border-b border-gray-100 transition duration-150 hover:bg-red-50/70";
  const tdClass = "px-3 py-2 text-gray-700 whitespace-nowrap";

  const baseBtn = "p-1.5 rounded-full transition-all duration-300 flex items-center justify-center shadow-md text-white font-bold";
  const imgBtn = `${baseBtn} bg-red-700 hover:bg-black hover:shadow-red-800/50`;
  const imgBtnGray = "p-1.5 rounded-full bg-gray-400/70 cursor-not-allowed flex items-center justify-center";

  const abrirModal = url => setModalImagen({ open: true, url });
  const cerrarModal = () => setModalImagen({ open: false, url: "" });

  if (!datos || datos.length === 0) {
    return (
      <div className="flex items-center justify-center py-6 bg-white border border-gray-100 shadow-lg rounded-xl">
        <p className="text-sm italic font-medium text-gray-500">
          🤷‍♂️ No hay movimientos registrados en el historial.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={tableContainerClass}>
        <table className={tableClass}>
          <thead className={headClass}>
            <tr>
              <th className={thClass + " rounded-tl-xl"}>Producto</th>
              <th className={thClass}>Usuario</th>
              <th className={thClass + " text-center"}>Cant.</th>
              <th className={thClass}>Mov.</th>
              <th className={thClass}>Comp.</th>
              <th className={thClass}>N° Comp.</th>
              <th className={thClass}>Pago</th>
              <th className={thClass + " text-right"}>Monto</th>
              <th className={thClass + " text-center"}>Img</th>
              <th className={thClass + " rounded-tr-xl"}>Fecha</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {datos.map((mov, index) => {
              const isEntrada = mov.tipo_movimiento === "entrada";
              const movementClass = isEntrada ? "text-green-600 font-bold flex items-center gap-1" : "text-red-600 font-bold flex items-center gap-1";
              const MovementIcon = isEntrada ? TrendingUp : TrendingDown;

              return (
                <tr key={index} className={trClass}>
                  <td className={tdClass + " font-semibold text-gray-900"}>{mov.producto || "N/A"}</td>
                  <td className={tdClass + " text-gray-600"}>{mov.usuario || "N/A"}</td>
                  <td className={tdClass + " text-center font-bold text-base"}>{mov.cantidad}</td>

                  <td className={tdClass}>
                    <span className={movementClass}>
                      <MovementIcon size={14} />
                      {mov.tipo_movimiento}
                    </span>
                  </td>

                  <td className={tdClass}>{mov.tipo_comprobante || "-"}</td>
                  <td className={tdClass + " font-mono"}>{mov.numero_comprobante || "-"}</td>
                  <td className={tdClass}>{mov.metodo_pago || "-"}</td>

                  <td className={tdClass + " text-right font-extrabold text-blue-700"}>
                    {mov.monto_pagado != null ? `S/ ${parseFloat(mov.monto_pagado).toFixed(2)}` : "-"}
                  </td>

                  <td className={tdClass + " text-center"}>
                    <div className="flex justify-center">
                      {mov.img_comp ? (
                        <button
                          type="button"
                          onClick={() => {
                            const path = mov.img_comp;
                            const url = path && (path.startsWith("http") ? path : `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`);
                            abrirModal(url);
                          }}
                          className={imgBtn}
                          title="Ver comprobante"
                        >
                          <ImageIcon className="w-4 h-4 text-white" />
                        </button>
                      ) : (
                        <div className={imgBtnGray}>
                          <ImageIcon className="w-4 h-4 text-white/60" />
                        </div>
                      )}
                    </div>
                  </td>

                  <td className={tdClass + " italic text-gray-500"}>{mov.fecha || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalImagen.open && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-transparent">
          <div className="relative w-full max-w-4xl max-h-[95vh] flex">
            <button
              onClick={cerrarModal}
              className="absolute p-2 text-white bg-red-600 rounded-full shadow-lg top-4 right-4"
            >
              <X size={22} />
            </button>

            <div className="flex items-center justify-center w-full p-4 bg-black rounded-lg">
              {modalImagen.url && (
                <img
                  src={modalImagen.url}
                  alt="Comprobante"
                  className="object-contain max-w-full max-h-[90vh]"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}