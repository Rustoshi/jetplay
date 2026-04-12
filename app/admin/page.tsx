'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Users, FileText, CreditCard, TrendingUp, FolderOpen, Tag, List, Receipt, DollarSign, Settings } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalLogs: number;
  totalTransactions: number;
}



interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  balance: number;
  spent: number;
  createdAt: string;
}

interface Log {
  _id: string;
  user: User;
  category: { name: string };
  subCategory: { name: string };
  price: number;
  createdAt: string;
}

interface AdminData {
  stats: AdminStats;
  users: User[];
  logs: Log[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      redirect('/auth/signin');
      return;
    }

    fetchAdminData();
  }, [session, status]);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch admin data');
      }

      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your Jetplay platform</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {data?.stats.totalUsers.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Registered users</span>
            </div>
          </div>

          {/* Total Logs */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Total Logs
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {data?.stats.totalLogs.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Social media accounts</span>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Total Transactions
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {data?.stats.totalTransactions.toLocaleString() || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Completed transactions</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
          {/* Fund User Link */}
          <a
            href="/admin/fund-user"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-3 rounded-full mb-3 group-hover:bg-orange-200 transition-colors">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Fund User</h4>
              <p className="text-xs text-gray-500 mt-1">Add user credits</p>
            </div>
          </a>

          {/* Users Link */}
          <a
            href="/admin/users"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3 group-hover:bg-blue-200 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Users</h4>
              <p className="text-xs text-gray-500 mt-1">Manage users</p>
            </div>
          </a>

          {/* Categories Link */}
          <a
            href="/admin/categories"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-3 group-hover:bg-green-200 transition-colors">
                <FolderOpen className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Categories</h4>
              <p className="text-xs text-gray-500 mt-1">Manage categories</p>
            </div>
          </a>

          {/* Sub Categories Link */}
          <a
            href="/admin/subcategories"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-yellow-100 p-3 rounded-full mb-3 group-hover:bg-yellow-200 transition-colors">
                <Tag className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Sub Categories</h4>
              <p className="text-xs text-gray-500 mt-1">Manage subcategories</p>
            </div>
          </a>

          {/* Logs Link */}
          <a
            href="/admin/logs"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-3 rounded-full mb-3 group-hover:bg-purple-200 transition-colors">
                <List className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Logs</h4>
              <p className="text-xs text-gray-500 mt-1">Manage logs</p>
            </div>
          </a>

          {/* Transactions Link */}
          <a
            href="/admin/transactions"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 p-3 rounded-full mb-3 group-hover:bg-red-200 transition-colors">
                <Receipt className="h-6 w-6 text-red-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Transactions</h4>
              <p className="text-xs text-gray-500 mt-1">Manage transactions</p>
            </div>
          </a>

          {/* Settings Link */}
          <a
            href="/admin/settings"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:bg-gray-200 transition-colors">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <h4 className="text-sm font-medium text-gray-900">Settings</h4>
              <p className="text-xs text-gray-500 mt-1">Payment & account</p>
            </div>
          </a>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.users.slice(0, 10).map((user, index) => (
                    <tr key={user._id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {user.firstName?.charAt(0) || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Logs Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subcategory
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.logs.slice(0, 10).map((log, index) => (
                    <tr key={log._id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.category?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {log.subCategory?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          ${log.price || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {log.user?.firstName} {log.user?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.user?.email}
                        </div>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                        No logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}