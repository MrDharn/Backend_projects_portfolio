const sales = [
  {
    id: "INV-001",
    customer: "John Doe",
    amount: "₦12,000",
  },
  {
    id: "INV-002",
    customer: "Mary Jane",
    amount: "₦18,500",
  },
  {
    id: "INV-003",
    customer: "David",
    amount: "₦25,000",
  },
];

const RecentSales = () => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">
      <h2 className="mb-4 text-xl font-semibold">
        Recent Sales
      </h2>

      <div className="space-y-4">
        {sales.map((sale) => (
          <div
            key={sale.id}
            className="flex justify-between border-b pb-2"
          >
            <div>
              <h3 className="font-medium">
                {sale.customer}
              </h3>

              <p className="text-sm text-gray-500">
                {sale.id}
              </p>
            </div>

            <span className="font-semibold">
              {sale.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSales;