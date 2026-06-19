import styles from "./Navbar.module.css";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar({ setOpen }) {
  const { user, logout } = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className={styles.navbar}>
      <button
        className={styles.menu}
        onClick={() => setOpen((prev) => !prev)}
      >
        ☰
      </button>

      <h3>SIMS</h3>

      <div className={styles.profile}>
        <div
          className={styles.avatar}
          onClick={() => setDropdown(!dropdown)}
        >
          {user?.username?.[0]?.toUpperCase()}
        </div>

        {dropdown && (
          <div className={styles.dropdown}>
            <p>{user?.username}</p>
            <p>{user?.role}</p>

            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}