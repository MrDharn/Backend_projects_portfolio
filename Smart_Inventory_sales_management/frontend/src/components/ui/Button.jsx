const Button = ({
  children,
  type = "button",
  variant = "primary",
  ...props
}) => {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      className={`rounded-lg px-5 py-2 font-medium transition ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;