import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HeaderBar } from './src/components/HeaderBar';
import { ItemFormModal } from './src/components/ItemFormModal';
import { SqlInspectorModal } from './src/components/SqlInspectorModal';
import { COLORS } from './src/constants/theme';
import { pantryDb } from './src/database/db';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { TeamGuideScreen } from './src/screens/TeamGuideScreen';
import {
  CreatePantryItemInput,
  ItemStatus,
  PantryItem,
  SqlLogEntry,
} from './src/types/pantry';
import { computeAnalytics } from './src/utils/expiryUtils';

type AppTab = 'pantry' | 'analytics' | 'team';

export default function App() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [sqlLogs, setSqlLogs] = useState<SqlLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>('pantry');

  const [formVisible, setFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [sqlModalVisible, setSqlModalVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMsg(message);
    setTimeout(() => {
      setToastMsg((prev) => (prev === message ? null : prev));
    }, 2600);
  }, []);

  const refreshData = useCallback(async () => {
    const loaded = await pantryDb.getAllItems();
    setItems(loaded);
    setSqlLogs(pantryDb.getSqlLogs());
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await pantryDb.initDatabase();
        await refreshData();
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : 'Failed to initialize database'
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshData, showToast]);

  const analytics = useMemo(() => computeAnalytics(items), [items]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormVisible(true);
  };

  const handleOpenEdit = (item: PantryItem) => {
    setEditingItem(item);
    setFormVisible(true);
  };

  const handleSubmitForm = async (
    payload: CreatePantryItemInput,
    existingId?: string
  ) => {
    if (existingId) {
      await pantryDb.updateItem(existingId, payload);
      await refreshData();
      showToast(`Updated "${payload.name}"`);
    } else {
      await pantryDb.createItem(payload);
      await refreshData();
      showToast(`Added "${payload.name}" to pantry`);
    }
  };

  const handleAdjustQuantity = async (item: PantryItem, delta: number) => {
    const nextQty = item.quantity + delta;
    if (nextQty <= 0) {
      handleDeleteItem(item);
      return;
    }
    await pantryDb.updateItem(item.id, { quantity: nextQty });
    await refreshData();
    showToast(`Updated ${item.name} qty to ${nextQty} ${item.unit}`);
  };

  const handleMarkStatus = async (item: PantryItem, status: ItemStatus) => {
    await pantryDb.updateItem(item.id, { status });
    await refreshData();
    const label =
      status === 'consumed'
        ? 'Marked as Consumed — Money saved!'
        : status === 'wasted'
        ? 'Marked as Wasted'
        : 'Restored to Active pantry';
    showToast(`${item.name}: ${label}`);
  };

  const performDelete = async (item: PantryItem) => {
    await pantryDb.deleteItem(item.id);
    await refreshData();
    showToast(`Deleted "${item.name}"`);
  };

  const handleDeleteItem = (item: PantryItem) => {
    if (Platform.OS === 'web') {
      const g = globalThis as { confirm?: (msg: string) => boolean };
      const confirmed = g.confirm
        ? g.confirm(`Delete "${item.name}" from pantry?`)
        : true;
      if (confirmed) {
        void performDelete(item);
      }
      return;
    }

    Alert.alert(
      'Delete Food Item',
      `Remove "${item.name}" from your pantry database?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void performDelete(item);
          },
        },
      ]
    );
  };

  const handleResetDemoData = async () => {
    await pantryDb.resetToDemoData();
    await refreshData();
    showToast('Reset database to 10 demo items');
  };

  const handleClearSqlLogs = () => {
    pantryDb.clearSqlLogs();
    setSqlLogs([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.shell}>
        <HeaderBar
          sqlLogCount={sqlLogs.length}
          onOpenSqlInspector={() => setSqlModalVisible(true)}
          onPressAdd={handleOpenCreate}
        />

        {toastMsg ? (
          <View style={styles.toastBanner}>
            <Text style={styles.toastText}>✅ {toastMsg}</Text>
          </View>
        ) : null}

        <View style={styles.mainContent}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading SQLite Pantry...</Text>
            </View>
          ) : activeTab === 'pantry' ? (
            <DashboardScreen
              items={items}
              analytics={analytics}
              onAddPress={handleOpenCreate}
              onEditItem={handleOpenEdit}
              onDeleteItem={handleDeleteItem}
              onAdjustQuantity={handleAdjustQuantity}
              onMarkStatus={handleMarkStatus}
            />
          ) : activeTab === 'analytics' ? (
            <AnalyticsScreen analytics={analytics} />
          ) : (
            <TeamGuideScreen
              engineName={pantryDb.getStorageEngineName()}
              sqlLogCount={sqlLogs.length}
              onResetDemoData={handleResetDemoData}
              onOpenSqlInspector={() => setSqlModalVisible(true)}
            />
          )}
        </View>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[
              styles.navTab,
              activeTab === 'pantry' && styles.navTabActive,
            ]}
            onPress={() => setActiveTab('pantry')}
          >
            <Text style={styles.navIcon}>🥬</Text>
            <Text
              style={[
                styles.navLabel,
                activeTab === 'pantry' && styles.navLabelActive,
              ]}
            >
              Pantry (CRUD)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navTab,
              activeTab === 'analytics' && styles.navTabActive,
            ]}
            onPress={() => setActiveTab('analytics')}
          >
            <Text style={styles.navIcon}>📊</Text>
            <Text
              style={[
                styles.navLabel,
                activeTab === 'analytics' && styles.navLabelActive,
              ]}
            >
              Analytics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navTab,
              activeTab === 'team' && styles.navTabActive,
            ]}
            onPress={() => setActiveTab('team')}
          >
            <Text style={styles.navIcon}>👥</Text>
            <Text
              style={[
                styles.navLabel,
                activeTab === 'team' && styles.navLabelActive,
              ]}
            >
              Team & Demo
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ItemFormModal
        visible={formVisible}
        editingItem={editingItem}
        onClose={() => setFormVisible(false)}
        onSubmit={handleSubmitForm}
      />

      <SqlInspectorModal
        visible={sqlModalVisible}
        engineName={pantryDb.getStorageEngineName()}
        logs={sqlLogs}
        onClearLogs={handleClearSqlLogs}
        onClose={() => setSqlModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 820,
    backgroundColor: COLORS.background,
  },
  mainContent: {
    flex: 1,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  toastBanner: {
    backgroundColor: '#064E3B',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  toastText: {
    color: COLORS.textInverse,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 10,
  },
  navTabActive: {
    backgroundColor: COLORS.primarySoft,
  },
  navIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});
