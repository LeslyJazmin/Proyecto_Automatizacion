import { useState, useEffect } from "react";
import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import Modal from "./ui/Modal";

export default function CreateUserModal({ modalOpen, setModalOpen, newUser, setNewUser, creating, onCreate }) {
  const [errors, setErrors] = useState({ nombre: "", celular: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      setNewUser({ username: "", celular: "", email: "", password: "" });
      setErrors({ nombre: "", celular: "", email: "", password: "" });
    }
  }, [modalOpen, setNewUser]);

  if (!modalOpen) return null;

  const handleCreate = () => {
    let valid = true;
    const newErrors = { nombre: "", celular: "", email: "", password: "" };

    if (!newUser.username.trim() || newUser.username.trim().split(" ").length < 2) {
      newErrors.nombre = "Debes ingresar tu nombre completo (mínimo dos palabras)";
      valid = false;
    }

    if (!/^\d{9}$/.test(newUser.celular)) {
      newErrors.celular = "El celular debe tener exactamente 9 dígitos";
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      newErrors.email = "Debes ingresar un email válido";
      valid = false;
    }

    if (!newUser.password || newUser.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    }

    setErrors(newErrors);
    if (valid) onCreate();
  };

  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      title={
        <div className="flex items-center gap-3 justify-center">
          <UserPlus className="w-6 h-6 text-red-400" />
          <span>Crear Nuevo Trabajador</span>
        </div>
      }
      disabled={creating}
    >
      <div className="space-y-4">
        <input
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          placeholder="Nombre completo"
          className="w-full p-3 rounded-lg bg-black/40 border border-red-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={creating}
        />
        {errors.nombre && <p className="text-red-400 text-sm">{errors.nombre}</p>}

        <input
          value={newUser.celular}
          onChange={(e) => /^\d{0,9}$/.test(e.target.value) && setNewUser({ ...newUser, celular: e.target.value })}
          placeholder="Celular (9 dígitos)"
          className="w-full p-3 rounded-lg bg-black/40 border border-red-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={creating}
        />
        {errors.celular && <p className="text-red-400 text-sm">{errors.celular}</p>}

        <input
          type="email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-black/40 border border-red-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={creating}
        />
        {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Contraseña"
            className="w-full p-3 rounded-lg bg-black/40 border border-red-700 text-white placeholder-gray-400 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500"
            autoComplete="new-password"
            disabled={creating}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-red-300 hover:text-red-100"
            disabled={creating}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

        <button
          onClick={handleCreate}
          disabled={creating}
          className={`w-full flex items-center justify-center gap-2 font-semibold p-3 rounded-lg shadow-lg transition transform ${
            creating
              ? "bg-gray-500 cursor-wait text-gray-300"
              : "bg-red-600 hover:bg-red-500 text-white hover:scale-105 active:scale-95"
          }`}
        >
          {creating && <Loader2 className="animate-spin w-5 h-5" />}
          {creating ? "Creando..." : "Crear Trabajador"}
        </button>
      </div>
    </Modal>
  );
}
