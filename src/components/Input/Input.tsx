import type { InputProps } from "./types";

const Input = ({
  label,
  placeholder = "",
  value,
  onChange,
  error,
  type = "text",
}: InputProps) => {
  return (
    <div className="w-full flex flex-col items-start gap-1 font-serif">
      {label && (
        <label className="text-[#4b3a2f] font-semibold drop-shadow-sm text-sm">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`
          w-full px-3 py-1.5 rounded-md border text-sm font-serif
          bg-[radial-gradient(circle,_#f6f0e0,_#e2d4b6)]
          border-[#bfa98a]
          placeholder-[#a78d66] text-[#4b3a2f]
          shadow-inner
          focus:outline-none focus:ring-1 focus:ring-[#a67c52]
        `}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default Input;
