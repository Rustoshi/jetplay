'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Debug state changes
  useEffect(() => {
    console.log('State changed - success:', success, 'loading:', loading, 'error:', error);
  }, [success, loading, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with email:', email);
    setLoading(true);
    setError('');

    try {
      console.log('Making API request to /api/auth/forgot-password');
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Request error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600">
              If an account with that email exists, we've sent you a password reset link.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-2">What to do next:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your email inbox</li>
                  <li>Look for an email from Jetplay</li>
                  <li>Click the reset link in the email</li>
                  <li>The link expires in 1 hour</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/user/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Forgot your password?</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Enter your email"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send reset link'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <Link
            href="/user/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>
          
          <div className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/user/register" className="text-primary hover:text-primary/80 font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
