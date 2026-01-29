"use client"
import { useEffect, useState, useCallback, useContext } from "react";
import Modal from "@/components/model";
import { capitalize, formatDate } from "@/app/utils/pipe";
import {
  addItemApi,
  adminItemList,
  updateItemApi,
  deleteItemApi,
} from "@/app/services/apiService";
import { AuthContext } from "@/context/AuthContext";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  categoryName: string;
  categoryId: number;
  created_at: string;
  images?: string[];
  color?: string;
  tag?: string;
  stock?: boolean;
  quantityName?: string;
  limitedItem?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

const PAGE_SIZE = 10;

export default function ItemPage() {
  const { fetchWithAuth, isLoggedIn } = useContext(AuthContext);
  const [items, setItems] = useState<Item[]>([]);
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
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [tag, setTag] = useState("");
  const [stock, setStock] = useState(true);
  const [limitedItem, setLimitedItem] = useState("");
  const [quantityName, setQuantityName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [discountPrice, setDiscount] = useState<number | "">("");
  const [images, setImages] = useState<File[]>([]);
 const [categoryId, setCategoryId] = useState<string>("");
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Debounce Search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch Items
  const fetchItems = useCallback(async (page: number) => {
    try {
      const params = new URLSearchParams({ 
        page: page.toString(), 
        limit: PAGE_SIZE.toString() 
      });
      if (debouncedSearch) params.append("search", debouncedSearch);
      
      const data: any = await fetchWithAuth(`/api/admin/item?${params.toString()}`);
      console.log('Item API Response:', data); // Debug log
      setItems(data.items || []);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
      setTotal(0);
    }
  }, [debouncedSearch, fetchWithAuth]);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const data: any = await fetchWithAuth('/api/admin/category');
      // Check different possible response structures
      const categoriesData = data.category || data.categories || data.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  }, [fetchWithAuth]);

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage, debouncedSearch, fetchItems]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  };

  // Open Modal for Add/Edit
  const openAddEditModal = (item?: Item) => {
    if (item) {
      // Edit mode
      setEditingItem(item);
      setName(item.name);
      setDescription(item.description);
      setPrice(item.price);
      setDiscount(item.discountPrice);
      setCategoryId(String(item.categoryId));
      setColor(item.color || "");
      setTag(item.tag || "");
      setStock(item.stock || true);
      setQuantityName(item.quantityName || "");
      setLimitedItem(item.limitedItem || "");
      setExistingImages(item.images ?? []);
      setImages([]);
    } else {
      // Add mode
      setEditingItem(null);
      setName("");
      setDescription("");
      setPrice("");
      setDiscount("");
      setCategoryId("");
      setExistingImages([]);
      setImages([]);
      setStock(false); // Reset stock input
    }
    setOpenModal(true);
  };

  // Add / Update Item
  const handleSaveItem = async () => {
    if (!name.trim() || !categoryId || !price) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", name);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("color", String(color));
    formData.append("limitedItem", limitedItem);
    formData.append("tag", tag);
    formData.append("quantityName", quantityName);
    formData.append("discountPrice", String(discountPrice || 0));
    formData.append("in_stock", String(stock));
    formData.append("categoryId", String(Number(categoryId)));

    images.forEach((img) => formData.append("images", img));

    if (editingItem) {
      await updateItemApi(editingItem.id, formData);
    } else {
      await addItemApi(formData);
    }

    setOpenModal(false);
    fetchItems(currentPage);
  };

  // Delete Item
  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await deleteItemApi(id);
    fetchItems(currentPage);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Item Management</h1>
        <button
          onClick={() => openAddEditModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Item
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search item"
          className="px-4 py-2 border rounded w-64"
        />
      </div>

      {/* Table */}
     <div className="bg-white shadow rounded-lg overflow-hidden">
  <div className="max-h-96 overflow-y-auto">
    <table className="w-full table-fixed border-collapse">
      <thead className="bg-gray-100 sticky top-0 z-10">
        <tr>
          <th className="px-6 py-3 w-16">S.No</th>
          <th className="px-6 py-3 w-32">Name</th>
          <th className="px-6 py-3 w-40">Category</th>
          <th className="px-6 py-3 w-48">Description</th>
          <th className="px-6 py-3 w-24">Price</th>
          <th className="px-6 py-3 w-28">Discount</th>
          <th className="px-6 py-3 w-24">In Stock</th>
          <th className="px-6 py-3 w-24">Tag</th>
          <th className="px-6 py-3 w-24">Color</th>
          <th className="px-6 py-3 w-36">Quantity Detail</th>
          <th className="px-6 py-3 w-36">Quantity Count</th>
          <th className="px-6 py-3 w-40">Image</th>
          <th className="px-6 py-3 w-36">Created</th>
          <th className="px-6 py-3 w-32">Actions</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item, i) => (
          <tr key={item.id} className="border-t">
            <td className="px-6 py-3">
              {(currentPage - 1) * PAGE_SIZE + i + 1}
            </td>
            <td className="px-6 py-3 truncate">{capitalize(item.name)}</td>
            <td className="px-6 py-3 truncate">{capitalize(item.categoryName)}</td>
            <td className="px-6 py-3 truncate">{item.description}</td>
            <td className="px-6 py-3">{item.price}</td>
            <td className="px-6 py-3">{item.discountPrice}%</td>
            <td className="px-6 py-3">{item.stock ? "Yes" : "No"}</td>
            <td className="px-6 py-3">{item.tag}</td>
            <td className="px-6 py-3">{item.color}</td>
            <td className="px-6 py-3">{item.quantityName}</td>
            <td className="px-6 py-3">{item.limitedItem}</td>

            <td className="px-6 py-3">
              <div className="flex gap-1">
                {item.images && item.images.length > 0 ? (
                  item.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img || '/placeholder.svg'}
                      className="h-10 w-10 rounded object-cover"
                      alt={`Item ${item.id} image ${idx}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.png';
                      }}
                    />
                  ))
                ) : (
                  <img
                    src="/placeholder.svg"
                    className="h-10 w-10 rounded object-cover"
                    alt="Placeholder"
                    width="40"
                    height="40"
                  />
                )}
              </div>
            </td>

            <td className="px-6 py-3">{formatDate(item.created_at)}</td>

            <td className="px-6 py-3 flex gap-2">
              <button className="px-2 py-1 bg-yellow-500 text-white rounded" onClick={() => openAddEditModal(item)}>
                Edit
              </button>
              <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => handleDeleteItem(item.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


      {/* Add / Edit Modal */}
      <Modal
        title={editingItem ? "Edit Item" : "Add Item"}
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveItem();
          }}
          className="space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Category Select */}
           <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {capitalize(cat.name)}
              </option>
            ))}
          </select>

          {/* Item Name */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name"
            className="w-full border px-3 py-2 rounded"
          />

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
          />

          {/* Price */}
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Price"
            className="w-full border px-3 py-2 rounded"
          />

          {/* Discount Price */}
          <input
            type="number"
            value={discountPrice}
            onChange={(e) => setDiscount(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Discount (%)"
            className="w-full border px-3 py-2 rounded"
          />

          {/* Color */}
          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Color"
            className="w-full border px-3 py-2 rounded"
          />

          {/* Tag */}
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag"
            className="w-full border px-3 py-2 rounded"
          />

          {/* Stock */}
          <div className="flex items-center gap-2">
            <label htmlFor="stock" className="text-lg">In Stock:</label>
            <input
              id="stock"
              type="checkbox"
              checked={stock === true} // If stock is true, checkbox will be checked
              onChange={(e) => setStock(e.target.checked)} // Update stock to true/false
              className="h-5 w-5"
            />
          </div>

          {/* Limited Item */}
          <input
            value={limitedItem}
            onChange={(e) => setLimitedItem(e.target.value)}
            placeholder="Limited Item"
            className="w-full border px-3 py-2 rounded"
          />

          {/* Quantity Name */}
          <input
            value={quantityName}
            onChange={(e) => setQuantityName(e.target.value)}
            placeholder="Quantity Name (e.g., kg, units)"
            className="w-full border px-3 py-2 rounded"
          />

          {/* Image Upload */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border px-3 py-2 rounded"
          />

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  className="h-16 w-16 object-cover rounded"
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
