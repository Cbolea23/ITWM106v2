import { FoodCategory, StorageLocation } from '../types/pantry';

export const COLORS = {
  primary: '#0F5132',
  primaryMid: '#157347',
  primaryLight: '#10B981',
  primarySoft: '#ECFDF5',
  primaryTint: '#D1FAE5',

  background: '#F4F7F5',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',

  expiredBg: '#FEE2E2',
  expiredText: '#991B1B',
  expiredAccent: '#DC2626',

  criticalBg: '#FFEDD5',
  criticalText: '#9A3412',
  criticalAccent: '#EA580C',

  warningBg: '#FEF3C7',
  warningText: '#92400E',
  warningAccent: '#D97706',

  freshBg: '#DCFCE7',
  freshText: '#166534',
  freshAccent: '#16A34A',

  consumedBg: '#DBEAFE',
  consumedText: '#1E40AF',
  wastedBg: '#F1F5F9',
  wastedText: '#475569',

  sqlInit: '#6366F1',
  sqlCreate: '#10B981',
  sqlRead: '#0284C7',
  sqlUpdate: '#D97706',
  sqlDelete: '#DC2626',
};

export const STORAGE_LOCATIONS: {
  label: StorageLocation;
  icon: string;
  description: string;
}[] = [
  { label: 'Fridge', icon: '❄️', description: '2°C – 4°C chilled perishables' },
  { label: 'Freezer', icon: '🧊', description: '-18°C long-term preservation' },
  { label: 'Pantry', icon: '🗄️', description: 'Cool, dry shelf storage' },
];

export const FOOD_CATEGORIES: {
  label: FoodCategory;
  icon: string;
  accent: string;
}[] = [
  { label: 'Produce', icon: '🥬', accent: '#16A34A' },
  { label: 'Dairy', icon: '🥛', accent: '#0284C7' },
  { label: 'Meat & Seafood', icon: '🍗', accent: '#DC2626' },
  { label: 'Grains & Bakery', icon: '🍞', accent: '#D97706' },
  { label: 'Beverages', icon: '🧃', accent: '#7C3AED' },
  { label: 'Snacks', icon: '🍪', accent: '#DB2777' },
  { label: 'Condiments', icon: '🧂', accent: '#475569' },
];

export const CATEGORY_ICON_MAP: Record<FoodCategory, string> = {
  Produce: '🥬',
  Dairy: '🥛',
  'Meat & Seafood': '🍗',
  'Grains & Bakery': '🍞',
  Beverages: '🧃',
  Snacks: '🍪',
  Condiments: '🧂',
};

export const STORAGE_ICON_MAP: Record<StorageLocation, string> = {
  Fridge: '❄️',
  Freezer: '🧊',
  Pantry: '🗄️',
};

export const COMMON_UNITS: string[] = [
  'pcs',
  'pack',
  'L',
  'mL',
  'kg',
  'g',
  'bottle',
  'jar',
  'loaf',
  'can',
];

export interface QuickFillPreset {
  name: string;
  category: FoodCategory;
  storageLocation: StorageLocation;
  quantity: number;
  unit: string;
  estimatedCost: number;
  daysOffset: number;
  notes: string;
}

export const QUICK_FILL_PRESETS: QuickFillPreset[] = [
  {
    name: 'Fresh Cow Milk',
    category: 'Dairy',
    storageLocation: 'Fridge',
    quantity: 1,
    unit: 'L',
    estimatedCost: 115,
    daysOffset: 2,
    notes: 'Keep on middle shelf, not the fridge door.',
  },
  {
    name: 'Free-Range Eggs',
    category: 'Dairy',
    storageLocation: 'Fridge',
    quantity: 12,
    unit: 'pcs',
    estimatedCost: 135,
    daysOffset: 10,
    notes: 'Store in original carton for steady temperature.',
  },
  {
    name: 'Chicken Breast Fillet',
    category: 'Meat & Seafood',
    storageLocation: 'Fridge',
    quantity: 500,
    unit: 'g',
    estimatedCost: 165,
    daysOffset: 1,
    notes: 'Cook tomorrow or move to freezer to extend +60 days.',
  },
  {
    name: 'Baby Spinach Leaves',
    category: 'Produce',
    storageLocation: 'Fridge',
    quantity: 1,
    unit: 'pack',
    estimatedCost: 85,
    daysOffset: 2,
    notes: 'Wrap with dry paper towel to absorb excess moisture.',
  },
  {
    name: 'Whole Wheat Bread',
    category: 'Grains & Bakery',
    storageLocation: 'Pantry',
    quantity: 1,
    unit: 'loaf',
    estimatedCost: 78,
    daysOffset: 4,
    notes: 'Freeze extra slices if not finishing this week.',
  },
  {
    name: 'Greek Yogurt Cup',
    category: 'Dairy',
    storageLocation: 'Fridge',
    quantity: 2,
    unit: 'pcs',
    estimatedCost: 140,
    daysOffset: 5,
    notes: 'Great for breakfast bowls or smoothies.',
  },
  {
    name: 'Ripe Tomatoes',
    category: 'Produce',
    storageLocation: 'Pantry',
    quantity: 6,
    unit: 'pcs',
    estimatedCost: 65,
    daysOffset: 3,
    notes: 'Keep stem-side down away from direct sunlight.',
  },
  {
    name: 'Jasmine Rice',
    category: 'Grains & Bakery',
    storageLocation: 'Pantry',
    quantity: 5,
    unit: 'kg',
    estimatedCost: 295,
    daysOffset: 45,
    notes: 'Seal in airtight container to prevent pantry pests.',
  },
];

export const STORAGE_EXTENSION_TIPS: {
  category: FoodCategory;
  icon: string;
  tip: string;
  extraDays: string;
}[] = [
  {
    category: 'Produce',
    icon: '🥬',
    tip: 'Line crisper drawers with a dry paper towel for leafy greens and herbs, and store bananas away from apples/tomatoes.',
    extraDays: '+4 to +7 days',
  },
  {
    category: 'Meat & Seafood',
    icon: '🍗',
    tip: 'Portion fresh meat into single-meal packs and move to the Freezer before Day 2 if your meal plan changes.',
    extraDays: '+60 to +90 days',
  },
  {
    category: 'Dairy',
    icon: '🥛',
    tip: 'Store milk and yogurt on interior fridge shelves rather than the warmer door racks.',
    extraDays: '+2 to +4 days',
  },
  {
    category: 'Grains & Bakery',
    icon: '🍞',
    tip: 'Slice extra bread and freeze in a sealed bag; toast directly from frozen whenever needed.',
    extraDays: '+30 days',
  },
];
