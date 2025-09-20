import { useEffect, useState } from "react";
import { getInfoEmpresa } from "../api/empresa";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  PencilLine,
  Trash2,
} from "lucide-react";

export default function InfoEmpresa() {
  const [empresa, setEmpresa] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getInfoEmpresa();
        setEmpresa(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();
  }, []);

  function handleEdit(field) {
    console.log(`✏️ Editar ${field}`);
  }

  function handleDelete(field) {
    setFieldToDelete(field);
    setShowConfirm(true);
  }

  function confirmDelete() {
    console.log(`🗑 Eliminando ${fieldToDelete}`);
    setShowConfirm(false);
    setFieldToDelete(null);
  }

  if (error)
    return (
      <div className="text-red-600 bg-red-100 p-2 rounded-lg border border-red-300 text-sm">
        ⚠ {error}
      </div>
    );

  if (!empresa)
    return <div className="text-gray-500 text-sm">Cargando información...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#5A1A1A] via-[#7B2323] to-[#3B0F0F] text-white shadow-xl rounded-2xl p-6 mb-4 border border-[#9E2B2B]">
      <div className="flex items-center space-x-3 mb-4 justify-center">
        <h2 className="text-2xl font-bold">{empresa.nombre}</h2>
      </div>

      {/* LISTA EN UNA SOLA COLUMNA */}
      <div className="flex flex-col gap-3">
        {/* RUC */}
        <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">RUC:</span>
            <span className="text-gray-200 text-sm">{empresa.ruc}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleEdit("ruc")}
              className="p-1.5 bg-yellow-500 hover:bg-yellow-600 rounded-full transform transition-transform duration-200 hover:scale-110"
              title="Editar"
            >
              <PencilLine className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              onClick={() => handleDelete("ruc")}
              className="p-1.5 bg-red-600 hover:bg-red-700 rounded-full transform transition-transform duration-200 hover:scale-110"
              title="Eliminar"
            >
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Dirección */}
        <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#F5B7B1]" />
            <span className="text-gray-200 text-sm">{empresa.direccion}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleEdit("direccion")}
              className="p-1.5 bg-yellow-500 hover:bg-yellow-600 rounded-full transform transition-transform duration-200 hover:scale-110"
            >
              <PencilLine className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              onClick={() => handleDelete("direccion")}
              className="p-1.5 bg-red-600 hover:bg-red-700 rounded-full transform transition-transform duration-200 hover:scale-110"
            >
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Teléfono */}
        <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-[#F5B7B1]" />
            <span className="text-gray-200 text-sm">{empresa.telefono}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleEdit("telefono")}
              className="p-1.5 bg-yellow-500 hover:bg-yellow-600 rounded-full transform transition-transform duration-200 hover:scale-110"
            >
              <PencilLine className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              onClick={() => handleDelete("telefono")}
              className="p-1.5 bg-red-600 hover:bg-red-700 rounded-full transform transition-transform duration-200 hover:scale-110"
            >
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Email */}
        <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-[#F5B7B1]" />
            <span className="text-gray-200 text-sm">{empresa.email}</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handleEdit("email")}
              className="p-1.5 bg-yellow-500 hover:bg-yellow-600 rounded-full transform transition-transform duration-200 hover:scale-110"
            >
              <PencilLine className="w-3.5 h-3.5 text-white" />
            </button>
            <button
              onClick={() => handleDelete("email")}
              className="p-1.5 bg-red-600 hover:bg-red-700 rounded-full transform transition-transform duration-200 hover:scale-110"
            >
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Fecha creación */}
        <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-lg">
          <Calendar className="w-4 h-4 text-[#F5B7B1]" />
          <span className="text-gray-300 text-xs">
            Creado el: {new Date(empresa.fecha_creacion).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Modal confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-5 shadow-xl w-72 text-center">
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              ¿Eliminar {fieldToDelete}?
            </h3>
            <p className="text-gray-600 text-sm mb-5">
              Esta acción eliminará el valor de este campo.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 bg-gray-300 hover:bg-gray-400 rounded-lg text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
