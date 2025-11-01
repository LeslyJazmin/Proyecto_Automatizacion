import { useEffect, useState } from "react";
import {
  obtenerRopa,
  obtenerComestibles,
  buscarRopa,
  buscarComestibles,
} from "../api/inventario";
import { Search, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ModalSeleccionProducto({ tipo, onClose, onSelect }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

  // ⚙️ Estilos centralizados y REDUCIDOS
  const inputClass =
    "w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-inner";
  const headerClass =
    "sticky top-0 bg-emerald-700 text-white font-semibold uppercase text-xxs tracking-wider"; // Más pequeño
  const rowClass = "border-b border-gray-100 hover:bg-emerald-50/50 transition duration-150 cursor-pointer";
  const cellClass = "px-3 py-2 align-middle text-gray-700"; // Menos padding
  const buttonClass =
    "inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xxs font-semibold px-2 py-1 rounded-md shadow-sm transition duration-200 active:scale-[0.98]"; // Botón más pequeño

  // 🔹 Cargar lista inicial
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data =
          tipo === "ropa" ? await obtenerRopa() : await obtenerComestibles();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tipo]);

  // 🔍 Buscar productos (exacto por ID o nombre)
  useEffect(() => {
    const fetchBusqueda = async () => {
      if (busqueda.trim() === "") {
        const data =
          tipo === "ropa" ? await obtenerRopa() : await obtenerComestibles();
        setProductos(data);
        return;
      }

      setLoading(true);
      try {
        const data =
          tipo === "ropa"
            ? await buscarRopa(busqueda)
            : await buscarComestibles(busqueda);
        setProductos(data);
      } catch (error) {
        console.error("Error al buscar productos:", error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchBusqueda, 400); // pequeño delay
    return () => clearTimeout(timeout);
  }, [busqueda, tipo]);

  // 🚨 El componente ahora solo devuelve el CONTENIDO, no el modal completo.
  return (
    <div className="p-3"> {/* Padding reducido */}
      {/* 🔎 Barra de búsqueda MEJORADA */}
      <div className="relative mb-4"> {/* Margen reducido */}
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /> {/* Icono más pequeño */}
        <input
          type="text"
          placeholder="Buscar producto por ID o Nombre..."
          className={inputClass}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* 📦 Contenedor de la Tabla */}
      <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg shadow-md bg-white"> {/* Altura reducida y sombra más sutil */}
        {loading ? (
          <div className="text-center py-6 text-emerald-600 font-semibold text-sm flex flex-col items-center justify-center"> {/* Padding y texto reducido */}
            <Loader2 className="w-5 h-5 animate-spin mb-2" /> {/* Icono más pequeño */}
            Cargando productos...
          </div>
        ) : productos.length > 0 ? (
          <table className="w-full text-xs table-auto"> {/* Fuente más pequeña en la tabla */}
            <thead>
              <tr>
                <th className={`${headerClass} text-left rounded-tl-lg w-1/5 ${cellClass}`}>ID</th>
                <th className={`${headerClass} text-left w-2/5 ${cellClass}`}>Nombre</th>
                <th className={`${headerClass} text-left w-1/5 ${cellClass}`}>Marca</th>
                <th className={`${headerClass} w-1/5 rounded-tr-lg ${cellClass}`}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr
                  key={tipo === "ropa" ? p.id_ropa : p.id_comestible}
                  className={rowClass}
                  onClick={() => onSelect(p)} 
                >
                  <td className={`${cellClass} font-mono font-semibold text-xxs`}>
                    {tipo === "ropa" ? p.id_ropa : p.id_comestible}
                  </td>
                  <td className={`${cellClass} font-medium`}>{p.nombre}</td>
                  <td className={`${cellClass} text-xxs`}>{p.marca || "-"}</td>
                  <td className={`${cellClass} text-center`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelect(p); }}
                      className={buttonClass}
                    >
                      <CheckCircle className="w-2.5 h-2.5 mr-1" /> {/* Icono más pequeño */}
                      Seleccionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm flex flex-col items-center justify-center">
            <AlertCircle className="w-5 h-5 mb-2 text-red-500" />
            <p className="font-medium text-sm">
              {busqueda.trim() ? 
                "La búsqueda no arrojó resultados." : 
                `No hay productos de ${tipo === "ropa" ? "ropa" : "comestibles"} disponibles.`
              }
            </p>
            <p className="text-xxs mt-1">
              {busqueda.trim() ? 
              "Intenta con otro nombre o ID." : 
              "Debes ingresar un nuevo producto si no aparece."
              }
            </p>
          </div>
        )}
      </div>

      {/* Botón de cierre más visible fuera de la tabla (usando onClose del padre) */}
      <div className="mt-4 flex justify-end"> {/* Margen reducido */}
        <button
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-4 py-1.5 text-xs rounded-lg transition duration-200"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
