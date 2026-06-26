import { useContext } from "react";
import {LayoutContext} from "../../context/LayoutContext";
import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { toggleSidebar } = useContext(LayoutContext);
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden">
          <FaBars size={20} />
        </button>

        <h1 className="text-2xl font-semibold text-gray-800">SIMS</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Search */}
        <div className="hidden items-center rounded-lg border border-gray-300 px-3 lg:flex">
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-64 border-none bg-transparent p-2 outline-none"
          />
        </div>

        {/* Notifications */}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
        >
          <FaBars size={20} />
        </button>

        {/* User */}
        <div className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-gray-100">
          <FaUserCircle size={34} className="text-blue-600" />

          <div className="hidden text-left md:block">
            <h3 className="font-semibold">Admin</h3>

            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
