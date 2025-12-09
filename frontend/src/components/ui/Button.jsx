export default function Button({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) {
  // Clases base
  const baseClass =
    "transition-all duration-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 flex items-center justify-center";

  // Clases según estado
  const enabledClass =
    "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer";
  const disabledClass = "bg-gray-400 cursor-not-allowed text-gray-200";

  // Responsive (solo ancho, manteniendo el padding/texto original)
  const responsiveClass = "w-full sm:w-auto";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${disabled ? disabledClass : enabledClass} ${responsiveClass} ${className}`}
    >
      {children}
    </button>
  );
}
