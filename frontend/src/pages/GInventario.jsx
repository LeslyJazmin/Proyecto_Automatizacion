import { useState, useEffect } from "react";
import { Package, Shirt,CupSoda,ClipboardPlus  } from "lucide-react"; // Icono del título
import Sidebar from "../components/Sidebar";
import ModalEntrada from "../components/RegistroEntrada"; 
import Button from "../components/ui/Button";
import {
  obtenerRopa,
  obtenerComestibles,
  registrarEntradaRopa,
  registrarEntradaComestible,
} from "../api/inventario";
import { useLocation } from "react-router-dom";

// Base URL del backend
const API_URL = "http://localhost:5000";

export default function GInventario() {
  const [imagenModalOpen, setImagenModalOpen] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  const [modalComestiblesOpen, setModalComestiblesOpen] = useState(false);
  const [modalRopaOpen, setModalRopaOpen] = useState(false);

  const [ropa, setRopa] = useState([]);
  const [comestibles, setComestibles] = useState([]);
  const [mostrarRopa, setMostrarRopa] = useState(false);
  const [mostrarComestibles, setMostrarComestibles] = useState(false);

  const usuarioId = "ADM2235";
  const location = useLocation();

  // Cargar datos
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

  // Registrar producto
  const handleRegistrarProducto = async (tipo, formData) => {
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      if (tipo === "ropa") {
        await registrarEntradaRopa(data);
        setModalRopaOpen(false);
      } else if (tipo === "comestible") {
        await registrarEntradaComestible(data);
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
        {/* Encabezado */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Package size={38} className="text-red-700" />
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Gestión de Inventario
            </h1>
          </div>
          <p className="mt-2 text-gray-600 text-lg">
            Administra tus productos de manera sencilla y visualiza tus entradas y salidas en tiempo real.
          </p>
        </div>

        {/* Sección Comestibles */}
        <div className="relative mb-6">
          <img 
            src="/images/PComestible.png" 
            alt="Productos Comestibles" 
            className="w-full h-62 object-cover shadow-xl rounded-xl" 
          />
         {/* Botón Productos de Consumo */}
          <button
            className="absolute top-4 left-4 
                      flex items-center gap-2
                      bg-gradient-to-r from-blue-600 via-blue-700 to-black
                      text-white px-5 py-2 font-bold rounded-lg
                      shadow-[0_0_15px_#1e90ff88,0_0_40px_#1e90ff44]
                      hover:shadow-[0_0_25px_#1e90ff,0_0_60px_#1e90ff99]
                      hover:scale-105
                      transition-all duration-300 ease-in-out"
            onClick={() => setMostrarComestibles((prev) => !prev)}
          >
            <CupSoda className="w-5 h-5 text-white drop-shadow-[0_0_6px_#ffffffaa]" />
            <span>Ver</span>
          </button>
          {mostrarComestibles && (
            <div className="bg-white shadow-md rounded-lg p-4 mt-4 relative">
              {/* Botón registrar comestible */}
              <div className="flex justify-end mb-3">
              <Button
                  onClick={() => setModalComestiblesOpen(true)}
                  className="flex items-center gap-2 
                            bg-gradient-to-r from-green-600 via-green-700 to-green-800
                            text-white font-bold px-5 py-2 rounded-lg
                            shadow-[0_0_12px_#22c55e66,0_0_25px_#16a34a33]
                            hover:shadow-[0_0_20px_#22c55eaa,0_0_45px_#16a34a88]
                            hover:scale-105
                            transition-all duration-300 ease-in-out"
                >
                  <ClipboardPlus className="w-5 h-5 text-white drop-shadow-[0_0_6px_#ffffffaa]" />
                  <span>Registrar Entrada</span>
              </Button>
              </div>
              {/* Tabla Comestibles */}
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
                      <th className="border px-4 py-2">Ubicación</th>
                      <th className="border px-4 py-2">Imagen</th>
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
                        <td className="border px-4 py-2">{p.ubicacion || "-"}</td>
                        <td className="border px-4 py-2 text-center">
                          {p.imagen ? (
                            <button
                              onClick={() => {
                                setImagenSeleccionada(`${API_URL}${p.imagen}`);
                                setImagenModalOpen(true);
                              }}
                                 className="bg-gradient-to-r from-red-900 via-red-700 to-black text-white px-3 py-1 rounded-md shadow-md hover:from-black hover:via-red-800 hover:to-black transition"
                            >
                              Ver Imagen
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
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

        {/* Sección Ropa */}
        <div className="relative mb-6">
          <img 
            src="/images/RDeportivo.png" 
            alt="Ropa Deportiva" 
            className="w-full h-62 object-cover shadow-xl rounded-xl" 
          />
          <button
              className="absolute top-4 right-4 
                        flex items-center gap-2
                        bg-gradient-to-r from-blue-600 via-blue-700 to-black
                        text-white px-5 py-2 font-bold rounded-lg
                        shadow-[0_0_15px_#1e90ff88,0_0_40px_#1e90ff44]
                        hover:shadow-[0_0_25px_#1e90ff,0_0_60px_#1e90ff99]
                        hover:scale-105
                        transition-all duration-300 ease-in-out"
              onClick={() => setMostrarRopa((prev) => !prev)}
            >
              <Shirt className="w-5 h-5" />
              Ver
            </button>

          {mostrarRopa && (
            <div className="bg-white shadow-md rounded-lg p-4 mt-4 relative">
              {/* Botón registrar ropa */}
              <div className="flex justify-end mb-3">
               <Button
                  onClick={() => setModalRopaOpen(true)}
                  className="flex items-center gap-2 
                            bg-gradient-to-r from-green-600 via-green-700 to-green-800
                            text-white font-bold px-5 py-2 rounded-lg
                            shadow-[0_0_12px_#22c55e66,0_0_25px_#16a34a33]
                            hover:shadow-[0_0_20px_#22c55eaa,0_0_45px_#16a34a88]
                            hover:scale-105
                            transition-all duration-300 ease-in-out"
                >
                  <ClipboardPlus className="w-5 h-5 text-white drop-shadow-[0_0_6px_#ffffffaa]" />
                  <span>Registrar Entrada</span>
              </Button>
              </div>

              {/* Tabla Ropa */}
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
                      <th className="border px-4 py-2">Ubicación</th>
                      <th className="border px-4 py-2">Imagen</th>
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
                        <td className="border px-4 py-2">{p.ubicacion || "-"}</td>
                        <td className="border px-4 py-2 text-center">
                          {p.imagen ? (
                            <button
                              onClick={() => {
                                setImagenSeleccionada(`${API_URL}${p.imagen}`);
                                setImagenModalOpen(true);
                              }}
                              className="bg-gradient-to-r from-red-900 via-red-700 to-black text-white px-3 py-1 rounded-md shadow-md hover:from-black hover:via-red-800 hover:to-black transition"
                            >
                              Ver Imagen
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
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

      {/* Modal de Imagen */}
      {imagenModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setImagenModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">📷 Vista de Imagen</h2>
            <img
              src={imagenSeleccionada}
              alt="Imagen del producto"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}
