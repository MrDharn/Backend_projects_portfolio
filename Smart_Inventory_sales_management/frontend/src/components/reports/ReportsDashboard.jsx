import React, { useEffect, useState } from 'react';
import { getOverviewReport, getBestSellingProducts, getStaffPerformance } from '../../services/reportServices';

export default function ReportsDashboard() {
  const [overview, setOverview] = useState(null);
  const [bestSelling, setBestSelling] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    async function loadReports() {
      try {
        const [overviewRes, bestSellingRes, staffRes] = await Promise.all([
          getOverviewReport(),
          getBestSellingProducts(),
          getStaffPerformance()
        ]);
        setOverview(overviewRes.data);
        setBestSelling(bestSellingRes.data || []);
        setStaff(staffRes.data || []);
      } catch (err) {
        console.error('Failed to load reports', err);
      }
    }
    loadReports();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2>Analytics & Business Intelligence</h2>
      
      <div className="grid-3">
        <div className="card">
          <h4>Total Revenue</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)', marginTop: '8px' }}>
            ${overview?.totalRevenue?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="card">
          <h4>Total Transactions</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', marginTop: '8px' }}>
            {overview?.totalSalesCount || 0}
          </p>
        </div>
        <div className="card">
          <h4>Net Profit Margin</h4>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--success)', marginTop: '8px' }}>
            {overview?.profitMargin || '0'}%
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <h3>Top Selling Products</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {bestSelling.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.unitsSold}</td>
                  <td>${item.totalRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Staff Performance</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Orders Processed</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member, index) => (
                <tr key={index}>
                  <td>{member.name}</td>
                  <td>{member.ordersCount}</td>
                  <td>${member.totalVolume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}