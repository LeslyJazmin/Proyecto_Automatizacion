import { useEffect, useState } from "react";
import ModalGInventario from "./ui/ModalGInventario";
import {
  obtenerRopa,
  obtenerComestibles,
  buscarRopa,
  buscarComestibles,
} from "../api/inventario";

export default function ModalSeleccionProducto({ tipo, onClose, onSelect }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

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
      title="Seleccionar Producto Existente"
    >
      {/* 🔎 Barra de búsqueda */}
      <div className="flex justify-between items-center mb-3">
        <input
          type="text"
          placeholder="Buscar por ID o nombre..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-red-500 outline-none"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* 📦 Tabla o indicador de carga */}
      <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
        {loading ? (
          <div className="text-center py-6 text-gray-600 font-medium animate-pulse">
            Cargando productos...
          </div>
        ) : productos.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-green-900 via-green-700 to-black text-white">
              <tr>
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Nombre</th>
                <th className="border px-3 py-2">Marca</th>
                <th className="border px-3 py-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr
                  key={tipo === "ropa" ? p.id_ropa : p.id_comestible}
                  className="hover:bg-gray-100 transition"
                >
                  <td className="border px-3 py-2">
                    {tipo === "ropa" ? p.id_ropa : p.id_comestible}
                  </td>
                  <td className="border px-3 py-2">{p.nombre}</td>
                  <td className="border px-3 py-2">{p.marca || "-"}</td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => onSelect(p)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md shadow transition"
                    >
                      Seleccionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No se encontraron productos.
          </div>
        )}
      </div>
    </ModalGInventario>
  );
}
