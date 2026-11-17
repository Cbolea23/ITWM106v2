import {
  CreatePantryItemInput,
  PantryItem,
  SqlLogEntry,
  SqlOperationType,
  UpdatePantryItemInput,
} from '../types/pantry';
import { isValidISODate } from '../utils/expiryUtils';
import { buildSeedItems } from './seedData';

const WEB_STORAGE_KEY = 'zerowaste_pantry_items_v1';
const MAX_SQL_LOGS = 50;

interface ExpoSQLiteDatabase {
  execAsync(source: string): Promise<void>;
  runAsync(source: string, ...params: unknown[]): Promise<unknown>;
  getAllAsync<T>(source: string, ...params: unknown[]): Promise<T[]>;
}

interface ExpoSQLiteModule {
  openDatabaseAsync(databaseName: string): Promise<ExpoSQLiteDatabase>;
}

declare function require(moduleName: string): unknown;

function detectNativeSQLite(): ExpoSQLiteModule | null {
  try {
    const g = globalThis as { navigator?: { product?: string } };
    if (g.navigator?.product === 'ReactNative') {
      const rn = require('react-native') as { Platform?: { OS?: string } };
      if (rn.Platform?.OS && rn.Platform.OS !== 'web') {
        return require('expo-sqlite') as ExpoSQLiteModule;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function getBrowserLocalStorage(): Storage | null {
  try {
    const g = globalThis as { localStorage?: Storage };
    if (g.localStorage && typeof g.localStorage.getItem === 'function') {
      return g.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

function generateId(prefix = 'item'): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`;
}

export class PantryDatabase {
  private sqliteDb: ExpoSQLiteDatabase | null = null;
  private memoryTable: PantryItem[] = [];
  private initialized = false;
  private sqlLogs: SqlLogEntry[] = [];
  private engineName:
    | 'SQLite (expo-sqlite)'
    | 'Web SQL Table (localStorage)'
    | 'In-Memory SQL Table' = 'In-Memory SQL Table';

  private logSql(
    operation: SqlOperationType,
    sql: string,
    params: unknown[] = []
  ): void {
    const entry: SqlLogEntry = {
      id: generateId('sql'),
      operation,
      sql,
      params: params.length > 0 ? JSON.stringify(params) : '[]',
      timestamp: new Date().toLocaleTimeString(),
    };
    this.sqlLogs = [entry, ...this.sqlLogs].slice(0, MAX_SQL_LOGS);
  }

  public getSqlLogs(): SqlLogEntry[] {
    return [...this.sqlLogs];
  }

  public clearSqlLogs(): void {
    this.sqlLogs = [];
  }

  public getStorageEngineName(): string {
    return this.engineName;
  }

  private persistWebTable(items: PantryItem[]): void {
    this.memoryTable = items;
    const storage = getBrowserLocalStorage();
    if (storage) {
      storage.setItem(WEB_STORAGE_KEY, JSON.stringify(items));
    }
  }

  private loadWebTable(): PantryItem[] | null {
    const storage = getBrowserLocalStorage();
    if (!storage) {
      return null;
    }
    const raw = storage.getItem(WEB_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as PantryItem[]) : null;
    } catch {
      return null;
    }
  }

  public async initDatabase(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const createTableSql = `CREATE TABLE IF NOT EXISTS pantry_items (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  storageLocation TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit TEXT NOT NULL,
  estimatedCost REAL NOT NULL,
  expiryDate TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);`;

    const sqliteMod = detectNativeSQLite();
    if (sqliteMod) {
      this.sqliteDb = await sqliteMod.openDatabaseAsync('zerowaste_pantry.db');
      this.engineName = 'SQLite (expo-sqlite)';
      await this.sqliteDb.execAsync(createTableSql);
      this.logSql('INIT', createTableSql);

      const existing = await this.sqliteDb.getAllAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM pantry_items;'
      );
      if ((existing[0]?.count ?? 0) === 0) {
        const seeds = buildSeedItems();
        for (const item of seeds) {
          await this.insertIntoSqlite(item, false);
        }
        this.logSql(
          'INIT',
          'INSERT INTO pantry_items (...) VALUES (...seed_items...);',
          [`${seeds.length} seed rows`]
        );
      }
    } else {
      const storage = getBrowserLocalStorage();
      this.engineName = storage
        ? 'Web SQL Table (localStorage)'
        : 'In-Memory SQL Table';
      this.logSql('INIT', createTableSql);

      const saved = this.loadWebTable();
      if (saved && saved.length > 0) {
        this.memoryTable = saved;
      } else {
        const seeds = buildSeedItems();
        this.persistWebTable(seeds);
        this.logSql(
          'INIT',
          'INSERT INTO pantry_items (...) VALUES (...seed_items...);',
          [`${seeds.length} seed rows`]
        );
      }
    }

    this.initialized = true;
  }

  private async insertIntoSqlite(
    item: PantryItem,
    shouldLog = true
  ): Promise<void> {
    if (!this.sqliteDb) return;
    const sql = `INSERT INTO pantry_items (id, name, category, storageLocation, quantity, unit, estimatedCost, expiryDate, status, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const params = [
      item.id,
      item.name,
      item.category,
      item.storageLocation,
      item.quantity,
      item.unit,
      item.estimatedCost,
      item.expiryDate,
      item.status,
      item.notes,
      item.createdAt,
      item.updatedAt,
    ];
    await this.sqliteDb.runAsync(sql, ...params);
    if (shouldLog) {
      this.logSql('CREATE', sql, params);
    }
  }

  public async getAllItems(): Promise<PantryItem[]> {
    await this.initDatabase();
    const sql =
      'SELECT * FROM pantry_items ORDER BY expiryDate ASC, name ASC;';
    this.logSql('READ', sql);

    if (this.sqliteDb) {
      return await this.sqliteDb.getAllAsync<PantryItem>(sql);
    }

    return [...this.memoryTable].sort((a, b) => {
      const dateCmp = a.expiryDate.localeCompare(b.expiryDate);
      return dateCmp !== 0 ? dateCmp : a.name.localeCompare(b.name);
    });
  }

  public async createItem(input: CreatePantryItemInput): Promise<PantryItem> {
    await this.initDatabase();

    const trimmedName = input.name.trim();
    if (!trimmedName) {
      throw new Error('Food item name is required.');
    }
    if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
      throw new Error('Quantity must be greater than zero.');
    }
    if (!Number.isFinite(input.estimatedCost) || input.estimatedCost < 0) {
      throw new Error('Estimated cost cannot be negative.');
    }
    if (!isValidISODate(input.expiryDate)) {
      throw new Error('Expiry date must use YYYY-MM-DD format.');
    }

    const now = new Date().toISOString();
    const newItem: PantryItem = {
      id: generateId('pantry'),
      name: trimmedName,
      category: input.category,
      storageLocation: input.storageLocation,
      quantity: Number(input.quantity),
      unit: input.unit.trim() || 'pcs',
      estimatedCost: Number(input.estimatedCost),
      expiryDate: input.expiryDate.trim(),
      status: input.status ?? 'active',
      notes: (input.notes ?? '').trim(),
      createdAt: now,
      updatedAt: now,
    };

    if (this.sqliteDb) {
      await this.insertIntoSqlite(newItem, true);
    } else {
      const sql = `INSERT INTO pantry_items (id, name, category, storageLocation, quantity, unit, estimatedCost, expiryDate, status, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      this.logSql('CREATE', sql, [
        newItem.id,
        newItem.name,
        newItem.category,
        newItem.storageLocation,
        newItem.quantity,
        newItem.unit,
        newItem.estimatedCost,
        newItem.expiryDate,
        newItem.status,
      ]);
      this.persistWebTable([...this.memoryTable, newItem]);
    }

    return newItem;
  }

  public async updateItem(
    id: string,
    updates: UpdatePantryItemInput
  ): Promise<PantryItem> {
    await this.initDatabase();

    let existing: PantryItem | undefined;
    if (this.sqliteDb) {
      const rows = await this.sqliteDb.getAllAsync<PantryItem>(
        'SELECT * FROM pantry_items WHERE id = ?;',
        id
      );
      existing = rows[0];
    } else {
      existing = this.memoryTable.find((item) => item.id === id);
    }

    if (!existing) {
      throw new Error(`Item with id "${id}" was not found.`);
    }

    const nextName =
      updates.name !== undefined ? updates.name.trim() : existing.name;
    if (!nextName) {
      throw new Error('Food item name cannot be empty.');
    }

    const nextQuantity =
      updates.quantity !== undefined ? Number(updates.quantity) : existing.quantity;
    if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
      throw new Error('Quantity must be greater than zero.');
    }

    const nextCost =
      updates.estimatedCost !== undefined
        ? Number(updates.estimatedCost)
        : existing.estimatedCost;
    if (!Number.isFinite(nextCost) || nextCost < 0) {
      throw new Error('Estimated cost cannot be negative.');
    }

    const nextExpiry =
      updates.expiryDate !== undefined
        ? updates.expiryDate.trim()
        : existing.expiryDate;
    if (!isValidISODate(nextExpiry)) {
      throw new Error('Expiry date must use YYYY-MM-DD format.');
    }

    const updatedItem: PantryItem = {
      ...existing,
      name: nextName,
      category: updates.category ?? existing.category,
      storageLocation: updates.storageLocation ?? existing.storageLocation,
      quantity: nextQuantity,
      unit:
        updates.unit !== undefined
          ? updates.unit.trim() || 'pcs'
          : existing.unit,
      estimatedCost: nextCost,
      expiryDate: nextExpiry,
      status: updates.status ?? existing.status,
      notes:
        updates.notes !== undefined ? updates.notes.trim() : existing.notes,
      updatedAt: new Date().toISOString(),
    };

    const updateSql = `UPDATE pantry_items SET name = ?, category = ?, storageLocation = ?, quantity = ?, unit = ?, estimatedCost = ?, expiryDate = ?, status = ?, notes = ?, updatedAt = ? WHERE id = ?;`;
    const params = [
      updatedItem.name,
      updatedItem.category,
      updatedItem.storageLocation,
      updatedItem.quantity,
      updatedItem.unit,
      updatedItem.estimatedCost,
      updatedItem.expiryDate,
      updatedItem.status,
      updatedItem.notes,
      updatedItem.updatedAt,
      updatedItem.id,
    ];

    if (this.sqliteDb) {
      await this.sqliteDb.runAsync(updateSql, ...params);
    } else {
      this.persistWebTable(
        this.memoryTable.map((item) => (item.id === id ? updatedItem : item))
      );
    }

    this.logSql('UPDATE', updateSql, [
      updatedItem.name,
      updatedItem.quantity,
      updatedItem.status,
      updatedItem.expiryDate,
      `WHERE id=${updatedItem.id}`,
    ]);

    return updatedItem;
  }

  public async deleteItem(id: string): Promise<void> {
    await this.initDatabase();

    const deleteSql = 'DELETE FROM pantry_items WHERE id = ?;';
    if (this.sqliteDb) {
      await this.sqliteDb.runAsync(deleteSql, id);
    } else {
      const next = this.memoryTable.filter((item) => item.id !== id);
      if (next.length === this.memoryTable.length) {
        throw new Error(`Item with id "${id}" was not found.`);
      }
      this.persistWebTable(next);
    }

    this.logSql('DELETE', deleteSql, [id]);
  }

  public async resetToDemoData(): Promise<PantryItem[]> {
    await this.initDatabase();
    const seeds = buildSeedItems();

    if (this.sqliteDb) {
      await this.sqliteDb.execAsync('DELETE FROM pantry_items;');
      for (const item of seeds) {
        await this.insertIntoSqlite(item, false);
      }
    } else {
      this.persistWebTable(seeds);
    }

    this.logSql(
      'INIT',
      'DELETE FROM pantry_items; INSERT INTO pantry_items (...) VALUES (...demo_seed...);',
      [`${seeds.length} demo items`]
    );
    return this.getAllItems();
  }
}

export const pantryDb = new PantryDatabase();
