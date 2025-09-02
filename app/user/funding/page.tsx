'use client';

import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { MessageCircle } from 'lucide-react';

export default function FundingPage() {
  const handleWhatsAppContact = () => {
    // Replace with your actual WhatsApp business number
    const whatsappNumber = '+2348139113344'; // Update this with your actual number
    const message = encodeURIComponent('Hello, I would like to fund my Jetplay account. Please assist me with the process.');
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
          <p className="text-gray-600">
            Add funds to your Jetplay wallet to start purchasing premium logs
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Customer Support
            </h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
              To fund your account, please contact our dedicated customer support team via WhatsApp. 
              Our representatives will guide you through the secure funding process and assist with 
              any payment-related inquiries you may have.
            </p>
          </div>

          {/* WhatsApp Contact Button */}
          <button
            onClick={handleWhatsAppContact}
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            Contact Support on WhatsApp
          </button>

          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              What to Expect
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-1">Quick Response</div>
                <div>Our support team typically responds within minutes during business hours</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-1">Secure Process</div>
                <div>All transactions are processed through secure, verified payment methods</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-1">Instant Credit</div>
                <div>Your account will be credited immediately upon payment confirmation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Hours */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Customer Support Hours: Monday - Sunday, 9:00 AM - 10:00 PM (GMT)
          </p>
        </div>
      </div>
    </div>
    </>
  );
}