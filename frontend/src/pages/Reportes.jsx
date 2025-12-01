import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";
import { ChartStockRopa, ChartStockComestibles } from "../components/ChartBarInventario";
import { ChartMovimientos } from "../components/ChartMovimientos"; // Uso correcto

export default function Reportes() {
  const location = useLocation();
  const handleLogout = () => console.log("Cerrar sesión");
  const sidebarActive = location.pathname;

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} active={sidebarActive} />

      <div className="p-8 ml-72">
        {/* Título y descripción general */}
        <h1 className="mb-2 text-2xl font-bold">Gestión de reportes</h1>
        <p className="mb-6 text-gray-600">
          Visualiza el stock actual de tus productos de ropa y comestibles. 
          Los gráficos muestran la cantidad disponible de cada producto para ayudarte 
          a tomar decisiones de inventario y planificación.
        </p>
        
        {/* Gráficos de stock */}
        <div className="flex flex-col gap-6 mb-8 md:flex-row">
          <ChartStockRopa />
          <ChartStockComestibles />
        </div>

        {/* Nueva sección: movimientos */}
        <h2 className="mb-2 text-xl font-bold">Movimientos recientes</h2>
        <p className="mb-6 text-gray-600">
          Muestra las entradas y salidas recientes de productos para monitorear la actividad del inventario.
        </p>

        {/* Gráficos de movimientos */}
        <div className="flex flex-col gap-6 md:flex-row">
          <ChartMovimientos tipo="ropa" />
          <ChartMovimientos tipo="comestibles" />
        </div>
      </div>
    </div>
  );
}
