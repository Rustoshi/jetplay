'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
}

interface CategoryData {
  success: boolean;
  data: {
    category: Category;
    subcategories: Subcategory[];
  };
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<CategoryData['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchCategoryData(params.id as string);
    }
  }, [params.id]);

  const fetchCategoryData = async (categoryId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/category/${categoryId}/subcategories`);
      const result: CategoryData = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to load category data');
      }
    } catch (err) {
      setError('Error loading category data');
      console.error('Error fetching category:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading subcategories...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error || 'Category not found'}</p>
            <button 
              onClick={() => router.back()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">{data.category.name}</span>
          </div>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {data.category.name} Products
              </h1>
              <p className="text-gray-600">
                Browse all available account types in this category
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Subcategories</p>
              <p className="text-2xl font-bold text-primary">
                {data.subcategories.length}
              </p>
            </div>
          </div>
        </div>

        {/* Subcategories List */}
        {data.subcategories.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3">
              <h2 className="text-lg font-bold text-primary-foreground">
                Available Account Types
              </h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {data.subcategories.map((subcategory) => (
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
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">
              No subcategories available in this category at the moment.
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Other Categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
