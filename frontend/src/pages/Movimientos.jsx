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

// API URL
const API_URL = "http://localhost:5000";

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
      const [ropa, comestibles] = await Promise.all([
        obtenerMovimientosRopa(anio, mes),
        obtenerMovimientosComestibles(anio, mes)
      ]);

      setMovRopa(ropa || []);
      setMovComestibles(comestibles || []);
    } catch (err) {
      console.error("Error al obtener movimientos:", err);
      setMovRopa([]);
      setMovComestibles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovimientos();
  }, [fetchMovimientos]);

  const handleMonthYearSelect = useCallback((anio, mes) => {
    fetchMovimientos(anio, mes);
  }, [fetchMovimientos]);

  // 📌 NUEVAS CLASES RESPONSIVE (sin alterar diseño original)
  const mainContainerClass = "bg-gray-100 min-h-screen";
  const contentAreaClass = "p-4 md:ml-64 md:p-10";
  const cardContainerClass =
    "bg-white p-4 md:p-8 rounded-2xl shadow-2xl space-y-8 border border-gray-100";
  const subTitleClass =
    "flex items-center gap-2 text-2xl font-extrabold text-red-800 pt-6 mt-6 border-t border-gray-100";

  const loadingClass =
    "flex flex-col items-center justify-center h-64 text-xl font-semibold text-red-700 bg-red-50 rounded-xl shadow-inner border border-red-200/50 p-6";

  const noDataClass =
    "py-6 px-4 md:py-8 md:px-6 text-center text-lg font-medium text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300";

  return (
    <div className={mainContainerClass}>
      <Sidebar onLogout={() => setLogoutModalOpen(true)} active={sidebarActive} />

      <div className={contentAreaClass}>
        <div className={cardContainerClass}>

          {/* HEADER PRINCIPAL */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-3 border-b border-red-700/50">

            {/* TÍTULO + SELECTOR */}
            <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
              <h1 className="flex items-center gap-3 text-3xl font-black tracking-tighter text-gray-900">
                <Zap size={30} className="text-red-700 fill-red-200/50" />
                HISTORIAL DE MOVIMIENTOS
              </h1>

              <MonthYearSelector onMonthYearSelect={handleMonthYearSelect} />
            </div>

            {/* BOTÓN DESCARGAR */}
            <Button
              onClick={() => generarPDFMovimientos(movRopa, movComestibles)}
              className="flex items-center gap-2 px-4 py-2 font-bold text-white transition-all duration-200 bg-red-700 shadow-md hover:bg-red-800 rounded-xl"
            >
              <FileDown size={18} />
              Descargar PDF
            </Button>
          </div>

          {/* LOADING */}
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
                  Aún no hay <strong>Movimientos de Ropa</strong> registrados.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <TablaMovimientos datos={movRopa} API_URL={API_URL} />
                </div>
              )}

              {/* SECCIÓN COMESTIBLES */}
              <h2 className={subTitleClass}>
                <Pizza size={24} className="text-red-600" />
                Comestibles
              </h2>

              {movComestibles.length === 0 ? (
                <div className={noDataClass}>
                  Aún no hay <strong>Movimientos de Comestibles</strong> registrados.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <TablaMovimientos datos={movComestibles} API_URL={API_URL} />
                </div>
              )}
            </>
          )}

          {/* MODAL CERRAR SESIÓN */}
          <Modal
            isOpen={logoutModalOpen}
            onClose={() => setLogoutModalOpen(false)}
            title="¿Cerrar sesión?"
          >
            <p className="mb-6 text-center text-gray-700">
              ¿Estás seguro que deseas salir?
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="px-5 py-2 text-gray-800 transition-all duration-200 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  sessionStorage.clear();
                  window.location.href = "/login";
                }}
                className="px-5 py-2 text-white transition-all duration-200 rounded-lg shadow-lg bg-rose-600 hover:bg-rose-500"
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
