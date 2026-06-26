const Select = ({ label, children, ...props }) => {
  return (
    <div className="space-y-2">
      <label className="font-medium">{label}</label>

      <select
        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;