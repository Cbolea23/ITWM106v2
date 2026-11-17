import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../constants/theme';

interface TeamGuideScreenProps {
  engineName: string;
  sqlLogCount: number;
  onResetDemoData: () => void;
  onOpenSqlInspector: () => void;
}

const TEAM_ROLES = [
  {
    member: 'Member 1 — Project Lead & SQLite Architect',
    files: 'src/database/db.ts, src/database/seedData.ts, src/types/pantry.ts',
    summary:
      'Designed SQLite schema, parameterized CRUD engine, seed dataset, and live SQL query logger.',
  },
  {
    member: 'Member 2 — Create & Update Developer',
    files: 'src/components/ItemFormModal.tsx, App.tsx',
    summary:
      'Built validated Add/Edit modal, Quick-Fill demo presets, 1-tap expiry date presets, and update handlers.',
  },
  {
    member: 'Member 3 — Read, Filter & Delete Developer',
    files: 'src/screens/DashboardScreen.tsx, src/components/UseFirstBanner.tsx',
    summary:
      'Built real-time search, storage/category/status filtering, sorting, Use First strip, and delete confirmation.',
  },
  {
    member: 'Member 4 — UI/UX & Design Lead',
    files: 'src/constants/theme.ts, HeaderBar.tsx, SummaryHeroCard.tsx, PantryItemCard.tsx',
    summary:
      'Crafted eco-fresh design system, color-coded urgency badges, KPI hero card, and responsive navigation.',
  },
  {
    member: 'Member 5 — Analytics, Docs, QA & Presentation Lead',
    files: 'AnalyticsScreen.tsx, TeamGuideScreen.tsx, PROJECT_DOCUMENTATION.md, PPTX',
    summary:
      'Built financial savings & waste prevention analytics, QA tests, documentation, and PowerPoint deck.',
  },
];

const CRUD_CHECKLIST = [
  {
    op: 'CREATE',
    sql: 'INSERT INTO pantry_items (...)',
    demo: 'Tap "+ Add Item", pick a Quick-Fill preset or enter custom food, then tap "Save to Pantry".',
  },
  {
    op: 'READ',
    sql: 'SELECT * FROM pantry_items ORDER BY expiryDate ASC',
    demo: 'Browse sorted urgency dashboard, search by keyword, or filter by Fridge/Freezer/Pantry.',
  },
  {
    op: 'UPDATE',
    sql: 'UPDATE pantry_items SET ... WHERE id = ?',
    demo: 'Tap +/- quantity stepper, "✓ Consumed", or "✎ Edit" to modify any existing item.',
  },
  {
    op: 'DELETE',
    sql: 'DELETE FROM pantry_items WHERE id = ?',
    demo: 'Tap the 🗑 button on any item card and confirm deletion.',
  },
];

export const TeamGuideScreen: React.FC<TeamGuideScreenProps> = ({
  engineName,
  sqlLogCount,
  onResetDemoData,
  onOpenSqlInspector,
}) => {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Demo Controls */}
      <View style={styles.card}>
        <Text style={styles.eyebrow}>LIVE PRESENTATION CONTROLS</Text>
        <Text style={styles.title}>Database & Demo Utilities</Text>
        <Text style={styles.metaText}>Active Engine: {engineName}</Text>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onOpenSqlInspector}
          >
            <Text style={styles.primaryBtnText}>
              Inspect SQL Logs ({sqlLogCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onResetDemoData}
          >
            <Text style={styles.secondaryBtnText}>↺ Reset Demo Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CRUD Checklist */}
      <View style={styles.card}>
        <Text style={styles.title}>✅ CRUD Verification Guide</Text>
        {CRUD_CHECKLIST.map((item) => (
          <View key={item.op} style={styles.crudRow}>
            <View style={styles.crudTop}>
              <Text style={styles.crudOp}>{item.op}</Text>
              <Text style={styles.crudSql}>{item.sql}</Text>
            </View>
            <Text style={styles.crudDemo}>{item.demo}</Text>
          </View>
        ))}
      </View>

      {/* 5-Member Ownership */}
      <View style={styles.card}>
        <Text style={styles.title}>👥 5-Member Team Ownership</Text>
        {TEAM_ROLES.map((role) => (
          <View key={role.member} style={styles.roleBox}>
            <Text style={styles.roleTitle}>{role.member}</Text>
            <Text style={styles.roleFiles}>Files: {role.files}</Text>
            <Text style={styles.roleSummary}>{role.summary}</Text>
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
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryMid,
    letterSpacing: 0.7,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: COLORS.textInverse,
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  crudRow: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  crudTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  crudOp: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  crudSql: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: COLORS.textSecondary,
  },
  crudDemo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  roleBox: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  roleFiles: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: COLORS.primaryMid,
    marginTop: 2,
    marginBottom: 3,
  },
  roleSummary: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
});
