'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, User, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isLoggedIn = session && session.user;

  return (
    <>
      {/* Header */}
      <header className="bg-background border-b border-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-primary">Jetplay</h1>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search logs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </form>
            </div>

            {/* Desktop Authentication */}
            <div className="hidden md:flex items-center space-x-4">
              {status === 'loading' ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : !isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/user/login"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/user/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              ) : null}
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-primary/80 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={toggleMobileMenu}
        />
        
        {/* Sidebar */}
        <div
          className={`absolute left-0 top-0 h-full w-80 bg-background shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-secondary">
            <h2 className="text-xl font-bold text-primary">Menu</h2>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-primary hover:bg-secondary"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="p-4">
            <div className="space-y-4">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-secondary transition-colors"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-secondary transition-colors"
                onClick={toggleMobileMenu}
              >
                About
              </Link>
              <Link
                href="/how-to-buy"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-secondary transition-colors"
                onClick={toggleMobileMenu}
              >
                How to buy logs
              </Link>
              <Link
                href="/fund-wallet"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-secondary transition-colors"
                onClick={toggleMobileMenu}
              >
                How to fund wallet
              </Link>
              
              {/* Mobile Authentication */}
              <div className="border-t border-secondary pt-4 mt-4">
                {status === 'loading' ? (
                  <div className="w-6 h-6 animate-pulse bg-gray-200 rounded-full mx-3"></div>
                ) : isLoggedIn ? (
                  /* Mobile logged in user options */
                  <>
                    <div className="px-3 py-2 text-sm text-gray-600">
                      Welcome, {session.user?.email?.split('@')[0] || 'User'}
                    </div>
                    <Link
                      href="/user/dashboard"
                      className="block px-3 py-2 rounded-md text-lg font-medium text-primary hover:bg-secondary transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/user/profile"
                      className="block px-3 py-2 rounded-md text-lg font-medium text-primary hover:bg-secondary transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        toggleMobileMenu();
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-md text-lg font-medium text-red-600 hover:bg-secondary transition-colors flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  /* Mobile not logged in - show login/register buttons */
                  !isLoggedIn && (
                    <>
                      <Link
                        href="/user/login"
                        className="block px-3 py-2 rounded-md text-lg font-medium text-primary hover:bg-secondary transition-colors"
                        onClick={toggleMobileMenu}
                      >
                        Login
                      </Link>
                      <Link
                        href="/user/register"
                        className="block px-3 py-2 rounded-md text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mt-2"
                        onClick={toggleMobileMenu}
                      >
                        Register
                      </Link>
                    </>
                  )
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
