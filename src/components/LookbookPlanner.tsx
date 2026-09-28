import React, { useState } from 'react';
import {
  Calendar,
  Bookmark,
  Heart,
  Briefcase,
  Sparkles,
  RefreshCw,
  Flame,
  Check,
  Palette,
  ExternalLink,
} from 'lucide-react';
import { OOTDProposal, CapsulePlan } from '../types';

interface LookbookPlannerProps {
  savedOutfits: OOTDProposal[];
  onToggleFavorite: (id: string) => void;
  onRemoveFromLookbook: (id: string) => void;
  onAssignDay: (id: string, day: string) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const LookbookPlanner: React.FC<LookbookPlannerProps> = ({
  savedOutfits,
  onToggleFavorite,
  onRemoveFromLookbook,
  onAssignDay,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'planner' | 'lookbook' | 'capsule'>('planner');
  const [selectedOutfit, setSelectedOutfit] = useState<OOTDProposal | null>(savedOutfits[0] || null);

  // Capsule Wardrobe generator state
  const [destination, setDestination] = useState('Paris & Milan');
  const [days, setDays] = useState(5);
  const [season, setSeason] = useState('Autumn (14-18°C)');
  const [capsuleVibe, setCapsuleVibe] = useState('Quiet Luxury Minimalist');
  const [loadingCapsule, setLoadingCapsule] = useState(false);
  const [capsulePlan, setCapsulePlan] = useState<CapsulePlan | null>(null);

  // Get outfit assigned to a given day
  const getOutfitForDay = (day: string) => {
    return savedOutfits.find((o) => o.plannedDay === day);
  };

  const handleGenerateCapsule = async () => {
    setLoadingCapsule(true);
    try {
      const res = await fetch('/api/stylist/capsule-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days,
          season,
          vibe: capsuleVibe,
        }),
      });

      if (!res.ok) throw new Error('Capsule generation failed');
      const data = await res.json();
      setCapsulePlan(data);
    } catch (err) {
      console.warn('Capsule fallback:', err);
      // High-taste local fallback
      setCapsulePlan({
        capsuleSummary: `A streamlined 9-piece carry-on capsule designed for ${days} days in ${destination}. Every top pairs effortlessly with both bottoms and outerwear.`,
        pieces: [
          { category: 'Outerwear', name: 'Camel Double-Breasted Trench', color: 'Warm Camel', role: 'Weatherproof statement layer' },
          { category: 'Outerwear', name: 'Oversized Wool Blazer', color: 'Charcoal Houndstooth', role: 'Smart evening and museum layer' },
          { category: 'Tops', name: 'Merino Wool Knit Crewneck', color: 'Cream Oatmeal', role: 'Warmth and daytime texture' },
          { category: 'Tops', name: 'Crisp Poplin Button-Down', color: 'Optic White', role: 'Layering under knit or solo' },
          { category: 'Tops', name: 'Heavyweight Cotton Tee', color: 'Black Noir', role: 'Base casual layer' },
          { category: 'Bottoms', name: 'Pleated Wide-Leg Trousers', color: 'Charcoal Wool', role: 'Formal and daytime walking' },
          { category: 'Bottoms', name: 'Vintage Straight Selvedge Denim', color: 'Raw Indigo', role: 'Casual exploration' },
          { category: 'Footwear', name: 'Suede Penny Loafers', color: 'Espresso Brown', role: 'Dinner & evening strolls' },
          { category: 'Footwear', name: 'Low-Profile Leather Sneakers', color: 'Chalk White', role: 'High-mileage walking' },
        ],
        dailyItinerary: [
          {
            dayNumber: 1,
            activityName: 'Arrival & Neighborhood Bistro Stroll',
            outfitTitle: 'Travel Ease & Architectural Trench',
            piecesUsed: ['Camel Double-Breasted Trench', 'Heavyweight Cotton Tee', 'Vintage Straight Selvedge Denim', 'Low-Profile Leather Sneakers'],
            stylingNote: 'Drape the trench open while walking; sneakers keep transit comfortable.',
          },
          {
            dayNumber: 2,
            activityName: 'Art Museums & Architectural Walk',
            outfitTitle: 'Cream Knit & Tailored Pleats',
            piecesUsed: ['Merino Wool Knit Crewneck', 'Pleated Wide-Leg Trousers', 'Low-Profile Leather Sneakers', 'Oversized Wool Blazer'],
            stylingNote: 'French tuck the knit; blazer rests over shoulders if interior gets chilly.',
          },
          {
            dayNumber: 3,
            activityName: 'Cafe Morning & Evening Tasting Menu',
            outfitTitle: 'Crisp White Poplin & Espresso Loafers',
            piecesUsed: ['Crisp Poplin Button-Down', 'Pleated Wide-Leg Trousers', 'Oversized Wool Blazer', 'Suede Penny Loafers'],
            stylingNote: 'Roll up blazer cuffs once to reveal the white shirt cuffs; switch to loafers.',
          },
          {
            dayNumber: 4,
            activityName: 'Vintage Markets & Boutique Browsing',
            outfitTitle: 'Layered Poplin under Knit with Denim',
            piecesUsed: ['Crisp Poplin Button-Down', 'Merino Wool Knit Crewneck', 'Vintage Straight Selvedge Denim', 'Low-Profile Leather Sneakers'],
            stylingNote: 'Pop the white shirt collar and cuffs just beyond the knit edges.',
          },
          {
            dayNumber: 5,
            activityName: 'Departure & Final Espresso',
            outfitTitle: 'The Classic Camel & Monochrome Departure',
            piecesUsed: ['Camel Double-Breasted Trench', 'Heavyweight Cotton Tee', 'Pleated Wide-Leg Trousers', 'Low-Profile Leather Sneakers'],
            stylingNote: 'Effortless airport transit styling that arrives looking fully put together.',
          },
        ],
        packingWisdom: [
          'Roll merino knits inside tissue paper to prevent crease lines in carry-on luggage',
          'Wear your heaviest piece (the camel trench coat and sneakers) on the flight to maximize suitcase volume',
          'Stick strictly to a 3-color neutral palette so any piece pairs with any other',
        ],
      });
    } finally {
      setLoadingCapsule(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner with Sub-Navigation */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E6DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C827A] uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Wardrobe Logistics & Lookbook</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Lookbook & Weekly Planner
          </h1>
          <p className="text-sm text-[#5A5850]">
            Organize your outfits across the week, curate your saved lookbook archive, or plan a minimalist travel capsule.
          </p>
        </div>

        {/* Sub-Tab Navigation Bar */}
        <div className="flex items-center gap-1 p-1 bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('planner')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'planner'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#5A5850] hover:text-[#1A1A1A]'
            }`}
          >
            Weekly Planner
          </button>

          <button
            onClick={() => setActiveSubTab('lookbook')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeSubTab === 'lookbook'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#5A5850] hover:text-[#1A1A1A]'
            }`}
          >
            Saved Looks ({savedOutfits.length})
          </button>

          <button
            onClick={() => setActiveSubTab('capsule')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
              activeSubTab === 'capsule'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#5A5850] hover:text-[#1A1A1A]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Capsule Trip</span>
          </button>
        </div>
      </section>

      {/* 1. WEEKLY PLANNER VIEW */}
      {activeSubTab === 'planner' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              7-Day Outfit Schedule
            </h2>
            <span className="text-xs text-[#7A7870]">
              Assign saved looks from your lookbook to eliminate morning decision fatigue
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {DAYS_OF_WEEK.map((day) => {
              const outfit = getOutfitForDay(day);
              return (
                <div
                  key={day}
                  className={`bg-white rounded-xl border p-3.5 flex flex-col justify-between min-h-[220px] transition-all ${
                    outfit ? 'border-[#1A1A1A] shadow-xs' : 'border-[#E8E6DF] bg-[#FAF9F6]/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#F0EDE5] pb-2">
                      <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                        {day.slice(0, 3)}
                      </span>
                      <span className="text-[10px] text-[#8C827A]">{day}</span>
                    </div>

                    {outfit ? (
                      <div className="space-y-2">
                        {outfit.image && (
                          <img
                            src={outfit.image}
                            alt={outfit.name}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        )}
                        <h4 className="font-serif text-xs font-bold text-[#1A1A1A] line-clamp-2">
                          {outfit.name}
                        </h4>
                        <div className="text-[10px] text-[#7A7870] line-clamp-2">
                          {outfit.summary}
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-xs text-[#A09C92] italic">
                        No outfit planned
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#F0EDE5] flex items-center justify-between">
                    {outfit ? (
                      <button
                        onClick={() => onAssignDay(outfit.id, '')}
                        className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    ) : (
                      <select
                        onChange={(e) => {
                          if (e.target.value) onAssignDay(e.target.value, day);
                        }}
                        defaultValue=""
                        className="text-[10px] bg-[#FAF9F6] border border-[#DDD9CE] rounded px-1.5 py-1 text-[#1A1A1A] cursor-pointer w-full"
                      >
                        <option value="" disabled>
                          + Assign Look
                        </option>
                        {savedOutfits.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SAVED LOOKBOOK GALLERY VIEW */}
      {activeSubTab === 'lookbook' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Curated Lookbook Archive
            </h2>
            <span className="text-xs text-[#7A7870]">
              {savedOutfits.length} saved formulas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedOutfits.map((outfit) => (
              <div
                key={outfit.id}
                className="bg-white rounded-xl border border-[#E8E6DF] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  {outfit.image ? (
                    <div className="relative h-64 overflow-hidden bg-[#FAF9F6]">
                      <img
                        src={outfit.image}
                        alt={outfit.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          onClick={() => onToggleFavorite(outfit.id)}
                          className={`p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                            outfit.isFavorite
                              ? 'bg-rose-600 text-white'
                              : 'bg-white/80 text-[#1A1A1A] hover:bg-white'
                          }`}
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 bg-[#FAF9F6] flex items-center justify-center p-6 border-b border-[#F0EDE5]">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {outfit.colorPalette?.map((c, idx) => (
                          <span
                            key={idx}
                            className="w-8 h-8 rounded-full border border-black/10 shadow-xs"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#8C827A] uppercase tracking-wider text-[10px]">
                        {outfit.tier || 'Curated'}
                      </span>
                      {outfit.plannedDay && (
                        <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 rounded font-medium">
                          {outfit.plannedDay}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#1A1A1A] leading-snug">
                      {outfit.name}
                    </h3>

                    <p className="text-xs text-[#5A5850] line-clamp-2">
                      {outfit.summary}
                    </p>

                    {/* Pieces itemized tags */}
                    <div className="space-y-1 pt-2 border-t border-[#F0EDE5]">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8C827A]">
                        Key Pieces:
                      </span>
                      <ul className="text-xs text-[#3A3830] space-y-0.5">
                        {outfit.items?.slice(0, 4).map((item, idx) => (
                          <li key={idx} className="truncate">
                            <span className="font-medium text-[#1A1A1A]">{item.category}:</span>{' '}
                            {item.pieceName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF9F6] border-t border-[#F0EDE5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-emerald-800 font-semibold">
                    <Flame className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{outfit.styleScore}/100</span>
                  </div>

                  <button
                    onClick={() => onRemoveFromLookbook(outfit.id)}
                    className="text-xs text-[#999] hover:text-rose-600 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CAPSULE WARDROBE TRIP GENERATOR VIEW */}
      {activeSubTab === 'capsule' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E8E6DF] p-6 space-y-5 shadow-xs">
            <div className="space-y-1">
              <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">
                Travel Capsule Wardrobe Engine
              </h2>
              <p className="text-xs text-[#7A7870]">
                Enter your destination and trip length. Gemini crafts a carry-on only capsule of 8-10 pieces that generate distinct outfits for every day of your itinerary.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5A5850] mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5850] mb-1">
                  Trip Length (Days)
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] cursor-pointer"
                >
                  <option value={3}>3 Days (Long Weekend)</option>
                  <option value={5}>5 Days (City Break)</option>
                  <option value={7}>7 Days (Full Week)</option>
                  <option value={10}>10 Days (Extended Tour)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5850] mb-1">
                  Climate & Weather
                </label>
                <input
                  type="text"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5850] mb-1">
                  Aesthetic Vibe
                </label>
                <input
                  type="text"
                  value={capsuleVibe}
                  onChange={(e) => setCapsuleVibe(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateCapsule}
                disabled={loadingCapsule}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {loadingCapsule ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Planning Packable Capsule...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Carry-On Capsule</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Capsule Plan Output */}
          {capsulePlan && (
            <div className="bg-white rounded-xl border border-[#E8E6DF] p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="space-y-2 border-b border-[#F0EDE5] pb-5">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Carry-On Master Plan
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                  {days}-Day {destination} Wardrobe Blueprint
                </h3>
                <p className="text-sm text-[#4A4840]">
                  {capsulePlan.capsuleSummary}
                </p>
              </div>

              {/* Core Packing List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  The {capsulePlan.pieces.length} Essential Pieces
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {capsulePlan.pieces.map((p, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3 bg-[#FAF9F6] border border-[#E8E6DF] rounded-lg text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[#7A7870]">
                        <span className="font-semibold text-[#1A1A1A]">{p.category}</span>
                        <span>{p.color}</span>
                      </div>
                      <div className="font-medium text-[#1A1A1A]">{p.name}</div>
                      <p className="text-[11px] text-[#6A6860] italic">{p.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day-by-Day Itinerary Outfits */}
              <div className="space-y-3 pt-3 border-t border-[#F0EDE5]">
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Day-by-Day Daily Outfits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {capsulePlan.dailyItinerary.map((dayPlan) => (
                    <div
                      key={dayPlan.dayNumber}
                      className="p-4 bg-[#FAF9F6] border border-[#E8E6DF] rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1A1A1A] uppercase tracking-wide">
                          Day {dayPlan.dayNumber}
                        </span>
                        <span className="text-[#7A7870]">{dayPlan.activityName}</span>
                      </div>
                      <div className="font-serif text-sm font-bold text-[#1A1A1A]">
                        {dayPlan.outfitTitle}
                      </div>
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-semibold uppercase text-[#8C827A]">
                          Formula Pieces:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {dayPlan.piecesUsed.map((piece, pcIdx) => (
                            <span
                              key={pcIdx}
                              className="bg-white border border-[#DDD9CE] px-2 py-0.5 rounded text-[11px] text-[#333]"
                            >
                              {piece}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-[#5A5850] pt-1 italic">
                        "{dayPlan.stylingNote}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Packing Wisdom Rules */}
              <div className="pt-4 border-t border-[#F0EDE5] space-y-2">
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  Stylist Packing Rules
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#4A4840]">
                  {capsulePlan.packingWisdom.map((tip, tIdx) => (
                    <li
                      key={tIdx}
                      className="p-3 bg-[#EEF5EE] border border-[#C5DEC5] text-[#225522] rounded-lg"
                    >
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
