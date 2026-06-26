import {
  FaChartPie,
  FaBoxOpen,
  FaTags,
  FaTruck,
  FaCashRegister,
  FaShoppingCart,
  FaUsers,
  FaChartBar,
  FaUserShield,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export const sidebarMenu = [
  {
    title: "MAIN",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: FaChartPie,
      },
    ],
  },

  {
    title: "INVENTORY",
    items: [
      {
        name: "Products",
        path: "/products",
        icon: FaBoxOpen,
      },
      {
        name: "Categories",
        path: "/categories",
        icon: FaTags,
      },
      {
        name: "Suppliers",
        path: "/suppliers",
        icon: FaTruck,
      },
    ],
  },

  {
    title: "SALES",
    items: [
      {
        name: "POS",
        path: "/sales",
        icon: FaCashRegister,
      },
      {
        name: "Purchases",
        path: "/purchases",
        icon: FaShoppingCart,
      },
      {
        name: "Customers",
        path: "/customers",
        icon: FaUsers,
      },
    ],
  },

  {
    title: "REPORTS",
    items: [
      {
        name: "Reports",
        path: "/reports",
        icon: FaChartBar,
      },
    ],
  },

  {
    title: "ADMIN",
    items: [
      {
        name: "Users",
        path: "/users",
        icon: FaUserShield,
      },
      {
        name: "Settings",
        path: "/settings",
        icon: FaCog,
      },
      {
        name: "Logout",
        path: "/logout",
        icon: FaSignOutAlt,
      },
    ],
  },
];
