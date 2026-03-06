'use client';

'use client';

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const isAuthPage = pathname?.startsWith('/auth') || pathname?.startsWith('/login') || pathname?.startsWith('/register');
  const isDashboardPage = pathname?.startsWith('/dashboard');
  const isEmbedPage = pathname?.startsWith('/embed');

  // Don't show navbar on auth or dashboard pages
  if (isAuthPage || isDashboardPage || isEmbedPage) {
    return null;
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-7 md:h-9 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                isActive('/about') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              About Us
            </Link>
            <Link
              href="/meet-your-surgeons"
              className={`text-sm font-medium transition-colors ${
                isActive('/meet-your-surgeons') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Meet Your Surgeons
            </Link>
            <Link
              href="/directory"
              className={`text-sm font-medium transition-colors ${
                isActive('/directory') ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Directory
            </Link>

            {/* Vertical Separator */}
            <div className="h-5 w-px bg-gray-300"></div>

            {user ? (
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-purple-600 focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4 space-y-3 animate-in slide-in-from-top">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/about') ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              About Us
            </Link>
            <Link
              href="/meet-your-surgeons"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/meet-your-surgeons') ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Meet Your Surgeons
            </Link>
            <Link
              href="/directory"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive('/directory') ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Directory
            </Link>
            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold text-center transition-all duration-200 shadow-md"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-semibold text-center transition-all duration-200 shadow-md"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
