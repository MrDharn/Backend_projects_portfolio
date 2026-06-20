import { useEffect, useState } from "react";

import {
  getCategories,
  deleteCategory,
} from "../../services/categoryService";

import CategoryForm from "../../components/CategoryForm/CategoryForm";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.categories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete category?")) return;

    await deleteCategory(id);

    loadCategories();
  };

  return (
    <div>
      <div>
        <h2>Categories</h2>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setShowForm(true);
          }}
        >
          Add Category
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.categoryName}</td>

              <td>
                <button
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(cat._id)
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
        <CategoryForm
          category={selectedCategory}
          close={() => setShowForm(false)}
          refresh={loadCategories}
        />
      )}
    </div>
  );
}