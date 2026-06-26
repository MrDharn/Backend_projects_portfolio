import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";
const ProductForm = () => {
  return (
    <form className="space-y-5">

      <Input
        label="Product Name"
        placeholder="Enter product name"
      />

      <div className="grid gap-5 md:grid-cols-2">

        <Select label="Category">
          <option>Food</option>
          <option>Electronics</option>
        </Select>

        <Select label="Supplier">
          <option>ABC Supplier</option>
        </Select>

      </div>

      {/* <div className="grid gap-5 md:grid-cols-2">

        <Input
          label="SKU"
          placeholder="SKU"
        />

        <Input
          label="Barcode"
          placeholder="Barcode"
        />

      </div> */}

      <div className="grid gap-5 md:grid-cols-2">

        <Input
          label="Cost Price"
          type="number"
        />

        <Input
          label="Selling Price"
          type="number"
        />

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        <Input
          label="Stock Quantity"
          type="number"
        />

        <Input
          label="Minimum Stock"
          type="number"
        />

      </div>
{/* 
      <Input
        label="Product Image"
        type="file"
      /> */}

      <Textarea
        label="Description"
      />

      <div className="flex justify-end gap-3">

        <Button variant="secondary">
          Cancel
        </Button>

        <Button type="submit">
          Save Product
        </Button>

      </div>

    </form>
  );
};

export default ProductForm;