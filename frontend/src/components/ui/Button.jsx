export default function Button({ children, onClick, className = "", disabled = false, type = "button" }) {
  const baseClass = "py-2 px-4 rounded text-white transition";
  const enabledClass = "bg-blue-600 hover:bg-blue-700";
  const disabledClass = "bg-gray-400 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${disabled ? disabledClass : enabledClass} ${className}`}
    >
      {children}
    </button>
  );
}
