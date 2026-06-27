import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import {useForm} from 'react-hook-form'

const ProductForm = ({onSubmit}) => {
  const {register, handleSubmit, reset} =useForm();


  const submitForm = (data)=>{
    onSubmit(data)
    reset()
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>

      <Input
        label="Product Name"
        placeholder="Enter product name"
        {...register('productName')}
      />

      <div className="grid gap-5 md:grid-cols-2">

        <Select label="Category" {...register('categoryName')}>
          <option>Food</option>
          <option>Electronics</option>
        </Select>

        <Select label="Supplier" {...register('supplierName')}>
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
          {...register('costPrice')}
        />

        <Input
          label="Selling Price"
          type="number"
          {...register('sellingPrice')}
        />

      </div>

      <div className="grid gap-5 md:grid-cols-2">

        <Input
          label="Stock Quantity"
          type="number"
          {...register('stockQuantity')}
        />

        {/* <Input
          label="Minimum Stock"
          type="number"
          {...register('minimumStock')}
        /> */}

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