export type StorageLocation = 'Fridge' | 'Freezer' | 'Pantry';

export type FoodCategory =
  | 'Produce'
  | 'Dairy'
  | 'Meat & Seafood'
  | 'Grains & Bakery'
  | 'Beverages'
  | 'Snacks'
  | 'Condiments';

export type ItemStatus = 'active' | 'consumed' | 'wasted';

export type UrgencyLevel = 'expired' | 'critical' | 'warning' | 'fresh';

export type SortOption = 'expiry' | 'name' | 'cost';

export type StorageFilter = 'All' | StorageLocation;

export type CategoryFilter = 'All' | FoodCategory;

export type StatusFilter = 'all' | ItemStatus;

export interface PantryItem {
  id: string;
  name: string;
  category: FoodCategory;
  storageLocation: StorageLocation;
  quantity: number;
  unit: string;
  estimatedCost: number;
  expiryDate: string; // YYYY-MM-DD
  status: ItemStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePantryItemInput {
  name: string;
  category: FoodCategory;
  storageLocation: StorageLocation;
  quantity: number;
  unit: string;
  estimatedCost: number;
  expiryDate: string;
  notes?: string;
  status?: ItemStatus;
}

export interface UpdatePantryItemInput {
  name?: string;
  category?: FoodCategory;
  storageLocation?: StorageLocation;
  quantity?: number;
  unit?: string;
  estimatedCost?: number;
  expiryDate?: string;
  status?: ItemStatus;
  notes?: string;
}

export type SqlOperationType = 'INIT' | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export interface SqlLogEntry {
  id: string;
  operation: SqlOperationType;
  sql: string;
  params: string;
  timestamp: string;
}

export interface UrgencyInfo {
  level: UrgencyLevel;
  label: string;
  shortLabel: string;
  badgeBg: string;
  badgeText: string;
  borderAccent: string;
}

export interface StorageBreakdown {
  location: StorageLocation;
  activeCount: number;
  expiringCount: number;
  totalValue: number;
}

export interface CategoryBreakdown {
  category: FoodCategory;
  count: number;
  value: number;
}

export interface PantryAnalytics {
  totalItems: number;
  activeCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  freshCount: number;
  consumedCount: number;
  wastedCount: number;
  wastePreventionRate: number;
  moneySaved: number;
  moneyLost: number;
  activeInventoryValue: number;
  storageBreakdown: StorageBreakdown[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface FilterSortOptions {
  searchQuery?: string;
  storageFilter?: StorageFilter;
  categoryFilter?: CategoryFilter;
  statusFilter?: StatusFilter;
  sortBy?: SortOption;
}
