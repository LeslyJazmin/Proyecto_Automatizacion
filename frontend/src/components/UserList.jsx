import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "./ui/Modal";

export default function UserList({ users, loading, error, currentUser, onEdit, onDelete }) {
  const [editUser, setEditUser] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState(null);

  if (loading) return <p className="text-black text-center py-8">Cargando usuarios...</p>;
  if (error) return <p className="text-red-600 text-center py-8">Error: {error}</p>;
  if (!users || users.length === 0)
    return <p className="text-black text-center py-8">No hay usuarios registrados.</p>;

  return (
    <div className=" shadow-2xl border border-red-900 bg-gradient-to-br from-red-50 to-red-100 overflow-hidden">
      <table className="w-full min-w-full divide-y divide-red-200">
        {/* Encabezado */}
        <thead className="bg-gradient-to-r from-red-800 via-red-900 to-black shadow-[0_0_15px_#7f1d1d]">
          <tr>
            {["Usuario", "Email", "Celular", "Rol", "Contraseña", "Acciones"].map((header) => (
              <th
                key={header}
                className="px-6 py-4 text-left text-sm font-bold tracking-wider text-white uppercase select-none"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Filas */}
        <tbody className="divide-y divide-red-200">
          {users.map((user) => (
            <tr
              key={user.id_usuario}
              className={`transition-all duration-300 ease-out ${
                currentUser.id_usuario === user.id_usuario
                  ? "bg-red-50 shadow-inner"
                  : "hover:bg-red-50 hover:shadow-md"
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">
                {user.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                {user.celular || "—"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full shadow-md transition-all duration-300 ${
                    user.rol === "admin"
                      ? "bg-gradient-to-r from-red-700 to-red-900 text-white"
                      : "bg-black text-white"
                  }`}
                >
                  {user.rol === "admin" ? "Administrador" : "Trabajador"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm select-none text-black">••••••••</td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                {/* Botón editar */}
                <button
                  onClick={() => setEditUser(user)}
                  className="p-2 rounded-full bg-gradient-to-r from-red-700 to-red-900 text-white shadow-md transition-all duration-300 hover:from-red-600 hover:to-red-800 hover:ring-2 hover:ring-red-700"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {/* Botón eliminar */}
                {currentUser.id_usuario !== user.id_usuario && (
                  <button
                    onClick={() => setDeleteUserModal(user)}
                    className="p-2 rounded-full bg-black text-white shadow-md transition-all duration-300 hover:bg-red-800 hover:ring-2 hover:ring-red-700"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal editar */}
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
            className="space-y-5"
          >
            {["username", "email", "celular"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-black capitalize">{field}</label>
                <input
                  type={field === "email" ? "email" : "text"}
                  value={editUser[field] || ""}
                  onChange={(e) => setEditUser({ ...editUser, [field]: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-red-700 bg-white text-black shadow-sm focus:border-red-700 focus:ring-red-700 sm:text-sm p-2"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={updating}
              className={`w-full flex justify-center items-center gap-2 font-medium py-2 rounded-xl transition-all shadow-lg ${
                updating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-700 to-red-900 text-white hover:from-red-600 hover:to-red-800 hover:ring-2 hover:ring-red-700"
              }`}
            >
              {updating ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        )}
      </Modal>

      {/* Modal eliminar */}
      <Modal isOpen={!!deleteUserModal} onClose={() => setDeleteUserModal(null)} title="¿Eliminar usuario?">
        <p className="text-black text-center mb-6">
          ¿Seguro que deseas eliminar a <strong className="text-red-600">{deleteUserModal?.username}</strong>?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setDeleteUserModal(null)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (deleteUserModal) onDelete(deleteUserModal.id_usuario);
              setDeleteUserModal(null);
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 hover:ring-2 hover:ring-red-700 text-white shadow-md transition-all"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
}
