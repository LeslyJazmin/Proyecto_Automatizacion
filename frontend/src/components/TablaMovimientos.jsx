import React, { useState } from "react";
import { TrendingUp, TrendingDown, Image as ImageIcon, X } from "lucide-react";

export default function TablaMovimientos({ datos }) {
  const [modalImagen, setModalImagen] = useState({ open: false, url: "" });

  const tableContainerClass = "overflow-x-auto rounded-xl shadow-lg border border-gray-100 bg-white";
  const tableClass = "w-full text-xs text-left text-gray-700";
  const headClass = "bg-gradient-to-r from-red-950 via-red-800 to-black text-white uppercase text-2xs tracking-wider font-extrabold";
  const thClass = "px-3 py-2 font-extrabold border-r border-red-950/50 last:border-r-0";
  const trClass = "border-b border-gray-100 transition duration-150 hover:bg-red-50/70";
  const tdClass = "px-3 py-2 text-gray-700 whitespace-nowrap";

  const abrirModal = (url) => {
    setModalImagen({ open: true, url });
  };

  const cerrarModal = () => {
    setModalImagen({ open: false, url: "" });
  };

  if (!datos || datos.length === 0) {
    return (
      <div className="flex justify-center items-center py-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <p className="text-gray-500 text-sm italic font-medium">
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
                  <td className={tdClass + " font-semibold text-gray-900"}>
                    {mov.producto || "N/A"}
                  </td>
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
                    {mov.monto_pagado != null
                      ? `S/ ${parseFloat(mov.monto_pagado).toFixed(2)}`
                      : "-"}
                  </td>

                  <td className={tdClass + " text-center"}>
                    {mov.img_comp ? (
                      <button
                        onClick={() => {
                          const url = mov.img_comp.startsWith("http")
                            ? mov.img_comp
                            : `http://localhost:5000${mov.img_comp}`;
                          abrirModal(url);
                        }}
                        className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        title="Ver Comprobante"
                      >
                        <ImageIcon size={16} />
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  <td className={tdClass + " italic text-gray-500"}>
                    {mov.fecha || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal para ver imagen */}
      {modalImagen.open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={cerrarModal}
        >
          <div
            className="relative bg-white rounded-lg p-4 max-w-2xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={cerrarModal}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all shadow-lg"
              title="Cerrar"
            >
              <X size={20} />
            </button>
            <img
              src={modalImagen.url}
              alt="Comprobante"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}