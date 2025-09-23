import Sidebar from "../components/Sidebar";

export default function Reportes() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onLogout={() => console.log("Cerrar sesión")} />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Gestión de reportes</h1>
        {/* Aquí puedes renderizar tu lista de inventario */}
        <p>Contenido de gestión de inventario...</p>
      </div>
    </div>
  );
}