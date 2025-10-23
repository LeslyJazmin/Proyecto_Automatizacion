/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
// Se eliminaron TrendingUp y TrendingDown de la importación para solucionar el warning
import { Package, Shirt, CupSoda, ClipboardPlus, Eye, Search } from "lucide-react"; 
import Sidebar from "../components/Sidebar";
// eslint-disable-next-line
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
  // ---------- ESTADOS Y LÓGICA (Funcionalmente sin cambios) ----------
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

  // Usamos una sola variable para el tab activo (ropa o comestible)
  const [activeTab, setActiveTab] = useState('ropa');

  const [loadingRopa, setLoadingRopa] = useState(true);
  const [loadingComestibles, setLoadingComestibles] = useState(true);

  const [mensaje, setMensaje] = useState({ open: false, tipo: "", texto: "" });

  const usuarioId = "ADM2235";
  const location = useLocation();
  const sidebarActive = location.pathname;

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ open: true, tipo, texto });
  };

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

  useEffect(() => {
    fetchDatos();
  }, [fetchDatos]);

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

  // eslint-disable-next-line
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
      mostrarMensaje("exito", "🗑️ Producto eliminado correctamente.");
    } catch (err) {
      mostrarMensaje("error", "❌ Error al eliminar producto.");
    } finally {
      setProductoAEliminar(null);
    }
  };
  
  // Función para cambiar la pestaña activa
  const changeTab = (tab) => {
      setActiveTab(tab);
  };

  // Renderizado de la sección Ropa
  const renderRopaSection = () => (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
          {/* Botón de Acción con Azul Corporativo */}
          <Button
              onClick={() => { setModalRopaOpen(true); setProductoEditar(null); }}
              className="flex items-center gap-2 bg-blue-700 text-white font-medium px-7 py-3 rounded-lg shadow-md hover:bg-blue-800 transition transform duration-200"
          >
              <ClipboardPlus className="w-5 h-5" />
              Registrar Nueva Prenda
          </Button>

          <div className="relative">
              <input
                  type="text"
                  placeholder="Buscar prenda por nombre, talla o código..."
                  className="w-96 border border-gray-300 rounded-lg pl-12 pr-5 py-3 text-base text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm placeholder-gray-500 font-light"
                  onChange={(e) => handleBuscar("ropa", e.target.value)}
              />
              {/* Icono de búsqueda */}
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
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
    </div>
  );

  // Renderizado de la sección Comestibles
  const renderComestiblesSection = () => (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
          {/* Botón de Acción con Verde Esmeralda (Éxito/Salud) */}
          <Button
              onClick={() => { setModalComestiblesOpen(true); setProductoEditar(null); }}
              className="flex items-center gap-2 bg-emerald-700 text-white font-medium px-7 py-3 rounded-lg shadow-md hover:bg-emerald-800 transition transform duration-200"
          >
              <ClipboardPlus className="w-5 h-5" />
              Registrar Nuevo Comestible
          </Button>

          <div className="relative">
              <input
                  type="text"
                  placeholder="Buscar suplemento, snack o bebida por nombre..."
                  className="w-96 border border-gray-300 rounded-lg pl-12 pr-5 py-3 text-base text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-sm placeholder-gray-500 font-light"
                  onChange={(e) => handleBuscar("comestible", e.target.value)}
              />
              {/* Icono de búsqueda */}
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
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
    </div>
  );

  // ---------- RENDER PRINCIPAL (Profesional/Enterprise) ----------
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen font-sans">
      <Sidebar active={sidebarActive} />

      <div className="ml-64 p-10">
        {/* ENCABEZADO PRINCIPAL (Limpio y Corporativo) */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {/* Ícono principal: color Azul Corporativo */}
            <Package size={36} className="text-blue-600" /> 
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900"> 
              Inventario Central: Gestión de Activos Fitness
            </h1>
          </div>
          <p className="mt-2 text-gray-500 text-base max-w-4xl font-light leading-snug">
            Plataforma profesional para la administración de Nutrición, Suplementos y Ropa Deportiva en tiempo real.
          </p>
        </div>
        
        {/* CONTENEDOR PRINCIPAL CON PESTAÑAS (TABS) */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* TAB BAR (Barra de Pestañas) */}
          <div className="flex border-b border-gray-200 bg-gray-50/50">
            {/* Pestaña de Ropa (Acento Azul) */}
            <button
              onClick={() => changeTab('ropa')}
              className={`flex items-center gap-2 px-6 py-4 text-lg font-medium transition duration-200 ease-in-out 
                ${activeTab === 'ropa' 
                  ? 'text-blue-700 border-b-4 border-blue-600 bg-white/80' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-b-4 border-transparent'
                }`}
            >
              <Shirt className="w-5 h-5" />
              Ropa Deportiva
            </button>

            {/* Pestaña de Comestibles (Acento Verde Esmeralda) */}
            <button
              onClick={() => changeTab('comestible')}
              className={`flex items-center gap-2 px-6 py-4 text-lg font-medium transition duration-200 ease-in-out 
                ${activeTab === 'comestible' 
                  ? 'text-emerald-700 border-b-4 border-emerald-600 bg-white/80' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border-b-4 border-transparent'
                }`}
            >
              <CupSoda className="w-5 h-5" />
              Nutrición y Suplementos
            </button>
          </div>

          {/* CONTENIDO DE LAS PESTAÑAS */}
          <div className="min-h-[500px]">
            {activeTab === 'ropa' && renderRopaSection()}
            {activeTab === 'comestible' && renderComestiblesSection()}
          </div>
        </div>

      </div>
      
      {/* -------------------- MODALES (Acento Azul Corporativo) -------------------- */}

      {/* MODAL ENTRADA */}
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

      {/* MODAL VISTA DE IMAGEN */}
      {imagenModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-3xl max-w-xl w-full relative border border-gray-200">
            <button
              onClick={() => setImagenModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-blue-700 text-xl font-light p-2 transition-colors rounded-full hover:bg-gray-100"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-800 border-b pb-3 tracking-wide">
              <Eye className="inline w-5 h-5 mr-2 text-blue-700" /> Vista Previa del Activo
            </h2>
            <div className="p-2 border border-blue-700/50 rounded-lg bg-gray-50">
                <img
                    src={imagenSeleccionada}
                    alt="Imagen del producto"
                    className="w-full h-auto rounded-md shadow-xl object-contain max-h-96"
                />
            </div>
          </div>
        </div>
      )}

      {/* MODAL ACTUALIZAR PRODUCTO */}
      {productoEditar && (
        <ActualizarProducto
          producto={productoEditar}
          tipo={tipoEdicion}
          onClose={() => { setProductoEditar(null); setTipoEdicion(null); }}
          onActualizar={handleActualizarProducto}
        />
      )}

      {/* MODAL CONFIRMACIÓN ELIMINAR */}
      <ModalConfirmacion
        isOpen={confirmacionOpen}
        onClose={() => setConfirmacionOpen(false)}
        onConfirm={confirmarEliminacion}
      />

      {/* MODAL MENSAJE */}
      <ModalMensaje
        isOpen={mensaje.open}
        tipo={mensaje.tipo}
        mensaje={mensaje.texto}
        onClose={() => setMensaje({ ...mensaje, open: false })}
      />
    </div>
  );
}