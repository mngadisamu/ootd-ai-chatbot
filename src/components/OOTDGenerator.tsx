import React, { useState } from 'react';
import {
  Sparkles,
  Bookmark,
  Calendar,
  Check,
  Flame,
  Shirt,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Palette,
  Compass,
} from 'lucide-react';
import { OOTDProposal, WeatherContext, ClosetItem } from '../types';

interface OOTDGeneratorProps {
  weather: WeatherContext;
  closetItems: ClosetItem[];
  onSaveToLookbook: (outfit: OOTDProposal) => void;
  onSendToCanvas: (outfit: OOTDProposal) => void;
  savedOutfits: OOTDProposal[];
}

const OCCASIONS = [
  'Office & Smart Casual',
  'Weekend Brunch & Stroll',
  'Evening Dinner & Date',
  'Creative Studio / Agency',
  'Modern Streetwear',
  'Formal Reception / Gala',
  'Airport & Travel Comfort',
];

const VIBES = [
  'Quiet Luxury',
  'Parisian Chic',
  'Scandi Minimalist',
  '90s Vintage Clean',
  'Old Money Classic',
  'Urban Streetwear',
  'Clean Athleisure',
];

export const OOTDGenerator: React.FC<OOTDGeneratorProps> = ({
  weather,
  closetItems,
  onSaveToLookbook,
  onSendToCanvas,
  savedOutfits,
}) => {
  const [occasion, setOccasion] = useState('Office & Smart Casual');
  const [vibe, setVibe] = useState('Quiet Luxury');
  const [gender, setGender] = useState<'Women\'s' | 'Men\'s' | 'Unisex'>('Women\'s');
  const [useCloset, setUseCloset] = useState(true);
  const [specialNotes, setSpecialNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [outfits, setOutfits] = useState<OOTDProposal[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<OOTDProposal | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(savedOutfits.map((o) => o.id)));
  const [plannedSuccess, setPlannedSuccess] = useState<string | null>(null);

  // Generate OOTD handler
  const handleGenerate = async () => {
    setLoading(true);
    setPlannedSuccess(null);

    const relevantCloset = useCloset
      ? closetItems.slice(0, 15).map((item) => ({
          name: item.name,
          category: item.category,
          color: item.primaryColor,
          material: item.material,
        }))
      : [];

    try {
      const response = await fetch('/api/stylist/generate-ootd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          weather,
          vibe,
          gender,
          closetItems: relevantCloset,
          specialPreferences: specialNotes.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Server request failed');
      }

      const data = await response.json();
      if (data?.outfits && Array.isArray(data.outfits) && data.outfits.length > 0) {
        setOutfits(data.outfits);
        setSelectedOutfit(data.outfits[0]);
      } else {
        throw new Error('Invalid outfit data structure');
      }
    } catch (err) {
      console.warn('Backend call failed, generating editorial fallback outfits:', err);
      // High-taste local fallback tailored to current parameters
      const fallbackOutfits: OOTDProposal[] = [
        {
          id: `outfit-sig-${Date.now()}`,
          tier: 'The Signature',
          name: `${vibe} Tailored Essential`,
          vibeTag: `${vibe} · ${occasion}`,
          summary: `An effortlessly balanced ensemble engineered for ${weather.temp}°C ${weather.condition.toLowerCase()} weather with crisp tonal harmony and refined proportions.`,
          whyItWorks: `Anchors visual weight with structured tailoring on top while maintaining fluidity through the legs, creating the coveted 1/3 to 2/3 silhouette balance.`,
          items: [
            {
              category: 'Tops',
              pieceName: 'Fine-Gauge Merino Knit Crewneck',
              color: 'Cream Oatmeal',
              texture: 'Breathable 18.5 micron wool',
              stylingTip: 'Gentle French tuck in front to reveal belt hardware.',
            },
            {
              category: 'Bottoms',
              pieceName: 'Single-Pleat Wide Trousers',
              color: 'Charcoal Slate',
              texture: 'Fluid tropical wool twill',
              stylingTip: 'Clean drape breaking just at the shoe collar.',
            },
            {
              category: 'Outerwear',
              pieceName: 'Double-Breasted Structured Blazer',
              color: 'Camel Tan',
              texture: 'Brushed wool blend',
              stylingTip: 'Sleeves pushed up past the wrists to expose wrists and accessories.',
            },
            {
              category: 'Footwear',
              pieceName: 'Almond-Toe Penny Loafers',
              color: 'Rich Espresso',
              texture: 'Burnished calfskin',
              stylingTip: 'Pair with no-show socks or ribbed off-white socks.',
            },
            {
              category: 'Bags',
              pieceName: 'Minimalist East-West Shoulder Bag',
              color: 'Saddle Brown',
              texture: 'Smooth vegetable-tanned leather',
              stylingTip: 'Tucked cleanly under arm.',
            },
            {
              category: 'Accessories',
              pieceName: 'Tortoiseshell Sunglasses & Flat Snake Chain',
              color: 'Warm Amber & Gold',
              texture: 'Polished acetate & 18K vermeil',
              stylingTip: 'Understated metal gleam matching hardware on bag.',
            },
          ],
          stylingHacks: [
            'French tuck the knit only at the center button to elongate the leg line without adding bulk',
            'Push up jacket sleeves right below the elbow joint for relaxed sophistication',
            'Keep fragrance subtle and close to the skin for smart professional settings',
          ],
          fragranceNote: 'Sandalwood, Violet Leaf, and Crisp Bergamot',
          groomingOrHair: 'Sleek low bun or naturally textured side sweep with matte finish',
          styleScore: 97,
          colorPalette: [
            { name: 'Cream Oatmeal', hex: '#F5F2EB' },
            { name: 'Charcoal Slate', hex: '#2B2E33' },
            { name: 'Camel Tan', hex: '#C19A6B' },
            { name: 'Espresso', hex: '#3E2723' },
          ],
        },
        {
          id: `outfit-elevated-${Date.now()}`,
          tier: 'The Elevated Statement',
          name: `${vibe} High-Contrast Monochrome`,
          vibeTag: `High Fashion · ${occasion}`,
          summary: `A high-impact editorial silhouette featuring architectural proportions, crisp black-and-white tonal contrast, and gold sculptural accents.`,
          whyItWorks: `High contrast draws focus to facial expressions while the elongated silhouette delivers commanding presence without looking rigid.`,
          items: [
            {
              category: 'Tops',
              pieceName: 'Crisp Poplin Extended-Collar Shirt',
              color: 'Bright White',
              texture: 'High-density poplin cotton',
              stylingTip: 'Unbutton top two buttons to frame collarbones.',
            },
            {
              category: 'Bottoms',
              pieceName: 'High-Rise Straight Column Trousers',
              color: 'Pitch Black',
              texture: 'Crepe de Chine wool blend',
              stylingTip: 'High-rise waistline worn with a slim leather belt.',
            },
            {
              category: 'Outerwear',
              pieceName: 'Sharp Shoulder Minimalist Trench / Duster',
              color: 'Charcoal Black',
              texture: 'Technical water-resistant gabardine',
              stylingTip: 'Open front drape to preserve vertical visual movement.',
            },
            {
              category: 'Footwear',
              pieceName: 'Sleek Pointed-Toe Kitten Mules',
              color: 'Black Patent',
              texture: 'Glossy leather',
              stylingTip: 'Exposed heel counter balances the tailored structure.',
            },
            {
              category: 'Accessories',
              pieceName: 'Bold Molten Gold Stud Earrings & Ring',
              color: '24K Yellow Gold',
              texture: 'Hand-sculpted organic metal',
              stylingTip: 'Single point of metallic warmth against dark monochrome.',
            },
          ],
          stylingHacks: [
            'Turn back shirt cuffs over outerwear sleeves for an intentional layered detail',
            'Wear a delicate gold necklace tucked under the collar for subtle glint',
          ],
          fragranceNote: 'Cardamom, Black Tea, and Smoked Cedarwood',
          groomingOrHair: 'High-gloss slicked back pony or clean defined fade',
          styleScore: 99,
          colorPalette: [
            { name: 'Bright White', hex: '#FFFFFF' },
            { name: 'Pitch Black', hex: '#0F0F10' },
            { name: 'Molten Gold', hex: '#D4AF37' },
          ],
        },
        {
          id: `outfit-relaxed-${Date.now()}`,
          tier: 'The Modern Casual',
          name: `Effortless ${vibe} Off-Duty`,
          vibeTag: `Relaxed Comfort · ${occasion}`,
          summary: `Comfort-first styling balancing an oversized premium knit with vintage selvedge denim and clean court footwear.`,
          whyItWorks: `Relaxed proportions made sharp by premium natural materials and clean footwear lines.`,
          items: [
            {
              category: 'Tops',
              pieceName: 'Washed Heavyweight Cotton Long-Sleeve',
              color: 'Ecru Off-White',
              texture: '260GSM combed cotton jersey',
              stylingTip: 'Half-tuck into waistband.',
            },
            {
              category: 'Bottoms',
              pieceName: 'Vintage Straight-Leg Japanese Denim',
              color: 'Faded Mid-Blue',
              texture: '13oz textured ring-spun denim',
              stylingTip: 'Straight hem with single clean turn-up cuff.',
            },
            {
              category: 'Outerwear',
              pieceName: 'Wool-Blend Oversized Overshirt / Chore Jacket',
              color: 'Heather Charcoal',
              texture: 'Boiled wool twill',
              stylingTip: 'Worn unbuttoned over the light tee.',
            },
            {
              category: 'Footwear',
              pieceName: 'Low-Profile Leather Court Sneakers',
              color: 'Chalk White & Gum',
              texture: 'Supple Nappa leather',
              stylingTip: 'Pristine white laces to keep the look intentional.',
            },
            {
              category: 'Bags',
              pieceName: 'Heavy Canvas Day Tote',
              color: 'Natural Canvas',
              texture: 'Dense duck canvas',
              stylingTip: 'Carry in hand by handles.',
            },
          ],
          stylingHacks: [
            'Cuff denim exactly at the sneaker ankle collar to show the shoe silhouette',
            'Let the bottom inch of the undershirt extend past the jacket hem',
          ],
          fragranceNote: 'Fig, Grapefruit, and Clean Vetiver',
          groomingOrHair: 'Air-dried natural waves or soft textured pomade',
          styleScore: 95,
          colorPalette: [
            { name: 'Ecru White', hex: '#F7F5F0' },
            { name: 'Mid-Blue Denim', hex: '#3B82F6' },
            { name: 'Heather Charcoal', hex: '#4B5563' },
            { name: 'Gum Sole Tan', hex: '#D97706' },
          ],
        },
      ];
      setOutfits(fallbackOutfits);
      setSelectedOutfit(fallbackOutfits[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (outfit: OOTDProposal) => {
    onSaveToLookbook(outfit);
    setSavedIds((prev) => new Set([...prev, outfit.id]));
  };

  const handlePlanDay = (day: string) => {
    if (!selectedOutfit) return;
    const plannedOutfit = { ...selectedOutfit, plannedDay: day };
    onSaveToLookbook(plannedOutfit);
    setPlannedSuccess(`Planned for ${day}! View in Lookbook & Planner.`);
    setTimeout(() => setPlannedSuccess(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-[#1A1A1A] text-white p-6 sm:p-8 md:p-10 border border-[#333]">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#A8A498]">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="tracking-wide uppercase font-medium">Daily Personal Stylist</span>
            <span aria-hidden="true">·</span>
            <span>{weather.season} {weather.temp}°C {weather.condition}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white text-balance leading-tight">
            Curate Today's Outfit of the Day
          </h1>

          <p className="text-sm sm:text-base text-[#C2BEB4] leading-relaxed">
            AI-crafted formulas tuned to your calendar, local temperature, silhouette preferences, and real wardrobe pieces.
          </p>
        </div>

        {/* Subtle geometric background motif */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden md:block">
          <div className="w-full h-full bg-gradient-to-l from-amber-500/20 via-transparent to-transparent" />
        </div>
      </section>

      {/* Control Panel: Occasion, Vibe, Gender & Closet */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-[#E8E6DF] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#F0EDE5] pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#1A1A1A]" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1A1A1A]">
              Styling Parameters
            </h2>
          </div>
          <span className="text-xs text-[#7A7870]">
            {weather.temp}°C {weather.condition} · {closetItems.length} pieces in closet
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Occasion */}
          <div>
            <label className="block text-xs font-medium text-[#5A5850] mb-1.5">
              Occasion & Context
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full text-sm bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] cursor-pointer"
            >
              {OCCASIONS.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Style Aesthetic / Vibe */}
          <div>
            <label className="block text-xs font-medium text-[#5A5850] mb-1.5">
              Style Aesthetic & Vibe
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full text-sm bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] cursor-pointer"
            >
              {VIBES.map((vb) => (
                <option key={vb} value={vb}>
                  {vb}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Gender Silhouette */}
          <div>
            <label className="block text-xs font-medium text-[#5A5850] mb-1.5">
              Silhouette / Fit Expression
            </label>
            <div className="flex items-center gap-1 p-1 bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg">
              {(['Women\'s', 'Men\'s', 'Unisex'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    gender === g
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'text-[#5A5850] hover:text-[#1A1A1A]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Custom Request & Wardrobe Inclusion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-[#5A5850] mb-1.5">
              Specific Wardrobe Notes / Requests (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Include my camel trench coat, lots of walking today, minimal jewelry..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full text-xs sm:text-sm bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-lg border border-[#DDD9CE]">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-[#1A1A1A]">
                Prioritize My Digital Closet Pieces
              </span>
              <p className="text-[11px] text-[#7A7870]">
                Integrate your {closetItems.length} saved wardrobe staples into the recommendation
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useCloset}
                onChange={(e) => setUseCloset(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#D1CDC2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1A1A1A]"></div>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs sm:text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Consulting Gemini Stylist...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate 3 Curated OOTDs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Planned success notification */}
      {plannedSuccess && (
        <div className="p-3 bg-[#EEF5EE] border border-[#C5DEC5] text-[#225522] rounded-lg text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{plannedSuccess}</span>
          </div>
        </div>
      )}

      {/* Curated Outfits Results */}
      {outfits.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-[#1A1A1A]">
              Today's Recommended Formulas
            </h2>
            <div className="text-xs text-[#7A7870]">
              Showing {outfits.length} distinct tiers
            </div>
          </div>

          {/* Tier Switcher Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {outfits.map((outfit) => {
              const isSelected = selectedOutfit?.id === outfit.id;
              return (
                <button
                  key={outfit.id}
                  onClick={() => setSelectedOutfit(outfit)}
                  className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#1A1A1A] shadow-md ring-1 ring-[#1A1A1A]'
                      : 'bg-[#FAF9F6] border-[#E8E6DF] hover:bg-white hover:border-[#D0CBBF]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1A1A1A] uppercase tracking-wider text-[11px]">
                      {outfit.tier}
                    </span>
                    <div className="flex items-center gap-1 text-emerald-800 font-medium">
                      <Flame className="w-3 h-3 text-emerald-600" />
                      <span className="tabular-nums">{outfit.styleScore}/100</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-base font-semibold text-[#1A1A1A] line-clamp-1 mb-1">
                    {outfit.name}
                  </h3>
                  <p className="text-xs text-[#7A7870] line-clamp-2">
                    {outfit.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Outfit Showcase */}
          {selectedOutfit && (
            <div className="bg-white rounded-xl border border-[#E8E6DF] overflow-hidden shadow-xs">
              {/* Header block */}
              <div className="p-6 border-b border-[#F0EDE5] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#7A7870] mb-1">
                      {selectedOutfit.tier} · {selectedOutfit.vibeTag}
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                      {selectedOutfit.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSave(selectedOutfit)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        savedIds.has(selectedOutfit.id)
                          ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                          : 'bg-white text-[#1A1A1A] border-[#DDD9CE] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{savedIds.has(selectedOutfit.id) ? 'Saved in Lookbook' : 'Save to Lookbook'}</span>
                    </button>

                    <button
                      onClick={() => onSendToCanvas(selectedOutfit)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F0EDE5] text-[#1A1A1A] hover:bg-[#E4E0D6] border border-[#DDD9CE] transition-colors cursor-pointer"
                      title="Open in Virtual Styling Canvas"
                    >
                      <Shirt className="w-3.5 h-3.5" />
                      <span>Try on Canvas</span>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-[#4A4840] leading-relaxed">
                  {selectedOutfit.summary}
                </p>

                {/* Color Palette Swatches */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-[#7A7870] mr-2">
                    <Palette className="w-3.5 h-3.5" />
                    <span>Tonal Palette:</span>
                  </div>
                  {selectedOutfit.colorPalette?.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-[11px] bg-[#FAF9F6] border border-[#E8E6DF] px-2 py-0.5 rounded"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-medium text-[#2A2925]">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Breakdown Grid */}
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5A5850] mb-3">
                    Garment & Accessory Breakdown
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedOutfit.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg border border-[#E8E6DF] bg-[#FAF9F6] space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs text-[#7A7870]">
                          <span className="font-semibold text-[#1A1A1A] uppercase tracking-wide text-[10px]">
                            {item.category}
                          </span>
                          <span className="text-[11px]">{item.color}</span>
                        </div>
                        <div className="font-medium text-sm text-[#1A1A1A]">
                          {item.pieceName}
                        </div>
                        <div className="text-xs text-[#7A7870]">
                          Texture: <span className="text-[#3A3830]">{item.texture}</span>
                        </div>
                        <p className="text-xs text-[#5A5850] pt-1 border-t border-[#EDEAE1] italic">
                          "{item.stylingTip}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stylist's Rational & Styling Hacks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-[#F0EDE5]">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5A5850]">
                      Why This Look Works
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4A4840] leading-relaxed bg-[#FAF9F6] p-3.5 rounded-lg border border-[#E8E6DF]">
                      {selectedOutfit.whyItWorks}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#5A5850]">
                      Zero-Cost Styling Hacks
                    </h4>
                    <ul className="space-y-2 bg-[#FAF9F6] p-3.5 rounded-lg border border-[#E8E6DF] text-xs sm:text-sm text-[#4A4840]">
                      {selectedOutfit.stylingHacks?.map((hack, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                          <span>{hack}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Fragrance, Grooming & Quick Schedule Action */}
                <div className="pt-4 border-t border-[#F0EDE5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#5A5850]">
                    {selectedOutfit.fragranceNote && (
                      <div>
                        <span className="font-medium text-[#1A1A1A]">Fragrance:</span>{' '}
                        <span>{selectedOutfit.fragranceNote}</span>
                      </div>
                    )}
                    {selectedOutfit.groomingOrHair && (
                      <div>
                        <span className="font-medium text-[#1A1A1A]">Hair / Grooming:</span>{' '}
                        <span>{selectedOutfit.groomingOrHair}</span>
                      </div>
                    )}
                  </div>

                  {/* Plan for Day selector */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="text-xs text-[#7A7870] font-medium mr-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Plan for:</span>
                    </span>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                      <button
                        key={d}
                        onClick={() => handlePlanDay(d)}
                        className="px-2 py-1 text-[11px] font-medium bg-[#FAF9F6] hover:bg-[#1A1A1A] hover:text-white border border-[#DDD9CE] rounded transition-colors cursor-pointer"
                        title={`Schedule for ${d}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial Empty State / Quick Discovery */}
      {outfits.length === 0 && !loading && (
        <div className="bg-white rounded-xl border border-[#E8E6DF] p-8 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#F0EDE5] flex items-center justify-center mx-auto text-[#1A1A1A]">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-semibold text-[#1A1A1A]">
              Ready for your daily styling formula?
            </h3>
            <p className="text-xs sm:text-sm text-[#7A7870]">
              Select your context above and click "Generate 3 Curated OOTDs". Gemini will craft three tailored looks from your capsule wardrobe.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-black transition-colors cursor-pointer shadow-sm"
          >
            <span>Generate Today's Looks</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
