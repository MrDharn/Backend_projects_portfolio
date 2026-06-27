import Modal from "../../components/ui/Modal";
import ProductForm from "../../components/forms/ProductForm";
const ProductModal = ({ onClose, onSave }) => {
  return (
    <Modal
      title="Add Product"
      onClose={onClose}
    >
      <ProductForm onSubmit={onSave} />
    </Modal>
  );
};

export default ProductModal;