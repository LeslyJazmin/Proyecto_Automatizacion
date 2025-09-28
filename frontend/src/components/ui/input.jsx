export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  disabled = false,
}) {
  return (
    <input
      type={type}
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
        ${className}
      `}
    />
  );
}
