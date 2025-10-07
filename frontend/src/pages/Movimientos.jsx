import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";
import TablaMovimientos from "../components/TablaMovimientos";
import { obtenerMovimientosRopa, obtenerMovimientosComestibles } from "../api/inventario";

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
        const ropa = await obtenerMovimientosRopa();
        const comestibles = await obtenerMovimientosComestibles();
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

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar onLogout={handleLogout} active={sidebarActive} />

      <div className="ml-72 p-8 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Gestión de Entradas y Salidas</h1>

        {loading ? (
          <p className="text-gray-600 animate-pulse">Cargando movimientos...</p>
        ) : (
          <>
            <h2 className="text-xl font-semibold mt-4">Ropa</h2>
            {movRopa.length === 0 ? (
              <p className="text-gray-500">No hay movimientos de ropa registrados.</p>
            ) : (
              <TablaMovimientos datos={movRopa} />
            )}

            <h2 className="text-xl font-semibold mt-8">Comestibles</h2>
            {movComestibles.length === 0 ? (
              <p className="text-gray-500">No hay movimientos de comestibles registrados.</p>
            ) : (
              <TablaMovimientos datos={movComestibles} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
