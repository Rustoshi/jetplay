'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { 
  Eye,
  X,
  Package,
  ArrowLeft,
  Calendar,
  DollarSign
} from 'lucide-react';

interface UserLog {
  _id: string;
  logDetails: string;
  previewLink: string | null;
  price: number;
  purchaseDate: string;
  subcategory: {
    _id: string;
    name: string;
    logoUrl?: string;
  };
  category: {
    _id: string;
    name: string;
    logoUrl?: string;
  };
}

export default function MyLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<UserLog | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserLogs();
    } else if (status === 'unauthenticated') {
      router.push('/user/login');
    }
  }, [status, router]);

  const fetchUserLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/logs');
      const result = await response.json();
      
      if (result.success) {
        setUserLogs(result.data);
      } else {
        console.error('Failed to load user logs');
      }
    } catch (err) {
      console.error('Error loading user logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLog = (log: UserLog) => {
    setSelectedLog(log);
    setShowLogModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/user/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Logs</h1>
            <p className="text-gray-600 mt-2">
              View and manage your purchased account logs ({userLogs.length} total)
            </p>
          </div>
        </div>

        {/* Logs Content */}
        {userLogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No logs found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't purchased any logs yet. Browse our products to get started.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userLogs.map((log) => (
              <div
                key={log._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1">
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        {(log.category.logoUrl || log.subcategory.logoUrl) ? (
                          <Image
                            src={log.category.logoUrl || log.subcategory.logoUrl!}
                            alt={`${log.subcategory.name} logo`}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 text-lg">
                          {log.subcategory.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {log.category.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>Price:</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(log.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Purchased:</span>
                      </div>
                      <span className="text-gray-900">
                        {formatDate(log.purchaseDate)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewLog(log)}
                    className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Details Modal */}
      {showLogModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedLog.subcategory.name} - Account Details
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedLog.category.name} • Purchased on {formatDate(selectedLog.purchaseDate)} • {formatCurrency(selectedLog.price)}
                </p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Account Login Details:
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono leading-relaxed">
                      {selectedLog.logDetails}
                    </pre>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">Important Security Notice</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Keep this information secure and confidential. Do not share these login details with anyone. 
                        This account is now yours to use according to our terms of service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowLogModal(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
