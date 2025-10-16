import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Detectamos si este input es de tipo password
  const isPassword = type === "password";

  return (
    <div className="relative">
      <input
        type={isPassword && showPassword ? "text" : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full p-3 rounded-xl border
          bg-white text-[#111] placeholder:text-neutral-400
          border-neutral-300 shadow-sm
          focus:ring-2 focus:ring-rose-500 focus:border-rose-500
          transition-all duration-300 ease-in-out
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isPassword ? "pr-12" : ""}
          ${className}
        `}
      />

      {/* 👁️ ÚNICO OJO: solo aparece si es contraseña */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 hover:text-rose-600 transition"
          tabIndex={-1}
          disabled={disabled}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
}
