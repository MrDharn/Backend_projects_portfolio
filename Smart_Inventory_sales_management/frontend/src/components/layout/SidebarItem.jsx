import { NavLink } from "react-router-dom";

const SidebarItem = ({ item }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
        }`
      }
    >
      <Icon size={18} />
      <span>{item.name}</span>
    </NavLink>
  );
};

export default SidebarItem;