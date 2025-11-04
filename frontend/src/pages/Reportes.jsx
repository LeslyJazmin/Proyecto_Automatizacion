import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";
import { ChartStockRopa, ChartStockComestibles } from "../components/ChartBarInventario";
import { ChartMovimientos } from "../components/ChartMovimientos"; // Uso correcto

export default function Reportes() {
  const location = useLocation();
  const handleLogout = () => console.log("Cerrar sesión");
  const sidebarActive = location.pathname;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar onLogout={handleLogout} active={sidebarActive} />

      <div className="ml-72 p-8">
        {/* Título y descripción general */}
        <h1 className="text-2xl font-bold mb-2">Gestión de reportes</h1>
        <p className="text-gray-600 mb-6">
          Visualiza el stock actual de tus productos de ropa y comestibles. 
          Los gráficos muestran la cantidad disponible de cada producto para ayudarte 
          a tomar decisiones de inventario y planificación.
        </p>
        
        {/* Gráficos de stock */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <ChartStockRopa />
          <ChartStockComestibles />
        </div>

        {/* Nueva sección: movimientos */}
        <h2 className="text-xl font-bold mb-2">Movimientos recientes</h2>
        <p className="text-gray-600 mb-6">
          Muestra las entradas y salidas recientes de productos para monitorear la actividad del inventario.
        </p>

        {/* Gráficos de movimientos */}
        <div className="flex flex-col md:flex-row gap-6">
          <ChartMovimientos tipo="ropa" />
          <ChartMovimientos tipo="comestibles" />
        </div>
      </div>
    </div>
  );
}
