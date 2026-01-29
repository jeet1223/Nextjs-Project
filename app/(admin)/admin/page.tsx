"use client";

import { FaUsers, FaBoxOpen, FaShoppingCart } from "react-icons/fa";
import { useContext, useEffect, useState, ReactNode } from "react";
import { AuthContext } from "@/context/AuthContext";

interface Stats {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
}

export default function Dashboard() {
  const { fetchWithAuth, isLoggedIn } = useContext(AuthContext);
  const [stats, setStats] = useState<Stats[]>([
    {
      title: "Users Registered",
      value: "--",
      icon: <FaUsers />, 
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Products Added",
      value: "--",
      icon: <FaBoxOpen />,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Orders Received",
      value: "--",
      icon: <FaShoppingCart />,
      gradient: "from-purple-500 to-purple-600",
    },
  ]);
  
  // Check if user is logged in
  if (!isLoggedIn) {
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/admin-login';
    }
    return null; // Render nothing while redirecting
  }

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch user count
        const userRes: any = await fetchWithAuth('/api/admin/userList?page=1&limit=1');
        
        // Fetch product count
        const productRes: any = await fetchWithAuth('/api/admin/item?page=1&limit=1');
        
        // For orders, we'll use a placeholder API or calculate from orders table
        // For now, using a placeholder
        const orderRes = { pagination: { total: 0 } };
        
        setStats([
          {
            title: "Users Registered",
            value: userRes.pagination?.total?.toLocaleString() || "0",
            icon: <FaUsers />, 
            gradient: "from-blue-500 to-blue-600",
          },
          {
            title: "Products Added",
            value: productRes.pagination?.total?.toLocaleString() || "0",
            icon: <FaBoxOpen />,
            gradient: "from-green-500 to-green-600",
          },
          {
            title: "Orders Received",
            value: orderRes.pagination?.total?.toLocaleString() || "0",
            icon: <FaShoppingCart />,
            gradient: "from-purple-500 to-purple-600",
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Keep the placeholder values if there's an error
      }
    };
    
    fetchDashboardStats();
  }, [fetchWithAuth]);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
        Welcome to the Admin Dashboard
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${item.gradient}
            text-white p-6 rounded-xl shadow-lg
            hover:scale-105 transition-transform duration-300
            dark:brightness-90`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase opacity-80">
                  {item.title}
                </p>
                <h3 className="text-3xl font-bold mt-2">
                  {item.value}
                </h3>
              </div>
              <span className="text-4xl opacity-80">
                {item.icon}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
