import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import styles from "./DashboardLayout.module.css";

import { useState } from "react";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <Sidebar open={open} setOpen={setOpen} />

      <div className={styles.main}>
        <Navbar setOpen={setOpen} />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}