import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "./ui/Modal";
import { listUsers, updateUser, deleteUser } from "../api/users";

// Aceptamos el nuevo prop: refreshSignal
export default function UserList({ currentUser, refreshSignal }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Para manejar la confirmación de eliminación

  // Función para refrescar la lista de usuarios
  const refreshUsers = async () => {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, [refreshSignal]); 

  const handleEdit = async (updatedUser) => {
    try {
      await updateUser(updatedUser.id_usuario, updatedUser);
      // Refrescar la lista de usuarios después de la actualización
      await refreshUsers();
    } catch (err) {
      // Usamos console.error para logging sin alerts invasivos
      console.error("Error al actualizar usuario:", err);
      // Podrías usar un toast o notificación en lugar de alert
      alert("Error al actualizar: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    // En lugar de usar window.confirm, establecemos el usuario a eliminar
    const user = users.find(u => u.id_usuario === id);
    setUserToDelete(user);
  };
  
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id_usuario);
      // Refrescar la lista de usuarios después de la eliminación
      await refreshUsers();
      setUserToDelete(null); // Cerramos el modal de confirmación
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("Error al eliminar: " + err.message);
      setUserToDelete(null); // Cerramos el modal de confirmación incluso si hay error
    }
  };
  
  const cancelDelete = () => {
    setUserToDelete(null);
  };
  

  if (loading)
    return <p className="py-8 text-center text-gray-700">Cargando usuarios...</p>;
  if (error)
    return <p className="py-8 text-center text-red-600">Error: {error}</p>;
  if (!users || users.length === 0)
    return <p className="py-8 text-center text-gray-700">No hay usuarios registrados.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <div
          key={user.id_usuario}
          className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
            currentUser?.id_usuario === user.id_usuario ? "ring-2 ring-red-600" : ""
          }`}
        >
          {/* Cabecera */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
            <div className="flex items-center gap-2">
              {/* Rol */}
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                  user.rol === "admin"
                    ? "bg-gradient-to-r from-red-600 to-red-800 text-white"
                    : "bg-gray-800 text-white"
                }`}
              >
                {user.rol === "admin" ? "Administrador" : "Trabajador"}
              </span>

              {/* Estado activo */}
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full shadow-sm ${
                  user.activo ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                }`}
              >
                {user.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>

          {/* Datos */}
          <div className="space-y-1 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Celular:</span> {user.celular || "—"}
            </p>
            <p>
              <span className="font-semibold">Contraseña:</span>{" "}
              <span className="text-gray-800 select-none">••••••••</span>
            </p>
          </div>

          {/* Acciones */}
          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={() => setEditUser(user)}
              className="p-2 text-white transition bg-red-600 rounded-full hover:bg-red-700"
              title="Editar usuario"
            >
              <Pencil className="w-4 h-4" />
            </button>

            {/* Solo mostrar eliminar si no es admin y no es el usuario actual */}
            {currentUser?.id_usuario !== user.id_usuario && user.rol !== "admin" && (
              <button
                onClick={() => handleDelete(user.id_usuario)}
                className="p-2 text-white transition bg-gray-800 rounded-full hover:bg-gray-900"
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
                await handleEdit(editUser);
                setEditUser(null);
              } catch (err) {
                console.error("Error al guardar cambios:", err);
              } finally {
                setUpdating(false);
              }
            }}
            className="space-y-4"
          >
            {/* Campos de info */}
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
                  className="block w-full p-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-red-600 focus:ring-red-600 sm:text-sm"
                />
              </div>
            ))}

            {/* 🔹 Switch de activo SOLO para Admin y NO admin */}
            {currentUser?.rol === "admin" && editUser.rol !== "admin" && (
              <div className="flex items-center mt-2">
                <label htmlFor="activo" className="mr-3 text-sm font-medium text-gray-700">
                  Usuario activo
                </label>
                <button
                  type="button"
                  onClick={() => setEditUser({ ...editUser, activo: !editUser.activo })}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                    editUser.activo ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      editUser.activo ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}

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
      
      {/* Modal de confirmación de eliminación */}
      <Modal 
        isOpen={!!userToDelete} 
        onClose={cancelDelete} 
        title="Confirmar Eliminación"
      >
        {userToDelete && (
          <div className="space-y-4">
            <p className="text-gray-700">
              ¿Estás seguro que deseas eliminar al usuario <span className="font-semibold">{userToDelete.username}</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end pt-4 space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}