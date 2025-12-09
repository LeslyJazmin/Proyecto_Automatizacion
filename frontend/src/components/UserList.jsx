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
  const [userToDelete, setUserToDelete] = useState(null);

  // ✅ Hook movido a SU LUGAR CORRECTO
  const [confirmationMessage, setConfirmationMessage] = useState("");

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
      await refreshUsers();

      // CONFIRMACIÓN
      setConfirmationMessage("Usuario actualizado correctamente ");

    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      alert("Error al actualizar: " + err.message);
    }
  };

  const handleDelete = (id) => {
    const user = users.find((u) => u.id_usuario === id);
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id_usuario);
      await refreshUsers();
      setUserToDelete(null);

      // CONFIRMACIÓN
      setConfirmationMessage("Usuario eliminado correctamente");

    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("Error al eliminar: " + err.message);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => setUserToDelete(null);

  /* -------------------------------------------------------------------
     RESPONSIVE
     - PC / LAPTOP → sin cambios.
     - Móvil → columnas 1 y tarjetas compactas.
  ------------------------------------------------------------------- */

  if (loading)
    return <p className="py-8 text-center text-gray-700">Cargando usuarios...</p>;
  if (error)
    return <p className="py-8 text-center text-red-600">Error: {error}</p>;
  if (!users || users.length === 0)
    return <p className="py-8 text-center text-gray-700">No hay usuarios registrados.</p>;

  return (
    <div
      className="
        grid
        gap-4
        grid-cols-1          /* MÓVIL */
        sm:grid-cols-2       /* TABLET */
        xl:grid-cols-3       /* PC GRANDE → EXACTO COMO TU ORIGINAL */
      "
    >
      {users.map((user) => (
        <div
          key={user.id_usuario}
          className="
            bg-white border border-gray-200 rounded-xl
            p-4 sm:p-5         /* móvil más compacto */
            shadow-sm
            transition-all duration-300
            hover:shadow-md hover:-translate-y-1
            text-sm            /* móvil más pequeño */
            sm:text-base       /* PC tamaño ORIGINAL */
            relative
          "
        >
          {/* Sombra roja para usuario actual */}
          {currentUser?.id_usuario === user.id_usuario && (
            <div className="absolute inset-0 ring-2 ring-red-600 rounded-xl pointer-events-none" />
          )}

          {/* CABECERA */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {user.username}
            </h3>

            <div className="flex items-center gap-2">
              <span
                className={`
                  text-[10px] sm:text-xs font-bold 
                  px-2 py-1 sm:px-3 sm:py-1 
                  rounded-full shadow-sm
                  ${
                    user.rol === "admin"
                      ? "bg-gradient-to-r from-red-600 to-red-800 text-white"
                      : user.rol === "almacenero"
                      ? "bg-blue-700 text-white"
                      : "bg-gray-800 text-white"
                  }
                `}
              >
                {user.rol === "admin"
                  ? "Administrador"
                  : user.rol === "almacenero"
                  ? "Almacenero"
                  : user.rol === "user"
                  ? "Recepcionista"
                  : "Trabajador"}
              </span>

              <span
                className={`
                  text-[10px] sm:text-xs font-bold 
                  px-2 py-1 rounded-full shadow-sm
                  ${user.activo ? "bg-green-500 text-white" : "bg-gray-400 text-white"}
                `}
              >
                {user.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>

          {/* DATOS */}
          <div className="space-y-1 text-[12px] sm:text-sm text-gray-700">
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Celular:</span>{" "}
              {user.celular || "—"}
            </p>
            <p>
              <span className="font-semibold">Contraseña:</span>{" "}
              <span className="text-gray-800 select-none">••••••••</span>
            </p>
          </div>

          {/* ACCIONES */}
          <div className="flex justify-end mt-4 space-x-3">
            <button
              onClick={() => setEditUser(user)}
              className="
                p-1.5 sm:p-2 
                text-white bg-red-600 rounded-full 
                hover:bg-red-700 transition
              "
            >
              <Pencil className="w-4 h-4" />
            </button>

            {currentUser?.id_usuario !== user.id_usuario &&
              user.rol !== "admin" && (
                <button
                  onClick={() => handleDelete(user.id_usuario)}
                  className="
                    p-1.5 sm:p-2 
                    text-white bg-gray-800 rounded-full 
                    hover:bg-gray-900 transition
                  "
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
          </div>
        </div>
      ))}

      {/* MODAL EDICIÓN */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Editar Usuario">
        {editUser && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setUpdating(true);
              try {
                await handleEdit(editUser);
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
                  className="
                    block w-full p-2 mt-1 
                    text-gray-900 bg-white 
                    border border-gray-300 rounded-lg shadow-sm
                    focus:border-red-600 focus:ring-red-600 
                    text-sm
                  "
                />
              </div>
            ))}

            {currentUser?.rol === "admin" && editUser.rol !== "admin" && (
              <div className="flex items-center mt-2">
                <label className="mr-3 text-sm font-medium text-gray-700">Usuario activo</label>
                <button
                  type="button"
                  onClick={() =>
                    setEditUser({ ...editUser, activo: !editUser.activo })
                  }
                  className={`
                    relative inline-flex items-center h-6 w-11 rounded-full transition-colors
                    ${editUser.activo ? "bg-green-500" : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      inline-block w-4 h-4 bg-white rounded-full transform transition-transform
                      ${editUser.activo ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={updating}
              className={`
                w-full py-2 rounded-lg font-semibold shadow-md 
                text-white 
                ${updating ? "bg-gray-300" : "bg-red-600 hover:bg-red-700"}
              `}
            >
              {updating ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        )}
      </Modal>

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal
        isOpen={!!confirmationMessage}
        onClose={() => setConfirmationMessage("")}
        title="Operación Exitosa"
      >
        <div className="text-center space-y-4">
          <p className="text-gray-800 text-lg font-semibold">
            {confirmationMessage}
          </p>

          <button
            onClick={() => setConfirmationMessage("")}
            className="
              px-6 py-2 rounded-lg 
              bg-red-600 hover:bg-red-700 
              text-white font-semibold shadow-md
            "
          >
            Cerrar
          </button>
        </div>
      </Modal>

      {/* MODAL ELIMINACIÓN */}
      <Modal isOpen={!!userToDelete} onClose={cancelDelete} title="Confirmar Eliminación">
        {userToDelete && (
          <div className="space-y-4">
            <p className="text-gray-700 text-sm">
              ¿Estás seguro que deseas eliminar al usuario <span className="font-semibold">{userToDelete.username}</span>?
              Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                onClick={cancelDelete}
                className="
                  px-4 py-2 rounded-lg 
                  bg-gray-200 hover:bg-gray-300 text-gray-700
                "
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="
                  px-4 py-2 rounded-lg 
                  bg-red-600 hover:bg-red-700 text-white
                "
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
