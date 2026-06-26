const ProductToolbar = () => {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        placeholder="Search product..."
        className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
      />

      <div className="flex gap-3">
        <select className="rounded-lg border border-gray-300 px-4 py-2">
          <option>All Categories</option>
        </select>

        <select className="rounded-lg border border-gray-300 px-4 py-2">
          <option>All Status</option>
        </select>

        <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
          Add Product
        </button>
      </div>
    </div>
  );
};

export default ProductToolbar;