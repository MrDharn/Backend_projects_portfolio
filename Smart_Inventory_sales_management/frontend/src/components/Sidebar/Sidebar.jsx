import styles from "./Sidebar.module.css";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const role = user?.role;

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Sales", path: "/sales" },
    { name: "Categories", path: "/categories" },
    { name: "Suppliers", path: "/suppliers" },
    { name: "Reports", path: "/reports" },
  ];

  const adminMenu = [...menu, { name: "Users", path: "/users" }];

  const finalMenu = role === "admin" ? adminMenu : menu;

  return (
    <div className={`${styles.sidebar} ${open ? styles.show : ""}`}>
      <h2 className={styles.logo}>SIMS</h2>

      {finalMenu.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={
            location.pathname === item.path ? styles.active : styles.link
          }
          onClick={() => setOpen(false)}
        >
          {item.name}
        </Link>
      ))}
      <Link to="/categories">Categories</Link>
      <button className={styles.logout} onClick={logout}>
        Logout
      </button>
    </div>
  );
}
