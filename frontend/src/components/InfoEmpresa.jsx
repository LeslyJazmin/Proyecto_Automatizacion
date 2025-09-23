import { useEffect, useState } from "react";
import { getInfoEmpresa, updateInfoEmpresa } from "../api/empresa";
import { Building2, Hash, MapPin, Phone, Mail, PencilLine, CheckCircle, Loader2 } from "lucide-react";
import Modal from "./ui/Modal";

// Componente para la fila de información
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
          className="p-1.5 bg-red-600 hover:bg-red-500 rounded-full transform transition-transform duration-200 hover:scale-110 shadow-md"
          title="Editar"
        >
          <PencilLine className="w-3.5 h-3.5 text-white" />
        </button>
      )}
    </div>
  );
}

// Componente para el modal de edición
function EditFieldModal({
  isOpen,
  onClose,
  title,
  value,
  onChange,
  onSave,
  saving,
  charLimit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      disabled={saving}
    >
      <input
        type="text"
        maxLength={charLimit}
        value={value}
        onChange={onChange}
        className="w-full p-3 rounded-lg bg-black/40 border border-red-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        disabled={saving}
      />
      <p className="text-xs text-gray-400 mb-5 text-right">
        {value.length}/{charLimit} caracteres
      </p>
      <button
        onClick={onSave}
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
  );
}

export default function InfoEmpresa() {
  const [empresa, setEmpresa] = useState(null);
  const [error, setError] = useState(null);
  const [editingModal, setEditingModal] = useState({
    isOpen: false,
    field: "",
    value: "",
    charLimit: 100,
  });
  const [successMessage, setSuccessMessage] = useState("");
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
    const limits = { direccion: 30, telefono: 9, email: 30 };
    setEditingModal({
      isOpen: true,
      field: field,
      value: empresa[field],
      charLimit: limits[field] || 100,
    });
  }

  async function handleSave() {
    try {
      setSaving(true);
      const updated = await updateInfoEmpresa({
        ...empresa,
        [editingModal.field]: editingModal.value,
      });

      setEmpresa(updated);
      setEditingModal({ ...editingModal, isOpen: false });
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
    // CAMBIO CLAVE: Reducimos el ancho máximo para dejar espacio a la derecha
    // de max-w-4xl a max-w-xl
    <div className="relative w-full bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 mb-6">
      
      {successMessage && (
        <div className="absolute top-4 right-4 bg-red-600/95 border border-red-700 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in-down transition-opacity duration-500">
          <CheckCircle className="w-5 h-5 text-white" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <InfoRow icon={<Building2 className="w-4 h-4 text-gray-600" />} label="Nombre" value={empresa.nombre} />
        <InfoRow icon={<Hash className="w-4 h-4 text-gray-600" />} label="RUC" value={empresa.ruc} />
        <InfoRow icon={<MapPin className="w-4 h-4 text-gray-600" />} label="Dirección" value={empresa.direccion} onEdit={() => handleEdit("direccion")} />
        <InfoRow icon={<Phone className="w-4 h-4 text-gray-600" />} label="Teléfono" value={empresa.telefono} onEdit={() => handleEdit("telefono")} />
        <InfoRow icon={<Mail className="w-4 h-4 text-gray-600" />} label="Email" value={empresa.email} onEdit={() => handleEdit("email")} />
      </div>

      <EditFieldModal
        isOpen={editingModal.isOpen}
        onClose={() => setEditingModal({ ...editingModal, isOpen: false })}
        title={`✏ Editar ${editingModal.field}`}
        value={editingModal.value}
        onChange={(e) => setEditingModal({ ...editingModal, value: e.target.value })}
        onSave={handleSave}
        saving={saving}
        charLimit={editingModal.charLimit}
      />
    </div>
  );
}