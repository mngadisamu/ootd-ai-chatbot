import React, { useState } from 'react';
import {
  Plus,
  Shirt,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  RefreshCw,
  Check,
  Palette,
  X,
  Layers,
  Flame,
} from 'lucide-react';
import { ClosetItem, GarmentCategory, OOTDProposal } from '../types';

interface DigitalClosetProps {
  closetItems: ClosetItem[];
  onAddClosetItem: (item: ClosetItem) => void;
  onRemoveClosetItem: (id: string) => void;
  onSaveToLookbook: (outfit: OOTDProposal) => void;
}

const CATEGORIES: GarmentCategory[] = [
  'Tops',
  'Bottoms',
  'Outerwear',
  'Footwear',
  'Bags',
  'Accessories',
];

export const DigitalCloset: React.FC<DigitalClosetProps> = ({
  closetItems,
  onAddClosetItem,
  onRemoveClosetItem,
  onSaveToLookbook,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<GarmentCategory>('Tops');
  const [newItemColor, setNewItemColor] = useState('');
  const [newItemColorHex, setNewItemColorHex] = useState('#222222');
  const [newItemMaterial, setNewItemMaterial] = useState('');
  const [newItemStyleTags, setNewItemStyleTags] = useState('');
  const [newItemImage, setNewItemImage] = useState<string | null>(null);

  // Interactive Styling Canvas ("Try Gemini Canvas") state
  const [canvasTop, setCanvasTop] = useState<ClosetItem | null>(null);
  const [canvasBottom, setCanvasBottom] = useState<ClosetItem | null>(null);
  const [canvasOuterwear, setCanvasOuterwear] = useState<ClosetItem | null>(null);
  const [canvasFootwear, setCanvasFootwear] = useState<ClosetItem | null>(null);
  const [canvasBag, setCanvasBag] = useState<ClosetItem | null>(null);
  const [canvasAccessory, setCanvasAccessory] = useState<ClosetItem | null>(null);
  const [canvasSavedMsg, setCanvasSavedMsg] = useState(false);

  // Filter items
  const filteredItems =
    selectedCategory === 'All'
      ? closetItems
      : closetItems.filter((item) => item.category === selectedCategory);

  // Image upload and AI Auto-Tagging
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setNewItemImage(dataUrl);
      setAnalyzingImage(true);

      try {
        const res = await fetch('/api/stylist/analyze-garment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: dataUrl,
            imageMimeType: file.type || 'image/jpeg',
          }),
        });

        if (res.ok) {
          const autoData = await res.json();
          if (autoData.name) setNewItemName(autoData.name);
          if (autoData.category && CATEGORIES.includes(autoData.category)) {
            setNewItemCategory(autoData.category);
          }
          if (autoData.primaryColor) setNewItemColor(autoData.primaryColor);
          if (autoData.colorHex) setNewItemColorHex(autoData.colorHex);
          if (autoData.material) setNewItemMaterial(autoData.material);
          if (autoData.styleTags && Array.isArray(autoData.styleTags)) {
            setNewItemStyleTags(autoData.styleTags.join(', '));
          }
        }
      } catch (err) {
        console.warn('AI Auto-tagging error:', err);
      } finally {
        setAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ClosetItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      primaryColor: newItemColor.trim() || 'Neutral',
      colorHex: newItemColorHex || '#4B5563',
      material: newItemMaterial.trim() || 'Textured Blend',
      pattern: 'Solid',
      styleTags: newItemStyleTags
        ? newItemStyleTags.split(',').map((t) => t.trim())
        : ['Contemporary'],
      seasons: ['Spring', 'Autumn'],
      pairingSuggestions: ['Versatile pairing across wardrobe'],
      image: newItemImage || undefined,
    };

    onAddClosetItem(newItem);
    // Reset form
    setNewItemName('');
    setNewItemColor('');
    setNewItemMaterial('');
    setNewItemStyleTags('');
    setNewItemImage(null);
    setShowAddModal(false);
  };

  // Canvas outfit save
  const handleSaveCanvasOutfit = () => {
    if (!canvasTop && !canvasBottom) return;

    const itemsList = [];
    if (canvasTop) {
      itemsList.push({
        category: 'Tops',
        pieceName: canvasTop.name,
        color: canvasTop.primaryColor,
        texture: canvasTop.material,
        stylingTip: 'Tucked or draped according to silhouette balance.',
      });
    }
    if (canvasBottom) {
      itemsList.push({
        category: 'Bottoms',
        pieceName: canvasBottom.name,
        color: canvasBottom.primaryColor,
        texture: canvasBottom.material,
        stylingTip: 'High-rise break aligned with footwear vamp.',
      });
    }
    if (canvasOuterwear) {
      itemsList.push({
        category: 'Outerwear',
        pieceName: canvasOuterwear.name,
        color: canvasOuterwear.primaryColor,
        texture: canvasOuterwear.material,
        stylingTip: 'Open front drape to elongate the vertical frame.',
      });
    }
    if (canvasFootwear) {
      itemsList.push({
        category: 'Footwear',
        pieceName: canvasFootwear.name,
        color: canvasFootwear.primaryColor,
        texture: canvasFootwear.material,
        stylingTip: 'Clean silhouette anchoring the look.',
      });
    }
    if (canvasBag) {
      itemsList.push({
        category: 'Bags',
        pieceName: canvasBag.name,
        color: canvasBag.primaryColor,
        texture: canvasBag.material,
        stylingTip: 'Handheld or underarm tuck.',
      });
    }
    if (canvasAccessory) {
      itemsList.push({
        category: 'Accessories',
        pieceName: canvasAccessory.name,
        color: canvasAccessory.primaryColor,
        texture: canvasAccessory.material,
        stylingTip: 'Intentional metallic or textural accent.',
      });
    }

    const newOOTD: OOTDProposal = {
      id: `canvas-ootd-${Date.now()}`,
      tier: 'Custom Canvas Assembly',
      name: `${canvasOuterwear?.name || canvasTop?.name || 'Curated'} & ${canvasBottom?.name || 'Trousers'}`,
      vibeTag: 'Personal Wardrobe Assembly',
      summary: 'A bespoke outfit hand-assembled on the interactive styling canvas using items from your digital closet.',
      whyItWorks: 'Harmonious textural interplay across wool, cotton, and structured leather surfaces.',
      items: itemsList,
      stylingHacks: [
        'Push up outerwear sleeves to expose wrists and accessories',
        'Maintain the 1/3 top to 2/3 bottom proportion rule with high-waisted tailoring',
      ],
      fragranceNote: 'Fresh Cedar, Amber, and Bergamot',
      groomingOrHair: 'Effortless parted texture',
      styleScore: 95,
      colorPalette: [
        { name: canvasTop?.primaryColor || 'Neutral', hex: canvasTop?.colorHex || '#F5F2EB' },
        { name: canvasBottom?.primaryColor || 'Dark', hex: canvasBottom?.colorHex || '#1F2421' },
      ],
      dateCreated: new Date().toISOString().split('T')[0],
      isFavorite: true,
    };

    onSaveToLookbook(newOOTD);
    setCanvasSavedMsg(true);
    setTimeout(() => setCanvasSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Overview */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E6DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C827A] uppercase tracking-wider">
            <Shirt className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>Wardrobe Inventory & Virtual Canvas</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Digital Capsule Closet
          </h1>
          <p className="text-sm text-[#5A5850]">
            Catalog your actual wardrobe pieces. Gemini uses these items to construct your daily OOTDs and travel capsules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer self-start md:self-auto shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Wardrobe Item</span>
        </button>
      </section>

      {/* Interactive Styling Canvas ("Try Gemini Canvas") */}
      <section className="bg-[#FAF9F6] rounded-2xl p-6 border border-[#E8E6DF] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E6DF] pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
                Interactive Styling Canvas
              </h2>
            </div>
            <p className="text-xs text-[#7A7870]">
              Click pieces from your closet below to slot them into this visual flat-lay board.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canvasSavedMsg && (
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved to Lookbook!</span>
              </span>
            )}
            <button
              onClick={handleSaveCanvasOutfit}
              disabled={!canvasTop && !canvasBottom}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#1A1A1A] hover:bg-black text-white rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
            >
              Save Canvas OOTD
            </button>
          </div>
        </div>

        {/* 6-Slot Visual Canvas Board */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Outerwear', item: canvasOuterwear, set: setCanvasOuterwear },
            { label: 'Top', item: canvasTop, set: setCanvasTop },
            { label: 'Bottom', item: canvasBottom, set: setCanvasBottom },
            { label: 'Footwear', item: canvasFootwear, set: setCanvasFootwear },
            { label: 'Bag', item: canvasBag, set: setCanvasBag },
            { label: 'Accessory', item: canvasAccessory, set: setCanvasAccessory },
          ].map((slot, sIdx) => (
            <div
              key={sIdx}
              className="bg-white rounded-xl border border-[#E8E6DF] p-3 text-center space-y-2 relative min-h-[120px] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[10px] font-semibold text-[#8C827A] uppercase tracking-wider">
                <span>{slot.label}</span>
                {slot.item && (
                  <button
                    onClick={() => slot.set(null)}
                    className="text-[#999] hover:text-rose-600 cursor-pointer"
                    title="Remove slot"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {slot.item ? (
                <div className="space-y-1 my-auto">
                  <div
                    className="w-4 h-4 rounded-full mx-auto border border-black/10"
                    style={{ backgroundColor: slot.item.colorHex }}
                  />
                  <div className="font-semibold text-xs text-[#1A1A1A] line-clamp-2">
                    {slot.item.name}
                  </div>
                  <div className="text-[10px] text-[#7A7870] line-clamp-1">
                    {slot.item.material}
                  </div>
                </div>
              ) : (
                <div className="my-auto text-[11px] text-[#A09C92] italic">
                  Slot empty
                </div>
              )}

              <div className="text-[10px] text-[#8C827A]">
                {slot.item ? slot.item.primaryColor : 'Select below'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closet Inventory Browser */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E6DF] space-y-6">
        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F0EDE5] pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-[#FAF9F6] text-[#5A5850] hover:text-[#1A1A1A] border border-[#DDD9CE]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#7A7870]">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} shown
          </span>
        </div>

        {/* Garment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-[#FAF9F6] hover:bg-white rounded-xl border border-[#E8E6DF] hover:border-[#C0BCB0] p-4 transition-all space-y-3 shadow-2xs hover:shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-[#8C827A] uppercase tracking-wider">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: item.colorHex }}
                      title={item.primaryColor}
                    />
                    <span className="text-[11px] text-[#5A5850]">{item.primaryColor}</span>
                  </div>
                </div>

                <h3 className="font-serif text-sm font-semibold text-[#1A1A1A] leading-snug">
                  {item.name}
                </h3>

                <div className="text-[11px] text-[#7A7870]">
                  Material: <span className="text-[#3A3830]">{item.material}</span>
                </div>

                {item.styleTags && item.styleTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.styleTags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] text-[#6A6860] bg-white border border-[#E0DCD3] px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions: Slot into canvas & delete */}
              <div className="pt-3 border-t border-[#EDEAE1] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    if (item.category === 'Tops') setCanvasTop(item);
                    if (item.category === 'Bottoms') setCanvasBottom(item);
                    if (item.category === 'Outerwear') setCanvasOuterwear(item);
                    if (item.category === 'Footwear') setCanvasFootwear(item);
                    if (item.category === 'Bags') setCanvasBag(item);
                    if (item.category === 'Accessories') setCanvasAccessory(item);
                  }}
                  className="text-xs font-semibold text-[#1A1A1A] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add to Canvas</span>
                </button>

                <button
                  onClick={() => onRemoveClosetItem(item.id)}
                  aria-label="Remove item"
                  className="text-[#999] hover:text-rose-600 transition-colors p-1 cursor-pointer"
                  title="Remove from closet"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Garment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E6DF] shadow-xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F0EDE5] pb-3">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-[#1A1A1A]" />
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  Add Piece to Digital Closet
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#888] hover:text-[#1A1A1A] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Upload with AI Auto-Tag */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[#5A5850]">
                Photo Upload (Auto-extracts material, color, category & tags with Gemini)
              </label>
              <div className="border border-dashed border-[#DDD9CE] rounded-xl p-3 text-center bg-[#FAF9F6]">
                {newItemImage ? (
                  <div className="flex items-center justify-between">
                    <img
                      src={newItemImage}
                      alt="Garment upload"
                      className="w-16 h-16 object-cover rounded-lg border border-[#DDD9CE]"
                    />
                    <div className="text-left text-xs space-y-0.5 px-3 flex-1">
                      {analyzingImage ? (
                        <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Gemini is cataloging garment specs...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-emerald-700 font-medium">
                          <Check className="w-3.5 h-3.5" />
                          <span>Garment attributes auto-detected!</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewItemImage(null)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 py-3 cursor-pointer text-xs text-[#1A1A1A] hover:text-black">
                    <Upload className="w-4 h-4 text-[#7A7870]" />
                    <span>Upload photo to auto-fill details</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </div>

            <form onSubmit={handleSaveNewItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5A5850] mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pleated Wool Flannel Trousers"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A5850] mb-1">
                    Category *
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as GarmentCategory)}
                    className="w-full text-xs sm:text-sm bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A5850] mb-1">
                    Primary Color
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Oatmeal Cream"
                    value={newItemColor}
                    onChange={(e) => setNewItemColor(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A5850] mb-1">
                    Fabric / Material
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Cashmere"
                    value={newItemMaterial}
                    onChange={(e) => setNewItemMaterial(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A5850] mb-1">
                    Color Hex Swatch
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newItemColorHex}
                      onChange={(e) => setNewItemColorHex(e.target.value)}
                      className="w-8 h-8 rounded border border-[#DDD9CE] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newItemColorHex}
                      onChange={(e) => setNewItemColorHex(e.target.value)}
                      className="w-full text-xs bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-2.5 py-1.5 text-[#1A1A1A]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5850] mb-1">
                  Style Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quiet Luxury, Minimalist, Tailored"
                  value={newItemStyleTags}
                  onChange={(e) => setNewItemStyleTags(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-[#FAF9F6] border border-[#DDD9CE] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                />
              </div>

              <div className="pt-3 border-t border-[#F0EDE5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#5A5850] hover:text-[#1A1A1A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-[#1A1A1A] hover:bg-black text-white rounded-lg transition-colors cursor-pointer"
                >
                  Save to Closet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
