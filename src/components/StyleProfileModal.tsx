import React, { useState } from 'react';
import { X, Sparkles, Check, Palette, User, Compass } from 'lucide-react';

interface StyleProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyProfile: (profile: { archetype: string; season: string }) => void;
}

const ARCHETYPES = [
  {
    name: 'Quiet Luxury Minimalist',
    desc: 'Structured tailoring, monochromatic tones, rich natural fibers (cashmere, silk, tropical wool), clean unbranded lines.',
    palette: ['#F5F2EB', '#2B2E33', '#C19A6B', '#3E2723'],
  },
  {
    name: 'Parisian Effortless Chic',
    desc: 'High-waisted trousers, classic Breton stripes, crisp cotton poplin, tailored blazers with pushed-up sleeves, understated kitten heels.',
    palette: ['#FFFFFF', '#111827', '#991B1B', '#E5E7EB'],
  },
  {
    name: 'Urban Streetwear Modernist',
    desc: 'Heavyweight loopback hoodies, raw selvedge denim, technical footwear, utilitarian pockets, layered silhouettes.',
    palette: ['#1F2937', '#6B7280', '#F9FAFB', '#D97706'],
  },
  {
    name: 'Old Money Heritage',
    desc: 'Pleated trousers, cable-knit crickets, wax outerwear, tortoiseshell accessories, burnished leather loafers.',
    palette: ['#1E3A8A', '#064E3B', '#D4AF37', '#FDFBF7'],
  },
];

const SEASONS = [
  {
    name: 'Deep Autumn',
    desc: 'Warm, rich, earthy tones with golden undertones. Flattered by espresso, camel, olive, and warm rust.',
    colors: [
      { name: 'Warm Camel', hex: '#C19A6B' },
      { name: 'Forest Olive', hex: '#526E58' },
      { name: 'Rich Espresso', hex: '#3E2723' },
      { name: 'Burnt Terracotta', hex: '#A45A3C' },
    ],
  },
  {
    name: 'Cool Winter',
    desc: 'High contrast, crisp, vivid neutrals. Flattered by pure optic white, pitch noir, emerald, and royal navy.',
    colors: [
      { name: 'Optic White', hex: '#FFFFFF' },
      { name: 'Midnight Black', hex: '#0F0F10' },
      { name: 'Royal Navy', hex: '#1E3A8A' },
      { name: 'Silver Slate', hex: '#94A3B8' },
    ],
  },
  {
    name: 'Soft Summer',
    desc: 'Muted, cool, delicate tones with powdery undertones. Flattered by dusty rose, heather charcoal, and sage.',
    colors: [
      { name: 'Heather Grey', hex: '#9CA3AF' },
      { name: 'Powder Blue', hex: '#93C5FD' },
      { name: 'Dusty Rose', hex: '#D8B4B8' },
      { name: 'Muted Sage', hex: '#A3B899' },
    ],
  },
  {
    name: 'Warm Spring',
    desc: 'Light, clear, radiant tones with peach and butter-yellow warmth. Flattered by cream, peach, coral, and buttermilk.',
    colors: [
      { name: 'Buttermilk', hex: '#FEF08A' },
      { name: 'Peach Cream', hex: '#FED7AA' },
      { name: 'Soft Coral', hex: '#FB7185' },
      { name: 'Warm Ecru', hex: '#F5EBE6' },
    ],
  },
];

export const StyleProfileModal: React.FC<StyleProfileModalProps> = ({
  isOpen,
  onClose,
  onApplyProfile,
}) => {
  const [selectedArchetype, setSelectedArchetype] = useState(ARCHETYPES[0].name);
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0].name);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onApplyProfile({ archetype: selectedArchetype, season: selectedSeason });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-[#E8E6DF] shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#F0EDE5] pb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
              Style Archetype & Seasonal Color Analysis
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-[#1A1A1A] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Style Archetype Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
            1. Select Your Style Archetype
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ARCHETYPES.map((arch) => (
              <button
                key={arch.name}
                type="button"
                onClick={() => setSelectedArchetype(arch.name)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  selectedArchetype === arch.name
                    ? 'border-[#1A1A1A] bg-[#FAF9F6] ring-1 ring-[#1A1A1A]'
                    : 'border-[#E8E6DF] hover:border-[#C0BCB0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-[#1A1A1A]">
                    {arch.name}
                  </span>
                  {selectedArchetype === arch.name && (
                    <Check className="w-4 h-4 text-[#1A1A1A]" />
                  )}
                </div>
                <p className="text-[11px] text-[#66645C] line-clamp-2">
                  {arch.desc}
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  {arch.palette.map((color, cIdx) => (
                    <span
                      key={cIdx}
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Color Season Selection */}
        <div className="space-y-3 pt-2 border-t border-[#F0EDE5]">
          <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
            2. Select Your Seasonal Color Palette
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SEASONS.map((sn) => (
              <button
                key={sn.name}
                type="button"
                onClick={() => setSelectedSeason(sn.name)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  selectedSeason === sn.name
                    ? 'border-[#1A1A1A] bg-[#FAF9F6] ring-1 ring-[#1A1A1A]'
                    : 'border-[#E8E6DF] hover:border-[#C0BCB0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-[#1A1A1A]">
                    {sn.name}
                  </span>
                  {selectedSeason === sn.name && (
                    <Check className="w-4 h-4 text-[#1A1A1A]" />
                  )}
                </div>
                <p className="text-[11px] text-[#66645C] line-clamp-2">
                  {sn.desc}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  {sn.colors.map((c, cIdx) => (
                    <span
                      key={cIdx}
                      className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#F0EDE5] flex items-center justify-between">
          <div className="text-xs text-[#7A7870]">
            Applied across all AI outfit generation
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs text-emerald-700 font-medium">
                Profile Saved!
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Save Style Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
