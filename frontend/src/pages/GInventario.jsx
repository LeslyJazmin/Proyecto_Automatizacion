import { useState, useEffect } from "react"; 
import Sidebar from "../components/Sidebar";
import ModalEntrada from "../components/ModalEntrada";
import Button from "../components/ui/Button";
import { obtenerRopa, obtenerComestibles } from "../api/inventario";

export default function GInventario() {
  const [modalOpen, setModalOpen] = useState(false);
  const [ropa, setRopa] = useState([]);
  const [comestibles, setComestibles] = useState([]);
  const usuarioId = "ADM2235"; // ID del usuario logueado

  const handleLogout = () => console.log("Cerrar sesión");

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const dataRopa = await obtenerRopa();
        setRopa(dataRopa);

        const dataComestibles = await obtenerComestibles();
        setComestibles(dataComestibles);
      } catch (error) {
        console.error("Error al obtener datos del inventario:", error);
      }
    };

    fetchDatos();
  }, [modalOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} logoutOpen={modalOpen} />

      {/* Contenido principal */}
      <div className="flex-1 p-6">
       <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent 
               bg-gradient-to-r from-red-900 via-orange-500 to-red-500 
               drop-shadow-lg">
  📦 Gestión de Inventario
</h1>
        <Button className="mb-4" onClick={() => setModalOpen(true)}>Registrar Entrada</Button>

        {/* Tabla Ropa Deportiva */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Ropa Deportiva</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-200 text-gray-900">
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Nombre</th>
                  <th className="border px-4 py-2">Marca</th>
                  <th className="border px-4 py-2">Talla</th>
                  <th className="border px-4 py-2">Color</th>
                  <th className="border px-4 py-2">Precio</th>
                </tr>
              </thead>
              <tbody>
                {ropa.map((p) => (
                  <tr key={p.id_ropa} className="hover:bg-gray-100 transition">
                    <td className="border px-4 py-2">{p.id_ropa}</td>
                    <td className="border px-4 py-2">{p.nombre}</td>
                    <td className="border px-4 py-2">{p.marca || "-"}</td>
                    <td className="border px-4 py-2">{p.talla || "-"}</td>
                    <td className="border px-4 py-2">{p.color || "-"}</td>
                    <td className="border px-4 py-2">{p.precio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tabla Productos Comestibles */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Productos Comestibles</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-200 text-gray-900">
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Nombre</th>
                  <th className="border px-4 py-2">Marca</th>
                  <th className="border px-4 py-2">Sabor</th>
                  <th className="border px-4 py-2">Peso</th>
                  <th className="border px-4 py-2">Litros</th>
                  <th className="border px-4 py-2">Precio</th>
                </tr>
              </thead>
              <tbody>
                {comestibles.map((p) => (
                  <tr key={p.id_comestible} className="hover:bg-gray-100 transition">
                    <td className="border px-4 py-2">{p.id_comestible}</td>
                    <td className="border px-4 py-2">{p.nombre}</td>
                    <td className="border px-4 py-2">{p.marca || "-"}</td>
                    <td className="border px-4 py-2">{p.sabor}</td>
                    <td className="border px-4 py-2">{p.peso || "-"}</td>
                    <td className="border px-4 py-2">{p.litros || "-"}</td>
                    <td className="border px-4 py-2">{p.precio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Entrada */}
      <ModalEntrada
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        usuarioId={usuarioId}
        title="Registrar Nueva Entrada"
      />
    </div>
  );
}
