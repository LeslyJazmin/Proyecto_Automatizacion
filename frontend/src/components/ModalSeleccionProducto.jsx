import { useEffect, useState } from "react";
import ModalGInventario from "./ui/ModalGInventario";
import {
  obtenerRopa,
  obtenerComestibles,
  buscarRopa,
  buscarComestibles,
} from "../api/inventario";
import { Search, Loader2, CheckCircle, AlertCircle } from "lucide-react"; // ⬅️ Importar iconos

export default function ModalSeleccionProducto({ tipo, onClose, onSelect }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

  // ⚙️ Estilos centralizados y mejorados
  const inputClass =
    "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm transition-all duration-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-inner";
  const headerClass =
    "sticky top-0 bg-emerald-700 text-white font-semibold uppercase text-xs tracking-wider";
  const rowClass = "border-b border-gray-100 hover:bg-emerald-50/50 transition duration-150 cursor-pointer";
  const cellClass = "px-4 py-3 align-middle text-gray-700";
  const buttonClass =
    "inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200 active:scale-[0.98]";

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
        // Si se borra la búsqueda, volver a cargar todos los productos
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

  return (
    <ModalGInventario
      isOpen={true}
      onClose={onClose}
      title="Seleccionar Producto Existente para Recarga"
      maxWidth="700px" // Ampliamos un poco el modal para la tabla
    >
      {/* 🔎 Barra de búsqueda MEJORADA */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar producto por ID o Nombre..."
          className={inputClass}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* 📦 Contenedor de la Tabla */}
      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-xl shadow-lg bg-white">
        {loading ? (
          <div className="text-center py-10 text-emerald-600 font-semibold flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin mb-3" />
            Cargando productos...
          </div>
        ) : productos.length > 0 ? (
          <table className="w-full text-sm table-auto">
            <thead>
              <tr>
                <th className={`${headerClass} text-left rounded-tl-xl w-1/5 ${cellClass}`}>ID</th>
                <th className={`${headerClass} text-left w-2/5 ${cellClass}`}>Nombre</th>
                <th className={`${headerClass} text-left w-1/5 ${cellClass}`}>Marca</th>
                <th className={`${headerClass} w-1/5 rounded-tr-xl ${cellClass}`}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr
                  key={tipo === "ropa" ? p.id_ropa : p.id_comestible}
                  className={rowClass}
                  onClick={() => onSelect(p)} // Permite seleccionar haciendo clic en la fila
                >
                  <td className={`${cellClass} font-mono font-semibold text-xs`}>
                    {tipo === "ropa" ? p.id_ropa : p.id_comestible}
                  </td>
                  <td className={`${cellClass} font-medium`}>{p.nombre}</td>
                  <td className={cellClass}>{p.marca || "-"}</td>
                  <td className={`${cellClass} text-center`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelect(p); }} // Detiene la propagación para evitar doble clic
                      className={buttonClass}
                    >
                      <CheckCircle className="w-3 h-3 mr-2" />
                      Seleccionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-gray-500 flex flex-col items-center justify-center">
            <AlertCircle className="w-6 h-6 mb-3 text-red-500" />
            <p className="font-medium">
              {busqueda.trim() ? 
               "La búsqueda no arrojó resultados." : 
               `No hay productos de ${tipo === "ropa" ? "ropa" : "comestibles"} disponibles en el catálogo.`
              }
            </p>
            <p className="text-sm mt-1">
              {busqueda.trim() ? 
              "Intenta con un nombre diferente o verifica el ID." : 
              "Debes ingresar un nuevo producto si no aparece en esta lista."
              }
            </p>
          </div>
        )}
      </div>

      {/* Botón de cierre más visible fuera de la tabla */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-6 py-2 rounded-xl transition duration-200"
        >
          Cancelar
        </button>
      </div>
    </ModalGInventario>
  );
}