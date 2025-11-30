import { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import MonthYearSelector from "../components/MonthYearSelector";
import { useLocation } from "react-router-dom";
import TablaMovimientos from "../components/TablaMovimientos";
import { obtenerMovimientosRopa, obtenerMovimientosComestibles } from "../api/inventario";
import { generarPDFMovimientos } from "../utils/pdfMovimientos";
import Button from "../components/ui/Button";
import { Loader2, Zap, Shirt, Pizza, FileDown } from "lucide-react";
import Modal from "../components/ui/Modal";

export default function Movimientos() {
  const location = useLocation();
  const sidebarActive = location.pathname;

  const [movRopa, setMovRopa] = useState([]);
  const [movComestibles, setMovComestibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const fetchMovimientos = useCallback(async (anio = null, mes = null) => {
    try {
      setLoading(true);
      // Fetch movements with optional year/month filters
      const [ropa, comestibles] = await Promise.all([
        obtenerMovimientosRopa(anio, mes),
        obtenerMovimientosComestibles(anio, mes)
      ]);

      setMovRopa(ropa || []);
      setMovComestibles(comestibles || []);
    } catch (err) {
      console.error("Error al obtener movimientos:", err);
      // En caso de error, establecer arrays vacíos para mostrar el mensaje correspondiente
      setMovRopa([]);
      setMovComestibles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all movements initially
  useEffect(() => {
    fetchMovimientos();
  }, [fetchMovimientos]);

  const handleMonthYearSelect = useCallback((anio, mes) => {
    // When month/year is selected, fetch movements for that period
    fetchMovimientos(anio, mes);
  }, [fetchMovimientos]);

  // --- Estilos de Layout y Contenido Mejorados ---

  // Contenedor principal con fondo suave
  const mainContainerClass = "bg-gray-100 min-h-screen";
  // Área de contenido principal: Limpio y con margen adecuado
  const contentAreaClass = "ml-64 p-10";

  // Tarjeta contenedora para el contenido: Fondo blanco, redondeado y flotante
  const cardContainerClass = "bg-white p-8 rounded-2xl shadow-2xl space-y-8 border border-gray-100";

  // Subtítulos para cada sección (con color rojo y borde sutil)
  const subTitleClass = "flex items-center gap-2 text-2xl font-extrabold text-red-800 pt-6 mt-6 border-t border-gray-100";

  // Estilo para el estado de carga
  const loadingClass = "flex flex-col items-center justify-center h-64 text-xl font-semibold text-red-700 bg-red-50 rounded-xl shadow-inner border border-red-200/50 p-6";

  // Estilo para el estado de "No hay movimientos"
  const noDataClass = "py-8 px-6 text-center text-lg font-medium text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300";
  // ---------------------------------------------

  return (
    <div className={mainContainerClass}>
    {/* Sidebar */}
     <Sidebar onLogout={() => setLogoutModalOpen(true)} active={sidebarActive} />

      <div className={contentAreaClass}>
        <div className={cardContainerClass}>

          {/* 🔥 TÍTULO PRINCIPAL + BOTÓN DESCARGAR */}
          <div className="flex items-center justify-between pb-3 border-b border-red-700/50">
            <div className="flex items-center gap-4">
              <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter text-gray-900">
                <Zap size={30} className="text-red-700 fill-red-200/50" />
                HISTORIAL DE MOVIMIENTOS
              </h1>
              <MonthYearSelector onMonthYearSelect={handleMonthYearSelect} />
            </div>

            <Button
              onClick={() => generarPDFMovimientos(movRopa, movComestibles)}
              className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-all duration-200 bg-red-700 shadow-md hover:bg-red-800 rounded-xl"
            >
              <FileDown size={18} />
              Descargar PDF
            </Button>
          </div>

          {loading ? (
            <div className={loadingClass}>
              <Loader2 size={32} className="mb-4 animate-spin" />
              <p>Cargando el historial de transacciones, por favor espera...</p>
            </div>
          ) : (
            <>
              {/* SECCIÓN ROPA */}
              <h2 className={subTitleClass}>
                <Shirt size={24} className="text-red-600" />
                Ropa
              </h2>
              {movRopa.length === 0 ? (
                <div className={noDataClass}>
                  Aún no hay **Movimientos de Ropa** registrados.
                </div>
              ) : (
                <TablaMovimientos datos={movRopa} />
              )}

              {/* SECCIÓN COMESTIBLES */}
              <h2 className={subTitleClass}>
                <Pizza size={24} className="text-red-600" />
                Comestibles
              </h2>
              {movComestibles.length === 0 ? (
                <div className={noDataClass}>
                  Aún no hay **Movimientos de Comestibles** registrados.
                </div>
              ) : (
                <TablaMovimientos datos={movComestibles} />
              )}
            </>
          )}
          <Modal
            isOpen={logoutModalOpen}
            onClose={() => setLogoutModalOpen(false)}
            title="¿Cerrar sesión?"
          >
            <p className="text-gray-700 text-center mb-6">
              ¿Estás seguro que deseas salir?
            </p>
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
        </div>
      </div>
    </div>
  );
}