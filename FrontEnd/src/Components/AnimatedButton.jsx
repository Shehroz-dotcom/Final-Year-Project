const AnimatedButton = ({
  label,
  children,
  onClick,
  type = 'button',
  className = '',
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`relative inline-flex items-center justify-center px-4 py-2 font-bold border-2 border-white rounded cursor-pointer overflow-hidden group transition-all duration-300 ${className}`}
  >
    {/* Diagonal Sweep Overlay */}
    <span className="absolute inset-0 z-0 before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-[10%] before:h-[500%] before:bg-white/30 before:-translate-x-1/2 before:-translate-y-1/2 before:-rotate-45 before:transition-all before:duration-500 before:ease-out group-hover:before:w-[200%] group-hover:before:bg-white group-hover:before:rotate-0"></span>

    {/* Button Label/Text */}
    <span className="relative z-10 text-white transition-colors duration-500 group-hover:text-black">
      {label || children}
    </span>
  </button>
);

export default AnimatedButton;
