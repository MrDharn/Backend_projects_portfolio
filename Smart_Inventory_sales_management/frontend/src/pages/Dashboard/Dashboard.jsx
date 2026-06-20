import { useEffect, useState } from "react";

import {
  getOverview,
  getBestSellingProduct,
  getBestStaff,
  getLowStock,
} from "../../services/dashboardService";

export default function Dashboard() {
  const [overview, setOverview] = useState({});
  const [bestProduct, setBestProduct] = useState([]);
  const [bestStaff, setBestStaff] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const overviewData =
      await getOverview();

    const productData =
      await getBestSellingProduct();

    const staffData =
      await getBestStaff();

    const lowStockData =
      await getLowStock();

    setOverview(overviewData);

    setBestProduct(
      productData.bestSellingProduct
    );

    setBestStaff(staffData.bestStaff);

    setLowStock(
      lowStockData.lowStockedProducts ||
      []
    );
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Cards */}

      <div>
        <div>
          Products:
          {overview.totalProducts}
        </div>

        <div>
          Categories:
          {overview.totalCategories}
        </div>

        <div>
          Revenue:
          ₦{overview.totalRevenue}
        </div>

        <div>
          Profit:
          ₦{overview.totalProfit}
        </div>
      </div>

      {/* Best Product */}

      <section>
        <h2>
          Best Selling Product
        </h2>

        {bestProduct.length > 0 && (
          <>
            <p>
              {
                bestProduct[0]
                  .product
              }
            </p>

            <p>
              Sold:
              {
                bestProduct[0]
                  .totalQuantitySold
              }
            </p>
          </>
        )}
      </section>

      {/* Best Staff */}

      <section>
        <h2>Best Staff</h2>

        {bestStaff.length > 0 && (
          <>
            <p>
              {
                bestStaff[0]
                  .staffName
              }
            </p>

            <p>
              Revenue:
              ₦
              {
                bestStaff[0]
                  .totalRevenue
              }
            </p>
          </>
        )}
      </section>

      {/* Low Stock */}

      <section>
        <h2>
          Low Stock Alerts
        </h2>

        {lowStock.map(
          (product) => (
            <div
              key={product._id}
            >
              {product.productName}
              {" - "}
              {product.quantity}
            </div>
          )
        )}
      </section>
    </div>
  );
}