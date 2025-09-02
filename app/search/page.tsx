'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { Search, Package, ArrowLeft } from 'lucide-react';

interface Subcategory {
  _id: string;
  name: string;
  description: string;
  price: number;
  unsoldCount: number;
}

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

interface SearchResults {
  success: boolean;
  data: Category[];
  query: string;
  totalResults: number;
  error?: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const result: SearchResults = await response.json();
      
      if (result.success) {
        setSearchResults(result.data);
      } else {
        setError(result?.error || 'Search failed');
      }
    } catch (err) {
      setError('Error performing search');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getTotalResults = () => {
    return searchResults.reduce((total, category) => total + category.subcategories.length, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Searching...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/products"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Products
            </Link>
          </div>
          
          <div className="flex items-center space-x-3 mb-4">
            <Search className="h-6 w-6 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
          </div>
          
          {query && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <p className="text-gray-600">
                Search results for: <span className="font-semibold text-gray-900">"{query}"</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Found {getTotalResults()} result{getTotalResults() !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">Search Error</div>
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* No Query */}
        {!query && !loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No search query</h3>
            <p className="text-gray-600 mb-6">
              Please enter a search term to find logs.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* No Results */}
        {query && !error && searchResults.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any logs matching "{query}". Try different keywords or browse our categories.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-12">
            {searchResults.map((category) => (
              <div key={category._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {category.subcategories.length} result{category.subcategories.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory._id}
                        href={`/subcategory/${subcategory._id}`}
                        className="group block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200 hover:border-primary/30"
                      >
                        <div className="flex flex-col h-full">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
                            {subcategory.name}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
                            {subcategory.description}
                          </p>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-lg font-bold text-primary">
                              {formatCurrency(subcategory.price)}
                            </span>
                            
                            {subcategory.unsoldCount > 0 && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {subcategory.unsoldCount} available
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  );
}
