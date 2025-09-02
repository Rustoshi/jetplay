import { 
  FaShieldAlt, 
  FaCheckCircle, 
  FaLock, 
  FaHeadset 
} from 'react-icons/fa';

export default function FeaturesSection() {
  const features = [
    {
      icon: FaShieldAlt,
      title: "Rigorous Verification",
      description: "Every account undergoes thorough verification to ensure authenticity and quality.",
      color: "text-blue-600"
    },
    {
      icon: FaLock,
      title: "Secure Escrow Service",
      description: "Our escrow service protects both buyers and sellers during all transactions.",
      color: "text-green-600"
    },
    {
      icon: FaHeadset,
      title: "24/7 Support Team",
      description: "Round-the-clock assistance from our dedicated support team for smooth transfers.",
      color: "text-purple-600"
    },
    {
      icon: FaCheckCircle,
      title: "Guaranteed Authenticity",
      description: "Buyers receive exactly what they invest in with our authenticity guarantee.",
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Our Features
          </h2>
          <h3 className="text-xl sm:text-2xl text-primary/80 font-semibold mb-6">
            Jetplay Premium Services
          </h3>
          <p className="text-lg sm:text-xl text-foreground/80 max-w-4xl mx-auto leading-relaxed">
            What sets us apart is our unwavering commitment to security and authenticity. Every account listed undergoes rigorous verification, ensuring that buyers receive exactly what they're investing in. Our escrow service protects both parties during transactions, while our dedicated support team provides round-the-clock assistance to ensure smooth transfers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`${feature.color} text-5xl mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon />
              </div>

              {/* Title */}
              <h4 className="text-xl font-bold text-primary mb-4">
                {feature.title}
              </h4>

              {/* Description */}
              <p className="text-foreground/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-secondary/50 rounded-2xl p-8 border border-secondary">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Experience Premium Service Today
            </h3>
            <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust our platform for secure social media account transactions.
            </p>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
