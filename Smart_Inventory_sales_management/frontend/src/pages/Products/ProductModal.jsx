import Modal from "../../components/ui/Modal";
import ProductForm from "../../components/forms/ProductForm";
const ProductModal = ({ onClose }) => {
  return (
    <Modal
      title="Add Product"
      onClose={onClose}
    >
      <ProductForm />
    </Modal>
  );
};

export default ProductModal;