import Link from 'next/link';
import { 
  FaWallet, 
  FaSearch, 
  FaShoppingCart 
} from 'react-icons/fa';

export default function HowToBuySection() {
  const steps = [
    {
      icon: FaWallet,
      title: "Fund Your Wallet",
      description: "Add funds to your Jetplay wallet through secure bank transfer to our company account. Quick and reliable funding process.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: FaSearch,
      title: "Browse Available Logs",
      description: "Explore our extensive catalog of verified social media accounts. Filter by platform, followers, engagement, and more.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: FaShoppingCart,
      title: "Purchase Securely",
      description: "Buy your selected logs directly from your wallet balance. Instant delivery with secure account transfer guaranteed.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
            How to Buy Logs
          </h2>
          <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto">
            Get started with Jetplay in three simple steps. Our streamlined process makes acquiring social media accounts quick and secure.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold z-10">
                {index + 1}
              </div>

              {/* Step Card */}
              <div className={`${step.bgColor} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50`}>
                {/* Icon */}
                <div className={`${step.color} text-4xl mb-6 flex justify-center`}>
                  <step.icon />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 text-center">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-foreground/80 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Arrow (hidden on mobile, shown on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-0">
                  <svg 
                    className="w-12 h-8 text-primary/30" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Jetplay for their social media account needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Fund Wallet Now
              </button>
              <Link href="/products" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-block">
                Browse Logs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
