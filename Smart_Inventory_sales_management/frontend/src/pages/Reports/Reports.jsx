import { useState } from "react";
import { getDailyReport, getBestStaff, getBestProducts } from "../../services/reportService";
import styles from "./Reports.module.css";

export default function Reports() {
  const [date, setDate] = useState("");
  const [report, setReport] = useState(null);
  const [bestProducts, setBestProducts] = useState([]);
  const [bestStaff, setBestStaff] = useState([]);

  const loadReport = async () => {
    const res = await getDailyReport(date);
    setReport(res.report);
  };

  

  const loadBestProducts = async () => {
    const res = await getBestProducts();
    setBestProducts(res.bestSellingProduct);
  };

  const loadBestStaff = async () => {
    const res = await getBestStaff();
    setBestStaff(res.bestStaff);
  };

  return (
    <div className={styles.container}>
      <h2>Analytics Dashboard</h2>

      {/* DATE FILTER */}
      <div className={styles.filter}>
        <input
          type="date"
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={loadReport}>Generate Report</button>
      </div>

      {/* REPORT SUMMARY */}
      {report && (
        <div className={styles.cards}>
          <div className={styles.card}>
            <h4>Transactions</h4>
            <p>{report.totalTransactions}</p>
          </div>

          <div className={styles.card}>
            <h4>Items Sold</h4>
            <p>{report.totalItemsSold}</p>
          </div>

          <div className={styles.card}>
            <h4>Revenue</h4>
            <p>₦{report.totalRevenue}</p>
          </div>

          <div className={styles.card}>
            <h4>Profit</h4>
            <p>₦{report.totalProfit}</p>
          </div>
        </div>
      )}

      {/* BEST PRODUCTS */}
      <div className={styles.section}>
        <h3>Best Selling Products</h3>
        <button onClick={loadBestProducts}>Load</button>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {bestProducts.map((p, i) => (
              <tr key={i}>
                <td>{p.product}</td>
                <td>{p.totalQuantitySold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BEST STAFF */}
      <div className={styles.section}>
        <h3>Top Staff</h3>
        <button onClick={loadBestStaff}>Load</button>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Revenue</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {bestStaff.map((s, i) => (
              <tr key={i}>
                <td>{s.staffName}</td>
                <td>₦{s.totalRevenue}</td>
                <td>{s.totalQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}