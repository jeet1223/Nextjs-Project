'use client';

import Link from 'next/link';
import { useContext, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/cartContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { cartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/cart');
    } else {
      router.push('/cart');
    }
  };

  const navLinkClass = (path: string) =>
    pathname === path
      ? "text-yellow-400 dark:text-yellow-300 border-b-2 border-yellow-400 dark:border-yellow-300 pb-1 transition-colors"
      : "hover:text-yellow-300 dark:hover:text-yellow-200 transition-colors";

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (pathname !== '/') {
      // If not on home page, navigate to home first
      router.push('/');
      // Scroll to section after a small delay to ensure page loads
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If already on home page, scroll directly
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="w-full bg-gray-900 dark:bg-gray-950 text-white px-6 py-4 fixed top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold hover:text-yellow-300 transition-colors">
          New Krishna Ceramics
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="relative group">
            <Link href="#hero" onClick={(e) => scrollToSection(e, 'hero')} className={navLinkClass("/")}>Home</Link>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400 dark:bg-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>
          <Link href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-yellow-300 dark:hover:text-yellow-200 transition-colors">Features</Link>
          <Link href="#products" onClick={(e) => scrollToSection(e, 'products')} className="hover:text-yellow-300 dark:hover:text-yellow-200 transition-colors">Our Products</Link>
          <Link href="#cta" onClick={(e) => scrollToSection(e, 'cta')} className="hover:text-yellow-300 dark:hover:text-yellow-200 transition-colors">Contact Us</Link>
          <Link href="/product" className={navLinkClass("/product")}>Shop</Link>
          <Link href="/about" className={navLinkClass("/about")}>About</Link>

          <button onClick={handleCartClick} className="relative hover:text-yellow-300 dark:hover:text-yellow-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 dark:bg-red-500 text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <ThemeToggle />

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 dark:bg-red-700 px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-all transform hover:scale-105"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/signup"
                className="bg-blue-600 dark:bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-all transform hover:scale-105"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="bg-green-600 dark:bg-green-700 px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-all transform hover:scale-105"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-gray-800 dark:hover:bg-gray-900 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-gray-700 dark:border-gray-800 pt-4 animate-fade-in">
          <div className="flex flex-col space-y-3">
            <Link 
              href="#hero" 
              className={`px-4 py-2 rounded-lg ${pathname === '/' ? 'bg-gray-800 dark:bg-gray-900 text-yellow-400 dark:text-yellow-300' : 'hover:bg-gray-800 dark:hover:bg-gray-900'} transition-colors`}
              onClick={(e) => { scrollToSection(e, 'hero'); setMobileMenuOpen(false); }}
            >
              Home
            </Link>
            <Link 
              href="#features" 
              className={`px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors`}
              onClick={(e) => { scrollToSection(e, 'features'); setMobileMenuOpen(false); }}
            >
              Features
            </Link>
            <Link 
              href="#products" 
              className={`px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors`}
              onClick={(e) => { scrollToSection(e, 'products'); setMobileMenuOpen(false); }}
            >
              Our Products
            </Link>
            <Link 
              href="#cta" 
              className={`px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors`}
              onClick={(e) => { scrollToSection(e, 'cta'); setMobileMenuOpen(false); }}
            >
              Contact Us
            </Link>
            <Link 
              href="/product" 
              className={`px-4 py-2 rounded-lg ${pathname === '/product' ? 'bg-gray-800 dark:bg-gray-900 text-yellow-400 dark:text-yellow-300' : 'hover:bg-gray-800 dark:hover:bg-gray-900'} transition-colors`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/about" 
              className={`px-4 py-2 rounded-lg ${pathname === '/about' ? 'bg-gray-800 dark:bg-gray-900 text-yellow-400 dark:text-yellow-300' : 'hover:bg-gray-800 dark:hover:bg-gray-900'} transition-colors`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            
            <button 
              onClick={() => { handleCartClick(); setMobileMenuOpen(false); }} 
              className="px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors flex items-center justify-between"
            >
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-red-600 dark:bg-red-500 text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm">Theme</span>
              <ThemeToggle />
            </div>

            {isLoggedIn ? (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="mx-4 bg-red-600 dark:bg-red-700 px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/signup"
                  className="mx-4 bg-blue-600 dark:bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="mx-4 bg-green-600 dark:bg-green-700 px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
