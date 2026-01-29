"use client";

import { useEffect, useState, useCallback, useContext } from "react";
import Modal from "@/components/model";
import { capitalize, formatDate } from "@/app/utils/pipe";
import { addCategoryApi } from "@/app/services/apiService";
import { AuthContext } from "@/context/AuthContext";

interface Category {
  id: number;
  name: string;
  description:string;
  created_at: string;
}

const PAGE_SIZE = 10;

export default function CategoryPage() {
  const { fetchWithAuth, isLoggedIn } = useContext(AuthContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Check if user is logged in
  if (!isLoggedIn) {
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/admin-login';
    }
    return null; // Render nothing while redirecting
  }

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [name, setCategoryName] = useState("");
  const [description, setDescriptionName] = useState("");


  /* ---------- Debounce ---------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  /* ---------- Fetch ---------- */
  const fetchCategories = useCallback(async (page: number) => {
    try {
      const params = new URLSearchParams({ 
        page: page.toString(), 
        limit: PAGE_SIZE.toString() 
      });
      if (debouncedSearch) params.append("search", debouncedSearch);
      
      const data: any = await fetchWithAuth(`/api/admin/category?${params.toString()}`);
      console.log('Category API Response:', data); // Debug log
      // Check different possible response structures
      const categoriesData = data.category || data.categories || data.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Handle error appropriately
    }
  }, [debouncedSearch, fetchWithAuth]);

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage, debouncedSearch, fetchCategories]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  /* ---------- Add Category ---------- */
  const handleAddCategory = async () => {
    if (!name.trim()) return;

    await addCategoryApi(name,description);
    setCategoryName("");
    setDescriptionName("");
    setOpenModal(false);
    fetchCategories(1);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Category
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search category"
          className="px-4 py-2 border rounded w-64"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-gray-500 dark:text-gray-300 font-medium uppercase text-sm">S.NO</th>
              <th className="px-6 py-3 text-gray-500 dark:text-gray-300 font-medium uppercase text-sm">Name</th>
              <th className="px-6 py-3 text-gray-500 dark:text-gray-300 font-medium uppercase text-sm">Description</th>
              <th className="px-6 py-3 text-gray-500 dark:text-gray-300 font-medium uppercase text-sm">Created</th>
              <th className="px-6 py-3 text-gray-500 dark:text-gray-300 font-medium uppercase text-sm">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((cat, i) => (
              <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-3">
                  {(currentPage - 1) * PAGE_SIZE + i + 1}
                </td>
                <td className="px-6 py-3">{capitalize(cat.name)}</td>
                <td className="px-6 py-3">{capitalize(cat.description)}</td>
                <td className="px-6 py-3">{formatDate(cat.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

    {/* Popup */}
        <Modal
        title="Add Category"
        open={openModal}
        onClose={() => setOpenModal(false)}
        >
        <form
            onSubmit={(e) => {
            e.preventDefault();
            handleAddCategory();
            }}
            className="space-y-4"
        >
            {/* Category Name */}
            <input
            type="text"
            value={name}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Category name"
            required
            className="w-full border px-3 py-2 rounded"
            />

            {/* Description */}
            <textarea
            value={description}
            onChange={(e) => setDescriptionName(e.target.value)}
            placeholder="Description"
            rows={3}
            className="w-full border px-3 py-2 rounded"
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
            <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 border rounded"
            >
                Cancel
            </button>

            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Save
            </button>
            </div>
        </form>
        </Modal>

    </div>
  );
}
