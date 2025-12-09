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
  // Contenedor con scroll responsivo
  const tableContainerClass =
    tipo === "comestible"
      ? "mx-auto my-4 w-full sm:w-[95%] overflow-x-auto rounded-lg shadow-2xl border border-gray-200 max-h-[60vh]"
      : "mx-auto my-4 w-full sm:w-[95%] overflow-x-auto rounded-lg shadow-2xl border border-gray-200";

  // Tabla
  const tableClass = "w-full min-w-[850px]"; // min ancho: evita romper columnas en móvil

  // Encabezado
  const headClass =
    "bg-gradient-to-r from-red-900 via-red-800 to-black text-white uppercase text-[11px] sm:text-[12px] tracking-wider font-extrabold";

  const thClass =
    "px-2 sm:px-3 py-2 border-l border-r border-red-950/50 last:border-r-0 first:border-l-0 whitespace-nowrap";

  // Filas
  const trClass =
    "bg-white border-b border-gray-100 transition duration-150 hover:bg-red-50";

  const tdClass =
    "px-2 sm:px-3 py-2 text-[12px] sm:text-[13px] text-gray-800 font-medium whitespace-nowrap border-r border-gray-200";

  // Botones
  const baseBtn =
    "p-1.5 rounded-full transition-all duration-300 flex items-center justify-center shadow-md text-white font-bold";

  const imgBtn = `${baseBtn} bg-red-700 hover:bg-black hover:shadow-red-800/50`;
  const imgBtnGray =
    "p-1.5 rounded-full bg-gray-400/70 cursor-not-allowed flex items-center justify-center";

  const editBtn = `${baseBtn} bg-blue-600 hover:bg-blue-800 hover:shadow-blue-600/50`;
  const delBtn = `${baseBtn} bg-red-700 hover:bg-red-900 hover:shadow-red-900/50`;

  // Celdas especiales
  const nameCellClass = tipo === "comestible" ? `${tdClass} max-w-[140px] sm:max-w-[220px] truncate` : tdClass;
  const marcaCellClass = tipo === "comestible" ? `${tdClass} max-w-[100px] sm:max-w-[120px] truncate` : tdClass;
  const loteCellClass = `${tdClass}`;
  const saborCellClass = `${tdClass} max-w-[100px] sm:max-w-[120px] truncate`;
  const pesoCellClass = `${tdClass} text-center`;
  const litrosCellClass = `${tdClass} text-center`;

  // Loading
  if (loading)
    return (
      <div className="flex items-center justify-center py-6">
        <p className="flex items-center gap-2 text-sm font-medium text-gray-600 animate-pulse">
          <Wand2 size={16} className="text-red-700 animate-spin" />
          Cargando inventario...
        </p>
      </div>
    );

  // Sin datos
  if (!datos?.length)
    return (
      <div className="flex items-center justify-center py-6">
        <p className="text-sm text-gray-500">
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
              {tipo === "comestible" && <th className={thClass}>Lote</th>}
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

              let stockColor = "font-bold";
              if (tipo === "ropa") stockColor += stock <= 10 ? " text-red-700" : " text-green-700";
              if (tipo === "comestible") stockColor += stock <= 30 ? " text-red-700" : " text-green-700";

              const fechaVenc =
                p.fecha_vencimiento &&
                new Date(p.fecha_vencimiento).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

              return (
                <tr key={id} className={trClass}>
                  <td className={tdClass + " font-mono text-gray-900 font-semibold"}>
                    {id}
                  </td>

                  {tipo === "comestible" && (
                    <td className={loteCellClass}>{p.lote || "—"}</td>
                  )}

                  <td className={nameCellClass} title={p.nombre}>{p.nombre}</td>
                  <td className={marcaCellClass} title={p.marca}>{p.marca || "N/A"}</td>

                  <td className={`${tdClass} text-center ${stockColor}`}>{stock}</td>

                  {tipo === "ropa" ? (
                    <>
                      <td className={tdClass}>{p.talla || "N/A"}</td>
                      <td className={tdClass}>{p.color || "N/A"}</td>
                    </>
                  ) : (
                    <>
                      <td className={saborCellClass}>{p.sabor || "N/A"}</td>
                      <td className={pesoCellClass}>{p.peso ? `${p.peso} g` : "-"}</td>
                      <td className={litrosCellClass}>{p.litros ? `${p.litros} ml` : "-"}</td>
                      <td className={tdClass + " text-center"}>{fechaVenc || "—"}</td>
                    </>
                  )}

                  <td className={tdClass + " font-bold text-green-700"}>
                    S/ {parseFloat(p.precio).toFixed(2) || "0.00"}
                  </td>

                  <td className={tdClass}>{p.ubicacion || "N/A"}</td>

                  {/* ---------- IMAGEN ---------- */}
                  <td className={`${tdClass} text-center`}>
                    <div className="flex justify-center">
                      {p.imagen ? (
                        <button
                          type="button"
                          onClick={() => {
                            const path = p.imagen;
                            const url =
                              path && (path.startsWith("http")
                                ? path
                                : `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`);
                            onVerImagen(url);
                          }}
                          className={imgBtn}
                          title="Ver imagen"
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

                  <td className={tdClass + " text-center"}>
                    <div className="flex justify-center gap-1.5">
                      <button onClick={() => onEditar(p)} className={editBtn}>
                        <Wand2 size={14} />
                      </button>

                      <button onClick={() => onEliminar(id, tipo)} className={delBtn}>
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
