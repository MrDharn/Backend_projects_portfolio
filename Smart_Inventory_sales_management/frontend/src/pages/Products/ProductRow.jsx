import {
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";

const ProductRow = ({ product }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">📦</td>

      <td>{product.productName}</td>

      <td>{product.categoryName}</td>

      <td>{product.sellingPrice}</td>

      <td>{product.stockQuantity}</td>

      <td>
        <span
          className={`rounded-full px-3 py-1 text-sm ${
            product.stock > 20
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {product.stock > 20 ? "In Stock" : "Low Stock"}
        </span>
      </td>

      <td>
        <div className="flex gap-3">
          <FaEye className="cursor-pointer text-blue-600" />
          <FaEdit className="cursor-pointer text-green-600" />
          <FaTrash className="cursor-pointer text-red-600" />
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;