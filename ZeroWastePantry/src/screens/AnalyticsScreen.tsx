import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  CATEGORY_ICON_MAP,
  COLORS,
  STORAGE_EXTENSION_TIPS,
  STORAGE_ICON_MAP,
} from '../constants/theme';
import { PantryAnalytics } from '../types/pantry';
import { formatCurrencyPHP } from '../utils/expiryUtils';

interface AnalyticsScreenProps {
  analytics: PantryAnalytics;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  analytics,
}) => {
  const maxCatValue = Math.max(
    ...analytics.categoryBreakdown.map((c) => c.value),
    1
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Waste Prevention Score Card */}
      <View style={styles.scoreCard}>
        <Text style={styles.eyebrow}>SUSTAINABILITY SCORE</Text>
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreNumber}>{analytics.wastePreventionRate}%</Text>
          <View style={styles.scoreMeta}>
            <Text style={styles.scoreTitle}>Waste Prevention Rate</Text>
            <Text style={styles.scoreSubtitle}>
              {analytics.consumedCount} consumed vs. {analytics.wastedCount}{' '}
              wasted
            </Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(100, Math.max(0, analytics.wastePreventionRate))}%` },
            ]}
          />
        </View>
      </View>

      {/* Financial Impact Grid */}
      <View style={styles.financeGrid}>
        <View style={[styles.financeCard, styles.financeSaved]}>
          <Text style={styles.financeLabel}>💰 Money Saved</Text>
          <Text style={[styles.financeValue, { color: COLORS.primary }]}>
            {formatCurrencyPHP(analytics.moneySaved)}
          </Text>
          <Text style={styles.financeHint}>
            From {analytics.consumedCount} consumed items
          </Text>
        </View>

        <View style={[styles.financeCard, styles.financeLost]}>
          <Text style={styles.financeLabel}>⚠️ Lost / Expired</Text>
          <Text style={[styles.financeValue, { color: COLORS.expiredText }]}>
            {formatCurrencyPHP(analytics.moneyLost)}
          </Text>
          <Text style={styles.financeHint}>
            {analytics.wastedCount} wasted + {analytics.expiredCount} expired
          </Text>
        </View>
      </View>

      {/* Storage Zone Breakdown */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📦 Storage Zone Breakdown</Text>
        {analytics.storageBreakdown.map((zone) => (
          <View key={zone.location} style={styles.zoneRow}>
            <View style={styles.zoneLeft}>
              <Text style={styles.zoneIcon}>
                {STORAGE_ICON_MAP[zone.location]}
              </Text>
              <View>
                <Text style={styles.zoneName}>{zone.location}</Text>
                <Text style={styles.zoneSub}>
                  {zone.activeCount} active • {zone.expiringCount} urgent
                </Text>
              </View>
            </View>
            <Text style={styles.zoneValue}>
              {formatCurrencyPHP(zone.totalValue)}
            </Text>
          </View>
        ))}
      </View>

      {/* Active Category Breakdown */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📊 Active Value by Category</Text>
        {analytics.categoryBreakdown.length === 0 ? (
          <Text style={styles.emptyHint}>
            Add active items to see category distribution.
          </Text>
        ) : (
          analytics.categoryBreakdown.map((cat) => {
            const widthPct = Math.max(8, Math.round((cat.value / maxCatValue) * 100));
            return (
              <View key={cat.category} style={styles.catRow}>
                <View style={styles.catTop}>
                  <Text style={styles.catLabel}>
                    {CATEGORY_ICON_MAP[cat.category]} {cat.category} ({cat.count})
                  </Text>
                  <Text style={styles.catValue}>
                    {formatCurrencyPHP(cat.value)}
                  </Text>
                </View>
                <View style={styles.catTrack}>
                  <View
                    style={[styles.catFill, { width: `${widthPct}%` }]}
                  />
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Shelf-Life Extension Tips */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>💡 Smart Shelf-Life Tips</Text>
        {STORAGE_EXTENSION_TIPS.map((item) => (
          <View key={item.category} style={styles.tipBox}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipCat}>
                {item.icon} {item.category}
              </Text>
              <Text style={styles.tipDays}>{item.extraDays}</Text>
            </View>
            <Text style={styles.tipText}>{item.tip}</Text>
          </View>
        ))}
      </View>
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
  scoreCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryTint,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  scoreNumber: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.textInverse,
  },
  scoreMeta: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textInverse,
  },
  scoreSubtitle: {
    fontSize: 12,
    color: COLORS.primaryTint,
    marginTop: 2,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 999,
  },
  financeGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  financeCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  financeSaved: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primaryTint,
  },
  financeLost: {
    backgroundColor: COLORS.expiredBg,
    borderColor: '#FECACA',
  },
  financeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  financeValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  financeHint: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  zoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  zoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  zoneIcon: {
    fontSize: 20,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  zoneSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  zoneValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  emptyHint: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  catRow: {
    marginBottom: 10,
  },
  catTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  catValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryMid,
  },
  catTrack: {
    height: 8,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 999,
    overflow: 'hidden',
  },
  catFill: {
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 999,
  },
  tipBox: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tipCat: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  tipDays: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  tipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
});
