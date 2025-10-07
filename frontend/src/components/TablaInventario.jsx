import { useState } from "react";
import { Trash2, Image as ImageIcon } from "lucide-react";
import { eliminarRopa, eliminarComestible } from "../api/inventario";

export default function TablaInventario({ datos, tipo, API_URL, onVerImagen, loading, onActualizar }) {
  const [eliminando, setEliminando] = useState(null);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    try {
      setEliminando(id);
      let res;
      if (tipo === "ropa") res = await eliminarRopa(id);
      else res = await eliminarComestible(id);

      console.log("✅ Eliminado:", res);
      alert("Producto eliminado correctamente ✅");

      if (onActualizar) onActualizar();
    } catch (err) {
      console.error("❌ Error al eliminar producto:", err);
      alert("Error al eliminar el producto. Revisa la consola.");
    } finally {
      setEliminando(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-6">
        <p className="text-gray-600 font-medium animate-pulse">⏳ Cargando información...</p>
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

                <td className="border px-4 py-2 text-center">
                  {p.imagen ? (
                    <button
                      onClick={() => onVerImagen(`${API_URL}${p.imagen}`)}
                      className="bg-gradient-to-r from-red-900 via-red-700 to-black text-white px-3 py-1 rounded-md shadow-md hover:from-black hover:via-red-800 hover:to-black transition flex items-center justify-center gap-2"
                    >
                      <ImageIcon size={16} /> Ver
                    </button>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleEliminar(id)}
                    disabled={eliminando === id}
                    title="Eliminar producto"
                    className={`${
                      eliminando === id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-black via-red-700 to-red-900 hover:from-red-900 hover:to-black"
                    } text-white px-3 py-1 rounded-md shadow-md transition flex items-center justify-center mx-auto`}
                  >
                    {eliminando === id ? (
                      <span className="animate-pulse text-sm">...</span>
                    ) : (
                      <Trash2 size={18} />
                    )}
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
