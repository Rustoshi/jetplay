'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { DollarSign, User, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface FundResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      newBalance: number;
    };
    transaction: {
      id: string;
      amount: number;
      type: string;
      createdAt: string;
    };
  };
  error?: string;
}

export default function FundUserPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FundResponse | null>(null);
  const [errors, setErrors] = useState<{email?: string; amount?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; amount?: string} = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Amount validation
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (numericAmount > 1000000) {
        newErrors.amount = 'Amount cannot exceed NGN 1,000,000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/fund-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          amount: parseFloat(amount)
        }),
      });

      const data = await response.json();
      setResult(data);

      if (data.success) {
        // Reset form on success
        setEmail('');
        setAmount('');
        setErrors({});
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error. Please try again.',
        error: 'Network error'
      });
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

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fund User Account</h1>
                <p className="mt-2 text-gray-600">Add funds to a user's wallet balance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Result Display */}
        {result && (
          <div className={`rounded-lg p-6 mb-6 ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {result.success ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <h3 className={`text-lg font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? 'Success!' : 'Error'}
                </h3>
                <p className={`mt-2 text-sm ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message || result.error}
                </p>

                {/* Success Details */}
                {result.success && result.data && (
                  <div className="mt-4 bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Transaction Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">User:</span>
                        <p className="text-gray-900">{result.data.user.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Email:</span>
                        <p className="text-gray-900">{result.data.user.email}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Amount Funded:</span>
                        <p className="text-green-600 font-semibold">
                          {formatCurrency(result.data.transaction.amount)}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">New Balance:</span>
                        <p className="text-gray-900 font-semibold">
                          {formatCurrency(result.data.user.newBalance)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fund User Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-6">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Fund User Wallet</h2>
              <p className="text-gray-600">Enter user email and amount to fund their account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                User Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="user@example.com"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (NGN) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.amount ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  max="1000000"
                  disabled={loading}
                />
              </div>
              {errors.amount && (
                <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Maximum amount: NGN 1,000,000
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="-ml-1 mr-3 h-5 w-5" />
                    Fund Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>


        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <div className="flex items-start">
            <User className="h-6 w-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-2">Instructions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Enter the exact email address of the user you want to fund</li>
                <li>• Specify the amount in Nigerian Naira (NGN)</li>
                <li>• The system will automatically update the user's balance and create a transaction record</li>
                <li>• Maximum funding amount per transaction is NGN 1,000,000</li>
                <li>• All funding transactions are logged for audit purposes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}