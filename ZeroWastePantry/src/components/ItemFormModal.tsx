import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  COLORS,
  COMMON_UNITS,
  FOOD_CATEGORIES,
  QUICK_FILL_PRESETS,
  QuickFillPreset,
  STORAGE_LOCATIONS,
} from '../constants/theme';
import {
  CreatePantryItemInput,
  FoodCategory,
  ItemStatus,
  PantryItem,
  StorageLocation,
} from '../types/pantry';
import { addDaysToISO, isValidISODate } from '../utils/expiryUtils';

interface ItemFormModalProps {
  visible: boolean;
  editingItem: PantryItem | null;
  onClose: () => void;
  onSubmit: (
    payload: CreatePantryItemInput,
    existingId?: string
  ) => Promise<void>;
}

const EXPIRY_DAY_PRESETS = [
  { label: 'Today', days: 0 },
  { label: '+2d', days: 2 },
  { label: '+5d', days: 5 },
  { label: '+7d', days: 7 },
  { label: '+14d', days: 14 },
  { label: '+30d', days: 30 },
];

export const ItemFormModal: React.FC<ItemFormModalProps> = ({
  visible,
  editingItem,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Produce');
  const [storageLocation, setStorageLocation] =
    useState<StorageLocation>('Fridge');
  const [quantityText, setQuantityText] = useState('1');
  const [unit, setUnit] = useState('pcs');
  const [costText, setCostText] = useState('100');
  const [expiryDate, setExpiryDate] = useState(addDaysToISO(3));
  const [status, setStatus] = useState<ItemStatus>('active');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setErrorMsg(null);
    if (editingItem) {
      setName(editingItem.name);
      setCategory(editingItem.category);
      setStorageLocation(editingItem.storageLocation);
      setQuantityText(String(editingItem.quantity));
      setUnit(editingItem.unit);
      setCostText(String(editingItem.estimatedCost));
      setExpiryDate(editingItem.expiryDate);
      setStatus(editingItem.status);
      setNotes(editingItem.notes);
    } else {
      setName('');
      setCategory('Produce');
      setStorageLocation('Fridge');
      setQuantityText('1');
      setUnit('pcs');
      setCostText('100');
      setExpiryDate(addDaysToISO(3));
      setStatus('active');
      setNotes('');
    }
  }, [visible, editingItem]);

  const applyPreset = (preset: QuickFillPreset) => {
    setName(preset.name);
    setCategory(preset.category);
    setStorageLocation(preset.storageLocation);
    setQuantityText(String(preset.quantity));
    setUnit(preset.unit);
    setCostText(String(preset.estimatedCost));
    setExpiryDate(addDaysToISO(preset.daysOffset));
    setNotes(preset.notes);
    setErrorMsg(null);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMsg('Please enter the food item name.');
      return;
    }

    const parsedQty = Number(quantityText);
    if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
      setErrorMsg('Quantity must be a positive number.');
      return;
    }

    const parsedCost = Number(costText);
    if (!Number.isFinite(parsedCost) || parsedCost < 0) {
      setErrorMsg('Estimated cost must be 0 or higher.');
      return;
    }

    if (!isValidISODate(expiryDate)) {
      setErrorMsg('Expiry date must use YYYY-MM-DD format (e.g., 2026-11-25).');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      await onSubmit(
        {
          name: trimmedName,
          category,
          storageLocation,
          quantity: parsedQty,
          unit: unit.trim() || 'pcs',
          estimatedCost: parsedCost,
          expiryDate: expiryDate.trim(),
          status,
          notes: notes.trim(),
        },
        editingItem?.id
      );
      onClose();
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Unable to save pantry item.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(editingItem);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetEyebrow}>
                {isEditing ? 'SQL UPDATE OPERATION' : 'SQL INSERT OPERATION'}
              </Text>
              <Text style={styles.sheetTitle}>
                {isEditing ? 'Edit Pantry Item' : 'Add Food Item'}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formScroll}
            showsVerticalScrollIndicator={false}
          >
            {!isEditing && (
              <View style={styles.sectionBlock}>
                <Text style={styles.label}>Quick-Fill Presets (1-Tap Demo)</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipRow}
                >
                  {QUICK_FILL_PRESETS.map((preset) => (
                    <TouchableOpacity
                      key={preset.name}
                      style={styles.presetChip}
                      onPress={() => applyPreset(preset)}
                    >
                      <Text style={styles.presetChipText}>{preset.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {errorMsg ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.sectionBlock}>
              <Text style={styles.label}>Food Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Fresh Cow's Milk"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.sectionBlock}>
              <Text style={styles.label}>Storage Location</Text>
              <View style={styles.gridRow}>
                {STORAGE_LOCATIONS.map((loc) => {
                  const selected = storageLocation === loc.label;
                  return (
                    <TouchableOpacity
                      key={loc.label}
                      style={[
                        styles.choiceChip,
                        styles.flexChoice,
                        selected && styles.choiceChipActive,
                      ]}
                      onPress={() => setStorageLocation(loc.label)}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          selected && styles.choiceTextActive,
                        ]}
                      >
                        {loc.icon} {loc.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.wrapRow}>
                {FOOD_CATEGORIES.map((cat) => {
                  const selected = category === cat.label;
                  return (
                    <TouchableOpacity
                      key={cat.label}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      onPress={() => setCategory(cat.label)}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          selected && styles.choiceTextActive,
                        ]}
                      >
                        {cat.icon} {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.twoColRow}>
              <View style={styles.colHalf}>
                <Text style={styles.label}>Quantity *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={quantityText}
                  onChangeText={setQuantityText}
                  placeholder="1"
                />
              </View>
              <View style={styles.colHalf}>
                <Text style={styles.label}>Est. Cost (₱) *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={costText}
                  onChangeText={setCostText}
                  placeholder="100"
                />
              </View>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={styles.label}>Unit</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {COMMON_UNITS.map((u) => {
                  const selected = unit === u;
                  return (
                    <TouchableOpacity
                      key={u}
                      style={[
                        styles.choiceChip,
                        selected && styles.choiceChipActive,
                      ]}
                      onPress={() => setUnit(u)}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          selected && styles.choiceTextActive,
                        ]}
                      >
                        {u}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.sectionBlock}>
              <Text style={styles.label}>Expiry Date (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={COLORS.textMuted}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {EXPIRY_DAY_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset.label}
                    style={styles.datePresetBtn}
                    onPress={() => setExpiryDate(addDaysToISO(preset.days))}
                  >
                    <Text style={styles.datePresetText}>{preset.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {isEditing && (
              <View style={styles.sectionBlock}>
                <Text style={styles.label}>Item Status</Text>
                <View style={styles.gridRow}>
                  {(['active', 'consumed', 'wasted'] as ItemStatus[]).map(
                    (st) => {
                      const selected = status === st;
                      return (
                        <TouchableOpacity
                          key={st}
                          style={[
                            styles.choiceChip,
                            styles.flexChoice,
                            selected && styles.choiceChipActive,
                          ]}
                          onPress={() => setStatus(st)}
                        >
                          <Text
                            style={[
                              styles.choiceText,
                              selected && styles.choiceTextActive,
                            ]}
                          >
                            {st.toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  )}
                </View>
              </View>
            )}

            <View style={styles.sectionBlock}>
              <Text style={styles.label}>Storage Tip / Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="e.g., Store in airtight container or freeze leftovers."
                placeholderTextColor={COLORS.textMuted}
                multiline
              />
            </View>
          </ScrollView>

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, submitting && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={submitting}
            >
              <Text style={styles.saveBtnText}>
                {submitting
                  ? 'Saving...'
                  : isEditing
                  ? 'Update Item'
                  : 'Save to Pantry'}
              </Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '92%',
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
    marginBottom: 12,
  },
  sheetEyebrow: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryMid,
    letterSpacing: 0.7,
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  formScroll: {
    marginBottom: 12,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  notesInput: {
    minHeight: 68,
    textAlignVertical: 'top',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  colHalf: {
    flex: 1,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 8,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipRow: {
    gap: 8,
    paddingTop: 6,
  },
  flexChoice: {
    flex: 1,
    alignItems: 'center',
  },
  choiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.surfaceMuted,
  },
  choiceChipActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primaryMid,
  },
  choiceText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  choiceTextActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  presetChip: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primaryTint,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  datePresetBtn: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
  },
  datePresetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  errorBox: {
    backgroundColor: COLORS.expiredBg,
    borderColor: '#FCA5A5',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.expiredText,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.65,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textInverse,
  },
});
