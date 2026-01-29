"use client";

import { capitalize, formatDate } from "@/app/utils/pipe";
import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";

interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  created_at: string;
}

const PAGE_SIZE = 10;

export default function UsersPage() {
  const { fetchWithAuth, isLoggedIn } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [fromDate, setFromDate] = useState(""); // YYYY-MM-DD
  const [toDate, setToDate] = useState("");     // YYYY-MM-DD

  // Check if user is logged in
  if (!isLoggedIn) {
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/admin-login';
    }
    return null; // Render nothing while redirecting
  }

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // reset page when search changes
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchUsers = useCallback(async (page: number) => {
    try {
      const params = new URLSearchParams({ 
        page: page.toString(), 
        limit: PAGE_SIZE.toString() 
      });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (fromDate) params.append("from", fromDate);
      if (toDate) params.append("to", toDate);
      
      const data: any = await fetchWithAuth(`/api/admin/userList?${params.toString()}`);
      console.log('API Response:', data); // Debug log
      setUsers(data.users || []);
      setTotalUsers(data.pagination?.total || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setTotalUsers(0);
    }
  }, [debouncedSearch, fromDate, toDate, fetchWithAuth]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, debouncedSearch, fromDate, toDate, fetchUsers]);

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  const handleApply = () => {
    setCurrentPage(1);
    fetchUsers(1);
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setSearchTerm("");
    setCurrentPage(1);
    fetchUsers(1);
  };

  return (
    <div className="p-8">
      {/* Page Heading */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by name, email, or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded w-64"
          />
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-4 py-2 border rounded"
          />
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-gray-500 dark:text-gray-300 font-medium uppercase text-sm">S.NO</th>
                <th className="px-6 py-3 text-gray-500 dark:text-gray-300 font-medium uppercase text-sm">Full Name</th>
                <th className="px-6 py-3 text-gray-500 dark:text-gray-300 font-medium uppercase text-sm">Email</th>
                <th className="px-6 py-3 text-gray-500 dark:text-gray-300 font-medium uppercase text-sm">Phone</th>
                <th className="px-6 py-3 text-gray-500 dark:text-gray-300 font-medium uppercase text-sm">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user, i) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">{(currentPage - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="px-6 py-4">{capitalize(user.name)}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone_number}</td>
                  <td className="px-6 py-4">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
    </div>
  );
}
