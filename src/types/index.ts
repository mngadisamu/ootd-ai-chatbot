export type GarmentCategory = 'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear' | 'Bags' | 'Accessories';

export interface ClosetItem {
  id: string;
  name: string;
  category: GarmentCategory;
  primaryColor: string;
  colorHex: string;
  material: string;
  pattern: string;
  styleTags: string[];
  seasons: string[];
  pairingSuggestions: string[];
  image?: string;
  isFavorite?: boolean;
}

export interface OutfitPiece {
  category: string;
  pieceName: string;
  color: string;
  texture: string;
  stylingTip: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface OOTDProposal {
  id: string;
  tier: string; // e.g. "The Signature", "The Elevated Statement", "The Relaxed Modern"
  name: string;
  vibeTag: string;
  summary: string;
  whyItWorks: string;
  items: OutfitPiece[];
  stylingHacks: string[];
  fragranceNote: string;
  groomingOrHair: string;
  styleScore: number;
  colorPalette: ColorSwatch[];
  image?: string;
  plannedDay?: string; // e.g. "Monday"
  isFavorite?: boolean;
  dateCreated?: string;
}

export interface ZeroCostTweak {
  action: string;
  impact: string;
}

export interface PieceSwap {
  currentPiece: string;
  recommendedPiece: string;
  level: string; // "Quick Swap", "Elevated Pivot", "Statement Touch"
  fashionReason: string;
}

export interface OutfitUpgradeResult {
  detectedItems: string[];
  styleAssessment: string;
  scores: {
    overall: number;
    proportion: number;
    colorHarmony: number;
    silhouette: number;
    accessoryBalance: number;
  };
  strengths: string[];
  zeroCostTweaks: ZeroCostTweak[];
  pieceSwaps: PieceSwap[];
  upgradedPalette: ColorSwatch[];
  finalUpgradedOutfit: {
    title: string;
    summary: string;
    formula: string;
  };
}

export interface WeatherContext {
  temp: number;
  condition: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
}

export interface CapsulePiece {
  category: string;
  name: string;
  color: string;
  role: string;
}

export interface CapsuleDay {
  dayNumber: number;
  activityName: string;
  outfitTitle: string;
  piecesUsed: string[];
  stylingNote: string;
}

export interface CapsulePlan {
  capsuleSummary: string;
  pieces: CapsulePiece[];
  dailyItinerary: CapsuleDay[];
  packingWisdom: string[];
}
