import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { SqlLogEntry, SqlOperationType } from '../types/pantry';

interface SqlInspectorModalProps {
  visible: boolean;
  engineName: string;
  logs: SqlLogEntry[];
  onClearLogs: () => void;
  onClose: () => void;
}

const OP_COLORS: Record<SqlOperationType, string> = {
  INIT: COLORS.sqlInit,
  CREATE: COLORS.sqlCreate,
  READ: COLORS.sqlRead,
  UPDATE: COLORS.sqlUpdate,
  DELETE: COLORS.sqlDelete,
};

export const SqlInspectorModal: React.FC<SqlInspectorModalProps> = ({
  visible,
  engineName,
  logs,
  onClearLogs,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>DATABASE CRUD INSPECTOR</Text>
              <Text style={styles.title}>Live SQL Query Log</Text>
              <Text style={styles.engine}>Engine: {engineName}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.logScroll}>
            {logs.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>
                  No SQL statements recorded yet. Add, edit, or delete an item to
                  inspect live CRUD queries.
                </Text>
              </View>
            ) : (
              logs.map((entry) => (
                <View key={entry.id} style={styles.logRow}>
                  <View style={styles.logMeta}>
                    <View
                      style={[
                        styles.opBadge,
                        { backgroundColor: OP_COLORS[entry.operation] },
                      ]}
                    >
                      <Text style={styles.opBadgeText}>{entry.operation}</Text>
                    </View>
                    <Text style={styles.timestamp}>{entry.timestamp}</Text>
                  </View>
                  <Text style={styles.sqlCode}>{entry.sql}</Text>
                  {entry.params !== '[]' && (
                    <Text style={styles.paramsText}>
                      Params: {entry.params}
                    </Text>
                  )}
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearBtn} onPress={onClearLogs}>
              <Text style={styles.clearBtnText}>Clear Log</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
              <Text style={styles.doneBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '85%',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryMid,
    letterSpacing: 0.7,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  engine: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  logScroll: {
    marginBottom: 12,
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  logRow: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  logMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  opBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  opBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  timestamp: {
    color: '#94A3B8',
    fontSize: 11,
  },
  sqlCode: {
    color: '#E2E8F0',
    fontFamily: 'monospace',
    fontSize: 11,
    lineHeight: 16,
  },
  paramsText: {
    color: '#6EE7B7',
    fontFamily: 'monospace',
    fontSize: 11,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  doneBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textInverse,
  },
});
