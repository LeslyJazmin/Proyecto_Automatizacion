import { Pencil, Trash2 } from "lucide-react";

export default function UserList({ users, loading, error, currentUser, onEdit, onDelete }) {
  if (loading) return <p className="text-gray-600">Cargando usuarios...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  if (!users || users.length === 0) {
    return <p className="text-gray-500 text-center">No hay usuarios registrados.</p>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Usuario</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Email</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Celular</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Rol</th>
            <th className="px-4 py-2 text-left text-gray-700 font-semibold">Contraseña</th>
            <th className="px-4 py-2 text-center text-gray-700 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id_usuario}
              className={`border-b hover:bg-gray-100 ${
                currentUser.id_usuario === user.id_usuario ? "bg-blue-50" : ""
              }`}
            >
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.celular || "—"}</td>
              <td className="px-4 py-2">
                {user.rol === "admin" ? "Administrador" : "Trabajador"}
              </td>
              <td className="px-4 py-2 text-gray-500 select-none">••••••••</td>
              <td className="px-4 py-2 text-center space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="inline w-5 h-5" />
                </button>
                {currentUser.id_usuario !== user.id_usuario && (
                  <button
                    onClick={() => onDelete(user.id_usuario)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="inline w-5 h-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
