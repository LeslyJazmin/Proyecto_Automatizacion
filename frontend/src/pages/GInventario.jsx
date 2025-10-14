import { useState, useEffect, useCallback } from "react";
import { Package, Shirt, CupSoda, ClipboardPlus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ModalEntrada from "../components/RegistroEntrada";
import TablaInventario from "../components/TablaInventario";
import ModalMensaje from "../components/ModalMensaje";
import Button from "../components/ui/Button";
import ActualizarProducto from "../components/ActualizarProducto";
import ModalConfirmacion from "../components/ModalConfirmacion";

import {
  obtenerRopa,
  obtenerComestibles,
  registrarEntradaRopa,
  registrarEntradaComestible,
  buscarRopa,
  buscarComestibles,
  eliminarRopa,
  eliminarComestible,
  actualizarRopa,
  actualizarComestible,
} from "../api/inventario";

import { useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function GInventario() {
  // ---------- ESTADOS GENERALES ----------
  const [imagenModalOpen, setImagenModalOpen] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  const [modalComestiblesOpen, setModalComestiblesOpen] = useState(false);
  const [modalRopaOpen, setModalRopaOpen] = useState(false);

  const [confirmacionOpen, setConfirmacionOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [productoEditar, setProductoEditar] = useState(null);
  const [tipoEdicion, setTipoEdicion] = useState(null);

  const [ropa, setRopa] = useState([]);
  const [comestibles, setComestibles] = useState([]);

  const [mostrarRopa, setMostrarRopa] = useState(false);
  const [mostrarComestibles, setMostrarComestibles] = useState(false);

  const [loadingRopa, setLoadingRopa] = useState(true);
  const [loadingComestibles, setLoadingComestibles] = useState(true);

  const [mensaje, setMensaje] = useState({ open: false, tipo: "", texto: "" });

  const usuarioId = "ADM2235";
  const location = useLocation();
  const sidebarActive = location.pathname;

  // ---------- FUNCIONES AUXILIARES ----------
  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ open: true, tipo, texto });
  };

  // ---------- CARGAR DATOS ----------
  const fetchDatos = useCallback(async () => {
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
      mostrarMensaje("error", "Error al cargar los datos del inventario.");
    } finally {
      setLoadingRopa(false);
      setLoadingComestibles(false);
    }
  }, []); // ✅ sin dependencias

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]); // ✅ sin warning de eslint

  // ---------- BUSCAR ----------
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
      mostrarMensaje("error", "Error en la búsqueda.");
    } finally {
      setLoadingRopa(false);
      setLoadingComestibles(false);
    }
  };

  // ---------- REGISTRAR ----------
  const handleRegistrarProducto = async (tipo, formData) => {
    try {
      const data = new FormData();
      for (const key in formData) data.append(key, formData[key]);

      if (tipo === "ropa") {
        await registrarEntradaRopa(data);
        setModalRopaOpen(false);
      } else {
        await registrarEntradaComestible(data);
        setModalComestiblesOpen(false);
      }

      await fetchDatos();
      mostrarMensaje("exito", "✅ Producto registrado con éxito.");
    } catch (err) {
      mostrarMensaje("error", "❌ Error al registrar producto.");
    }
  };

  // ---------- EDITAR ----------
  const handleEditar = (producto) => {
    const tipo = producto.id_ropa ? "ropa" : "comestible";
    setProductoEditar(producto);
    setTipoEdicion(tipo);
  };

  const handleActualizarProducto = async (tipo, formData) => {
    try {
      if (tipo === "ropa") await actualizarRopa(formData);
      else await actualizarComestible(formData);

      await fetchDatos();
      mostrarMensaje("exito", "✅ Producto actualizado con éxito.");
      setProductoEditar(null);
      setTipoEdicion(null);
    } catch (err) {
      mostrarMensaje("error", "❌ Error al actualizar producto.");
    }
  };

  // ---------- ELIMINAR ----------
  // Mostrar el modal de confirmación
const handleEliminar = (id, tipo) => {
  setProductoAEliminar({ id, tipo });
  setConfirmacionOpen(true);
};

// Confirmar eliminación
const confirmarEliminacion = async () => {
  if (!productoAEliminar) return;

  const { id, tipo } = productoAEliminar;
  setConfirmacionOpen(false);

  try {
    if (tipo === "ropa") await eliminarRopa(id);
    else await eliminarComestible(id);

    await fetchDatos();
    mostrarMensaje("exito", "🗑️ Producto eliminado correctamente.");
  } catch (err) {
    mostrarMensaje("error", "❌ Error al eliminar producto.");
  } finally {
    setProductoAEliminar(null);
  }
};


  // ---------- RENDER ----------
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      <Sidebar active={sidebarActive} />

      <div className="ml-72 p-6">
        {/* ENCABEZADO */}
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

        {/* 🧃 COMESTIBLES */}
        <div className="relative mb-6">
          <img
            src="/images/PComestible.png"
            alt="Productos Comestibles"
            className="w-full h-62 object-cover shadow-xl rounded-xl"
          />
          <button
            className="absolute top-4 left-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 via-blue-700 to-black text-white px-5 py-2 font-bold rounded-lg shadow-lg hover:scale-105 transition"
            onClick={() => setMostrarComestibles((p) => !p)}
          >
            <CupSoda className="w-5 h-5" />
            <span>Ver</span>
          </button>

          {mostrarComestibles && (
            <div className="bg-white shadow-md rounded-lg p-4 mt-4 relative">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setModalComestiblesOpen(true);
                      setProductoEditar(null);
                    }}
                    className="bg-green-700 text-white font-bold px-5 py-2 rounded-lg hover:bg-green-800 transition"
                  >
                    <ClipboardPlus className="w-5 h-5 text-white" />
                    Registrar Entrada
                  </Button>
                </div>

                <input
                  type="text"
                  placeholder="🔍 Buscar comestible..."
                  className="w-1/3 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleBuscar("comestible", e.target.value)}
                />
              </div>

              <TablaInventario
                datos={comestibles}
                tipo="comestible"
                API_URL={API_URL}
                onVerImagen={(img) => {
                  setImagenSeleccionada(img);
                  setImagenModalOpen(true);
                }}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
                loading={loadingComestibles}
              />

              <ModalEntrada
                isOpen={modalComestiblesOpen}
                onClose={() => setModalComestiblesOpen(false)}
                usuarioId={usuarioId}
                title={
                  productoEditar
                    ? "Editar Producto Comestible"
                    : "Registrar Nuevo Producto Comestible"
                }
                tipo="comestible"
                data={productoEditar}
                onSuccess={(formData) =>
                  productoEditar
                    ? handleActualizarProducto("comestible", formData)
                    : handleRegistrarProducto("comestible", formData)
                }
              />
            </div>
          )}
        </div>

        {/* 👕 ROPA */}
        <div className="relative mb-6">
          <img
            src="/images/RDeportivo.png"
            alt="Ropa Deportiva"
            className="w-full h-62 object-cover shadow-xl rounded-xl"
          />
          <button
            className="absolute top-4 right-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 via-blue-700 to-black text-white px-5 py-2 font-bold rounded-lg shadow-lg hover:scale-105 transition"
            onClick={() => setMostrarRopa((p) => !p)}
          >
            <Shirt className="w-5 h-5" />
            <span>Ver</span>
          </button>

          {mostrarRopa && (
            <div className="bg-white shadow-md rounded-lg p-4 mt-4 relative">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setModalRopaOpen(true);
                      setProductoEditar(null);
                    }}
                    className="bg-green-700 text-white font-bold px-5 py-2 rounded-lg hover:bg-green-800 transition"
                  >
                    <ClipboardPlus className="w-5 h-5 text-white" />
                    Registrar Entrada
                  </Button>
                </div>

                <input
                  type="text"
                  placeholder="🔍 Buscar prenda..."
                  className="w-1/3 border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-red-600"
                  onChange={(e) => handleBuscar("ropa", e.target.value)}
                />
              </div>

              <TablaInventario
                datos={ropa}
                tipo="ropa"
                API_URL={API_URL}
                onVerImagen={(img) => {
                  setImagenSeleccionada(img);
                  setImagenModalOpen(true);
                }}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
                loading={loadingRopa}
              />

              <ModalEntrada
                isOpen={modalRopaOpen}
                onClose={() => setModalRopaOpen(false)}
                usuarioId={usuarioId}
                title={
                  productoEditar
                    ? "Editar Prenda Deportiva"
                    : "Registrar Nueva Prenda"
                }
                tipo="ropa"
                data={productoEditar}
                onSuccess={(formData) =>
                  productoEditar
                    ? handleActualizarProducto("ropa", formData)
                    : handleRegistrarProducto("ropa", formData)
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* 🖼️ MODAL IMAGEN */}
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
+          </div>
        </div>
      )}

      {/* ✏️ MODAL ACTUALIZAR PRODUCTO */}
      {productoEditar && (
        <ActualizarProducto
          producto={productoEditar}
          tipo={tipoEdicion}
          onClose={() => setProductoEditar(null)}
          onActualizar={handleActualizarProducto}
        />
      )}
      {/* ⚠️ MODAL CONFIRMACIÓN ELIMINAR */}
      <ModalConfirmacion
        isOpen={confirmacionOpen}
        onClose={() => setConfirmacionOpen(false)}
        onConfirm={confirmarEliminacion}
      />


      {/* ✅ MODAL MENSAJE */}
      <ModalMensaje
        isOpen={mensaje.open}
        tipo={mensaje.tipo}
        mensaje={mensaje.texto}
        onClose={() => setMensaje({ ...mensaje, open: false })}
      />
    </div>
  );
}
