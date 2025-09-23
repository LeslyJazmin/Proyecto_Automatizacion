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
  }, [modalOpen]); // Se refresca cada vez que se cierra el modal

  return (
    <div className="flex min-h-screen text-gray-900">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} logoutOpen={modalOpen} />

      {/* Contenido principal */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Gestión de Inventario</h1>
        <Button onClick={() => setModalOpen(true)}>Registrar Entrada</Button>

        {/* Tabla Ropa Deportiva */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Ropa Deportiva</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
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
                <tr key={p.id_ropa}>
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

        {/* Tabla Productos Comestibles */}
        <h2 className="text-xl font-semibold mt-6 mb-2">Productos Comestibles</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
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
                <tr key={p.id_comestible}>
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
