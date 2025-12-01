import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChartStockRopa, ChartStockComestibles } from "../components/ChartBarInventario";
import ChartMovimientos from "../components/ChartMovimientos"; // ✅ import default

// ❗ Importamos tus APIs existentes
import { obtenerRopa, obtenerComestibles } from "../api/inventario";

export default function Reportes() {
  const location = useLocation();
  const handleLogout = () => console.log("Cerrar sesión");
  const sidebarActive = location.pathname;

  // Estados para alertas
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const cargarStockBajo = async () => {
      try {
        const ropa = await obtenerRopa();
        const comestibles = await obtenerComestibles();

        // 🔥 FILTROS IGUALES A LOS GRÁFICOS
        const ropaBaja = ropa.filter((p) => (p.stock_actual ?? 0) <= 10);
        const comestiblesBajos = comestibles.filter((p) => (p.stock_actual ?? 0) <= 30);

        // Formato de alertas
        const listado = [
          ...ropaBaja.map((p) => ({
            tipo: "Ropa",
            nombre: p.nombre,
            stock: p.stock_actual ?? 0,
          })),
          ...comestiblesBajos.map((p) => ({
            tipo: "Comestible",
            nombre: p.nombre,
            stock: p.stock_actual ?? 0,
          })),
        ];

        setAlertas(listado);
      } catch (error) {
        console.error("Error obteniendo stock bajo:", error);
      }
    };

    cargarStockBajo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} active={sidebarActive} />

      <div className="p-8 ml-72">
        {/* 🔔 ALERTA SUPERIOR — STOCK BAJO */}
        {alertas.length > 0 && (
          <div className="p-4 mb-6 bg-red-100 border-l-4 border-red-600 rounded-lg shadow">
            <h2 className="font-bold text-red-700 text-lg">⚠ Productos con Stock Bajo</h2>
            <p className="text-red-700 text-sm mb-2">
              Estos productos requieren reposición inmediata:
            </p>

            <ul className="text-red-700 text-sm ml-4 list-disc">
              {alertas.map((p, index) => (
                <li key={index}>
                  <strong>{p.tipo}:</strong> {p.nombre} — Stock:{" "}
                  <b>{p.stock}</b>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ENCABEZADO */}
        <h1 className="mb-2 text-2xl font-bold">📊 Análisis del Inventario</h1>
        <p className="mb-6 text-gray-600">
          Panel estadístico para visualizar el estado actual del inventario.
        </p>

        {/* STOCK */}
        <h2 className="mb-2 text-xl font-bold">📦 Análisis del Stock Actual</h2>
        <p className="mb-6 text-gray-600">
          Gráficos comparativos entre ropa y comestibles.
        </p>

        <div className="flex flex-col gap-6 mb-8 md:flex-row">
          <ChartStockRopa />
          <ChartStockComestibles />
        </div>

        {/* MOVIMIENTOS */}
        <h2 className="mb-2 text-xl font-bold">📈 Análisis de Movimientos</h2>
        <p className="mb-6 text-gray-600">
          Entradas y salidas recientes del inventario.
        </p>

        <div className="flex flex-col w-full gap-6">
          <div className="w-full">
            <ChartMovimientos tipo="ropa" />
          </div>
          <div className="w-full">
            <ChartMovimientos tipo="comestibles" />
          </div>
        </div>
      </div>
    </div>
  );
}
