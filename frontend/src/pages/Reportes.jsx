import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom"; // Importamos useLocation

export default function Reportes() {
  const location = useLocation(); // Obtenemos la ubicación actual
  
  const handleLogout = () => console.log("Cerrar sesión");

  // Determinamos qué botón debe estar activo en el Sidebar
  const sidebarActive = location.pathname;

  return (
    // Se elimina la clase 'flex' del contenedor principal
    <div className="bg-gray-100 min-h-screen">
      {/* El Sidebar es fijo y no necesita un contenedor flex */}
      <Sidebar onLogout={handleLogout} active={sidebarActive} />

      {/* Contenido principal, que usa un margen para no superponerse */}
      {/* La clase ml-72 es crucial para mover el contenido a la derecha */}
      <div className="ml-72 p-8">
        <h1 className="text-2xl font-bold mb-6">Gestión de reportes</h1>
        {/* Aquí puedes renderizar tu lista de inventario */}
        <p>Contenido de gestión de inventario...</p>
      </div>
    </div>
  );
}