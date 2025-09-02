import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import HowToBuySection from '../components/HowToBuySection';
import StatsSection from '../components/StatsSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Header />
      <Navbar />
      <div className="min-h-screen bg-background">
        <HeroSection />
        <AboutSection />
        <HowToBuySection />
        <StatsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </>
  );
}
