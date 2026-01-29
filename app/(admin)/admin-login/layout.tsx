"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 transition-colors">
          <main className="flex-1 p-8 text-gray-900 dark:text-gray-100">
               <ThemeProvider>
               <AuthProvider>
            {children}
               </AuthProvider>
               </ThemeProvider>
          </main>
      </body>
    </html>
  );
}
