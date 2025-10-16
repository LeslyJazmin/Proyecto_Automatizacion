import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TablaMovimientos({ datos }) {
  // --- Clases de Estilo Más Pequeñas y Compactas ---
  const tableContainerClass = "overflow-x-auto rounded-xl shadow-lg border border-gray-100 bg-white";
  const tableClass = "w-full text-xs text-left text-gray-700"; // Texto base más pequeño

  // Encabezado: Más compacto
  const headClass = "bg-gradient-to-r from-red-950 via-red-800 to-black text-white uppercase text-2xs tracking-wider font-extrabold";
  const thClass = "px-3 py-2 font-extrabold border-r border-red-950/50 last:border-r-0";

  // Cuerpo: Filas y celdas
  const trClass = "border-b border-gray-100 transition duration-150 hover:bg-red-50/70";
  const tdClass = "px-3 py-2 text-gray-700 whitespace-nowrap"; // Relleno reducido

  // ------------------------------------

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
    <div className={tableContainerClass}>
      <table className={tableClass}>
        {/* 🔥 Encabezado */}
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
            <th className={thClass + " rounded-tr-xl"}>Fecha</th>
          </tr>
        </thead>

        {/* Cuerpo */}
        <tbody className="divide-y divide-gray-100">
          {datos.map((mov, index) => {
            const isEntrada = mov.tipo_movimiento === "entrada";
            
            // Clase de estilo condicional para el tipo de movimiento
            const movementClass = isEntrada ? "text-green-600 font-bold flex items-center gap-1" : "text-red-600 font-bold flex items-center gap-1";
            
            // Icono condicional
            const MovementIcon = isEntrada ? TrendingUp : TrendingDown;

            return (
              <tr
                key={index}
                className={trClass}
              >
                <td className={tdClass + " font-semibold text-gray-900"}>
                  {mov.producto || "N/A"}
                </td>
                <td className={tdClass + " text-gray-600"}>{mov.usuario || "N/A"}</td>
                <td className={tdClass + " text-center font-bold text-base"}>{mov.cantidad}</td>
                
                {/* Tipo de Movimiento con Icono y Color (más pequeño) */}
                <td className={tdClass}>
                  <span className={movementClass}>
                    <MovementIcon size={14} /> {/* Icono más pequeño */}
                    {mov.tipo_movimiento}
                  </span>
                </td>
                
                <td className={tdClass}>{mov.tipo_comprobante || "-"}</td>
                <td className={tdClass + " font-mono"}>{mov.numero_comprobante || "-"}</td>
                <td className={tdClass}>{mov.metodo_pago || "-"}</td>
                
                {/* Monto Pagado */}
                <td className={tdClass + " text-right font-extrabold text-blue-700"}>
                  {mov.monto_pagado != null
                    ? `S/ ${parseFloat(mov.monto_pagado).toFixed(2)}`
                    : "-"}
                </td>
                
                {/* Fecha */}
                <td className={tdClass + " italic text-gray-500"}>
                  {mov.fecha || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}