import { Package, BarChart3, LogOut, Building2, Info } from "lucide-react";

export default function Sidebar({ onLogout }) {
  return (
<div className="w-72 bg-gradient-to-b from-black via-black to-orange-700 
                bg-[length:200%_200%] animate-gradient shadow-xl flex flex-col">


      <div className="p-6 border-b border-gray-200 text-center">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <Building2 className="text-orange-500 w-8 h-8" />
       <h2 className="text-xl font-bold text-white">Mi Empresa</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">Sistema de Gestión de Inventario</p>
        <img src="/images/GT.png" alt="Logo" className="mx-auto w-48 h-48 object-contain" />
      </div>
      <div className="flex-1 p-4 space-y-4">
        <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-orange-100 transition">
          <Info className="text-orange-500" />
          <span className="font-medium text-gray-700">Información de la Empresa</span>
        </button>
        <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-orange-100 transition">
          <Package className="text-orange-500" />
          <span className="font-medium text-gray-700">Registro e Inventario</span>
        </button>
        <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-orange-100 transition">
          <BarChart3 className="text-orange-500" />
          <span className="font-medium text-gray-700">Reportes</span>
        </button>
        <button onClick={onLogout} className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-100 text-red-600 transition">
          <LogOut />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
