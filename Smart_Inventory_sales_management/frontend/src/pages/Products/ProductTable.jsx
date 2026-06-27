import ProductRow from "./ProductRow";

const ProductTable = ({products}) => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">Image</th>
            <th className="text-left">Product</th>
            <th className="text-left">Category</th>
            <th className="text-left">Price</th>
            <th className="text-left">Stock</th>
            <th className="text-left">Status</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;