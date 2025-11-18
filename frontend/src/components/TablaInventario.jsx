import { Trash2, Image as ImageIcon, Wand2 } from "lucide-react";

export default function TablaInventario({
  datos,
  tipo,
  API_URL,
  onVerImagen,
  onEditar,
  onEliminar,
  loading,
}) {
  const tableContainerClass =
    "mx-auto my-4 w-[95%] overflow-hidden shadow-2xl border border-gray-200";

  const tableClass = "w-full";
  const headClass =
    "bg-gradient-to-r from-red-900 via-red-800 to-black text-white uppercase text-[12px] tracking-wider font-extrabold";
  const thClass =
    "px-3 py-2 border-l border-r border-red-950/50 last:border-r-0 first:border-l-0";
  const trClass =
    "bg-white border-b border-gray-100 transition duration-150 hover:bg-red-50";
  const tdClass =
    "px-3 py-2 text-[13px] text-gray-800 font-medium whitespace-nowrap border-r border-gray-200";

  const baseBtn =
    "p-1.5 rounded-full transition-all duration-300 flex items-center justify-center shadow-md text-white font-bold";
  const imgBtn = `${baseBtn} bg-red-700 hover:bg-black hover:shadow-red-800/50`;
  const editBtn = `${baseBtn} bg-blue-600 hover:bg-blue-800 hover:shadow-blue-600/50`;
  const delBtn = `${baseBtn} bg-red-700 hover:bg-red-900 hover:shadow-red-900/50`;

  if (loading)
    return (
      <div className="flex justify-center items-center py-6">
        <p className="text-sm text-gray-600 font-medium animate-pulse flex items-center gap-2">
          <Wand2 size={16} className="text-red-700 animate-spin" />
          Cargando inventario...
        </p>
      </div>
    );

  if (!datos?.length)
    return (
      <div className="flex justify-center items-center py-6">
        <p className="text-gray-500 text-sm">
          No hay productos registrados en esta categoría.
        </p>
      </div>
    );

  return (
    <div className="flex justify-center">
      <div className={tableContainerClass}>
        <table className={tableClass}>
          <thead className={headClass}>
            <tr>
              <th className={thClass}>ID</th>
              {/* 🆕 Nueva columna Lote (solo para comestibles) */}
              {tipo === "comestibles" && <th className={thClass}>Lote</th>}
              <th className={thClass}>Nombre</th>
              <th className={thClass}>Marca</th>
              <th className={thClass + " text-center"}>Stock</th>
              {tipo === "ropa" ? (
                <>
                  <th className={thClass}>Talla</th>
                  <th className={thClass}>Color</th>
                </>
              ) : (
                <>
                  <th className={thClass}>Sabor</th>
                  <th className={thClass}>Peso</th>
                  <th className={thClass}>Litros</th>
                  {/* ✅ Nueva columna de fecha de vencimiento */}
                  <th className={thClass}>Vencimiento</th>
                </>
              )}
              <th className={thClass}>Precio</th>
              <th className={thClass}>Ubicación</th>
              <th className={thClass + " text-center"}>Img</th>
              <th className={thClass + " text-center"}>Acción</th>
            </tr>
          </thead>

          <tbody>
            {datos.map((p) => {
              const id = tipo === "ropa" ? p.id_ropa : p.id_comestible;
              const stock = p.stock_actual ?? 0;
              const stockColor =
                stock < 50
                  ? "text-red-700 font-bold"
                  : "text-green-700 font-bold";

              // ✅ Dar formato a la fecha de vencimiento
              const fechaVenc =
                p.fecha_vencimiento &&
                new Date(p.fecha_vencimiento).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

              return (
                <tr key={id} className={trClass}>
                  <td
                    className={
                      tdClass + " font-mono text-gray-900 font-semibold"
                    }
                  >
                    {id}
                  </td>

                  {/* 🆕 Mostrar lote al costado del ID solo para comestibles */}
                  {tipo === "comestibles" && (
                    <td className={tdClass}>{p.lote || "—"}</td>
                  )}

                  <td className={tdClass}>{p.nombre}</td>
                  <td className={tdClass}>{p.marca || "N/A"}</td>
                  <td className={`${tdClass} text-center ${stockColor}`}>
                    {stock}
                  </td>

                  {tipo === "ropa" ? (
                    <>
                      <td className={tdClass}>{p.talla || "N/A"}</td>
                      <td className={tdClass}>{p.color || "N/A"}</td>
                    </>
                  ) : (
                    <>
                      <td className={tdClass}>{p.sabor || "N/A"}</td>
                      <td className={tdClass}>{p.peso || "-"}</td>
                      <td className={tdClass}>{p.litros || "-"}</td>
                      {/* ✅ Mostrar fecha de vencimiento */}
                      <td className={tdClass + " text-center"}>
                        {fechaVenc || "—"}
                      </td>
                    </>
                  )}

                  <td className={tdClass + " font-bold text-green-700"}>
                    S/ {parseFloat(p.precio).toFixed(2) || "0.00"}
                  </td>
                  <td className={tdClass}>{p.ubicacion || "N/A"}</td>

                  {/* --- Ícono de imagen centrado y resaltado --- */}
                  <td className={`${tdClass} text-center font-bold`}>
                    <div className="flex justify-center items-center">
                      {p.imagen ? (
                        <button
                          onClick={() => onVerImagen(`${API_URL}${p.imagen}`)}
                          className={imgBtn}
                          title="Ver imagen"
                        >
                          <ImageIcon size={16} />
                        </button>
                      ) : (
                        <span className="text-gray-400 font-bold">-</span>
                      )}
                    </div>
                  </td>

                  <td className={tdClass + " text-center"}>
                    <div className="flex justify-center gap-1.5">
                      <button
                        onClick={() => onEditar(p)}
                        className={editBtn}
                        title="Editar"
                      >
                        <Wand2 size={14} />
                      </button>
                      <button
                        onClick={() => onEliminar(id, tipo)}
                        className={delBtn}
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
