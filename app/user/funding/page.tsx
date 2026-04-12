'use client';

import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { MessageCircle, Copy, CheckCircle, CreditCard, AlertCircle, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FundingPage() {
  const { data: session } = useSession();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [amountSent, setAmountSent] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState({
    accountName: '',
    bank: '',
    accountNumber: ''
  });
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.data) {
          setPaymentDetails(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch payment details:', err);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchPaymentDetails();
  }, []);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleWhatsAppContact = () => {
    if (!amountSent.trim()) {
      alert('Please enter the amount you sent before contacting support.');
      return;
    }
    
    const whatsappNumber = '+2348139113344';
    const userEmail = session?.user?.email || 'User';
    const formattedAmount = parseFloat(amountSent).toLocaleString();
    const message = encodeURIComponent(
      `Hello! My email is ${userEmail} and I've made a payment to fund my Jetplay account.\n\n` +
      `Payment Details:\n` +
      `• Account: ${paymentDetails.accountName}\n` +
      `• Bank: ${paymentDetails.bank}\n` +
      `• Account Number: ${paymentDetails.accountNumber}\n` +
      `• Amount Sent: ₦${formattedAmount}\n\n` +
      `I'm sending the payment receipt for verification. Please credit my account once confirmed.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <>
    <Header />
    <Navbar />
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Fund Your Account
          </h1>
          <p className="text-gray-600 text-lg">
            Follow these simple steps to add funds to your Jetplay wallet
          </p>
        </div>

        {/* Step-by-Step Process */}
        <div className="space-y-6">
          {/* Step 1: Payment Details */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  1
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Make Payment to Our Account
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    Payment Account Details
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Account Name</p>
                          <p className="font-semibold text-gray-900">{paymentDetails.accountName}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(paymentDetails.accountName, 'name')}
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                          title="Copy account name"
                        >
                          {copiedField === 'name' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Bank</p>
                          <p className="font-semibold text-gray-900">{paymentDetails.bank}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(paymentDetails.bank, 'bank')}
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                          title="Copy bank name"
                        >
                          {copiedField === 'bank' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Account Number</p>
                          <p className="font-semibold text-gray-900 text-lg">{paymentDetails.accountNumber}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(paymentDetails.accountNumber, 'number')}
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                          title="Copy account number"
                        >
                          {copiedField === 'number' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-amber-600" />
                    Important Instructions
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-amber-800 font-medium text-sm">
                        ⚠️ Please don't send less than the agreed price
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        💡 <strong>Tip:</strong> Use the copy buttons to easily copy account details to your banking app
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        ✅ Double-check all details before making the transfer
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Send Receipt */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  2
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Send Receipt & Email via WhatsApp
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="max-w-md mx-auto">
                <p className="text-gray-700 mb-6 text-lg text-center">
                  After making the payment, enter the amount you sent and click the button below to contact our support team on WhatsApp.
                </p>
                
                {/* Amount Input */}
                <div className="mb-6">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Sent (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₦</span>
                    <input
                      type="number"
                      id="amount"
                      value={amountSent}
                      onChange={(e) => setAmountSent(e.target.value)}
                      placeholder="Enter amount sent"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the exact amount you transferred
                  </p>
                </div>

                <div className="text-center">
                  <button
                    onClick={handleWhatsAppContact}
                    className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg text-lg w-full justify-center"
                  >
                    <MessageCircle className="w-6 h-6 mr-3" />
                    Send Receipt on WhatsApp
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                  <p className="text-sm text-gray-500 mt-3">
                    Your email: <span className="font-medium">{session?.user?.email || 'Please login first'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Account Credit */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  3
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Account Credit & Confirmation
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Quick Response</h4>
                  <p className="text-sm text-gray-600">Our support team responds within minutes during business hours</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Verification</h4>
                  <p className="text-sm text-gray-600">We'll verify your payment receipt and confirm the transaction</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Instant Credit</h4>
                  <p className="text-sm text-gray-600">Your account will be credited immediately upon confirmation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our customer support team is available to assist you with any funding questions.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-900">Support Hours</p>
              <p className="text-gray-600">Monday - Sunday, 9:00 AM - 10:00 PM (GMT)</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Average Response Time</p>
              <p className="text-gray-600">Within 5 minutes during business hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}