import { useEffect, useState } from "react";
import { getOverview } from "../../services/dashboardService";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getOverview();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <h2>Loading dashboard...</h2>;

  return (
    <div className={styles.container}>
      <h2>SIMS Overview</h2>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Products</h3>
          <p>{data.totalProducts}</p>
        </div>

        <div className={styles.card}>
          <h3>Categories</h3>
          <p>{data.totalCategories}</p>
        </div>

        <div className={styles.card}>
          <h3>Suppliers</h3>
          <p>{data.totalSupplier}</p>
        </div>

        <div className={styles.card}>
          <h3>Total Sales</h3>
          <p>{data.totalSales}</p>
        </div>

        <div className={styles.card}>
          <h3>Total Revenue</h3>
          <p>₦{data.totalRevenue}</p>
        </div>

        <div className={styles.card}>
          <h3>Total Profit</h3>
          <p>₦{data.totalProfit}</p>
        </div>
      </div>
    </div>
  );
}