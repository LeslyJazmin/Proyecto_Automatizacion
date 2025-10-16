import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "./ui/Modal";

export default function UserList({ users, loading, error, currentUser, onEdit, onDelete }) {
  const [editUser, setEditUser] = useState(null);
  const [updating, setUpdating] = useState(false);

  if (loading)
    return <p className="text-gray-700 text-center py-8">Cargando usuarios...</p>;

  if (error)
    return <p className="text-red-600 text-center py-8">Error: {error}</p>;

  if (!users || users.length === 0)
    return <p className="text-gray-700 text-center py-8">No hay usuarios registrados.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <div
          key={user.id_usuario}
          className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
            currentUser?.id_usuario === user.id_usuario
              ? "ring-2 ring-red-600"
              : ""
          }`}
        >
          {/* Cabecera del usuario */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {user.username}
            </h3>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                user.rol === "admin"
                  ? "bg-gradient-to-r from-red-600 to-red-800 text-white"
                  : "bg-gray-800 text-white"
              }`}
            >
              {user.rol === "admin" ? "Administrador" : "Trabajador"}
            </span>
          </div>

          {/* Datos del usuario */}
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <span className="font-semibold text-gray-800">Email:</span>{" "}
              {user.email}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Celular:</span>{" "}
              {user.celular || "—"}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Contraseña:</span>{" "}
              <span className="select-none text-gray-800">••••••••</span>
            </p>
          </div>

          {/* Acciones */}
          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={() => setEditUser(user)}
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
              title="Editar usuario"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {currentUser?.id_usuario !== user.id_usuario && (
              <button
                onClick={() => onDelete(user.id_usuario)}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-900 text-white transition"
                title="Eliminar usuario"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Modal de edición */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Editar Usuario">
        {editUser && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setUpdating(true);
              try {
                await onEdit(editUser);
                setEditUser(null);
              } finally {
                setUpdating(false);
              }
            }}
            className="space-y-4"
          >
            {["username", "email", "celular"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  value={editUser[field] || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, [field]: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-red-600 focus:ring-red-600 sm:text-sm p-2"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={updating}
              className={`w-full flex justify-center items-center gap-2 font-medium py-2 rounded-lg transition-all shadow-md ${
                updating
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {updating ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
