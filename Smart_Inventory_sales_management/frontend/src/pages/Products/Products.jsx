import ProductToolbar from "./ProductToolbar";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import { useState } from "react";
const Products = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-gray-500">
            Manage all inventory products.
          </p>
        </div>
      </div>

      <ProductToolbar/>

      <ProductTable />

       {open && (
        <ProductModal
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Products;