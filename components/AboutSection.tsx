import { 
  FaUserTie, 
  FaChartLine, 
  FaClock, 
  FaUsers, 
  FaCheckCircle, 
  FaHeadset, 
  FaLock 
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutSection() {
  const features = [
    {
      icon: FaUserTie,
      title: "Dedicated Account Manager",
      color: "text-blue-600"
    },
    {
      icon: FaChartLine,
      title: "Real-Time Market Analytics",
      color: "text-green-600"
    },
    {
      icon: FaLock,
      title: "Secure Transactions",
      color: "text-green-600"
    },
    {
      icon: FaCheckCircle,
      title: "Instant Account Verification",
      color: "text-emerald-600"
    },
    {
      icon: FaHeadset,
      title: "24/7 Customer Support",
      color: "text-orange-600"
    },
    {
      icon: FaLock,
      title: "Secure Escrow Payment Protection",
      color: "text-red-600"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Section */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden ">
                <Image
                  src="/images/about.webp"
                  alt="About Jetplay"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
                  About Us
                </h2>
                <h3 className="text-xl sm:text-2xl text-primary/80 font-semibold mb-6">
                  Your Trusted Partner in Social Media Account Trading
                </h3>
              </div>

              <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
                <p>
                  At Jetplay, we've revolutionized the way digital entrepreneurs acquire and sell established social media accounts. As a leading marketplace in the social media asset space, we connect serious buyers with verified sellers through a secure, transparent platform.
                </p>
                <p>
                  Join the thousands of satisfied clients who have chosen Rocky Socials as their preferred platform for social media account trading. Your digital future starts here.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors duration-200"
                  >
                    <div className={`${feature.color} text-xl flex-shrink-0`}>
                      <feature.icon />
                    </div>
                    <span className="text-foreground font-medium text-base">
                      {feature.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                <Link href="/products" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-block">
                  Explore Logs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
