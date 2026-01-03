
import React from 'react';
import { Rocket } from 'lucide-react';
import { Link } from "wouter";

const FloatingCTA: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] flex flex-col items-end gap-2 md:gap-3 pointer-events-none">
      <Link 
        href="/signup?plan=pro"
        className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white px-5 md:px-8 py-3.5 md:py-4 rounded-2xl shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-2 md:gap-3 font-bold text-base md:text-lg transition-all active:scale-95"
      >
        <Rocket className="w-4 h-4 md:w-5 md:h-5 text-blue-200" />
        <span>Começar 🚀</span>
      </Link>
    </div>
  );
};

export default FloatingCTA;
