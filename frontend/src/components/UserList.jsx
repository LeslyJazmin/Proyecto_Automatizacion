import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "./ui/Modal";

export default function UserList({ users, loading, error, currentUser, onEdit, onDelete }) {
  const [editUser, setEditUser] = useState(null);
  const [updating, setUpdating] = useState(false); // <- Estado de carga para edición

  if (loading) return <p className="text-gray-300 text-center">Cargando usuarios...</p>;
  if (error) return <p className="text-red-400 text-center">Error: {error}</p>;

  if (!users || users.length === 0) {
    return <p className="text-gray-400 text-center">No hay usuarios registrados.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl shadow-[0_0_35px_#ff1a1a88] border border-red-700 bg-gradient-to-b from-black via-black to-red-950">
      <table className="min-w-full border-collapse">
        <thead className="bg-gradient-to-r from-red-950 to-black">
          <tr>
            <th className="px-5 py-3 text-left text-red-400 font-bold uppercase">Usuario</th>
            <th className="px-5 py-3 text-left text-red-400 font-bold uppercase">Email</th>
            <th className="px-5 py-3 text-left text-red-400 font-bold uppercase">Celular</th>
            <th className="px-5 py-3 text-left text-red-400 font-bold uppercase">Rol</th>
            <th className="px-5 py-3 text-left text-red-400 font-bold uppercase">Contraseña</th>
            <th className="px-5 py-3 text-center text-red-400 font-bold uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id_usuario}
              className={`transition duration-300 ${
                currentUser.id_usuario === user.id_usuario
                  ? "bg-red-950/70"
                  : "bg-black/80"
              } hover:bg-red-900/50`}
            >
              <td className="px-5 py-3 text-white">{user.username}</td>
              <td className="px-5 py-3 text-white">{user.email}</td>
              <td className="px-5 py-3 text-white">{user.celular || "—"}</td>
              <td className="px-5 py-3 text-red-400 font-semibold">
                {user.rol === "admin" ? "Administrador" : "Trabajador"}
              </td>
              <td className="px-5 py-3 select-none text-white/70">••••••••</td>
              <td className="px-5 py-3 text-center space-x-3">
                <button
                  onClick={() => setEditUser(user)}
                  className="p-2 bg-red-700 hover:bg-red-600 rounded-full shadow-[0_0_10px_#ff1a1a88] transition-transform hover:scale-110"
                >
                  <Pencil className="w-4 h-4 text-white" />
                </button>
                {currentUser.id_usuario !== user.id_usuario && (
                  <button
                    onClick={() => onDelete(user.id_usuario)}
                    className="p-2 bg-black/70 hover:bg-red-700 rounded-full shadow-[0_0_10px_#ff1a1a55] transition-transform hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para editar usuario */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Editar Usuario"
      >
        {editUser && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setUpdating(true); // <- empieza guardando
              try {
                await onEdit(editUser);
                setEditUser(null);
              } finally {
                setUpdating(false); // <- termina guardando
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-white mb-1">Usuario</label>
              <input
                type="text"
                value={editUser.username}
                onChange={(e) =>
                  setEditUser({ ...editUser, username: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-black/50 border border-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Email</label>
              <input
                type="email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-black/50 border border-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Celular</label>
              <input
                type="text"
                value={editUser.celular || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, celular: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-black/50 border border-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={updating} // <- deshabilita mientras guarda
              className={`w-full ${
                updating ? "bg-gray-600" : "bg-red-700 hover:bg-red-600"
              } text-white py-2 rounded-lg shadow-[0_0_15px_#ff1a1a88] transition-transform hover:scale-105`}
            >
              {updating ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
