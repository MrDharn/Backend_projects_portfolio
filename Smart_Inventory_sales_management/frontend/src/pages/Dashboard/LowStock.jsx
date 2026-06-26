const products = [
  { name: "Rice", stock: 5 },
  { name: "Sugar", stock: 3 },
  { name: "Milk", stock: 7 },
];

const LowStock = () => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">
      <h2 className="mb-4 text-xl font-semibold">
        Low Stock
      </h2>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.name}
            className="flex justify-between border-b pb-2"
          >
            <span>{product.name}</span>

            <span className="rounded bg-red-100 px-3 py-1 text-red-600">
              {product.stock}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStock;