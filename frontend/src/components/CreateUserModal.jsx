import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import Button from "./ui/Button";

export default function CreateUserModal({ modalOpen, setModalOpen, newUser, setNewUser, creating, onCreate }) {
  const [errors, setErrors] = useState({ nombre: "", celular: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      // 🔄 Resetea datos cuando el modal se abre
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

    if (valid) {
      onCreate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        {/* Botón de cerrar */}
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        <h3 className="text-xl font-semibold mb-4">Crear Nuevo Trabajador</h3>

        <div className="space-y-3" autoComplete="off">
          {/* Nombre completo */}
          <input
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            placeholder="Nombre completo"
            className="w-full p-2 border rounded"
            autoComplete="off"
          />
          {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}

          {/* Celular */}
          <input
            value={newUser.celular}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,9}$/.test(value)) {
                setNewUser({ ...newUser, celular: value });
              }
            }}
            placeholder="Celular (9 dígitos)"
            className="w-full p-2 border rounded"
            autoComplete="off"
          />
          {errors.celular && <p className="text-red-500 text-sm">{errors.celular}</p>}

          {/* Email */}
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
            className="w-full p-2 border rounded"
            autoComplete="off"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          {/* Contraseña con ojito */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="Contraseña"
              className="w-full p-2 border rounded pr-10"
              autoComplete="new-password" // 🔑 Previene autocompletado de contraseñas guardadas
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          {/* Botón */}
          <Button
            onClick={handleCreate}
            disabled={creating}
            className="w-full flex items-center justify-center"
          >
            {creating ? "Creando..." : "Crear Trabajador"}
          </Button>
        </div>
      </div>
    </div>
  );
}
