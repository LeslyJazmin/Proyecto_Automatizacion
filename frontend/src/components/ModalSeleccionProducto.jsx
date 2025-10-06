import { useEffect, useState } from "react";
import ModalGInventario from "./ui/ModalGInventario";
import { obtenerRopa, obtenerComestibles } from "../api/inventario";

export default function ModalSeleccionProducto({ tipo, onClose, onSelect }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = tipo === "ropa" ? await obtenerRopa() : await obtenerComestibles();
      setProductos(data);
    };
    fetchData();
  }, [tipo]);

  return (
    <ModalGInventario isOpen={true} onClose={onClose} title="Seleccionar Producto Existente">
      <div className="max-h-80 overflow-y-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-200 text-gray-900">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Nombre</th>
              <th className="border px-3 py-2">Marca</th>
              <th className="border px-3 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={tipo === "ropa" ? p.id_ropa : p.id_comestible} className="hover:bg-gray-100 transition">
                <td className="border px-3 py-2">{tipo === "ropa" ? p.id_ropa : p.id_comestible}</td>
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
      </div>
    </ModalGInventario>
  );
}
