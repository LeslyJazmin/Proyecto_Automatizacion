import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import Modal from "./ui/Modal";

const VALIDATION_RULES = {
  USERNAME: (value) => value.trim().split(" ").length >= 2,
  CELULAR: (value) => /^\d{9}$/.test(value),
  EMAIL: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  PASSWORD: (value) => value.length >= 6,
};

const ERROR_MESSAGES = {
  nombre: "Debes ingresar tu nombre completo (mínimo dos palabras)",
  celular: "El celular debe tener exactamente 9 dígitos",
  email: "Debes ingresar un email válido",
  password: "La contraseña debe tener al menos 6 caracteres",
};

export default function CreateUserModal({
  modalOpen,
  setModalOpen,
  newUser,
  setNewUser,
  creating,
  onCreate,
}) {
  const [errors, setErrors] = useState({
    nombre: "",
    celular: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // 👉 Al abrir el modal, limpia todo pero fija el rol en "almacenero"
  useEffect(() => {
    if (modalOpen) {
      setNewUser({
        username: "",
        celular: "",
        email: "",
        password: "",
        rol: "almacenero",
      });

      setErrors({ nombre: "", celular: "", email: "", password: "" });
    }
  }, [modalOpen, setNewUser]);

  const validateUser = useCallback(() => {
    let valid = true;
    const newErrors = { nombre: "", celular: "", email: "", password: "" };

    if (!VALIDATION_RULES.USERNAME(newUser.username)) {
      newErrors.nombre = ERROR_MESSAGES.nombre;
      valid = false;
    }
    if (!VALIDATION_RULES.CELULAR(newUser.celular)) {
      newErrors.celular = ERROR_MESSAGES.celular;
      valid = false;
    }
    if (!VALIDATION_RULES.EMAIL(newUser.email)) {
      newErrors.email = ERROR_MESSAGES.email;
      valid = false;
    }
    if (!VALIDATION_RULES.PASSWORD(newUser.password)) {
      newErrors.password = ERROR_MESSAGES.password;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }, [newUser]);

  const handleCreate = () => {
    if (validateUser()) {
      onCreate(); // Esto ya enviará el rol incluido
    }
  };

  const handleInputChange = (field) => (e) => {
    setNewUser({ ...newUser, [field]: e.target.value });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCelularChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 9) {
      setNewUser({ ...newUser, celular: value });

      if (errors.celular) {
        setErrors((prev) => ({ ...prev, celular: "" }));
      }
    }
  };

  if (!modalOpen) return null;

  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      disabled={creating}
      title={
        <div className="flex items-center justify-center gap-3 text-2xl font-bold text-red-600">
          <UserPlus className="w-7 h-7" />
          <span>Crear Nuevo Almacenero</span>
        </div>
      }
    >
      <div className="space-y-5 px-1 sm:px-2 md:px-4">

        {/* Nombre */}
        <div>
          <input
            value={newUser.username}
            onChange={handleInputChange("username")}
            placeholder="Nombre completo"
            className={`w-full h-12 pl-4 pr-4 rounded-xl border text-gray-900 bg-white placeholder-gray-400 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200
              ${errors.nombre ? "border-red-500" : "border-neutral-300 hover:border-red-400"}`}
            disabled={creating}
            aria-invalid={!!errors.nombre}
          />
          {errors.nombre && <ErrorMessage message={errors.nombre} />}
        </div>

        {/* Celular */}
        <div>
          <input
            type="tel"
            value={newUser.celular}
            onChange={handleCelularChange}
            placeholder="Celular (9 dígitos)"
            className={`w-full h-12 pl-4 pr-4 rounded-xl border text-gray-900 bg-white placeholder-gray-400 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200
              ${errors.celular ? "border-red-500" : "border-neutral-300 hover:border-red-400"}`}
            disabled={creating}
            maxLength={9}
            inputMode="numeric"
            aria-invalid={!!errors.celular}
          />
          {errors.celular && <ErrorMessage message={errors.celular} />}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            value={newUser.email}
            onChange={handleInputChange("email")}
            placeholder="Correo electrónico"
            className={`w-full h-12 pl-4 pr-4 rounded-xl border text-gray-900 bg-white placeholder-gray-400 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200
              ${errors.email ? "border-red-500" : "border-neutral-300 hover:border-red-400"}`}
            disabled={creating}
            aria-invalid={!!errors.email}
          />
          {errors.email && <ErrorMessage message={errors.email} />}
        </div>

        {/* Contraseña */}
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            value={newUser.password}
            onChange={handleInputChange("password")}
            placeholder="Contraseña"
            className={`w-full h-12 pl-4 pr-12 rounded-xl border text-gray-900 bg-white placeholder-gray-400 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200
              ${errors.password ? "border-red-500" : "border-neutral-300 hover:border-red-400"}`}
            autoComplete="new-password"
            disabled={creating}
            aria-invalid={!!errors.password}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 inset-y-0 flex items-center justify-center
              text-red-500 hover:text-red-600 transition duration-200 p-1.5 rounded-full hover:bg-rose-50"
            disabled={creating}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>
        {errors.password && <ErrorMessage message={errors.password} />}

        {/* Botón */}
        <button
          onClick={handleCreate}
          disabled={creating}
          className={`w-full flex items-center justify-center gap-2 font-extrabold text-lg p-3 rounded-xl shadow-lg transition duration-300
            ${
              creating
                ? "bg-red-300 cursor-wait text-white"
                : "bg-red-600 hover:bg-red-500 text-white hover:scale-[1.02] active:scale-[0.98]"
            }`}
        >
          {creating && <Loader2 className="animate-spin w-5 h-5" />}
          {creating ? "Creando..." : "Crear Almacenero"}
        </button>
      </div>
    </Modal>
  );
}

const ErrorMessage = ({ message }) => (
  <p className="text-red-600 text-sm pl-2 mt-1 animate-fadeIn" role="alert">
    {message}
  </p>
);
