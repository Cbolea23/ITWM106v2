import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PantryItemCard } from '../components/PantryItemCard';
import { SummaryHeroCard } from '../components/SummaryHeroCard';
import { UseFirstBanner } from '../components/UseFirstBanner';
import {
  COLORS,
  FOOD_CATEGORIES,
  STORAGE_LOCATIONS,
} from '../constants/theme';
import {
  CategoryFilter,
  PantryAnalytics,
  PantryItem,
  SortOption,
  StatusFilter,
  StorageFilter,
} from '../types/pantry';
import { filterAndSortItems } from '../utils/expiryUtils';

interface DashboardScreenProps {
  items: PantryItem[];
  analytics: PantryAnalytics;
  onAddPress: () => void;
  onEditItem: (item: PantryItem) => void;
  onDeleteItem: (item: PantryItem) => void;
  onAdjustQuantity: (item: PantryItem, delta: number) => void;
  onMarkStatus: (item: PantryItem, status: 'active' | 'consumed' | 'wasted') => void;
}

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'consumed', label: 'Consumed' },
  { key: 'wasted', label: 'Wasted' },
  { key: 'all', label: 'All' },
];

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'expiry', label: 'Soonest Expiry' },
  { key: 'name', label: 'Name A–Z' },
  { key: 'cost', label: 'Highest Value' },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  items,
  analytics,
  onAddPress,
  onEditItem,
  onDeleteItem,
  onAdjustQuantity,
  onMarkStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');
  const [storageFilter, setStorageFilter] = useState<StorageFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('expiry');

  const filteredItems = useMemo(
    () =>
      filterAndSortItems(items, {
        searchQuery,
        statusFilter,
        storageFilter,
        categoryFilter,
        sortBy,
      }),
    [items, searchQuery, statusFilter, storageFilter, categoryFilter, sortBy]
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <SummaryHeroCard analytics={analytics} />

      <UseFirstBanner
        items={items}
        onMarkConsumed={(item) => onMarkStatus(item, 'consumed')}
        onSelectEdit={onEditItem}
      />

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search food, category, or storage tip..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearSearchText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status Tabs */}
      <View style={styles.statusTabsRow}>
        {STATUS_TABS.map((tab) => {
          const active = statusFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.statusTab, active && styles.statusTabActive]}
              onPress={() => setStatusFilter(tab.key)}
            >
              <Text
                style={[
                  styles.statusTabText,
                  active && styles.statusTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Storage Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChipsRow}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            storageFilter === 'All' && styles.filterChipActive,
          ]}
          onPress={() => setStorageFilter('All')}
        >
          <Text
            style={[
              styles.filterChipText,
              storageFilter === 'All' && styles.filterChipTextActive,
            ]}
          >
            All Zones
          </Text>
        </TouchableOpacity>
        {STORAGE_LOCATIONS.map((loc) => {
          const active = storageFilter === loc.label;
          return (
            <TouchableOpacity
              key={loc.label}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setStorageFilter(loc.label)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {loc.icon} {loc.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Category Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChipsRow}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            categoryFilter === 'All' && styles.filterChipActive,
          ]}
          onPress={() => setCategoryFilter('All')}
        >
          <Text
            style={[
              styles.filterChipText,
              categoryFilter === 'All' && styles.filterChipTextActive,
            ]}
          >
            All Categories
          </Text>
        </TouchableOpacity>
        {FOOD_CATEGORIES.map((cat) => {
          const active = categoryFilter === cat.label;
          return (
            <TouchableOpacity
              key={cat.label}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setCategoryFilter(cat.label)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  active && styles.filterChipTextActive,
                ]}
              >
                {cat.icon} {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sort Bar + Result Count */}
      <View style={styles.listHeaderRow}>
        <Text style={styles.resultCount}>
          Showing {filteredItems.length} item
          {filteredItems.length === 1 ? '' : 's'}
        </Text>
        <View style={styles.sortRow}>
          {SORT_OPTIONS.map((opt) => {
            const active = sortBy === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.sortPill, active && styles.sortPillActive]}
                onPress={() => setSortBy(opt.key)}
              >
                <Text
                  style={[
                    styles.sortPillText,
                    active && styles.sortPillTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Pantry Items List */}
      {filteredItems.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🧺</Text>
          <Text style={styles.emptyTitle}>No pantry items match</Text>
          <Text style={styles.emptyDesc}>
            Try clearing your filters or tap "+ Add Item" to create a new record
            in SQLite.
          </Text>
          <TouchableOpacity style={styles.emptyAddBtn} onPress={onAddPress}>
            <Text style={styles.emptyAddBtnText}>+ Add Pantry Item</Text>
          </TouchableOpacity>
        </View>
      ) : (
        filteredItems.map((item) => (
          <PantryItemCard
            key={item.id}
            item={item}
            onAdjustQuantity={onAdjustQuantity}
            onMarkStatus={onMarkStatus}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 8,
  },
  searchIcon: {
    fontSize: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingVertical: 2,
  },
  clearSearchText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryMid,
  },
  statusTabsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.border,
    padding: 4,
    borderRadius: 12,
    marginBottom: 10,
    gap: 4,
  },
  statusTab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 9,
    alignItems: 'center',
  },
  statusTabActive: {
    backgroundColor: COLORS.surface,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  statusTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  statusTabTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  filterChipsRow: {
    gap: 8,
    paddingBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.textInverse,
    fontWeight: '700',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    marginBottom: 10,
  },
  resultCount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  sortRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sortPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortPillActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primaryLight,
  },
  sortPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  sortPillTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
  },
  emptyAddBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyAddBtnText: {
    color: COLORS.textInverse,
    fontSize: 13,
    fontWeight: '800',
  },
});
