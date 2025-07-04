import type { ButtonProps } from "./types";

const Button = ({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: ButtonProps) => {
  const baseStyles = `
    my-2 px-2 text-base sm:text-base py-2 rounded font-serif
    ${disabled
      ? 'bg-gray-400 text-white cursor-not-allowed opacity-25'
      : `bg-[radial-gradient(circle,_#795649,_#5b3b2b)]
         hover:bg-[radial-gradient(circle,_#a1784d,_#5b3b2b)]
         hover:shadow-[0px_0_5px_5px_rgba(255,255,255,0.1)]
         active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]
         active:translate-y-[2px] cursor-pointer`
    }
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
