import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CATEGORY_ICON_MAP, COLORS } from '../constants/theme';
import { PantryItem } from '../types/pantry';
import {
  formatCurrencyPHP,
  getDaysUntilExpiry,
  getUrgencyInfo,
} from '../utils/expiryUtils';

interface UseFirstBannerProps {
  items: PantryItem[];
  onMarkConsumed: (item: PantryItem) => void;
  onSelectEdit: (item: PantryItem) => void;
}

export const UseFirstBanner: React.FC<UseFirstBannerProps> = ({
  items,
  onMarkConsumed,
  onSelectEdit,
}) => {
  const priorityItems = items
    .filter((item) => {
      if (item.status !== 'active') return false;
      return getDaysUntilExpiry(item.expiryDate) <= 3;
    })
    .sort(
      (a, b) =>
        getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate)
    );

  if (priorityItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>🔥 Priority: Use This First</Text>
        <Text style={styles.countBadge}>{priorityItems.length} urgent</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {priorityItems.map((item) => {
          const days = getDaysUntilExpiry(item.expiryDate);
          const urgency = getUrgencyInfo(days);

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.priorityCard,
                { borderLeftColor: urgency.borderAccent },
              ]}
              onPress={() => onSelectEdit(item)}
              activeOpacity={0.88}
            >
              <View style={styles.cardTop}>
                <Text style={styles.categoryIcon}>
                  {CATEGORY_ICON_MAP[item.category]}
                </Text>
                <View
                  style={[
                    styles.urgencyBadge,
                    { backgroundColor: urgency.badgeBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.urgencyText,
                      { color: urgency.badgeText },
                    ]}
                  >
                    {urgency.label}
                  </Text>
                </View>
              </View>

              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemMeta}>
                {item.quantity} {item.unit} • {item.storageLocation} •{' '}
                {formatCurrencyPHP(item.estimatedCost)}
              </Text>

              <TouchableOpacity
                style={styles.consumeButton}
                onPress={() => onMarkConsumed(item)}
                activeOpacity={0.85}
              >
                <Text style={styles.consumeButtonText}>✓ Mark Consumed</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  countBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.criticalText,
    backgroundColor: COLORS.criticalBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  scrollContent: {
    gap: 10,
    paddingRight: 8,
  },
  priorityCard: {
    width: 215,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  categoryIcon: {
    fontSize: 18,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '800',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  itemMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  consumeButton: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primaryLight,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  consumeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
