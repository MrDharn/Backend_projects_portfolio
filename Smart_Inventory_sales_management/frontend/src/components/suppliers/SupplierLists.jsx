import React, { useState, useEffect } from 'react';
import { getSuppliers, createSupplier, deleteSupplier } from '../../services/supplierServices';

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  const loadSuppliers = async () => {
    try {
      const res = await getSuppliers();
      setSuppliers(res.data || []);
    } catch (err) {
      console.error('Failed to load suppliers:', err);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSupplier(formData);
      setFormData({ name: '', email: '', phone: '', address: '' });
      loadSuppliers();
    } catch (err) {
      console.error('Failed to create supplier:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove supplier?')) {
      try {
        await deleteSupplier(id);
        loadSuppliers();
      } catch (err) {
        console.error('Failed to delete supplier:', err);
      }
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
      <div className="card">
        <h3>Add Supplier</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <input 
            type="text" 
            placeholder="Company/Supplier Name" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
          <input 
            type="email" 
            placeholder="Contact Email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
          <input 
            type="text" 
            placeholder="Phone Number" 
            value={formData.phone} 
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
          <textarea 
            placeholder="Address" 
            value={formData.address} 
            onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>Save Supplier</button>
        </form>
      </div>

      <div className="card">
        <h3>Suppliers Directory</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((sup) => (
              <tr key={sup._id}>
                <td><strong>{sup.name}</strong></td>
                <td>
                  <div>{sup.email}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sup.phone}</div>
                </td>
                <td>{sup.address || 'N/A'}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDelete(sup._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}