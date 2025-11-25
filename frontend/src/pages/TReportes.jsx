import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SidebarTrabajador";
import InfoEmpresa from "../components/InfoEmpresa";
import Modal from "../components/ui/Modal";
import { jwtDecode } from "jwt-decode";

export default function TInventario({ user, setToken, setUser }) {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("Trabajador");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.rol !== "trabajador" && user.rol !== "user")) {
      sessionStorage.clear();
      setUser(null);
      setToken(null);
      navigate("/login");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setNombreUsuario(decoded.username || decoded.name || "Trabajador");
      }
    } catch {
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
    <div className="bg-neutral-100 min-h-screen flex">
      <Sidebar onLogout={() => setLogoutModalOpen(true)} active="/tinventario" />

      <main className="ml-64 p-6 w-full space-y-6">
        <h1 className="text-2xl font-bold">👋 Hola {nombreUsuario}</h1>

        <div className="bg-white p-5 rounded-lg shadow">
          <InfoEmpresa readOnly={user.rol === "user"} />
        </div>
      </main>

      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="¿Cerrar sesión?"
      >
        <p className="text-center mb-4">¿Deseas salir de tu cuenta?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setLogoutModalOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
          >
            Cerrar Sesión
          </button>
        </div>
      </Modal>
    </div>
  );
}
