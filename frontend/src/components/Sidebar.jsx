import { Package, BarChart3, LogOut, Building2, Info } from "lucide-react";

export default function Sidebar({ onLogout }) {
  return (
    <div
      className="
        w-72 
        bg-gradient-to-b from-[#4a0e0e] via-[#2e0505] to-black
        bg-[length:200%_200%] animate-gradient
        shadow-[0_0_20px_#4a0e0e]
        flex flex-col
      "
    >
      {/* Encabezado */}
      <div className="p-6 border-b border-[#2e0505] text-center">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <Building2 className="text-[#a83232] w-8 h-8" />
          <h2 className="text-xl font-bold text-white drop-shadow-[0_0_5px_#4a0e0e]">
            Mi Empresa
          </h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Sistema de Gestión de Inventario
        </p>
        <img
          src="/images/GT2.png"
          alt="Logo"
          className="mx-auto w-70 h-48 object-contain drop-shadow-[0_0_10px_#4a0e0e]"
        />
      </div>

      {/* Botones */}
      <div className="flex-1 p-4 space-y-4">
        <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#4a0e0e]/40 transition">
          <Info className="text-[#a83232]" />
          <span className="font-medium text-white">Información de la Empresa</span>
        </button>
        <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#4a0e0e]/40 transition">
          <Package className="text-[#a83232]" />
          <span className="font-medium text-white">Registro e Inventario</span>
        </button>
        <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-[#4a0e0e]/40 transition">
          <BarChart3 className="text-[#a83232]" />
          <span className="font-medium text-white">Reportes</span>
        </button>
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-700/30 text-red-400 transition"
        >
          <LogOut />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
