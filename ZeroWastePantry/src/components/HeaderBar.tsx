import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/theme';

interface HeaderBarProps {
  sqlLogCount: number;
  onOpenSqlInspector: () => void;
  onPressAdd: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  sqlLogCount,
  onOpenSqlInspector,
  onPressAdd,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🥬</Text>
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>ZeroWaste Pantry</Text>
          <Text style={styles.subtitle}>Smart Expiry & Waste Tracker</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.sqlButton}
          onPress={onOpenSqlInspector}
          activeOpacity={0.8}
          accessibilityLabel="Open SQL Query Inspector"
        >
          <Text style={styles.sqlButtonText}>SQL ({sqlLogCount})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={onPressAdd}
          activeOpacity={0.85}
          accessibilityLabel="Add new pantry item"
        >
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryMid,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 20,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textInverse,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.primaryTint,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sqlButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  sqlButtonText: {
    color: COLORS.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  addButton: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: '#052E16',
    fontSize: 13,
    fontWeight: '800',
  },
});
