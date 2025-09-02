import Image from 'next/image';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Digital Marketing Manager",
      image: "/testimonial-1.jpg",
      quote: "Jetplay made acquiring verified social media accounts incredibly easy. The verification process is thorough and the support team was available 24/7 to help with my purchase.",
      rating: 5
    },
    {
      name: "Sarah Chen",
      role: "E-commerce Entrepreneur",
      image: "/testimonial-2.jpg",
      quote: "I've used several platforms before, but Jetplay's escrow service gave me the confidence I needed. The account transfer was seamless and exactly as described.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Social Media Consultant",
      image: "/testimonial-3.jpg",
      quote: "Outstanding service! The quality of accounts and the security measures in place are top-notch. I recommend Jetplay to all my clients looking for authentic social media accounts.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
            What Our Customers Say
          </h2>
          <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience with Jetplay.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-background rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50"
            >
              {/* Quote Icon */}
              <div className="text-primary/20 text-4xl mb-4">
                <FaQuoteLeft />
              </div>

              {/* Quote */}
              <p className="text-foreground/80 text-lg leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* Rating */}
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-lg mr-1" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-foreground/60 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Ready to Join Our Satisfied Customers?
            </h3>
            <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
              Experience the same level of service and security that our customers rave about.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Start Your Journey
              </button>
              <button className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                View All Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
