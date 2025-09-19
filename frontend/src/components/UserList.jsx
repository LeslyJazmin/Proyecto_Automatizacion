export default function UserList({ users, loading, error, currentUser, onEdit, onDelete }) {
  if (loading) return <p className="text-gray-600">Cargando usuarios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!users.length) return <p>No hay usuarios registrados.</p>;

  return (
    <ul className="space-y-3">
      {users.map((u) => (
        <li key={u.id_usuario} className="bg-white shadow rounded p-3 flex justify-between items-center">
          <span><strong>{u.username}</strong> — {u.rol}</span>
          {currentUser.rol === "admin" && (
            <div className="space-x-2">
              <button
                className="text-blue-600 hover:text-blue-800 font-semibold"
                onClick={() => onEdit(u)}
              >
                Modificar
              </button>
              <button
                className="text-red-600 hover:text-red-800 font-semibold"
                onClick={() => onDelete(u.id_usuario)}
              >
                Eliminar
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
