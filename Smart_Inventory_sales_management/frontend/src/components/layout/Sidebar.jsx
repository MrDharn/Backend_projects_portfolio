import { sidebarMenu } from "../../constants/sidebar";
import SidebarGroup from "./SidebarGroup";
import { LayoutContext } from "../../context/LayoutContext";
import { useContext } from "react";

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useContext(LayoutContext);
  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bd-black/40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
      fixed left-0 top-0 z-50 h-screen w-72 bg-white border-r
      transform transition-transform duration-300
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 lg:static
    `}
      >
        <div className="border-b p-6">
          <h1 className="text-2xl font-bold text-blue-600">Smart Inventory</h1>

          <p className="mt-1 text-sm text-gray-500">Sales Management</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {sidebarMenu.map((group) => (
            <SidebarGroup key={group.title} group={group} />
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
