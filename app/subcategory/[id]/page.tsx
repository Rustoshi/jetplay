'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

interface Log {
  _id: string;
  previewLink: string | null;
  logoUrl?: string;
  price: number;
  createdAt: string;
}

interface Subcategory {
  _id: string;
  name: string;
  logoUrl?: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
}

interface SubcategoryData {
  success: boolean;
  data: {
    subcategory: Subcategory;
    logs: Log[];
  };
}

export default function SubcategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [data, setData] = useState<SubcategoryData['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchSubcategoryData(params.id as string);
    }
  }, [params.id]);

  const fetchSubcategoryData = async (subcategoryId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/subcategory/${subcategoryId}/logs`);
      const result: SubcategoryData = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to load subcategory data');
      }
    } catch (err) {
      setError('Error loading subcategory data');
      console.error('Error fetching subcategory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (log: Log) => {
    if (!session) {
      alert('Please login to purchase accounts');
      return;
    }
    setSelectedLog(log);
    setShowConfirmModal(true);
  };

  const confirmPurchase = async () => {
    if (!selectedLog) return;
    
    setPurchasing(true);
    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logId: selectedLog._id }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Purchase successful! Check your dashboard for account details.');
        // Refresh the data to remove the purchased log
        if (params.id) {
          fetchSubcategoryData(params.id as string);
        }
      } else {
        if (result.error === 'Insufficient funds') {
          alert(`Insufficient funds. Required: ₦${result.required?.toLocaleString()}, Available: ₦${result.available?.toLocaleString()}`);
        } else {
          alert(result.error || 'Purchase failed');
        }
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
      setShowConfirmModal(false);
      setSelectedLog(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading accounts...</span>
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
            <p className="text-red-600 mb-4">{error || 'Subcategory not found'}</p>
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
            <span className="text-gray-900">{data.subcategory.category.name}</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">{data.subcategory.name}</span>
          </div>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              {/* Subcategory Logo */}
              <div className="flex-shrink-0">
                {data.subcategory.logoUrl ? (
                  <Image
                    src={data.subcategory.logoUrl}
                    alt={`${data.subcategory.name} logo`}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-7 h-7 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {data.subcategory.name}
                </h1>
                <p className="text-gray-600 mb-2">
                  Category: {data.subcategory.category.name}
                </p>
                <p className="text-lg font-semibold text-primary">
                  Price: ₦{data.subcategory.price.toLocaleString()} each
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Available Accounts</p>
              <p className="text-2xl font-bold text-primary">
                {data.logs.length}
              </p>
            </div>
          </div>
        </div>

        {/* Logs List */}
        {data.logs.length > 0 ? (
          <div className="space-y-4">
            {data.logs.map((log, index) => (
              <div 
                key={log._id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1 flex items-start space-x-3">
                    {/* Log Logo */}
                    <div className="flex-shrink-0 mt-1">
                      {(log.logoUrl || data.subcategory.logoUrl) ? (
                        <Image
                          src={log.logoUrl || data.subcategory.logoUrl!}
                          alt={`${data.subcategory.name} logo`}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          Account #{index + 1}
                        </span>
                        <span className="text-sm text-gray-600">
                          {data.subcategory.name}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-lg font-bold text-primary">
                          ₦{data.subcategory.price.toLocaleString()}
                        </span>
                        {log.previewLink && (
                          <a 
                            href={log.previewLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            Preview Link
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleBuyNow(log)}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">
              No accounts available in this subcategory at the moment.
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Other Products
            </Link>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && selectedLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Confirm Purchase
              </h3>
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  You are about to purchase:
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-900">
                    {data?.subcategory.name}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    ₦{data?.subcategory.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedLog(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={purchasing}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  disabled={purchasing}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {purchasing ? 'Processing...' : 'Confirm Purchase'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
