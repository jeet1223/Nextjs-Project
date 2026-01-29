"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTachometerAlt,
  FaLink,
} from "react-icons/fa";

const Sidebar = ({
  onToggle,
}: {
  onToggle: (open: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    onToggle(!isOpen);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen transition-all duration-300
      ${isOpen ? "w-64" : "w-20"}
      bg-gray-900 dark:bg-gray-950 text-white shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-600">
        {isOpen && <span className="text-xl font-bold">My App</span>}

        <button onClick={toggleSidebar} className="text-lg hover:text-yellow-300 transition-colors">
          <FaBars />
        </button>
      </div>

      {/* Menu */}
      <ul className="mt-4 space-y-1">
        <SidebarItem href="/admin" icon={<FaTachometerAlt />} label="Dashboard" isOpen={isOpen} />
        <SidebarItem href="/admin/userManagement" icon={<FaLink />} label="User" isOpen={isOpen} />
        <SidebarItem href="/admin/categoryManagement" icon={<FaTachometerAlt />} label="Category" isOpen={isOpen} />
        <SidebarItem href="/admin/itemManagement" icon={<FaLink />} label="Item" isOpen={isOpen} />
        <SidebarItem href="/admin/crm" icon={<FaLink />} label="CRM" isOpen={isOpen} />

      </ul>
    </aside>
  );
};

export default Sidebar;

/* ---------- Sidebar Item ---------- */
const SidebarItem = ({
  href,
  icon,
  label,
  isOpen,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}) => (
  <li>
    <Link
      href={href}
      className={`flex items-center gap-4 px-4 py-3 rounded
      hover:bg-gray-700 dark:hover:bg-gray-800 transition-all
      ${isOpen ? "justify-start" : "justify-center"}`}
    >
      <span className="text-lg">{icon}</span>
      {isOpen && <span>{label}</span>}
    </Link>
  </li>
);
