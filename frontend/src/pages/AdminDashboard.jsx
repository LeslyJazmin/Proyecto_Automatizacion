import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserList from "../components/UserList";
import CreateUserModal from "../components/CreateUserModal";
import useUsers from "../hooks/useUsers";
import { UserPlus } from "lucide-react";

function AdminDashboard() {
  const {
    users, loading, error, currentUser,
    modalOpen, setModalOpen,
    newUser, setNewUser, creating,
    createNewUser, updateUserData, deleteUserData
  } = useUsers();

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 p-8">
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            👋 ¡Bienvenido, {currentUser.username || "Administrador"}!
          </h1>
          <p className="text-gray-600">Rol: {currentUser.rol || "admin"}</p>
        </div>

        {currentUser.rol === "admin" && (
           <button
            onClick={() => setModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-6"
          >
            <UserPlus className="w-5 h-5" /> {/* ícono agregado */}
            <span>Crear Trabajador</span>
          </button>
        )}

        <CreateUserModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          newUser={newUser}
          setNewUser={setNewUser}
          creating={creating}
          onCreate={createNewUser}
        />

        <UserList
          users={users}
          loading={loading}
          error={error}
          currentUser={currentUser}
          onEdit={updateUserData}
          onDelete={deleteUserData}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
