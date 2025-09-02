'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaInstagram, 
  FaFacebook, 
  FaFacebookF,
  FaTwitter, 
  FaYoutube, 
  FaTiktok, 
  FaLinkedin,
  FaLinkedinIn, 
  FaSnapchatGhost,
  FaTelegramPlane,
  FaWhatsapp,
  FaDiscord
} from 'react-icons/fa';

interface Category {
  _id: string;
  name: string;
}

export default function HeroSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const leftIcons = [
    { Icon: FaInstagram, color: 'text-pink-500', delay: '0s' },
    { Icon: FaTiktok, color: 'text-black', delay: '0.5s' },
    { Icon: FaFacebookF, color: 'text-blue-600', delay: '1s' },
    { Icon: FaSnapchatGhost, color: 'text-yellow-400', delay: '1.5s' },
    { Icon: FaYoutube, color: 'text-red-600', delay: '2s' },
  ];

  const rightIcons = [
    { Icon: FaTwitter, color: 'text-blue-400', delay: '0.2s' },
    { Icon: FaLinkedinIn, color: 'text-blue-700', delay: '0.7s' },
    { Icon: FaTelegramPlane, color: 'text-blue-500', delay: '1.2s' },
    { Icon: FaWhatsapp, color: 'text-green-500', delay: '1.7s' },
    { Icon: FaDiscord, color: 'text-indigo-600', delay: '2.2s' },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      const result = await response.json();

      if (response.ok && result.success) {
        setCategories(result.data.categories);
      } else {
        console.error('Failed to fetch categories:', result.error);
        // Fallback to hardcoded categories if API fails
        setCategories([
          { _id: '1', name: 'Instagram' },
          { _id: '2', name: 'TikTok' },
          { _id: '3', name: 'Facebook' },
          { _id: '4', name: 'Twitter / X' },
          { _id: '5', name: 'YouTube' },
          { _id: '6', name: 'Other Socials' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to hardcoded categories if API fails
      setCategories([
        { _id: '1', name: 'Instagram' },
        { _id: '2', name: 'TikTok' },
        { _id: '3', name: 'Facebook' },
        { _id: '4', name: 'Twitter / X' },
        { _id: '5', name: 'YouTube' },
        { _id: '6', name: 'Other Socials' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background to-secondary overflow-hidden">
      {/* Left Social Icons */}
      <div className="absolute left-4 md:left-8 lg:left-16 top-1/2 transform -translate-y-1/2 hidden sm:flex flex-col space-y-6 md:space-y-8">
        {leftIcons.map(({ Icon, color, delay }, index) => (
          <div
            key={index}
            className={`${color} text-2xl md:text-3xl lg:text-4xl animate-bounce`}
            style={{
              animationDelay: delay,
              animationDuration: '3s',
              animationIterationCount: 'infinite'
            }}
          >
            <Icon />
          </div>
        ))}
      </div>

      {/* Right Social Icons */}
      <div className="absolute right-4 md:right-8 lg:right-16 top-1/2 transform -translate-y-1/2 hidden sm:flex flex-col space-y-6 md:space-y-8">
        {rightIcons.map(({ Icon, color, delay }, index) => (
          <div
            key={index}
            className={`${color} text-2xl md:text-3xl lg:text-4xl animate-bounce`}
            style={{
              animationDelay: delay,
              animationDuration: '3s',
              animationIterationCount: 'infinite'
            }}
          >
            <Icon />
          </div>
        ))}
      </div>


      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
          Buy Social Media Accounts At{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
            Affordable Rates
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          Jetplay is a secure marketplace where you can buy and sell verified social media accounts with confidence.
        </p>

        {/* Categories */}
        <div className="mb-10">
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-primary/70">Loading categories...</span>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-sm sm:text-base md:text-lg text-primary/70">
              {categories.map((category, index) => (
                <span key={category._id} className="flex items-center">
                  <Link 
                    href={`/products/category/${category._id}`}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    {category.name}
                  </Link>
                  {index < categories.length - 1 && (
                    <span className="ml-2 sm:ml-4 text-primary/40">|</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/products" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block text-center">
            Explore Logs
          </Link>
          <button className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105">
            Login
          </button>
        </div>
      </div>
    </section>
  );
}
