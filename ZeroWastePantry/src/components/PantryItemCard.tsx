import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  CATEGORY_ICON_MAP,
  COLORS,
  STORAGE_ICON_MAP,
} from '../constants/theme';
import { PantryItem } from '../types/pantry';
import {
  formatCurrencyPHP,
  getDaysUntilExpiry,
  getUrgencyInfo,
} from '../utils/expiryUtils';

interface PantryItemCardProps {
  item: PantryItem;
  onAdjustQuantity: (item: PantryItem, delta: number) => void;
  onMarkStatus: (item: PantryItem, status: 'active' | 'consumed' | 'wasted') => void;
  onEdit: (item: PantryItem) => void;
  onDelete: (item: PantryItem) => void;
}

export const PantryItemCard: React.FC<PantryItemCardProps> = ({
  item,
  onAdjustQuantity,
  onMarkStatus,
  onEdit,
  onDelete,
}) => {
  const daysLeft = getDaysUntilExpiry(item.expiryDate);
  const urgency = getUrgencyInfo(daysLeft);
  const isActive = item.status === 'active';

  const statusBadge =
    item.status === 'consumed'
      ? { label: '✓ Consumed', bg: COLORS.consumedBg, text: COLORS.consumedText }
      : item.status === 'wasted'
      ? { label: '✗ Wasted', bg: COLORS.wastedBg, text: COLORS.wastedText }
      : { label: urgency.label, bg: urgency.badgeBg, text: urgency.badgeText };

  return (
    <View
      style={[
        styles.card,
        {
          borderLeftColor: isActive ? urgency.borderAccent : COLORS.borderStrong,
        },
        !isActive && styles.cardInactive,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>
              {CATEGORY_ICON_MAP[item.category]}
            </Text>
          </View>
          <View style={styles.titleMeta}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.subMeta}>
              {item.category} • {STORAGE_ICON_MAP[item.storageLocation]}{' '}
              {item.storageLocation} • Exp: {item.expiryDate}
            </Text>
          </View>
        </View>

        <View
          style={[styles.badge, { backgroundColor: statusBadge.bg }]}
        >
          <Text style={[styles.badgeText, { color: statusBadge.text }]}>
            {statusBadge.label}
          </Text>
        </View>
      </View>

      {item.notes ? (
        <Text style={styles.notes} numberOfLines={2}>
          💡 {item.notes}
        </Text>
      ) : null}

      <View style={styles.middleRow}>
        <View style={styles.quantityBox}>
          <Text style={styles.quantityLabel}>Qty:</Text>
          {isActive && (
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => onAdjustQuantity(item, -1)}
              accessibilityLabel={`Decrease quantity of ${item.name}`}
            >
              <Text style={styles.stepperBtnText}>−</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.quantityValue}>
            {item.quantity} {item.unit}
          </Text>
          {isActive && (
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => onAdjustQuantity(item, 1)}
              accessibilityLabel={`Increase quantity of ${item.name}`}
            >
              <Text style={styles.stepperBtnText}>+</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.costPill}>
          <Text style={styles.costText}>
            Value: {formatCurrencyPHP(item.estimatedCost)}
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        {isActive ? (
          <>
            <TouchableOpacity
              style={[styles.actionBtn, styles.consumeBtn]}
              onPress={() => onMarkStatus(item, 'consumed')}
            >
              <Text style={styles.consumeBtnText}>✓ Consumed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.wasteBtn]}
              onPress={() => onMarkStatus(item, 'wasted')}
            >
              <Text style={styles.wasteBtnText}>✗ Wasted</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.actionBtn, styles.restoreBtn]}
            onPress={() => onMarkStatus(item, 'active')}
          >
            <Text style={styles.restoreBtnText}>↩ Restore Active</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => onEdit(item)}
        >
          <Text style={styles.editBtnText}>✎ Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => onDelete(item)}
        >
          <Text style={styles.deleteBtnText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 5,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 1,
  },
  cardInactive: {
    opacity: 0.85,
    backgroundColor: '#F8FAFC',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  titleMeta: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  notes: {
    fontSize: 12,
    color: COLORS.textSecondary,
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  quantityValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  costPill: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  costText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  actionBtn: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  consumeBtn: {
    flex: 1.2,
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primaryLight,
  },
  consumeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  wasteBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
    borderColor: COLORS.borderStrong,
  },
  wasteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  restoreBtn: {
    flex: 2,
    backgroundColor: COLORS.consumedBg,
    borderColor: '#93C5FD',
  },
  restoreBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.consumedText,
  },
  editBtn: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  deleteBtn: {
    backgroundColor: COLORS.expiredBg,
    borderColor: '#FECACA',
    paddingHorizontal: 11,
  },
  deleteBtnText: {
    fontSize: 13,
  },
});
