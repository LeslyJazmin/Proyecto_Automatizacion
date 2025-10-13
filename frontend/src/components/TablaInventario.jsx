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
  if (loading)
    return (
      <div className="flex justify-center items-center py-6">
        <p className="text-gray-600 font-medium animate-pulse">
          ⏳ Cargando información...
        </p>
      </div>
    );

  if (!datos || datos.length === 0)
    return (
      <div className="flex justify-center items-center py-6">
        <p className="text-gray-500">No hay productos registrados.</p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 rounded-lg">
        <thead className="bg-gradient-to-r from-red-900 via-red-700 to-black text-white">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Marca</th>
            <th className="border px-4 py-2">Cantidad</th>

            {tipo === "ropa" ? (
              <>
                <th className="border px-4 py-2">Talla</th>
                <th className="border px-4 py-2">Color</th>
              </>
            ) : (
              <>
                <th className="border px-4 py-2">Sabor</th>
                <th className="border px-4 py-2">Peso</th>
                <th className="border px-4 py-2">Litros</th>
              </>
            )}

            <th className="border px-4 py-2">Precio</th>
            <th className="border px-4 py-2">Ubicación</th>
            <th className="border px-4 py-2">Imagen</th>
            <th className="border px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {datos.map((p) => {
            const id = tipo === "ropa" ? p.id_ropa : p.id_comestible;

            return (
              <tr key={id} className="hover:bg-gray-100 transition">
                <td className="border px-4 py-2">{id}</td>
                <td className="border px-4 py-2">{p.nombre}</td>
                <td className="border px-4 py-2">{p.marca || "-"}</td>
                <td className="border px-4 py-2">{p.cantidad ?? "-"}</td>

                {tipo === "ropa" ? (
                  <>
                    <td className="border px-4 py-2">{p.talla || "-"}</td>
                    <td className="border px-4 py-2">{p.color || "-"}</td>
                  </>
                ) : (
                  <>
                    <td className="border px-4 py-2">{p.sabor || "-"}</td>
                    <td className="border px-4 py-2">{p.peso || "-"}</td>
                    <td className="border px-4 py-2">{p.litros || "-"}</td>
                  </>
                )}

                <td className="border px-4 py-2">{p.precio}</td>
                <td className="border px-4 py-2">{p.ubicacion || "-"}</td>

                {/* Imagen */}
                <td className="border px-4 py-2 text-center">
                  {p.imagen ? (
                    <button
                      onClick={() => onVerImagen(`${API_URL}${p.imagen}`)}
                      className="bg-gradient-to-r from-red-900 via-red-700 to-black text-white px-3 py-1 rounded-md shadow-md hover:from-black hover:via-red-800 hover:to-black transition flex items-center justify-center gap-2"
                    >
                      <ImageIcon size={16} className="text-white" />
                      <span className="text-sm font-medium">Ver</span>
                    </button>
                  ) : (
                    "-"
                  )}
                </td>

                {/* Botones */}
                <td className="border px-4 py-2 text-center flex justify-center gap-2">
                  {/* Editar */}
                  <button
                    onClick={() => onEditar(p)}
                    title="Editar producto"
                    className="relative p-1.5 rounded-md 
                    bg-gradient-to-r from-black via-blue-700 to-blue-700 
                    text-white flex items-center justify-center 
                    shadow-[0_0_12px_rgba(0,191,255,0.6)] 
                    hover:shadow-[0_0_16px_rgba(0,191,255,0.9)] 
                    transition-all duration-300 hover:scale-105"
                  >
                    <Wand2
                      size={18}
                      className="text-white stroke-white stroke-[1.5]"
                    />
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={() => onEliminar(id, tipo)}
                    title="Eliminar producto"
                    className="bg-gradient-to-r from-black via-red-700 to-red-900 hover:from-red-900 hover:to-black text-white px-2 py-1 rounded-md shadow-md hover:shadow-lg transition flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
