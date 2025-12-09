"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Package,
  Shirt,
  CupSoda,
  Eye,
  Search,
  ClipboardList,
} from "lucide-react";
import Sidebar from "../components/SidebarTrabajador";
import ModalEntrada from "../components/ModalNuevoProducto";
import TablaInventario from "../components/TablaInventarioTrabajador";
import ModalMensaje from "../components/ModalMensaje";
import Button from "../components/ui/Button";
import ActualizarProducto from "../components/ActualizarProducto";
import ModalExistenteProducto from "../components/ModalExistenteProducto";
import { generarPDFInventario } from "../utils/pdfGenerator";
import Modal from "../components/ui/Modal";

import {
  obtenerRopa,
  obtenerComestibles,
  registrarEntradaRopa,
  registrarEntradaComestible,
  buscarRopa,
  buscarComestibles,
  actualizarRopa,
  actualizarComestible,
} from "../api/inventario";

import { useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function TInventario() {
  // 1️⃣ Obtener user id desde token (si aplica)
  const getUserIdFromToken = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload.id ?? null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // ---------- ESTADOS ----------
  const [imagenModalOpen, setImagenModalOpen] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  const [modalComestiblesOpen, setModalComestiblesOpen] = useState(false);
  const [modalRopaOpen, setModalRopaOpen] = useState(false);

  const [modalExistenteRopaOpen, setModalExistenteRopaOpen] = useState(false);
  const [modalExistenteComestibleOpen, setModalExistenteComestibleOpen] =
    useState(false);

  const [productoEditar, setProductoEditar] = useState(null);
  const [tipoEdicion, setTipoEdicion] = useState(null);

  const [ropa, setRopa] = useState([]);
  const [comestibles, setComestibles] = useState([]);

  const [activeTab, setActiveTab] = useState("ropa");
  const [loadingRopa, setLoadingRopa] = useState(true);
  const [loadingComestibles, setLoadingComestibles] = useState(true);

  const [mensaje, setMensaje] = useState({ open: false, tipo: "", texto: "" });
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const usuarioId = getUserIdFromToken();
  const location = useLocation();
  const sidebarActive = location.pathname;

  // ---------- FUNCIONES ----------
  const mostrarMensaje = (tipo, texto) =>
    setMensaje({ open: true, tipo, texto });

  const fetchDatos = useCallback(async () => {
    try {
      setLoadingRopa(true);
      setLoadingComestibles(true);

      const [ropaData, comestiblesData] = await Promise.all([
        obtenerRopa(),
        obtenerComestibles(),
      ]);

      setRopa(ropaData || []);
      setComestibles(comestiblesData || []);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      mostrarMensaje("error", "Error al cargar los datos del inventario.");
    } finally {
      setLoadingRopa(false);
      setLoadingComestibles(false);
    }
  }, []);

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

  const handleBuscar = async (tipo, valor) => {
    if (valor.trim() === "") {
      await fetchDatos();
      return;
    }
    try {
      if (tipo === "ropa") {
        setLoadingRopa(true);
        const res = await buscarRopa(valor);
        setRopa(res);
      } else {
        setLoadingComestibles(true);
        const res = await buscarComestibles(valor);
        setComestibles(res);
      }
    } catch (err) {
      console.error("Error en búsqueda:", err);
      mostrarMensaje("error", "Error en la búsqueda.");
    } finally {
      setLoadingRopa(false);
      setLoadingComestibles(false);
    }
  };

  const handleRegistrarProducto = async (tipo, formData) => {
    try {
      let data = formData;
      // convertir a FormData solo si hay archivos
      if (!(formData instanceof FormData)) {
        const hasFile = Object.values(formData).some((v) => v instanceof File);
        if (hasFile) {
          data = new FormData();
          for (const key in formData) data.append(key, formData[key]);
        } else {
          data = formData; // JSON
        }
      }

      if (tipo === "ropa") await registrarEntradaRopa(data);
      else await registrarEntradaComestible(data);

      if (tipo === "ropa") setModalRopaOpen(false);
      else setModalComestiblesOpen(false);

      await fetchDatos();
      mostrarMensaje("exito", "Producto registrado con éxito.");
    } catch (err) {
      console.error("Error al registrar:", err);
      mostrarMensaje("error", "❌ Error al registrar producto.");
    }
  };

  const handleActualizarProducto = async (tipo, formData) => {
    try {
      let data = formData;
      if (!(formData instanceof FormData)) {
        const hasFile = Object.values(formData).some((v) => v instanceof File);
        if (hasFile) {
          data = new FormData();
          for (const key in formData) data.append(key, formData[key]);
        } else {
          data = formData;
        }
      }

      if (tipo === "ropa") await actualizarRopa(data);
      else await actualizarComestible(data);

      await fetchDatos();
      mostrarMensaje("exito", "Producto actualizado con éxito.");
      setProductoEditar(null);
      setTipoEdicion(null);
    } catch (err) {
      console.error("Error al actualizar:", err);
      mostrarMensaje("error", "❌ Error al actualizar producto.");
    }
  };

  const changeTab = (tab) => setActiveTab(tab);

  // ---------- RENDER DE SECCIONES ----------
  const renderRopaSection = () => (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              setModalRopaOpen(true);
              setProductoEditar(null);
            }}
            className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <Package className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
            <span>Registrar entrada</span>
          </Button>

          <Button
            onClick={() => setModalExistenteRopaOpen(true)}
            className="group flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <ClipboardList className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
            <span>Recargar Stock</span>
          </Button>

        </div>

        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar prenda por nombre..."
            className="py-2 sm:py-3 pl-10 pr-4 sm:pr-5 text-sm sm:text-base font-light text-gray-700 placeholder-gray-500 transition border border-gray-300 rounded-lg shadow-sm w-full sm:w-96 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => handleBuscar("ropa", e.target.value)}
          />
          <Search className="absolute w-4 sm:w-5 h-4 sm:h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <TablaInventario
          datos={ropa}
          tipo="ropa"
          API_URL={API_URL}
          onVerImagen={(img) => {
            setImagenSeleccionada(img);
            setImagenModalOpen(true);
          }}
          loading={loadingRopa}
        />
      </div>
    </div>
  );

  const renderComestiblesSection = () => (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              setModalComestiblesOpen(true);
              setProductoEditar(null);
            }}
            className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <Package className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
            <span>Registrar entrada</span>
          </Button>

          <Button
            onClick={() => setModalExistenteComestibleOpen(true)}
            className="group flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <ClipboardList className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
            <span>Recargar Stock</span>
          </Button>

        </div>

        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar producto comestible por nombre..."
            className="py-2 sm:py-3 pl-10 pr-4 sm:pr-5 text-sm sm:text-base font-light text-gray-700 placeholder-gray-500 transition border border-gray-300 rounded-lg shadow-sm w-full sm:w-96 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            onChange={(e) => handleBuscar("comestible", e.target.value)}
          />
          <Search className="absolute w-4 sm:w-5 h-4 sm:h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <TablaInventario
          datos={comestibles}
          tipo="comestible"
          API_URL={API_URL}
          onVerImagen={(img) => {
            setImagenSeleccionada(img);
            setImagenModalOpen(true);
          }}
          loading={loadingComestibles}
        />
      </div>
    </div>
  );

  // ---------- RENDER PRINCIPAL ----------
  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar onLogout={() => setLogoutModalOpen(true)} active={sidebarActive} />

      {/* Contenido responsivo: en móvil no dejamos margin-left grande */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 md:ml-64 ml-0 mt-20 md:mt-0">
        {/* ENCABEZADO */}
        <div className="pb-4 mb-8 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Título e ícono */}
            <div className="flex items-center gap-3 flex-1">
              <Package size={36} className="text-blue-600" />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                  Inventario Central: Gestión de Activos Fitness
                </h1>
                <p className="max-w-full md:max-w-3xl mt-1 text-sm sm:text-base font-light leading-snug text-gray-500">
                  Plataforma profesional para la administración de Nutrición, Suplementos y Ropa Deportiva en tiempo real.
                </p>
              </div>
            </div>

            <div className="mt-3 md:mt-0">
              <Button
                onClick={() =>
                  generarPDFInventario(ropa, comestibles, {
                    filename: "Inventario_Stock_Actual.pdf",
                    meta: {
                      title: "Inventario Stock Actual",
                      subtitle: `Generado: ${new Date().toLocaleString("es-PE")}`,
                    },
                  })
                }
                className="flex items-center gap-2 bg-gradient-to-r from-[#4b0000] to-black hover:from-[#5c0000] hover:to-[#1a1a1a] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.05] active:scale-95"
              >
                <Package className="w-5 h-5 text-white" />
                <span className="text-sm sm:text-base">Descargar Inventario en PDF</span>
              </Button>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-xl">
          <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50/50">
            <button
              onClick={() => changeTab("ropa")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-4 text-sm sm:text-lg font-medium transition duration-200 ease-in-out 
                ${activeTab === "ropa"
                  ? "text-blue-700 border-b-4 border-blue-600 bg-white/80"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-b-4 border-transparent"}`}
            >
              <Shirt className="w-4 sm:w-5 h-4 sm:h-5" /> Ropa Deportiva
            </button>

            <button
              onClick={() => changeTab("comestible")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-4 text-sm sm:text-lg font-medium transition duration-200 ease-in-out 
                ${activeTab === "comestible"
                  ? "text-yellow-700 border-b-4 border-yellow-600 bg-white/80"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-b-4 border-transparent"}`}
            >
              <CupSoda className="w-4 sm:w-5 h-4 sm:h-5" /> Nutrición y Suplementos
            </button>
          </div>

          <div className="min-h-[500px]">
            {activeTab === "ropa" && renderRopaSection()}
            {activeTab === "comestible" && renderComestiblesSection()}
          </div>
        </div>
      </div>

      {/* -------------------- MODALES -------------------- */}
      <ModalEntrada
        isOpen={modalComestiblesOpen && !productoEditar}
        onClose={() => setModalComestiblesOpen(false)}
        usuarioId={usuarioId}
        title={"Registrar Nuevo Producto Comestible"}
        tipo="comestible"
        onSuccess={(formData) => handleRegistrarProducto("comestible", formData)}
      />
      <ModalEntrada
        isOpen={modalRopaOpen && !productoEditar}
        onClose={() => setModalRopaOpen(false)}
        usuarioId={usuarioId}
        title={"Registrar Nueva Prenda"}
        tipo="ropa"
        onSuccess={(formData) => handleRegistrarProducto("ropa", formData)}
      />

      <ModalExistenteProducto
        isOpen={modalExistenteRopaOpen}
        onClose={() => setModalExistenteRopaOpen(false)}
        tipo="ropa"
        onSelect={(producto) => {
          setProductoEditar(producto);
          setTipoEdicion("ropa");
          setModalExistenteRopaOpen(false);
        }}
      />

      <ModalExistenteProducto
        isOpen={modalExistenteComestibleOpen}
        onClose={() => setModalExistenteComestibleOpen(false)}
        tipo="comestible"
        onSelect={(producto) => {
          setProductoEditar(producto);
          setTipoEdicion("comestible");
          setModalExistenteComestibleOpen(false);
        }}
      />

      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="¿Cerrar sesión?"
      >
        <p className="text-gray-700 text-center mb-6">¿Estás seguro que deseas salir?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setLogoutModalOpen(false)}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = "/login";
            }}
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </Modal>

      {imagenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-70">
          <div className="relative w-full max-w-xl p-8 bg-white border border-gray-200 rounded-xl shadow-3xl">
            <button
              onClick={() => setImagenModalOpen(false)}
              className="absolute p-2 text-xl font-light text-gray-500 transition-colors rounded-full top-4 right-4 hover:text-blue-700 hover:bg-gray-100"
            >
              ×
            </button>
            <h2 className="pb-3 mb-6 text-xl font-semibold tracking-wide text-center text-gray-800 border-b">
              <Eye className="inline w-5 h-5 mr-2 text-blue-700" /> Vista Previa del Activo
            </h2>
            <div className="p-2 border rounded-lg border-blue-700/50 bg-gray-50">
              <img
                src={imagenSeleccionada}
                alt="Imagen del producto"
                className="object-contain w-full h-auto rounded-md shadow-xl max-h-96"
              />
            </div>
          </div>
        </div>
      )}

      {productoEditar && (
        <ActualizarProducto
          producto={productoEditar}
          tipo={tipoEdicion}
          onClose={() => {
            setProductoEditar(null);
            setTipoEdicion(null);
          }}
          onActualizar={handleActualizarProducto}
        />
      )}

      <ModalMensaje
        isOpen={mensaje.open}
        tipo={mensaje.tipo}
        mensaje={mensaje.texto}
        onClose={() => setMensaje({ ...mensaje, open: false })}
      />

      {/* 🔹 Modal para registrar entrada de ropa existente */}
      <ModalExistenteProducto
        isOpen={modalExistenteRopaOpen}
        onClose={() => setModalExistenteRopaOpen(false)}
        tipo="ropa"
        title="Registrar Entrada de Ropa Existente"
        onSuccess={async () => {
          await fetchDatos();
          mostrarMensaje("exito", "Entrada de prenda registrada correctamente.");
        }}
      />

      {/* 🔹 Modal para registrar entrada de comestible existente */}
      <ModalExistenteProducto
        isOpen={modalExistenteComestibleOpen}
        onClose={() => setModalExistenteComestibleOpen(false)}
        tipo="comestible"
        title="Registrar Entrada de Comestible Existente"
        onSuccess={async () => {
          await fetchDatos();
          mostrarMensaje("exito", "Entrada de comestible registrada correctamente.");
        }}
      />
    </div>
  );
}
