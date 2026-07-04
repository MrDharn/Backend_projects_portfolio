const Button = ({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
}) => {
  const base =
    "inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-all duration-300";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white",
  };

  if (href) {
    return (
      <a
        href={href}
        className={`${base} ${variants[variant]}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;