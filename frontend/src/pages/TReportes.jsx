"use client";

import Sidebar from "../components/SidebarTrabajador";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChartStockRopa, ChartStockComestibles } from "../components/ChartBarInventario";
import { obtenerRopa, obtenerComestibles } from "../api/inventario";
import Modal from "../components/ui/Modal";

export default function Reportes() {
  const location = useLocation();
  const sidebarActive = location.pathname;

  const [stockBajo, setStockBajo] = useState([]);
  const [porVencer, setPorVencer] = useState([]);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    const cargarAlertas = async () => {
      try {
        const ropa = await obtenerRopa();
        const comestibles = await obtenerComestibles();

        // 🔴 STOCK BAJO
        const ropaBaja = ropa.filter((p) => (p.stock_actual ?? 0) <= 10);
        const comestiblesBajos = comestibles.filter((p) => (p.stock_actual ?? 0) <= 30);

        const listadoStockBajo = [
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

        setStockBajo(listadoStockBajo);

        // ⚠ PRÓXIMOS A VENCER
        const hoy = new Date();
        const diasAlerta = 7; // productos que vencen en 7 días
        const comestiblesPorVencer = comestibles.filter((p) => {
          if (!p.fecha_vencimiento) return false;
          const fechaVenc = new Date(p.fecha_vencimiento);
          const diffDias = Math.ceil((fechaVenc - hoy) / (1000 * 60 * 60 * 24));
          return diffDias <= diasAlerta && diffDias >= 0;
        });

        const listadoPorVencer = comestiblesPorVencer.map((p) => ({
          tipo: "Comestible",
          nombre: p.nombre,
          stock: p.stock_actual ?? 0,
          fecha_vencimiento: p.fecha_vencimiento,
        }));

        setPorVencer(listadoPorVencer);
      } catch (error) {
        console.error("Error obteniendo alertas:", error);
      }
    };

    cargarAlertas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onLogout={() => setLogoutModalOpen(true)} active={sidebarActive} />

      <div className="p-8 ml-72">
        {/* TÍTULO GENERAL DEL PANEL */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1 text-left">📊 Análisis del Inventario</h1>
          <p className="text-gray-500 text-sm text-left">
            Visualiza el estado actual de tus productos, identifica stock bajo y toma decisiones a tiempo.
          </p>
        </div>

        {/* ALERTA STOCK BAJO */}
        {stockBajo.length > 0 && (
          <div className="p-4 mb-6 bg-red-100 border-l-4 border-red-600 rounded-lg shadow">
            <h2 className="font-bold text-red-700 text-lg">⚠ Productos con Stock Bajo</h2>
            <ul className="text-red-700 text-sm ml-4 list-disc">
              {stockBajo.map((p, i) => (
                <li key={i}>
                  <strong>{p.tipo}:</strong> {p.nombre} — Stock: <b>{p.stock}</b>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ALERTA PRÓXIMOS A VENCER */}
        {porVencer.length > 0 && (
          <div className="p-4 mb-6 bg-yellow-100 border-l-4 border-yellow-600 rounded-lg shadow">
            <h2 className="font-bold text-yellow-700 text-lg">⚠ Productos Próximos a Vencer</h2>
            <ul className="text-yellow-700 text-sm ml-4 list-disc">
              {porVencer.map((p, i) => {
                const fechaFormateada = new Date(p.fecha_vencimiento).toLocaleDateString("es-PE");
                return (
                  <li key={i}>
                    <strong>{p.tipo}:</strong> {p.nombre} — Fecha de Vencimiento: <b>{fechaFormateada}</b>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* GRÁFICOS */}
        <div className="flex flex-col gap-6 mb-8 md:flex-row">
          <ChartStockRopa />
          <ChartStockComestibles />
        </div>

        {/* MODAL CERRAR SESIÓN */}
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
  );
}
