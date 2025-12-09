import { Image as ImageIcon, Wand2 } from "lucide-react";

export default function TablaInventario({
  datos,
  tipo,
  API_URL,
  onVerImagen,
  loading,
}) {
  const tableContainerClass =
    tipo === "comestible"
      ? "mx-auto my-4 w-[95%] overflow-x-auto overflow-y-auto shadow-2xl border border-gray-200 max-h-[60vh] rounded-lg"
      : "mx-auto my-4 w-[95%] overflow-x-auto shadow-2xl border border-gray-200 rounded-lg";

  const tableClass = "w-full min-w-[750px] sm:min-w-full";
  const headClass =
    "bg-gradient-to-r from-red-900 via-red-800 to-black text-white uppercase text-[11px] sm:text-[12px] tracking-wider font-extrabold";
  const thClass =
    "px-2 sm:px-3 py-2 border-l border-r border-red-950/50 last:border-r-0 first:border-l-0 text-[11px] sm:text-[12px] whitespace-nowrap";
  const trClass =
    "bg-white border-b border-gray-100 transition duration-150 hover:bg-red-50";
  const tdClass =
    "px-2 sm:px-3 py-2 text-[12px] sm:text-[13px] text-gray-800 font-medium whitespace-nowrap border-r border-gray-200 max-w-[120px] truncate";

  const baseBtn =
    "p-1.5 rounded-full transition-all duration-300 flex items-center justify-center shadow-md text-white font-bold";
  const imgBtn = `${baseBtn} bg-red-700 hover:bg-black hover:shadow-red-800/50`;
  const imgBtnGray =
    "p-1.5 rounded-full bg-gray-400/70 cursor-not-allowed flex items-center justify-center";

  const nameCellClass = `${tdClass} max-w-[180px] sm:max-w-[220px]`;
  const marcaCellClass = `${tdClass} max-w-[100px] sm:max-w-[120px]`;
  const saborCellClass = `${tdClass} max-w-[100px] sm:max-w-[120px]`;

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
            </tr>
          </thead>

          <tbody>
            {datos.map((p) => {
              const id = tipo === "ropa" ? p.id_ropa : p.id_comestible;
              const stock = p.stock_actual ?? 0;

              let stockColor = "font-bold";
              stockColor +=
                tipo === "ropa"
                  ? stock <= 10
                    ? " text-red-700"
                    : " text-green-700"
                  : stock <= 30
                  ? " text-red-700"
                  : " text-green-700";

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
                    <td className={tdClass}>{p.lote || "—"}</td>
                  )}

                  <td className={nameCellClass} title={p.nombre}>
                    {p.nombre}
                  </td>

                  <td className={marcaCellClass} title={p.marca}>
                    {p.marca || "N/A"}
                  </td>

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
                      <td className={saborCellClass} title={p.sabor}>
                        {p.sabor || "N/A"}
                      </td>
                      <td className={tdClass}>{p.peso ? `${p.peso} g` : "-"}</td>
                      <td className={tdClass}>{p.litros ? `${p.litros} ml` : "-"}</td>
                      <td className={tdClass + " text-center"}>
                        {fechaVenc || "—"}
                      </td>
                    </>
                  )}

                  <td className={tdClass + " font-bold text-green-700"}>
                    S/ {parseFloat(p.precio).toFixed(2) || "0.00"}
                  </td>

                  <td className={tdClass}>{p.ubicacion || "N/A"}</td>

                  <td className={`${tdClass} text-center`}>
                    <div className="flex justify-center">
                      {p.imagen ? (
                        <button
                          type="button"
                          onClick={() => {
                            const url = p.imagen.startsWith("http")
                              ? p.imagen
                              : `${API_URL}${p.imagen.startsWith("/") ? "" : "/"}${p.imagen}`;
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
