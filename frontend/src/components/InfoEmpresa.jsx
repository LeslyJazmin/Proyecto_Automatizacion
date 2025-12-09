import { useEffect, useState } from "react";
import { getInfoEmpresa, updateInfoEmpresa } from "../api/empresa";
import {
  Building2,
  Hash,
  MapPin,
  Phone,
  Mail,
  PencilLine,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Modal from "./ui/Modal";

/* ------------------------------------------------------
   InfoRow Original + RESPONSIVE (solo texto y padding)
------------------------------------------------------- */
function InfoRow({ label, value, icon, onEdit, readOnly }) {
  return (
    <div
      className="
        flex justify-between items-center 
        bg-white 
        p-2 sm:p-2 
        rounded-md border border-neutral-200 
        hover:bg-red-50/40 
        transition-all duration-200
      "
    >
      <div className="flex items-center space-x-2">

        {/* ICONO EXACTO COMO EL ORIGINAL */}
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-red-100 text-red-700">
          {icon}
        </div>

        {label && (
          <span className="font-medium text-gray-700 text-xs sm:text-sm">
            {label}:
          </span>
        )}

        <span className="text-gray-900 text-xs sm:text-sm">{value}</span>
      </div>

      {!readOnly && onEdit && (
        <button
          onClick={onEdit}
          className="
            p-1 
            bg-gradient-to-r from-red-700 to-red-900 
            hover:from-red-600 hover:to-red-800
            rounded-full 
            transition-all duration-200
            shadow-sm hover:shadow-md
          "
        >
          <PencilLine className="w-3.5 h-3.5 text-white" />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------
   Modal Editar (solo responsivo en texto)
------------------------------------------------------- */
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
    <Modal isOpen={isOpen} onClose={onClose} title={title} disabled={saving}>
      <input
        type="text"
        maxLength={charLimit}
        value={value}
        onChange={onChange}
        className="
          w-full p-2 
          rounded-md bg-black/30 border border-red-700/40 
          text-black 
          focus:outline-none focus:ring-1 focus:ring-red-600 
          text-xs sm:text-sm
        "
        disabled={saving}
      />

      <p className="text-[10px] sm:text-xs text-black/60 mb-3 text-right">
        {value.length}/{charLimit} caracteres
      </p>

      <button
        onClick={onSave}
        disabled={saving}
        className={`
          w-full flex items-center justify-center gap-2 
          font-medium p-2.5 rounded-lg text-xs sm:text-sm
          transition-all duration-300
          ${
            saving
              ? "bg-gray-600 cursor-wait text-white/70"
              : "bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white shadow-md"
          }
        `}
      >
        {saving && <Loader2 className="animate-spin w-4 h-4" />}
        {saving ? "Guardando..." : "Guardar"}
      </button>
    </Modal>
  );
}

/* ------------------------------------------------------
   COMPONENTE PRINCIPAL RESPONSIVO
------------------------------------------------------- */
export default function InfoEmpresa({ readOnly = false }) {
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
    if (readOnly) return;

    const limits = { direccion: 30, telefono: 9, email: 50 };

    setEditingModal({
      isOpen: true,
      field,
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

      setSuccessMessage(`${editingModal.field} actualizado correctamente`);

      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  }

  if (error)
    return (
      <div className="text-red-700 bg-red-100 p-2 rounded-lg border border-red-300 text-xs">
        ⚠ {error}
      </div>
    );

  if (!empresa)
    return <div className="text-gray-600 text-sm">Cargando información...</div>;

  return (
    <div className="relative rounded-xl shadow-md border border-neutral-200 overflow-hidden transition-all">

      {/* MENSAJE DE ÉXITO (sin tocar diseño original) */}
      {successMessage && !readOnly && (
        <div className="
          absolute top-4 right-4 
          bg-green-600 text-white 
          px-3 sm:px-4 py-2 
          rounded-lg shadow-lg 
          flex items-center gap-2 
          animate-fade-in-down
          text-xs sm:text-sm
        ">
          <CheckCircle className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* HEADER – igual al original */}
      <div className="bg-gradient-to-r from-red-900 via-black to-red-950 border-b border-red-700 shadow-[0_0_15px_#ff1a1a44] px-3 sm:px-4 py-3 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-white/90" />
        <h2 className="text-white text-base sm:text-lg font-semibold tracking-wide">
          Información de la Empresa
        </h2>
      </div>

      {/* CONTENIDO RESPONSIVO */}
      <div className="bg-white p-3 sm:p-4 space-y-2">
        <InfoRow icon={<Building2 className="w-4 h-4" />} label="Nombre" value={empresa.nombre} readOnly={readOnly} />
        <InfoRow icon={<Hash className="w-4 h-4" />} label="RUC" value={empresa.ruc} readOnly={readOnly} />
        <InfoRow icon={<MapPin className="w-4 h-4" />} label="Dirección" value={empresa.direccion} onEdit={() => handleEdit("direccion")} readOnly={readOnly} />
        <InfoRow icon={<Phone className="w-4 h-4" />} label="Teléfono" value={empresa.telefono} onEdit={() => handleEdit("telefono")} readOnly={readOnly} />
        <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={empresa.email} onEdit={() => handleEdit("email")} readOnly={readOnly} />
      </div>

      {!readOnly && (
        <EditFieldModal
          isOpen={editingModal.isOpen}
          onClose={() =>
            setEditingModal({ ...editingModal, isOpen: false })
          }
          title={`✏ Editar ${editingModal.field}`}
          value={editingModal.value}
          onChange={(e) =>
            setEditingModal({ ...editingModal, value: e.target.value })
          }
          onSave={handleSave}
          saving={saving}
          charLimit={editingModal.charLimit}
        />
      )}
    </div>
  );
}
