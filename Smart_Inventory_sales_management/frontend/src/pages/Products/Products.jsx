import ProductToolbar from "./ProductToolbar";
import ProductTable from "./ProductTable";
import ProductModal from "./ProductModal";
import { useState } from "react";
import {toast} from 'react-toastify'
const Products = () => {
  const [products, setProducts] = useState([
  {
    id: 1,
    productName: "Rice",
    category: "Food",
    sellingPrice: 3500,
    stockQuantity: 120,
  }
]);

const handleAddProduct = (data)=> {

  const newProduct = {
    id: Date.now(), ...data
  }

  setProducts((prev)=> [...prev, newProduct])
  setOpen(false)
  toast.success('product added successfully!');
}
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>

          <p className="text-gray-500">Manage all inventory products.</p>
        </div>

        <button
          onClick = {()=> setOpen(true)}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Add Product
        </button>
      </div>

      <ProductToolbar onAddProduct={()=> setOpen(true)} />

      <ProductTable products={products}/>

      {open && <ProductModal onClose={() => setOpen(false)} onSave={handleAddProduct} />}
    </>
  );
};

export default Products;
