import { COLORS, FOOD_CATEGORIES, STORAGE_LOCATIONS } from '../constants/theme';
import {
  FilterSortOptions,
  PantryAnalytics,
  PantryItem,
  UrgencyInfo,
} from '../types/pantry';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function normalizeToMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysToISO(daysOffset: number, baseDate: Date = new Date()): string {
  const target = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate() + daysOffset
  );
  return formatDateISO(target);
}

export function parseISODateLocal(dateStr: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

export function isValidISODate(dateStr: string): boolean {
  return parseISODateLocal(dateStr) !== null;
}

export function getDaysUntilExpiry(
  expiryDate: string,
  referenceDate: Date = new Date()
): number {
  const parsed = parseISODateLocal(expiryDate);
  if (!parsed) return 0;

  const todayMidnight = normalizeToMidnight(referenceDate);
  const expiryMidnight = normalizeToMidnight(parsed);
  return Math.round((expiryMidnight.getTime() - todayMidnight.getTime()) / MS_PER_DAY);
}

export function getUrgencyInfo(daysUntilExpiry: number): UrgencyInfo {
  if (daysUntilExpiry < 0) {
    const overdue = Math.abs(daysUntilExpiry);
    return {
      level: 'expired',
      label: `Expired ${overdue}d ago`,
      shortLabel: `-${overdue}d`,
      badgeBg: COLORS.expiredBg,
      badgeText: COLORS.expiredText,
      borderAccent: COLORS.expiredAccent,
    };
  }

  if (daysUntilExpiry === 0) {
    return {
      level: 'critical',
      label: 'Expires Today!',
      shortLabel: 'Today',
      badgeBg: COLORS.criticalBg,
      badgeText: COLORS.criticalText,
      borderAccent: COLORS.criticalAccent,
    };
  }

  if (daysUntilExpiry <= 3) {
    return {
      level: 'critical',
      label: `Use in ${daysUntilExpiry}d`,
      shortLabel: `${daysUntilExpiry}d left`,
      badgeBg: COLORS.criticalBg,
      badgeText: COLORS.criticalText,
      borderAccent: COLORS.criticalAccent,
    };
  }

  if (daysUntilExpiry <= 7) {
    return {
      level: 'warning',
      label: `${daysUntilExpiry}d remaining`,
      shortLabel: `${daysUntilExpiry}d`,
      badgeBg: COLORS.warningBg,
      badgeText: COLORS.warningText,
      borderAccent: COLORS.warningAccent,
    };
  }

  return {
    level: 'fresh',
    label: `Fresh (${daysUntilExpiry}d)`,
    shortLabel: `${daysUntilExpiry}d`,
    badgeBg: COLORS.freshBg,
    badgeText: COLORS.freshText,
    borderAccent: COLORS.freshAccent,
  };
}

export function formatCurrencyPHP(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `₱${safe.toLocaleString('en-PH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function filterAndSortItems(
  items: PantryItem[],
  options: FilterSortOptions = {},
  referenceDate: Date = new Date()
): PantryItem[] {
  const {
    searchQuery = '',
    storageFilter = 'All',
    categoryFilter = 'All',
    statusFilter = 'active',
    sortBy = 'expiry',
  } = options;

  const query = searchQuery.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    if (storageFilter !== 'All' && item.storageLocation !== storageFilter) {
      return false;
    }
    if (categoryFilter !== 'All' && item.category !== categoryFilter) {
      return false;
    }
    if (query.length > 0) {
      const haystack = `${item.name} ${item.category} ${item.storageLocation} ${item.notes}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'cost') {
      return b.estimatedCost - a.estimatedCost;
    }
    const daysA = getDaysUntilExpiry(a.expiryDate, referenceDate);
    const daysB = getDaysUntilExpiry(b.expiryDate, referenceDate);
    if (daysA !== daysB) {
      return daysA - daysB;
    }
    return a.name.localeCompare(b.name);
  });
}

export function computeAnalytics(
  items: PantryItem[],
  referenceDate: Date = new Date()
): PantryAnalytics {
  const activeItems = items.filter((item) => item.status === 'active');
  const consumedItems = items.filter((item) => item.status === 'consumed');
  const wastedItems = items.filter((item) => item.status === 'wasted');

  let expiringSoonCount = 0;
  let expiredCount = 0;
  let freshCount = 0;
  let activeInventoryValue = 0;
  let expiredActiveValue = 0;

  for (const item of activeItems) {
    const days = getDaysUntilExpiry(item.expiryDate, referenceDate);
    activeInventoryValue += item.estimatedCost;
    if (days < 0) {
      expiredCount += 1;
      expiredActiveValue += item.estimatedCost;
    } else if (days <= 3) {
      expiringSoonCount += 1;
    } else {
      freshCount += 1;
    }
  }

  const consumedValue = consumedItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const wastedValue = wastedItems.reduce((sum, item) => sum + item.estimatedCost, 0);

  const resolvedCount = consumedItems.length + wastedItems.length;
  const wastePreventionRate =
    resolvedCount > 0 ? Math.round((consumedItems.length / resolvedCount) * 100) : 100;

  const storageBreakdown = STORAGE_LOCATIONS.map(({ label }) => {
    const inLocation = activeItems.filter((item) => item.storageLocation === label);
    const urgentInLocation = inLocation.filter(
      (item) => getDaysUntilExpiry(item.expiryDate, referenceDate) <= 3
    );
    const totalValue = inLocation.reduce((sum, item) => sum + item.estimatedCost, 0);
    return {
      location: label,
      activeCount: inLocation.length,
      expiringCount: urgentInLocation.length,
      totalValue,
    };
  });

  const categoryBreakdown = FOOD_CATEGORIES.map(({ label }) => {
    const inCat = activeItems.filter((item) => item.category === label);
    return {
      category: label,
      count: inCat.length,
      value: inCat.reduce((sum, item) => sum + item.estimatedCost, 0),
    };
  }).filter((entry) => entry.count > 0);

  return {
    totalItems: items.length,
    activeCount: activeItems.length,
    expiringSoonCount,
    expiredCount,
    freshCount,
    consumedCount: consumedItems.length,
    wastedCount: wastedItems.length,
    wastePreventionRate,
    moneySaved: consumedValue,
    moneyLost: wastedValue + expiredActiveValue,
    activeInventoryValue,
    storageBreakdown,
    categoryBreakdown,
  };
}
