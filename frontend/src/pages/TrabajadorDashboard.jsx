import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SidebarTrabajador";
import Modal from "../components/ui/Modal";
import InfoEmpresa from "../components/InfoEmpresa";
import UserList from "../components/UserList";
import useUsers from "../hooks/useUsers";
import { jwtDecode } from "jwt-decode";

export default function TrabajadorDashboard({ user, setToken, setUser }) {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("Trabajador");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Obtener usuarios desde hook
  const { users, loading: usersLoading, error } = useUsers();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.rol !== "trabajador" && user.rol !== "user") {
      sessionStorage.clear();
      setUser(null);
      setToken(null);
      navigate("/login");
      return;
    }

    // Extraer datos del token
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setNombreUsuario(decoded.username || decoded.name || "Trabajador");
      }
    } catch (err) {
      console.error("Token inválido:", err);
      sessionStorage.clear();
      setUser(null);
      setToken(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [user, navigate, setUser, setToken]);

  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  return (
    <div className="bg-neutral-100 min-h-screen font-sans flex">
      <Sidebar
        onLogout={() => setLogoutModalOpen(true)}
        active="/trabajador-dashboard"
      />

      <main className="ml-64 px-5 py-6 w-full space-y-6 transition-all duration-300">
        {/* Encabezado */}
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-neutral-200 hover:shadow-2xl transition-all duration-500">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            👋 Bienvenido {nombreUsuario}
            <span
              className="px-3 py-1 rounded-full text-sm font-semibold 
                         bg-blue-100 text-blue-700 border border-blue-300 shadow-sm"
            >
              Trabajador
            </span>
          </h1>
          <p className="text-gray-500 mt-2 text-base">Vista del trabajador.</p>
        </div>

        {/* Info + Imagen */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="flex-1">
            <InfoEmpresa readOnly={user.rol === "user"} />
          </div>

          <div className="flex-1 relative rounded-2xl overflow-hidden shadow-lg hover:scale-[1.01] transition-transform duration-200 max-h-[300px]">
            <img
              src="/images/info.jpeg"
              className="w-full h-full object-cover"
              alt="Información de la empresa"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
        </div>

        {/* Tabla de trabajadores (solo lectura) */}
        <div className="rounded-2xl shadow-lg border border-neutral-200 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-900 via-black to-blue-950 
                       border-b border-blue-700 
                       p-4 flex justify-between items-center"
          >
            <h2 className="text-white text-xl font-semibold tracking-wide">
              Personal Registrado
            </h2>
          </div>

          <div className="bg-white p-5">
            <UserList
              users={users}
              loading={usersLoading}
              error={error}
              currentUser={{ username: nombreUsuario, rol: "trabajador" }}
              onEdit={() => {}}
              onDelete={() => {}}
              readOnly={true}
            />
          </div>
        </div>
      </main>

      {/* Modal Cerrar Sesión */}
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="¿Cerrar sesión?"
      >
        <p className="text-gray-700 text-center mb-6">
          ¿Estás seguro que deseas salir de tu cuenta?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setLogoutModalOpen(false)}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              sessionStorage.clear();
              setUser(null);
              setToken(null);
              navigate("/login");
            }}
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg"
          >
            Cerrar Sesión
          </button>
        </div>
      </Modal>
    </div>
  );
}
