import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { PantryAnalytics } from '../types/pantry';
import { formatCurrencyPHP } from '../utils/expiryUtils';

interface SummaryHeroCardProps {
  analytics: PantryAnalytics;
}

export const SummaryHeroCard: React.FC<SummaryHeroCardProps> = ({ analytics }) => {
  const urgentTotal = analytics.expiringSoonCount + analytics.expiredCount;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.eyebrow}>SMART PANTRY OVERVIEW</Text>
          <Text style={styles.headline}>
            {urgentTotal > 0
              ? `${urgentTotal} item${urgentTotal > 1 ? 's' : ''} need attention`
              : 'All pantry items are fresh!'}
          </Text>
        </View>
        <View style={styles.inventoryPill}>
          <Text style={styles.inventoryPillLabel}>Active Stock</Text>
          <Text style={styles.inventoryPillValue}>
            {formatCurrencyPHP(analytics.activeInventoryValue)}
          </Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{analytics.activeCount}</Text>
          <Text style={styles.metricLabel}>In Pantry</Text>
        </View>

        <View
          style={[
            styles.metricBox,
            urgentTotal > 0 ? styles.metricAlert : undefined,
          ]}
        >
          <Text
            style={[
              styles.metricValue,
              urgentTotal > 0 ? styles.metricAlertText : undefined,
            ]}
          >
            {urgentTotal}
          </Text>
          <Text style={styles.metricLabel}>Use Soon</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={[styles.metricValue, styles.metricSuccessText]}>
            {analytics.wastePreventionRate}%
          </Text>
          <Text style={styles.metricLabel}>Waste Saved</Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={[styles.metricValue, styles.metricSuccessText]}>
            {formatCurrencyPHP(analytics.moneySaved)}
          </Text>
          <Text style={styles.metricLabel}>Money Saved</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryMid,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  headline: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  inventoryPill: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primaryTint,
    alignItems: 'flex-end',
  },
  inventoryPillLabel: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
  },
  inventoryPillValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '800',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricAlert: {
    backgroundColor: COLORS.criticalBg,
    borderColor: '#FDBA74',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  metricAlertText: {
    color: COLORS.criticalText,
  },
  metricSuccessText: {
    color: COLORS.primaryMid,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
