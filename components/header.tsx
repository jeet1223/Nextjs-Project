"use client";
import ThemeToggle from './ThemeToggle';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

const Header = () => {
  const router = useRouter();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    router.push('/admin-login');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 flex items-center justify-between px-8 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Admin Panel
      </h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button 
          onClick={handleLogout}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
