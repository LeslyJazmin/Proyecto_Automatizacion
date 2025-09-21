import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserList from "../components/UserList";
import CreateUserModal from "../components/CreateUserModal";
import InfoEmpresa from "../components/InfoEmpresa";
import useUsers from "../hooks/useUsers";
import { UserPlus } from "lucide-react";

// Componente para el botón moderno de crear trabajador
function CreateUserButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
    >
      <UserPlus className="w-5 h-5 text-white" />
      <span>Crear Trabajador</span>
    </button>
  );
}

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
        {/* --- Bienvenida --- */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            👋 ¡Bienvenido, {currentUser.username || "Administrador"}!
          </h1>
          <p className="text-gray-600">
            Rol: {currentUser.rol === "admin" ? "Administrador" : "Trabajador"}
          </p>
        </div>

        {/* --- Información de la empresa --- */}
        <InfoEmpresa />

        {/* --- Encabezado lista de usuarios con botón a la derecha --- */}
        <div className="flex justify-between items-center mb-4 mt-6">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Personal a Cargo
          </h2>
          {currentUser.rol === "admin" && (
            <CreateUserButton onClick={() => setModalOpen(true)} />
          )}
        </div>

        {/* --- Modal creación de usuario --- */}
        <CreateUserModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          newUser={newUser}
          setNewUser={setNewUser}
          creating={creating}
          onCreate={createNewUser}
        />

        {/* --- Lista de usuarios --- */}
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
