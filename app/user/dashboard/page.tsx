'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  ExternalLink,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  CreditCard,
  Wallet,
  TrendingUp,
  Eye,
  X,
  Store,
  BookOpen
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
  };
  category: {
    _id: string;
    name: string;
  };
}

interface DashboardData {
  balance: number;
  spent: number;
  totalPurchase: number;
  transactions: Array<{
    _id: string;
    type: 'credit' | 'purchase';
    amount: number;
    createdAt: string;
  }>;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<UserLog | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData();
      fetchUserLogs();
    } else if (status === 'unauthenticated') {
      router.push('/user/login');
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/dashboard');
      const result = await response.json();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('Error loading dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLogs = async () => {
    try {
      setLogsLoading(true);
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
      setLogsLoading(false);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const quickLinks = [
    {
      title: 'Buy Logs',
      href: '/products',
      icon: Store,
      description: 'Browse and purchase social media accounts'
    },
    {
      title: 'My Logs',
      href: '/user/logs',
      icon: Package,
      description: 'View your purchased accounts'
    },
    {
      title: 'How to Fund Account',
      href: '/user/funding',
      icon: CreditCard,
      description: 'Learn how to add funds to your account'
    },
    {
      title: 'How to Buy Logs',
      href: '/user/guide',
      icon: BookOpen,
      description: 'Step-by-step guide to purchasing'
    },
    {
      title: 'Join Our WhatsApp Channel',
      href: 'https://whatsapp.com/channel/jetplay',
      icon: MessageCircle,
      description: 'Get updates and support',
      external: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {dashboardData.user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your Jetplay account
          </p>
        </div>

        {/* Stats Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Balance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(dashboardData.balance)}
                  </p>
                </div>
              </div>
              <Link
                href="/user/funding"
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Fund Wallet
              </Link>
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(dashboardData.spent)}
                </p>
              </div>
            </div>
          </div>

          {/* Total Purchased */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Purchased</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.totalPurchase}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-2">
                  <link.icon className="h-6 w-6 text-primary" />
                  {link.external && (
                    <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                  )}
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{link.title}</h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          
          {dashboardData.transactions.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">No transactions yet</p>
              <Link 
                href="/products"
                className="inline-flex items-center mt-4 text-primary hover:text-primary/80"
              >
                Start shopping <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {transaction.type === 'credit' ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600 mr-2" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-600 mr-2" />
                          )}
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {transaction.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* My Logs Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">My Logs</h2>
            <p className="text-sm text-gray-600">Your purchased account logs</p>
          </div>
          
          {logsLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading logs...</p>
            </div>
          ) : userLogs.length === 0 ? (
            <div className="p-6 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't purchased any logs yet</p>
              <Link 
                href="/products"
                className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchase Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.subcategory.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {log.category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₦{log.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.purchaseDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewLog(log)}
                          className="inline-flex items-center bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90 transition-colors text-sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Log
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Log Details Modal */}
      {showLogModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedLog.subcategory.name} - Log Details
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedLog.category.name} • Purchased on {formatDate(selectedLog.purchaseDate)}
                </p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Details:
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap font-mono">
                      {selectedLog.logDetails}
                    </pre>
                  </div>
                </div>
                
                {selectedLog.previewLink && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview Link:
                    </label>
                    <a 
                      href={selectedLog.previewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open Preview
                    </a>
                  </div>
                )}
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Important:</strong> Keep this information secure and do not share it with others. 
                    This account is now yours to use according to our terms of service.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowLogModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
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