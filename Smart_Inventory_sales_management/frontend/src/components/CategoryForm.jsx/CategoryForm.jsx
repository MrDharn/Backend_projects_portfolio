import { useState } from "react";

import {
  createCategory,
  updateCategory,
} from "../../services/categoryService";

export default function CategoryForm({
  category,
  close,
  refresh,
}) {
  const [categoryName, setCategoryName] =
    useState(category?.categoryName || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (category) {
      await updateCategory(category._id, {
        categoryName,
      });
    } else {
      await createCategory({
        categoryName,
      });
    }

    refresh();
    close();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>
          {category
            ? "Edit Category"
            : "Create Category"}
        </h3>

        <input
          type="text"
          value={categoryName}
          onChange={(e) =>
            setCategoryName(e.target.value)
          }
          placeholder="Category Name"
        />

        <button type="submit">
          Save
        </button>

        <button
          type="button"
          onClick={close}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}