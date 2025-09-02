'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { ChevronDown, Search, User, LogOut } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/categories');
      const result = await response.json();
      
      if (result.success) {
        setCategories(result.data.categories);
      } else {
        console.error('Failed to load categories');
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isLoggedIn = session && session.user;

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'How to fund wallet', href: '/user/funding' },
  ];

  return (
    <nav 
    className="bg-background border-b border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between h-12">
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="flex items-center space-x-2 px-4 py-2 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/80 rounded-md transition-colors"
            >
              <span>Categories</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Categories Dropdown Menu */}
            {isCategoriesOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-primary rounded-md shadow-lg border border-primary/20 z-50">
                <div className="py-1">
                  {categoriesLoading ? (
                    <div className="px-4 py-2 text-primary-foreground">
                      <div className="animate-pulse">Loading categories...</div>
                    </div>
                  ) : (
                    <>
                      <Link
                        href="/products"
                        className="block px-4 py-2 text-base text-primary-foreground hover:bg-primary/80 transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        All Categories
                      </Link>
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/products/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-base text-primary-foreground hover:bg-primary/80 transition-colors"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Menu Links */}
          <div className="flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-base font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Authentication Section */}
            <div className="flex items-center space-x-4">
              {status === 'loading' ? (
                <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
              ) : isLoggedIn ? (
                /* Logged in user menu */
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>{session.user?.email?.split('@')[0] || 'User'}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* User dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <Link
                          href="/user/dashboard"
                          className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/user/profile"
                          className="block px-4 py-2 text-base text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-base text-red-600 hover:bg-gray-100 transition-colors flex items-center"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Not logged in - show login/register buttons */
                <div className="flex items-center space-x-3">
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between h-12">
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="flex items-center space-x-2 px-3 py-2 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/80 rounded-md transition-colors"
            >
              <span>Categories</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Mobile Categories Dropdown Menu */}
            {isCategoriesOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-primary rounded-md shadow-lg border border-primary/20 z-50">
                <div className="py-1">
                  {categoriesLoading ? (
                    <div className="px-4 py-2 text-primary-foreground">
                      <div className="animate-pulse">Loading...</div>
                    </div>
                  ) : (
                    <>
                      <Link
                        href="/products"
                        className="block px-4 py-2 text-base text-primary-foreground hover:bg-primary/80 transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        All Categories
                      </Link>
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/products/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-base text-primary-foreground hover:bg-primary/80 transition-colors"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Authentication */}
          <div className="flex items-center space-x-2">
            {status === 'loading' ? (
              <div className="w-6 h-6 animate-pulse bg-gray-200 rounded-full"></div>
            ) : isLoggedIn ? (
              /* Mobile logged in user menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 px-2 py-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Mobile user dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <Link
                        href="/user/dashboard"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/user/profile"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors flex items-center"
                      >
                        <LogOut className="h-3 w-3 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Mobile not logged in - show login/register buttons */
              <div className="flex items-center space-x-2">
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
