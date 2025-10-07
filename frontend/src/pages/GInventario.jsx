import { useState, useEffect } from "react";
import { Package, Shirt, CupSoda, ClipboardPlus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ModalEntrada from "../components/RegistroEntrada";
import Button from "../components/ui/Button";
import TablaInventario from "../components/TablaInventario";
import {
  obtenerRopa,
  obtenerComestibles,
  registrarEntradaRopa,
  registrarEntradaComestible,
  buscarRopa,
  buscarComestibles,
} from "../api/inventario";
import { useLocation } from "react-router-dom";

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

  const [loadingRopa, setLoadingRopa] = useState(true);
  const [loadingComestibles, setLoadingComestibles] = useState(true);

  const usuarioId = "ADM2235";
  const location = useLocation();
  const sidebarActive = location.pathname;

  // ✅ Cargar datos iniciales
  const fetchDatos = async () => {
    try {
      setLoadingRopa(true);
      setLoadingComestibles(true);

      const [ropaData, comestiblesData] = await Promise.all([
        obtenerRopa(),
        obtenerComestibles(),
      ]);

      setRopa(ropaData);
      setComestibles(comestiblesData);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setLoadingRopa(false);
      setLoadingComestibles(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  // ✅ Buscar ropa o comestibles por texto (API real)
  const handleBuscar = async (tipo, valor) => {
    if (valor.trim() === "") {
      fetchDatos();
      return;
    }

    try {
      if (tipo === "ropa") {
        setLoadingRopa(true);
        const data = await buscarRopa(valor);
        setRopa(data);
      } else {
        setLoadingComestibles(true);
        const data = await buscarComestibles(valor);
        setComestibles(data);
      }
    } catch (err) {
      console.error("Error en búsqueda:", err);
    } finally {
      setLoadingRopa(false);
      setLoadingComestibles(false);
    }
  };

  // ✅ Registrar producto (ropa o comestible)
  const handleRegistrarProducto = async (tipo, formData) => {
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      if (tipo === "ropa") {
        await registrarEntradaRopa(data);
        setModalRopaOpen(false);
      } else {
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
        {/* ENCABEZADO PRINCIPAL */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <Package size={38} className="text-red-700" />
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              Gestión de Inventario
            </h1>
          </div>
          <p className="mt-2 text-gray-600 text-lg">
            Administra tus productos de manera sencilla y visualiza tus entradas
            y salidas en tiempo real.
          </p>
        </div>

        {/* 🧃 SECCIÓN COMESTIBLES */}
        <div className="relative mb-6">
          <img
            src="/images/PComestible.png"
            alt="Productos Comestibles"
            className="w-full h-62 object-cover shadow-xl rounded-xl"
          />
          <button
            className="absolute top-4 left-4 flex items-center gap-2
                      bg-gradient-to-r from-blue-600 via-blue-700 to-black
                      text-white px-5 py-2 font-bold rounded-lg
                      shadow-[0_0_15px_#1e90ff88,0_0_40px_#1e90ff44]
                      hover:shadow-[0_0_25px_#1e90ff,0_0_60px_#1e90ff99]
                      hover:scale-105
                      transition-all duration-300 ease-in-out"
            onClick={() => setMostrarComestibles((prev) => !prev)}
          >
            <CupSoda className="w-5 h-5" />
            <span>Ver</span>
          </button>

          {mostrarComestibles && (
            <div className="bg-white shadow-md rounded-lg p-4 mt-4 relative">
              <div className="flex justify-between items-center mb-4">
                {/* BOTONES */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setModalComestiblesOpen(true)}
                    className="flex items-center gap-2 
                              bg-gradient-to-r from-green-600 via-green-700 to-green-800
                              text-white font-bold px-5 py-2 rounded-lg
                              shadow-[0_0_12px_#22c55e66,0_0_25px_#16a34a33]
                              hover:scale-105 hover:shadow-[0_0_20px_#22c55eaa]
                              transition-all duration-300 ease-in-out"
                  >
                    <ClipboardPlus className="w-5 h-5 text-white" />
                    <span>Registrar Entrada</span>
                  </Button>

                  <Button
                    onClick={() => alert("Abrir modal de salida (pendiente)")}
                    className="flex items-center gap-2 
                              bg-gradient-to-r from-red-600 via-red-700 to-red-800
                              text-white font-bold px-5 py-2 rounded-lg
                              shadow-[0_0_12px_#ef444466,0_0_25px_#b91c1c33]
                              hover:scale-105 hover:shadow-[0_0_20px_#ef4444aa]
                              transition-all duration-300 ease-in-out"
                  >
                    <ClipboardPlus className="w-5 h-5 text-white" />
                    <span>Registrar Salida</span>
                  </Button>
                </div>

                {/* BUSCADOR */}
                <input
                  type="text"
                  placeholder="🔍 Buscar comestible por ID o nombre..."
                  className="w-1/3 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  onChange={(e) => handleBuscar("comestible", e.target.value)}
                />
              </div>

              {loadingComestibles ? (
                <p className="text-center text-gray-500 py-4 animate-pulse">
                  ⏳ Cargando productos comestibles...
                </p>
              ) : (
                <TablaInventario
                  datos={comestibles}
                  tipo="comestible"
                  API_URL={API_URL}
                  onVerImagen={(img) => {
                    setImagenSeleccionada(img);
                    setImagenModalOpen(true);
                  }}
                  loading={loadingComestibles}
                  onActualizar={fetchDatos} // <-- Agregar esta línea
                />
              )}

              <ModalEntrada
                isOpen={modalComestiblesOpen}
                onClose={() => setModalComestiblesOpen(false)}
                usuarioId={usuarioId}
                title="Registrar Nuevo Producto Comestible"
                tipo="comestible"
                onSuccess={(formData) =>
                  handleRegistrarProducto("comestible", formData)
                }
              />
            </div>
          )}
        </div>

        {/* 👕 SECCIÓN ROPA */}
        <div className="relative mb-6">
          <img
            src="/images/RDeportivo.png"
            alt="Ropa Deportiva"
            className="w-full h-62 object-cover shadow-xl rounded-xl"
          />
          <button
            className="absolute top-4 right-4 flex items-center gap-2
                        bg-gradient-to-r from-blue-600 via-blue-700 to-black
                        text-white px-5 py-2 font-bold rounded-lg
                        shadow-[0_0_15px_#1e90ff88,0_0_40px_#1e90ff44]
                        hover:scale-105 hover:shadow-[0_0_25px_#1e90ff]
                        transition-all duration-300 ease-in-out"
            onClick={() => setMostrarRopa((prev) => !prev)}
          >
            <Shirt className="w-5 h-5" />
            <span>Ver</span>
          </button>

          {mostrarRopa && (
            <div className="bg-white shadow-md rounded-lg p-4 mt-4 relative">
              <div className="flex justify-between items-center mb-4">
                {/* BOTONES */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setModalRopaOpen(true)}
                    className="flex items-center gap-2 
                              bg-gradient-to-r from-green-600 via-green-700 to-green-800
                              text-white font-bold px-5 py-2 rounded-lg
                              hover:scale-105 shadow-[0_0_12px_#22c55e66]
                              transition-all duration-300"
                  >
                    <ClipboardPlus className="w-5 h-5 text-white" />
                    <span>Registrar Entrada</span>
                  </Button>

                  <Button
                    onClick={() => alert("Abrir modal de salida (pendiente)")}
                    className="flex items-center gap-2 
                              bg-gradient-to-r from-red-600 via-red-700 to-red-800
                              text-white font-bold px-5 py-2 rounded-lg
                              hover:scale-105 shadow-[0_0_12px_#ef444466]
                              transition-all duration-300"
                  >
                    <ClipboardPlus className="w-5 h-5 text-white" />
                    <span>Registrar Salida</span>
                  </Button>
                </div>

                {/* BUSCADOR */}
                <input
                  type="text"
                  placeholder="🔍 Buscar prenda por ID o nombre..."
                  className="w-1/3 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-red-600 outline-none transition-all"
                  onChange={(e) => handleBuscar("ropa", e.target.value)}
                />
              </div>

              {loadingRopa ? (
                <p className="text-center text-gray-500 py-4 animate-pulse">
                  ⏳ Cargando prendas...
                </p>
              ) : (
                <TablaInventario
                  datos={ropa}
                  tipo="ropa"
                  API_URL={API_URL}
                  onVerImagen={(img) => {
                    setImagenSeleccionada(img);
                    setImagenModalOpen(true);
                  }}
                  loading={loadingRopa}
                  onActualizar={fetchDatos}
                />
              )}

              <ModalEntrada
                isOpen={modalRopaOpen}
                onClose={() => setModalRopaOpen(false)}
                usuarioId={usuarioId}
                title="Registrar Nueva Prenda"
                tipo="ropa"
                onSuccess={(formData) =>
                  handleRegistrarProducto("ropa", formData)
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* 🖼️ MODAL DE IMAGEN */}
      {imagenModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setImagenModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              📷 Vista de Imagen
            </h2>
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

