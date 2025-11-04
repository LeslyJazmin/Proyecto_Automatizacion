import { useState, useEffect, useCallback } from "react";
import { Package, Shirt, CupSoda, Eye, Search,ClipboardList } from "lucide-react"; 
import Sidebar from "../components/Sidebar";
import ModalEntrada from "../components/ModalNuevoProducto";
import TablaInventario from "../components/TablaInventario";
import ModalMensaje from "../components/ModalMensaje";
import Button from "../components/ui/Button";
import ActualizarProducto from "../components/ActualizarProducto";
import ModalConfirmacion from "../components/ModalConfirmacion";
import ModalExistenteProducto from "../components/ModalExistenteProducto";
import ModalSalidaProducto from "../components/ModalSalidaProducto";
import { generarPDFInventario } from "../utils/pdfGenerator";

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
  // ---------- ESTADOS ----------
  const [imagenModalOpen, setImagenModalOpen] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  const [modalComestiblesOpen, setModalComestiblesOpen] = useState(false);
  const [modalRopaOpen, setModalRopaOpen] = useState(false);

  const [modalExistenteRopaOpen, setModalExistenteRopaOpen] = useState(false);
  const [modalExistenteComestibleOpen, setModalExistenteComestibleOpen] = useState(false);

  const [modalSalidaRopaOpen, setModalSalidaRopaOpen] = useState(false);
  const [modalSalidaComestibleOpen, setModalSalidaComestibleOpen] = useState(false);

  const [confirmacionOpen, setConfirmacionOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [productoEditar, setProductoEditar] = useState(null);
  const [tipoEdicion, setTipoEdicion] = useState(null);

  const [ropa, setRopa] = useState([]);
  const [comestibles, setComestibles] = useState([]);

  const [activeTab, setActiveTab] = useState('ropa');
  const [loadingRopa, setLoadingRopa] = useState(true);
  const [loadingComestibles, setLoadingComestibles] = useState(true);

  const [mensaje, setMensaje] = useState({ open: false, tipo: "", texto: "" });

  const usuarioId = "ADM2235";
  const location = useLocation();
  const sidebarActive = location.pathname;

  // ---------- FUNCIONES ----------
  const mostrarMensaje = (tipo, texto) => setMensaje({ open: true, tipo, texto });

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
  }, []);

  useEffect(() => { fetchDatos(); }, [fetchDatos]);

  const handleBuscar = async (tipo, valor) => {
    if (valor.trim() === "") { fetchDatos(); return; }
    try {
      if (tipo === "ropa") { setLoadingRopa(true); setRopa(await buscarRopa(valor)); }
      else { setLoadingComestibles(true); setComestibles(await buscarComestibles(valor)); }
    } catch (err) { mostrarMensaje("error", "Error en la búsqueda."); }
    finally { setLoadingRopa(false); setLoadingComestibles(false); }
  };

  const handleRegistrarProducto = async (tipo, formData) => {
    try {
      const data = new FormData();
      for (const key in formData) data.append(key, formData[key]);
      if (tipo === "ropa") await registrarEntradaRopa(data);
      else await registrarEntradaComestible(data);

      if (tipo === "ropa") setModalRopaOpen(false);
      else setModalComestiblesOpen(false);

      await fetchDatos();
      mostrarMensaje("exito", " Producto registrado con éxito.");
    } catch (err) { mostrarMensaje("error", "❌ Error al registrar producto."); }
  };

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
      mostrarMensaje("exito", " Producto actualizado con éxito.");
      setProductoEditar(null);
      setTipoEdicion(null);
    } catch (err) { mostrarMensaje("error", "❌ Error al actualizar producto."); }
  };

  const handleEliminar = (id, tipo) => {
    setProductoAEliminar({ id, tipo });
    setConfirmacionOpen(true);
  };

  const confirmarEliminacion = async () => {
    if (!productoAEliminar) return;
    const { id, tipo } = productoAEliminar;
    setConfirmacionOpen(false);
    try {
      if (tipo === "ropa") await eliminarRopa(id);
      else await eliminarComestible(id);

      await fetchDatos();
      mostrarMensaje("exito", " Producto eliminado correctamente.");
    } catch (err) { mostrarMensaje("error", "❌ Error al eliminar producto."); }
    finally { setProductoAEliminar(null); }
  };

  const changeTab = (tab) => setActiveTab(tab);

  // ---------- RENDER DE SECCIONES ----------
  const renderRopaSection = () => (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center gap-4">
       <div className="flex gap-3 flex-wrap">
        {/* 🟩 Registrar nueva prenda */}
        <Button
          onClick={() => { setModalRopaOpen(true); setProductoEditar(null); }}
          className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-95"
        >
          <Package className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
          <span>Registrar entrada</span>
        </Button>

        {/* 🩶 Producto existente */}
        <Button
          onClick={() => setModalExistenteRopaOpen(true)}
          className="group flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-95"
        >
          <ClipboardList className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
          <span> Recargar Stock </span>
        </Button>

        {/* 🟥 Registrar salida */}
        <Button
          onClick={() => setModalSalidaRopaOpen(true)}
          className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-95"
        >
          <Shirt className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
          <span>Registrar Salida</span>
        </Button>
      </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar prenda por nombre o código..."
            className="w-96 border border-gray-300 rounded-lg pl-12 pr-5 py-3 text-base text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm placeholder-gray-500 font-light"
            onChange={(e) => handleBuscar("ropa", e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <TablaInventario
        datos={ropa}
        tipo="ropa"
        API_URL={API_URL}
        onVerImagen={(img) => { setImagenSeleccionada(img); setImagenModalOpen(true); }}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        loading={loadingRopa}
      />
    </div>
  );

  const renderComestiblesSection = () => (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center gap-4">
      <div className="flex gap-3 flex-wrap">
        {/* 🟩 Registrar nuevo comestible */}
        <Button
          onClick={() => { setModalComestiblesOpen(true); setProductoEditar(null); }}
          className="group flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-95"
        >
          <Package className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
          <span> Registrar entrada</span>
        </Button>

        {/* 🩶 Producto existente */}
        <Button
          onClick={() => setModalExistenteComestibleOpen(true)}
          className="group flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-95"
        >
          <ClipboardList className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
          <span> Recargar Stock </span>
        </Button>

        {/* 🟥 Registrar salida */}
        <Button
          onClick={() => setModalSalidaComestibleOpen(true)}
          className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-95"
        >
          <CupSoda className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
          <span>Registrar Salida</span>
        </Button>
      </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar producto comestibles por nombre o código..."
            className="w-96 border border-gray-300 rounded-lg pl-12 pr-5 py-3 text-base text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-sm placeholder-gray-500 font-light"
            onChange={(e) => handleBuscar("comestible", e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <TablaInventario
        datos={comestibles}
        tipo="comestible"
        API_URL={API_URL}
        onVerImagen={(img) => { setImagenSeleccionada(img); setImagenModalOpen(true); }}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        loading={loadingComestibles}
      />
    </div>
  );

  // ---------- RENDER PRINCIPAL ----------
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      <Sidebar active={sidebarActive} />

      <div className="ml-64 p-10">
        {/* ENCABEZADO */}
       <div className="mb-8 pb-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          {/* Título e ícono */}
          <div className="flex items-center gap-3">
            <Package size={36} className="text-blue-600" />
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                Inventario Central: Gestión de Activos Fitness
              </h1>
              <p className="mt-1 text-gray-500 text-base max-w-3xl font-light leading-snug">
                Plataforma profesional para la administración de Nutrición, Suplementos y Ropa Deportiva en tiempo real.
              </p>
            </div>
          </div>

          {/* Botón de descarga */}
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
            className="flex items-center gap-2 bg-gradient-to-r from-[#4b0000] to-black hover:from-[#5c0000] hover:to-[#1a1a1a] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.05] active:scale-95"
          >
            <Package className="w-5 h-5 text-white" />
            <span>Descargar Inventario en PDF</span>
          </Button>
        </div>
      </div>

        {/* TABS */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="flex border-b border-gray-200 bg-gray-50/50">
            <button
              onClick={() => changeTab('ropa')}
              className={`flex items-center gap-2 px-6 py-4 text-lg font-medium transition duration-200 ease-in-out 
                ${activeTab === 'ropa' 
                  ? 'text-blue-700 border-b-4 border-blue-600 bg-white/80' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-b-4 border-transparent'}`}
            >
              <Shirt className="w-5 h-5" /> Ropa Deportiva
            </button>

            <button
              onClick={() => changeTab('comestible')}
              className={`flex items-center gap-2 px-6 py-4 text-lg font-medium transition duration-200 ease-in-out 
                ${activeTab === 'comestible' 
                  ? 'text-yellow-700 border-b-4 border-yellow-600 bg-white/80' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-b-4 border-transparent'}`}
            >
              <CupSoda className="w-5 h-5" /> Nutrición y Suplementos
            </button>
          </div>

          <div className="min-h-[500px]">
            {activeTab === 'ropa' && renderRopaSection()}
            {activeTab === 'comestible' && renderComestiblesSection()}
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

      {imagenModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-3xl max-w-xl w-full relative border border-gray-200">
            <button
              onClick={() => setImagenModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-blue-700 text-xl font-light p-2 transition-colors rounded-full hover:bg-gray-100"
            >×</button>
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-800 border-b pb-3 tracking-wide">
              <Eye className="inline w-5 h-5 mr-2 text-blue-700" /> Vista Previa del Activo
            </h2>
            <div className="p-2 border border-blue-700/50 rounded-lg bg-gray-50">
              <img src={imagenSeleccionada} alt="Imagen del producto" className="w-full h-auto rounded-md shadow-xl object-contain max-h-96" />
            </div>
          </div>
        </div>
      )}

      {productoEditar && (
        <ActualizarProducto
          producto={productoEditar}
          tipo={tipoEdicion}
          onClose={() => { setProductoEditar(null); setTipoEdicion(null); }}
          onActualizar={handleActualizarProducto}
        />
      )}

      <ModalConfirmacion
        isOpen={confirmacionOpen}
        onClose={() => setConfirmacionOpen(false)}
        onConfirm={confirmarEliminacion}
      />

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
          await fetchDatos(); // 🔄 Actualiza tabla
          mostrarMensaje("exito", "Entrada de prenda registrada correctamente."); // ✅ Mensaje global
        }}
      />

      {/* 🔹 Modal para registrar entrada de comestible existente */}
      <ModalExistenteProducto
        isOpen={modalExistenteComestibleOpen}
        onClose={() => setModalExistenteComestibleOpen(false)}
        tipo="comestible"
        title="Registrar Entrada de Comestible Existente"
        onSuccess={async () => {
          await fetchDatos(); // 🔄 Actualiza tabla
          mostrarMensaje("exito", "Entrada de comestible registrada correctamente."); // ✅ Mensaje global
        }}
      />

      {/* 🔹 Modal para registrar salida de ropa */}
        <ModalSalidaProducto
          isOpen={modalSalidaRopaOpen}
          onClose={() => setModalSalidaRopaOpen(false)}
          tipo="ropa"
          onSuccess={async () => {
            await fetchDatos(); // 🔄 actualiza tabla
            mostrarMensaje("exito", "Salida de prenda registrada correctamente."); // ✅ mensaje global
          }}
        />

        {/* 🔹 Modal para registrar salida de comestible */}
        <ModalSalidaProducto
          isOpen={modalSalidaComestibleOpen}
          onClose={() => setModalSalidaComestibleOpen(false)}
          tipo="comestible"
          onSuccess={async () => {
            await fetchDatos();
            mostrarMensaje("exito", "Salida de comestible registrada correctamente.");
          }}
        />

    </div>
  );
}
