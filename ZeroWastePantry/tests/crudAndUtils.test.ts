import assert from 'node:assert/strict';
import test from 'node:test';
import { PantryDatabase } from '../src/database/db';
import {
  addDaysToISO,
  computeAnalytics,
  filterAndSortItems,
  getDaysUntilExpiry,
  getUrgencyInfo,
} from '../src/utils/expiryUtils';

test('Expiry calculation and urgency classification', () => {
  const ref = new Date(2026, 10, 17); // 2026-11-17

  const expiredDays = getDaysUntilExpiry('2026-11-15', ref);
  assert.equal(expiredDays, -2);
  assert.equal(getUrgencyInfo(expiredDays).level, 'expired');

  const todayDays = getDaysUntilExpiry('2026-11-17', ref);
  assert.equal(todayDays, 0);
  assert.equal(getUrgencyInfo(todayDays).level, 'critical');
  assert.equal(getUrgencyInfo(todayDays).label, 'Expires Today!');

  const soonDays = getDaysUntilExpiry('2026-11-20', ref);
  assert.equal(soonDays, 3);
  assert.equal(getUrgencyInfo(soonDays).level, 'critical');

  const warnDays = getDaysUntilExpiry('2026-11-22', ref);
  assert.equal(warnDays, 5);
  assert.equal(getUrgencyInfo(warnDays).level, 'warning');

  const freshDays = getDaysUntilExpiry('2026-12-01', ref);
  assert.equal(freshDays, 14);
  assert.equal(getUrgencyInfo(freshDays).level, 'fresh');
});

test('Full CRUD lifecycle & SQL logging on PantryDatabase', async () => {
  const db = new PantryDatabase();
  await db.initDatabase();

  // READ initial seed items
  const initialItems = await db.getAllItems();
  assert.equal(initialItems.length, 10);

  // CREATE new item
  const created = await db.createItem({
    name: 'Organic Oat Milk',
    category: 'Beverages',
    storageLocation: 'Fridge',
    quantity: 2,
    unit: 'L',
    estimatedCost: 240,
    expiryDate: addDaysToISO(4),
    notes: 'Shake well before serving',
  });
  assert.ok(created.id.startsWith('pantry-'));
  assert.equal(created.name, 'Organic Oat Milk');

  const afterCreate = await db.getAllItems();
  assert.equal(afterCreate.length, 11);

  // UPDATE item quantity & status
  const updated = await db.updateItem(created.id, {
    quantity: 1,
    status: 'consumed',
    notes: 'Used for iced coffee',
  });
  assert.equal(updated.quantity, 1);
  assert.equal(updated.status, 'consumed');
  assert.equal(updated.notes, 'Used for iced coffee');

  // DELETE item
  await db.deleteItem(created.id);
  const afterDelete = await db.getAllItems();
  assert.equal(afterDelete.length, 10);
  assert.equal(
    afterDelete.find((i) => i.id === created.id),
    undefined
  );

  // Verify SQL query logs recorded INIT, READ, CREATE, UPDATE, DELETE
  const logs = db.getSqlLogs();
  const operations = new Set(logs.map((l) => l.operation));
  assert.ok(operations.has('INIT'));
  assert.ok(operations.has('READ'));
  assert.ok(operations.has('CREATE'));
  assert.ok(operations.has('UPDATE'));
  assert.ok(operations.has('DELETE'));
});

test('Validation rejects invalid CRUD inputs', async () => {
  const db = new PantryDatabase();
  await db.initDatabase();

  await assert.rejects(
    db.createItem({
      name: '   ',
      category: 'Dairy',
      storageLocation: 'Fridge',
      quantity: 1,
      unit: 'L',
      estimatedCost: 50,
      expiryDate: addDaysToISO(2),
    }),
    /name is required/i
  );

  await assert.rejects(
    db.createItem({
      name: 'Test Item',
      category: 'Dairy',
      storageLocation: 'Fridge',
      quantity: 0,
      unit: 'L',
      estimatedCost: 50,
      expiryDate: addDaysToISO(2),
    }),
    /greater than zero/i
  );

  await assert.rejects(
    db.createItem({
      name: 'Test Item',
      category: 'Dairy',
      storageLocation: 'Fridge',
      quantity: 1,
      unit: 'L',
      estimatedCost: 50,
      expiryDate: '2026-13-45',
    }),
    /YYYY-MM-DD/i
  );
});

test('Filter, search, sort, and analytics calculations', async () => {
  const db = new PantryDatabase();
  await db.initDatabase();
  const items = await db.getAllItems();

  const fridgeActive = filterAndSortItems(items, {
    storageFilter: 'Fridge',
    statusFilter: 'active',
    sortBy: 'expiry',
  });
  assert.ok(fridgeActive.length > 0);
  assert.ok(fridgeActive.every((i) => i.storageLocation === 'Fridge'));
  assert.ok(fridgeActive.every((i) => i.status === 'active'));

  const searched = filterAndSortItems(items, {
    searchQuery: 'spinach',
    statusFilter: 'active',
  });
  assert.equal(searched.length, 1);
  assert.equal(searched[0].name, 'Baby Spinach Leaves');

  const analytics = computeAnalytics(items);
  assert.equal(analytics.totalItems, 10);
  assert.equal(analytics.activeCount, 8);
  assert.equal(analytics.consumedCount, 1);
  assert.equal(analytics.wastedCount, 1);
  assert.equal(analytics.wastePreventionRate, 50);
  assert.equal(analytics.moneySaved, 160);
  assert.equal(analytics.moneyLost, 290); // 110 wasted + 180 expired active adobo
});
