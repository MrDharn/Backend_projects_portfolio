import { useEffect, useState } from "react";

import {
  getSuppliers,
  deleteSupplier,
} from "../../services/supplierService";

import SupplierForm from "../../components/SupplierForm/SupplierForm";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const loadSuppliers = async () => {
    const res = await getSuppliers();
    setSuppliers(res.suppliers);
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this supplier?"
      );

    if (!confirmDelete) return;

    await deleteSupplier(id);

    loadSuppliers();
  };

  return (
    <div>
      <div>
        <h2>Suppliers</h2>

        <button
          onClick={() => {
            setSelectedSupplier(null);
            setShowForm(true);
          }}
        >
          Add Supplier
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td>{supplier.supplierName}</td>
              <td>{supplier.email}</td>
              <td>{supplier.phoneNumber}</td>
              <td>{supplier.address}</td>

              <td>
                <button
                  onClick={() => {
                    setSelectedSupplier(
                      supplier
                    );
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      supplier._id
                    )
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <SupplierForm
          supplier={selectedSupplier}
          close={() => setShowForm(false)}
          refresh={loadSuppliers}
        />
      )}
    </div>
  );
}