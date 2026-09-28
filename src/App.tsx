/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OOTDGenerator } from './components/OOTDGenerator';
import { OutfitUpgrade } from './components/OutfitUpgrade';
import { DigitalCloset } from './components/DigitalCloset';
import { LookbookPlanner } from './components/LookbookPlanner';
import { StyleProfileModal } from './components/StyleProfileModal';
import { INITIAL_CLOSET } from './data/initialCloset';
import { INITIAL_LOOKBOOK } from './data/initialLookbook';
import { ClosetItem, OOTDProposal, WeatherContext } from './types';
import { Sun, CloudRain, Wind, Thermometer } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'upgrade' | 'closet' | 'lookbook' | 'capsule'>('generator');

  // Weather context
  const [weather, setWeather] = useState<WeatherContext>({
    temp: 19,
    condition: 'Crisp & Mild',
    season: 'Autumn',
  });
  const [showWeatherPicker, setShowWeatherPicker] = useState(false);

  // Digital Closet state with local persistence
  const [closetItems, setClosetItems] = useState<ClosetItem[]>(() => {
    try {
      const saved = localStorage.getItem('ootd_closet_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved closet items:', e);
    }
    return INITIAL_CLOSET;
  });

  // Lookbook saved outfits state with local persistence
  const [savedOutfits, setSavedOutfits] = useState<OOTDProposal[]>(() => {
    try {
      const saved = localStorage.getItem('ootd_saved_lookbook');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved lookbook:', e);
    }
    return INITIAL_LOOKBOOK;
  });

  // Style Profile Modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState<{ archetype: string; season: string }>({
    archetype: 'Quiet Luxury Minimalist',
    season: 'Deep Autumn',
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ootd_closet_items', JSON.stringify(closetItems));
    } catch (e) {
      console.warn('Could not save closet items:', e);
    }
  }, [closetItems]);

  useEffect(() => {
    try {
      localStorage.setItem('ootd_saved_lookbook', JSON.stringify(savedOutfits));
    } catch (e) {
      console.warn('Could not save lookbook:', e);
    }
  }, [savedOutfits]);

  // Handlers
  const handleSaveToLookbook = (outfit: OOTDProposal) => {
    setSavedOutfits((prev) => {
      const exists = prev.some((o) => o.id === outfit.id);
      if (exists) {
        return prev.map((o) => (o.id === outfit.id ? { ...o, ...outfit } : o));
      }
      return [outfit, ...prev];
    });
  };

  const handleToggleFavorite = (id: string) => {
    setSavedOutfits((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isFavorite: !o.isFavorite } : o))
    );
  };

  const handleRemoveFromLookbook = (id: string) => {
    setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  const handleAssignDay = (id: string, day: string) => {
    setSavedOutfits((prev) =>
      prev.map((o) => {
        if (o.id === id) return { ...o, plannedDay: day };
        if (o.plannedDay === day && day !== '') return { ...o, plannedDay: undefined };
        return o;
      })
    );
  };

  const handleAddClosetItem = (item: ClosetItem) => {
    setClosetItems((prev) => [item, ...prev]);
  };

  const handleRemoveClosetItem = (id: string) => {
    setClosetItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSendToCanvas = (_outfit: OOTDProposal) => {
    setActiveTab('closet');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col selection:bg-[#1A1A1A] selection:text-white">
      {/* 3-Zone Top Navigation Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        weather={weather}
        onOpenWeatherModal={() => setShowWeatherPicker(true)}
        onOpenProfileModal={() => setShowProfileModal(true)}
      />

      {/* Weather Selector Bar (Collapsible Quick Filter) */}
      <div className="bg-[#F0EDE5] border-b border-[#E4E0D6] py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#5A5850]">
            <Thermometer className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span className="font-semibold text-[#1A1A1A]">Live Weather Context:</span>
            <span>{weather.temp}°C {weather.condition} ({weather.season})</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] text-[#7A7870] mr-1">Quick Presets:</span>
            {[
              { temp: 14, condition: 'Autumn Breeze', season: 'Autumn' as const },
              { temp: 22, condition: 'Sunny & Clear', season: 'Spring' as const },
              { temp: 28, condition: 'Summer Heat', season: 'Summer' as const },
              { temp: 4, condition: 'Winter Chill', season: 'Winter' as const },
              { temp: 12, condition: 'Rainy Overcast', season: 'Autumn' as const },
            ].map((preset, pIdx) => (
              <button
                key={pIdx}
                onClick={() => setWeather(preset)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  weather.temp === preset.temp && weather.condition === preset.condition
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-white text-[#5A5850] hover:text-[#1A1A1A] border border-[#DDD9CE]'
                }`}
              >
                {preset.temp}°C {preset.condition}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'generator' && (
          <OOTDGenerator
            weather={weather}
            closetItems={closetItems}
            onSaveToLookbook={handleSaveToLookbook}
            onSendToCanvas={handleSendToCanvas}
            savedOutfits={savedOutfits}
          />
        )}

        {activeTab === 'upgrade' && <OutfitUpgrade />}

        {activeTab === 'closet' && (
          <DigitalCloset
            closetItems={closetItems}
            onAddClosetItem={handleAddClosetItem}
            onRemoveClosetItem={handleRemoveClosetItem}
            onSaveToLookbook={handleSaveToLookbook}
          />
        )}

        {(activeTab === 'lookbook' || activeTab === 'capsule') && (
          <LookbookPlanner
            savedOutfits={savedOutfits}
            onToggleFavorite={handleToggleFavorite}
            onRemoveFromLookbook={handleRemoveFromLookbook}
            onAssignDay={handleAssignDay}
          />
        )}
      </main>

      {/* Style Profile Modal */}
      <StyleProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onApplyProfile={(prof) => setUserProfile(prof)}
      />

      {/* Clean Footer (No Ornamental Engines or Slop) */}
      <footer className="border-t border-[#E8E6DF] bg-white mt-12 py-8 text-xs text-[#7A7870]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-sm text-[#1A1A1A]">OOTD STYLIST</span>
            <span aria-hidden="true">·</span>
            <span>Intelligent Personal Wardrobe & Lookbook Studio</span>
          </div>

          <div className="flex items-center gap-4 text-[#5A5850]">
            <button
              onClick={() => setActiveTab('generator')}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              Today's OOTD
            </button>
            <button
              onClick={() => setActiveTab('upgrade')}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              Outfit Upgrade
            </button>
            <button
              onClick={() => setActiveTab('closet')}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              Digital Closet
            </button>
            <button
              onClick={() => setActiveTab('lookbook')}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              Weekly Planner
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
