import React from "react";

export default function TablaMovimientos({ datos }) {
  if (!datos || datos.length === 0) {
    return (
      <div className="flex justify-center items-center py-10 bg-white rounded-xl shadow-sm">
        <p className="text-gray-500 text-sm italic">No hay movimientos registrados.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-md bg-white">
      <table className="w-full text-sm text-left text-gray-800">
        {/* 🔥 Encabezado con estilo premium */}
        <thead className="bg-gradient-to-r from-red-900 via-red-700 to-black text-white uppercase text-xs shadow-md">
          <tr>
            <th className="px-4 py-3 font-semibold tracking-wide">Producto</th>
            <th className="px-4 py-3 font-semibold tracking-wide">Usuario</th>
            <th className="px-4 py-3 font-semibold text-center">Cantidad</th>
            <th className="px-4 py-3 font-semibold">Movimiento</th>
            <th className="px-4 py-3 font-semibold">Comprobante</th>
            <th className="px-4 py-3 font-semibold">N° Comprobante</th>
            <th className="px-4 py-3 font-semibold">Tipo de venta</th>
            <th className="px-4 py-3 font-semibold">Fecha</th>
          </tr>
        </thead>

        {/* Cuerpo con estilo limpio */}
        <tbody className="divide-y divide-gray-100">
          {datos.map((mov, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition duration-200 ease-in-out"
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {mov.producto || "Desconocido"}
              </td>
              <td className="px-4 py-3">{mov.usuario || "Desconocido"}</td>
              <td className="px-4 py-3 text-center">{mov.cantidad}</td>
              <td
                className={`px-4 py-3 font-semibold ${
                  mov.tipo_movimiento === "entrada"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {mov.tipo_movimiento}
              </td>
              <td className="px-4 py-3">{mov.tipo_comprobante || "-"}</td>
              <td className="px-4 py-3">{mov.numero_comprobante || "-"}</td>
              <td className="px-4 py-3">{mov.tipo_venta || "-"}</td>
              <td className="px-4 py-3 text-gray-600">
  {mov.fecha || "-"}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
