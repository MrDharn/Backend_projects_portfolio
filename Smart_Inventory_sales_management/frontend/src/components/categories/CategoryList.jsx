import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../../services/categoryService';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '' });

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCat.name) return;
    try {
      await createCategory(newCat);
      setNewCat({ name: '', description: '' });
      setShowModal(false);
      loadCategories();
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await deleteCategory(id);
        loadCategories();
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Category Management</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Category</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td><strong>{cat.name}</strong></td>
              <td>{cat.description || 'N/A'}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(cat._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '400px' }}>
            <h3>Create Category</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <input 
                type="text" 
                placeholder="Category Name" 
                value={newCat.name} 
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} 
                required 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
              />
              <textarea 
                placeholder="Description" 
                value={newCat.description} 
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', minHeight: '80px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}