import { useEffect, useState } from "react";
import { getInfoEmpresa, updateInfoEmpresa } from "../api/empresa";
import { Building2, Hash, MapPin, Phone, Mail, PencilLine, CheckCircle, Loader2 } from "lucide-react";
import Modal from "./ui/Modal"; // ✅ Importamos el modal centralizado

export default function InfoEmpresa() {
  const [empresa, setEmpresa] = useState(null);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState("");
  const [newValue, setNewValue] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [charLimit, setCharLimit] = useState(100);
  const [saving, setSaving] = useState(false);

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
    setFieldToEdit(field);
    setNewValue(empresa[field]);
    const limits = { direccion: 30, telefono: 9, email: 30 };
    setCharLimit(limits[field] || 100);
    setModalOpen(true);
  }

  async function handleSave() {
    try {
      setSaving(true);
      const updated = await updateInfoEmpresa({
        ...empresa,
        [fieldToEdit]: newValue,
      });

      setEmpresa(updated);
      setModalOpen(false);
      setFieldToEdit("");
      setNewValue("");
      setSuccessMessage("Información actualizada correctamente");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert("Error al actualizar: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (error)
    return (
      <div className="text-red-600 bg-red-100 p-2 rounded-lg border border-red-300 text-sm">
        ⚠ {error}
      </div>
    );

  if (!empresa) return <div className="text-gray-500 text-sm">Cargando información...</div>;

  return (
    <div className="relative max-w-4xl mx-auto bg-gradient-to-r from-[#4a0e0e] via-[#2e0505] to-black text-white shadow-lg rounded-2xl p-6 mb-4 border border-[#e60000]">
      
      {/* Toast */}
      {successMessage && (
        <div className="absolute top-4 right-4 bg-[#e60000]/95 border border-[#b30000] text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-white" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <InfoRow icon={<Building2 className="w-4 h-4 text-[#e60000]" />} label="Nombre" value={empresa.nombre} />
        <InfoRow icon={<Hash className="w-4 h-4 text-[#e60000]" />} label="RUC" value={empresa.ruc} />
        <InfoRow icon={<MapPin className="w-4 h-4 text-[#e60000]" />} label="Dirección" value={empresa.direccion} onEdit={() => handleEdit("direccion")} />
        <InfoRow icon={<Phone className="w-4 h-4 text-[#e60000]" />} label="Teléfono" value={empresa.telefono} onEdit={() => handleEdit("telefono")} />
        <InfoRow icon={<Mail className="w-4 h-4 text-[#e60000]" />} label="Email" value={empresa.email} onEdit={() => handleEdit("email")} />
      </div>

      {/* Modal de edición */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`✏ Editar ${fieldToEdit}`}
        disabled={saving}
      >
        <input
          type="text"
          maxLength={charLimit}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/40 border border-red-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={saving}
        />
        <p className="text-xs text-gray-400 mb-5 text-right">
          {newValue.length}/{charLimit} caracteres
        </p>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full flex items-center justify-center gap-2 font-semibold p-3 rounded-lg shadow-lg transition transform ${
            saving
              ? "bg-gray-500 cursor-wait text-gray-300"
              : "bg-red-600 hover:bg-red-500 text-white hover:scale-105 active:scale-95"
          }`}
        >
          {saving && <Loader2 className="animate-spin w-5 h-5" />}
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </Modal>
    </div>
  );
}

function InfoRow({ label, value, icon, onEdit }) {
  return (
    <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg hover:bg-white/10 transition">
      <div className="flex items-center space-x-2">
        {icon}
        {label && <span className="font-semibold text-sm">{label}:</span>}
        <span className="text-gray-200 text-sm">{value}</span>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 bg-[#e60000] hover:bg-[#b30000] rounded-full transform transition-transform duration-200 hover:scale-110 shadow-md"
          title="Editar"
        >
          <PencilLine className="w-3.5 h-3.5 text-white" />
        </button>
      )}
    </div>
  );
}
