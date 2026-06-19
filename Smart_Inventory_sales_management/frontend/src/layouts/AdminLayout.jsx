import { Outlet, Link, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <h2>SIMS</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/pos">POS</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/products">Products</Link>
        </nav>

        <button onClick={logout} className={styles.logout}>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}