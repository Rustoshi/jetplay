export default function StatsSection() {
  const stats = [
    {
      number: "12",
      label: "Team Members"
    },
    {
      number: "5M+",
      label: "In Transaction Value"
    },
    {
      number: "360+",
      label: "Customers Attended To"
    },
    {  
      number: "500+",
      label: "Accounts Sold"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              {/* Number */}
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              
              {/* Label */}
              <div className="text-lg sm:text-xl text-primary-foreground/80 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
