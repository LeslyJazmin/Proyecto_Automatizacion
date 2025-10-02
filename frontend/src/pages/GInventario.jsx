import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ModalEntrada from "../components/RegistroEntrada"; // ruta corregida
import Button from "../components/ui/Button";
import {
  obtenerRopa,
  obtenerComestibles,
  registrarEntradaRopa,
  registrarEntradaComestible,
} from "../api/inventario";
import { useLocation } from "react-router-dom";

export default function GInventario() {
  const [modalComestiblesOpen, setModalComestiblesOpen] = useState(false);
  const [modalRopaOpen, setModalRopaOpen] = useState(false);

  const [ropa, setRopa] = useState([]);
  const [comestibles, setComestibles] = useState([]);
  const [mostrarRopa, setMostrarRopa] = useState(false);
  const [mostrarComestibles, setMostrarComestibles] = useState(false);

  const usuarioId = "ADM2235";
  const location = useLocation();

  const fetchDatos = async () => {
    try {
      setRopa(await obtenerRopa());
      setComestibles(await obtenerComestibles());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const sidebarActive = location.pathname;

  const handleRegistrarProducto = async (tipo, formData) => {
    try {
      if (tipo === "ropa") {
        await registrarEntradaRopa({ ...formData, id_usuario: usuarioId });
        setModalRopaOpen(false);
      } else if (tipo === "comestible") {
        await registrarEntradaComestible({ ...formData, id_usuario: usuarioId });
        setModalComestiblesOpen(false);
      }
      await fetchDatos();
      alert("✅ Producto registrado con éxito");
    } catch (err) {
      console.error(err);
      alert("❌ Error al registrar producto: " + err.message);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      <Sidebar
        onLogout={() => console.log("Cerrar sesión")}
        logoutOpen={modalComestiblesOpen || modalRopaOpen}
        active={sidebarActive}
      />

      <div className="ml-72 p-6">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-900 via-orange-500 to-red-500 drop-shadow-lg">
          📦 Gestión de Inventario
        </h1>

        {/* Comestibles */}
        <div className="relative mb-6">
          <img src="/images/PComestible.png" alt="Productos Comestibles" className="w-full h-72 object-cover shadow-xl" />
          <button
            className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 transition"
            onClick={() => setMostrarComestibles((prev) => !prev)}
          >
            Ver
          </button>
          {mostrarComestibles && (
            <div className="bg-white shadow-md rounded-lg p-4 mt-4 relative">
              <div className="flex justify-end mb-3">
                <Button onClick={() => setModalComestiblesOpen(true)} className="bg-rose-600 hover:bg-rose-500">
                  ➕ Registrar Producto
                </Button>
              </div>
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
              <ModalEntrada
                isOpen={modalComestiblesOpen}
                onClose={() => setModalComestiblesOpen(false)}
                usuarioId={usuarioId}
                title="Registrar Nuevo Producto Comestible"
                tipo="comestible"
                onSuccess={(formData) => handleRegistrarProducto("comestible", formData)}
              />
            </div>
          )}
        </div>

        {/* Ropa Deportiva */}
        <div className="relative mb-6">
          <img src="/images/RDeportivo.png" alt="Ropa Deportiva" className="w-full h-72 object-cover shadow-xl" />
          <button
            className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 transition"
            onClick={() => setMostrarRopa((prev) => !prev)}
          >
            Ver
          </button>
          {mostrarRopa && (
            <div className="bg-white shadow-md rounded-lg p-4 mt-4 relative">
              <div className="flex justify-end mb-3">
                <Button onClick={() => setModalRopaOpen(true)} className="bg-blue-600 hover:bg-blue-500">
                  👕 Registrar Ropa
                </Button>
              </div>
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
              <ModalEntrada
                isOpen={modalRopaOpen}
                onClose={() => setModalRopaOpen(false)}
                usuarioId={usuarioId}
                title="Registrar Nueva Prenda"
                tipo="ropa"
                onSuccess={(formData) => handleRegistrarProducto("ropa", formData)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
