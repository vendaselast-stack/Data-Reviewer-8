
import { useState, useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import PainPoints from './PainPoints';
import Benefits from './Benefits';
import Modules from './Modules';
import Pricing from './Pricing';
import Guarantee from './Guarantee';
import FAQ from './FAQ';
import Footer from './Footer';

const WhatsAppFAB = () => (
  <a
    href="https://wa.me/5554996231432"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 group flex items-center justify-center"
  >
    <div className="absolute -inset-2 bg-blue-600 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition duration-300"></div>
    <div className="relative w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
      <svg 
        viewBox="0 0 24 24" 
        className="w-10 h-10 fill-yellow-400"
      >
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.767 5.767 0 1.267.405 2.436 1.096 3.393l-.717 2.616 2.684-.704c.83.473 1.785.742 2.804.742 3.181 0 5.767-2.586 5.767-5.767 0-3.181-2.586-5.767-5.767-5.767zm3.39 8.21c-.147.414-.73.743-1.02.775-.275.03-.62.053-1.01-.073a5.55 5.55 0 0 1-2.223-1.288 6.142 6.142 0 0 1-1.52-2.1c-.16-.3-.31-.693-.31-1.092 0-.41.213-.614.293-.695.122-.122.21-.155.276-.155.065 0 .13.003.187.006.06.002.14.004.21.168.077.185.263.642.286.688.024.045.038.1.008.163-.03.065-.045.105-.088.158-.044.053-.092.11-.133.155-.047.052-.095.108-.04.204.056.096.248.408.532.66.364.324.672.424.77.472.096.046.152.038.208-.025.056-.063.24-.28.304-.374.065-.094.13-.08.22-.047.09.033.567.268.665.316.097.05.163.076.187.116.024.04.024.234-.123.647zM12 2C6.477 2 2 6.477 2 12c0 1.892.527 3.657 1.442 5.166L2 22l4.983-1.31A9.944 9.944 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.725 0-3.337-.534-4.665-1.44l-.334-.23-2.766.727.74-2.703-.253-.404A7.952 7.952 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
      </svg>
    </div>
  </a>
);

const LandingPage = () => {
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowFloatingCTA(true);
      } else {
        setShowFloatingCTA(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <Benefits />
        <Modules />
        <Guarantee />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default LandingPage;
