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
  // --- Clases de Estilo Mejoradas y Redondeadas ---
  const tableContainerClass =
    "overflow-hidden rounded-xl shadow-2xl border border-gray-200";
  const tableClass = "w-full";

  const headClass =
    "bg-gradient-to-r from-red-900 via-red-800 to-black text-white uppercase text-xs tracking-wider font-extrabold";
  const thClass =
    "px-4 py-3 border-l border-r border-red-950/50 last:border-r-0 first:border-l-0";

  const trClass =
    "bg-white border-b border-gray-100 transition duration-150 hover:bg-red-50";
  const tdClass =
    "px-4 py-3 text-sm text-gray-800 font-medium whitespace-nowrap border-r border-gray-200";

  const baseBtnClass =
    "p-2 rounded-full transition-all duration-300 flex items-center justify-center shadow-md text-white";
  const imageBtnClass = `${baseBtnClass} bg-red-700 hover:bg-black hover:shadow-red-800/50`;
  const editBtnClass = `${baseBtnClass} bg-blue-600 hover:bg-blue-800 hover:shadow-blue-600/50`;
  const deleteBtnClass = `${baseBtnClass} bg-red-700 hover:bg-red-900 hover:shadow-red-900/50`;

  // --- Indicadores de carga o vacío ---
  if (loading)
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-base text-gray-600 font-medium animate-pulse flex items-center gap-2">
          <Wand2 size={20} className="text-red-700 animate-spin" />
          Cargando inventario...
        </p>
      </div>
    );

  if (!datos || datos.length === 0)
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-500 text-base">
          No hay productos registrados en esta categoría.
        </p>
      </div>
    );

  // --- Tabla principal ---
  return (
    <div className={tableContainerClass}>
      <table className={tableClass}>
        <thead className={headClass}>
          <tr>
            <th className={thClass + " rounded-tl-xl"}>ID</th>
            <th className={thClass}>Nombre</th>
            <th className={thClass}>Marca</th>
            <th className={thClass + " text-center"}>Stock Actual</th>

            {tipo === "ropa" ? (
              <>
                <th className={thClass}>Talla</th>
                <th className={thClass}>Color</th>
              </>
            ) : (
              <>
                <th className={thClass}>Sabor</th>
                <th className={thClass}>Peso (kg)</th>
                <th className={thClass}>Litros (Lt)</th>
              </>
            )}

            <th className={thClass}>Precio (S/)</th>
            <th className={thClass}>Ubicación</th>
            <th className={thClass + " text-center"}>Imagen</th>
            <th className={thClass + " text-center rounded-tr-xl"}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {datos.map((p) => {
            const id = tipo === "ropa" ? p.id_ropa : p.id_comestible;

            return (
              <tr key={id} className={trClass}>
                <td
                  className={
                    tdClass + " font-mono text-gray-900 font-semibold"
                  }
                >
                  {id}
                </td>
                <td
                  className={
                    tdClass + " max-w-[200px] overflow-hidden text-ellipsis"
                  }
                >
                  {p.nombre}
                </td>
                <td className={tdClass}>{p.marca || "N/A"}</td>

                {/* ✅ CAMBIO: mostrar stock_actual en lugar de cantidad */}
                <td
                  className={
                    tdClass +
                    " text-center font-bold text-lg text-red-700"
                  }
                >
                  {p.stock_actual ?? "0"}
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
                  </>
                )}

                <td className={tdClass + " font-bold text-green-700"}>
                  S/ {parseFloat(p.precio).toFixed(2) || "0.00"}
                </td>
                <td className={tdClass + " border-r-0"}>
                  {p.ubicacion || "N/A"}
                </td>

                {/* Imagen */}
                <td className={tdClass + " text-center"}>
                  {p.imagen ? (
                    <button
                      onClick={() => onVerImagen(`${API_URL}${p.imagen}`)}
                      className={imageBtnClass}
                      title="Ver imagen"
                    >
                      <ImageIcon size={16} />
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>

                {/* Botones */}
                <td className={tdClass + " text-center border-r-0"}>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEditar(p)}
                      title="Editar producto"
                      className={editBtnClass}
                    >
                      <Wand2 size={16} />
                    </button>

                    <button
                      onClick={() => onEliminar(id, tipo)}
                      title="Eliminar producto"
                      className={deleteBtnClass}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
