'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

interface Subcategory {
  _id: string;
  name: string;
  price: number;
  unsoldCount: number;
}

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

interface ProductsData {
  success: boolean;
  data: Category[];
}

export default function ProductsPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [productsData, setProductsData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const bannerImages = [
    '/images/banners/slider_1.webp',
    '/images/banners/slider_2.webp'
  ];

  // Create infinite loop array: [last, ...original, first]
  const infiniteImages = [
    bannerImages[bannerImages.length - 1], // Clone of last image
    ...bannerImages,
    bannerImages[0] // Clone of first image
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const result: ProductsData = await response.json();
      
      if (result.success) {
        setProductsData(result.data);
      } else {
        setError('Failed to load products data');
      }
    } catch (err) {
      setError('Error loading products data');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };

  // Handle infinite loop transitions
  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      if (currentSlide >= infiniteImages.length - 1) {
        // Jump to first real slide without animation
        setCurrentSlide(1);
      } else if (currentSlide <= 0) {
        // Jump to last real slide without animation
        setCurrentSlide(bannerImages.length);
      }
      setIsTransitioning(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentSlide, isTransitioning, bannerImages.length, infiniteImages.length]);

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStartX.current === 0) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="bg-background">
      <Header />
      <Navbar />
      {/* Carousel */}
      <div 
        ref={carouselRef}
        className="relative w-full max-w-4xl mx-auto h-48 md:h-56 overflow-hidden cursor-grab active:cursor-grabbing rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Carousel Container */}
        <div 
          className={`flex w-full h-full ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
          style={{
            transform: `translateX(-${currentSlide * 100}%)`
          }}
        >
          {infiniteImages.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <Image
                src={image}
                alt={`Banner ${((index - 1 + bannerImages.length) % bannerImages.length) + 1}`}
                fill
                className="object-contain"
                priority={index === 1}
                quality={90}
              />
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {bannerImages.map((_, index) => {
            const isActive = (currentSlide - 1 + bannerImages.length) % bannerImages.length === index;
            return (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentSlide(index + 1); // +1 because we start at index 1
                  }
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
          <div 
            className="h-full bg-white transition-all duration-4000 ease-linear"
            style={{
              width: `${(((currentSlide - 1 + bannerImages.length) % bannerImages.length) + 1) / bannerImages.length * 100}%`
            }}
          />
        </div>
      </div>

      {/* Disclaimer Section */}
      <section className="py-4 bg-red-50 border-l-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-red-200">
            <h2 className="text-lg font-bold text-red-600 mb-2 uppercase tracking-wide">
              DISCLAIMER
            </h2>
            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
              We do not teach how to use accounts, and we do not unlock accounts; we only sell to experts. It is strictly forbidden to use our products to harm other people, engage in bullying on social networks, comment spam, threats, etc., or to commit other illegal actions – such as fraud, extortion, data theft, etc. We will not be held responsible for any issues that may arise from customers' misuse. Test a few accounts before buying in bulk. All users are eligible for replacements of faulty accounts 24hours after purchase, Terms and conditions apply;
            </p>
          </div>
        </div>
      </section>

      {/* Tutorial Blocks Section */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* How to Buy Account Logs */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    How to Buy Account Logs
                  </h3>
                  <p className="text-blue-100 text-xs">
                    Watch our step-by-step tutorial
                  </p>
                </div>
                <div className="ml-3 text-white group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-6V7a2 2 0 00-2-2H5a2 2 0 00-2 2v3m2 4v1a2 2 0 002 2h14a2 2 0 002-2v-1M9 7h6" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center text-white font-semibold text-sm">
                  Click Here to Watch
                  <svg className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>

            {/* How to Fund Your Wallet */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    How to Fund Your Wallet
                  </h3>
                  <p className="text-green-100 text-xs">
                    Learn about payment methods
                  </p>
                </div>
                <div className="ml-3 text-white group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center text-white font-semibold text-sm">
                  Click Here to Watch
                  <svg className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Reporting Section */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-primary mb-4 uppercase tracking-wide text-center">
              STEPS ON HOW TO REPORT A PROBLEM
            </h2>
            
            {/* Steps List */}
            <div className="mb-4">
              <ol className="space-y-2">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs mr-3">
                    1
                  </span>
                  <p className="text-gray-700 text-sm">
                    Send the login details and transaction ID.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs mr-3">
                    2
                  </span>
                  <p className="text-gray-700 text-sm">
                    Provide video evidence or screenshots of the problem.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs mr-3">
                    3
                  </span>
                  <p className="text-gray-700 text-sm">
                    Describe the issue to the admin.
                  </p>
                </li>
              </ol>
            </div>

            {/* Contact Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Telegram Support */}
              <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <div className="flex items-center justify-center">
                  <div className="text-white mr-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.58 7.44c-.12.54-.43.67-.87.42l-2.4-1.77-1.16.89c-.13.13-.24.24-.49.24l.17-2.43 4.33-3.91c.19-.17-.04-.26-.29-.1l-5.35 3.37-2.3-.72c-.5-.16-.51-.5.1-.74l8.95-3.45c.42-.16.79.1.65.74z"/>
                    </svg>
                  </div>
                  <span className="text-white font-semibold text-center text-sm">
                    Contact Telegram support admin
                  </span>
                </div>
              </div>

              {/* WhatsApp Channel */}
              <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                <div className="flex items-center justify-center">
                  <div className="text-white mr-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <span className="text-white font-semibold text-center text-xs">
                    Join WhatsApp channel for updates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Categories Section */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600">Loading products...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchProductsData}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {productsData.map((category) => (
                <div key={category._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Category Header */}
                  <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3">
                    <h2 className="text-lg font-bold text-primary-foreground">
                      {category.name}
                    </h2>
                  </div>
                  
                  {/* Subcategories */}
                  <div className="p-4">
                    {category.subcategories.length > 0 ? (
                      <>
                        <div className="space-y-3 mb-4">
                          {category.subcategories.map((subcategory) => (
                            <div 
                              key={subcategory._id} 
                              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-base mb-2">
                                    {subcategory.name}
                                  </h3>
                                  <div className="flex items-center space-x-4 text-sm">
                                    <span className="text-lg font-bold text-primary">
                                      ₦{subcategory.price.toLocaleString()}
                                    </span>
                                    <span className="text-gray-600">
                                      • {subcategory.unsoldCount} available
                                    </span>
                                  </div>
                                </div>
                                <Link 
                                  href={`/subcategory/${subcategory._id}`}
                                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium inline-block"
                                >
                                  View Accounts
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* View All Button */}
                        <div className="text-center">
                          <Link 
                            href={`/products/category/${category._id}`}
                            className="inline-flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                          >
                            View All {category.name} Products
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-sm">
                        No products available in this category yet.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
