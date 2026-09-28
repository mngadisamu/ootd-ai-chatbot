import React from 'react';
import { Sparkles, Sun, CloudRain, Wind, UserCircle } from 'lucide-react';
import { WeatherContext } from '../types';

interface HeaderProps {
  activeTab: 'generator' | 'upgrade' | 'closet' | 'lookbook' | 'capsule';
  setActiveTab: (tab: 'generator' | 'upgrade' | 'closet' | 'lookbook' | 'capsule') => void;
  weather: WeatherContext;
  onOpenWeatherModal?: () => void;
  onOpenProfileModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  weather,
  onOpenProfileModal,
}) => {
  const getWeatherIcon = (cond: string) => {
    if (cond.toLowerCase().includes('rain')) return <CloudRain className="w-3.5 h-3.5 text-slate-500" />;
    if (cond.toLowerCase().includes('wind') || cond.toLowerCase().includes('breeze')) return <Wind className="w-3.5 h-3.5 text-slate-500" />;
    return <Sun className="w-3.5 h-3.5 text-amber-500" />;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8E6DF] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single Wordmark Brand Text */}
        <button
          onClick={() => setActiveTab('generator')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] group-hover:text-black transition-colors">
            OOTD STYLIST
          </span>
        </button>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A5850]">
          <button
            onClick={() => setActiveTab('generator')}
            className={`cursor-pointer transition-colors pb-0.5 whitespace-nowrap ${
              activeTab === 'generator'
                ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-semibold'
                : 'hover:text-[#1A1A1A]'
            }`}
          >
            Today's OOTD
          </button>

          <button
            onClick={() => setActiveTab('upgrade')}
            className={`cursor-pointer transition-colors pb-0.5 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'upgrade'
                ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-semibold'
                : 'hover:text-[#1A1A1A]'
            }`}
          >
            <span>Outfit Upgrade</span>
            <span className="text-[10px] tracking-wide uppercase px-1.5 py-0.2 bg-[#1A1A1A] text-white rounded font-sans">
              AI Vision
            </span>
          </button>

          <button
            onClick={() => setActiveTab('closet')}
            className={`cursor-pointer transition-colors pb-0.5 whitespace-nowrap ${
              activeTab === 'closet'
                ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-semibold'
                : 'hover:text-[#1A1A1A]'
            }`}
          >
            Digital Closet
          </button>

          <button
            onClick={() => setActiveTab('lookbook')}
            className={`cursor-pointer transition-colors pb-0.5 whitespace-nowrap ${
              activeTab === 'lookbook'
                ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-semibold'
                : 'hover:text-[#1A1A1A]'
            }`}
          >
            Lookbook & Planner
          </button>

          <button
            onClick={() => setActiveTab('capsule')}
            className={`cursor-pointer transition-colors pb-0.5 whitespace-nowrap ${
              activeTab === 'capsule'
                ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-semibold'
                : 'hover:text-[#1A1A1A]'
            }`}
          >
            Capsule Trip
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Weather context pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#5A5850] bg-[#F0EDE5] px-2.5 py-1.5 rounded-md border border-[#E4E0D6]">
            {getWeatherIcon(weather.condition)}
            <span className="font-medium text-[#2A2925] tabular-nums">{weather.temp}°C</span>
            <span aria-hidden="true" className="text-[#A09C92]">·</span>
            <span className="truncate max-w-[90px]">{weather.condition}</span>
          </div>

          <button
            onClick={onOpenProfileModal}
            aria-label="Style Profile"
            className="p-2 text-[#5A5850] hover:text-[#1A1A1A] hover:bg-[#EFECE3] rounded-lg transition-colors cursor-pointer"
            title="Style Personality & Color Season"
          >
            <UserCircle className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-black transition-colors whitespace-nowrap shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate OOTD</span>
          </button>
        </div>

      </div>

      {/* Mobile navigation tab strip */}
      <div className="md:hidden flex items-center justify-around border-t border-[#E8E6DF] px-2 py-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'generator' ? 'bg-[#1A1A1A] text-white font-medium' : 'text-[#5A5850]'
          }`}
        >
          Today's OOTD
        </button>
        <button
          onClick={() => setActiveTab('upgrade')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'upgrade' ? 'bg-[#1A1A1A] text-white font-medium' : 'text-[#5A5850]'
          }`}
        >
          Upgrade
        </button>
        <button
          onClick={() => setActiveTab('closet')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'closet' ? 'bg-[#1A1A1A] text-white font-medium' : 'text-[#5A5850]'
          }`}
        >
          Closet
        </button>
        <button
          onClick={() => setActiveTab('lookbook')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'lookbook' ? 'bg-[#1A1A1A] text-white font-medium' : 'text-[#5A5850]'
          }`}
        >
          Lookbook
        </button>
        <button
          onClick={() => setActiveTab('capsule')}
          className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
            activeTab === 'capsule' ? 'bg-[#1A1A1A] text-white font-medium' : 'text-[#5A5850]'
          }`}
        >
          Capsule
        </button>
      </div>
    </header>
  );
};
