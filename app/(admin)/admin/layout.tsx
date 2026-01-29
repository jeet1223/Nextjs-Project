"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar";
import Header from "../../../components/header";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider>
          <AuthProvider>
            <Sidebar onToggle={setSidebarOpen} />

            <div
              className="flex flex-col min-h-screen transition-all duration-300"
              style={{ marginLeft: sidebarOpen ? 256 : 80 }}
            >
              <Header />
              <main className="flex-1 p-8">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
