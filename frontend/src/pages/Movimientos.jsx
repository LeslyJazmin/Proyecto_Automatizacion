import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";
import TablaMovimientos from "../components/TablaMovimientos";
import { obtenerMovimientosRopa, obtenerMovimientosComestibles } from "../api/inventario";
import { generarPDFMovimientos } from "../utils/pdfMovimientos";
import Button from "../components/ui/Button";
import { Loader2, Zap, Shirt, Pizza, FileDown } from "lucide-react"; // Iconos actualizados

export default function Movimientos() {
  const location = useLocation();
  const sidebarActive = location.pathname;

  const [movRopa, setMovRopa] = useState([]);
  const [movComestibles, setMovComestibles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovimientos() {
      try {
        setLoading(true);
        // Esperar ambas llamadas en paralelo
        const [ropa, comestibles] = await Promise.all([
          obtenerMovimientosRopa(),
          obtenerMovimientosComestibles()
        ]);
        
        setMovRopa(ropa);
        setMovComestibles(comestibles);
      } catch (err) {
        console.error("Error al obtener movimientos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovimientos();
  }, []);

  const handleLogout = () => console.log("Cerrar sesión");

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
      <Sidebar onLogout={handleLogout} active={sidebarActive} />

      <div className={contentAreaClass}>
        <div className={cardContainerClass}>
            
            {/* 🔥 TÍTULO PRINCIPAL + BOTÓN DESCARGAR */}
            <div className="flex items-center justify-between border-b border-red-700/50 pb-3">
              <h1 className="flex items-center gap-3 text-3xl font-black text-gray-900 tracking-tighter">
                <Zap size={30} className="text-red-700 fill-red-200/50" />
                HISTORIAL DE MOVIMIENTOS
              </h1>

              <Button
                onClick={() => generarPDFMovimientos(movRopa, movComestibles)}
                className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all duration-200"
              >
                <FileDown size={18} />
                Descargar PDF
              </Button>
            </div>


            {loading ? (
                <div className={loadingClass}>
                    <Loader2 size={32} className="animate-spin mb-4" />
                    <p>Cargando el historial de transacciones, por favor espera...</p>
                </div>
            ) : (
                <>
                    {/* SECCIÓN ROPA */}
                    <h2 className={subTitleClass}>
                        <Shirt size={24} className="text-red-600"/>
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
                        <Pizza size={24} className="text-red-600"/>
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
        </div>
      </div>
    </div>
  );
}