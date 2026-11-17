# Project Documentation: ZeroWaste Pantry

**Course:** M096-ITWM106 (2026–2027) — Final Project (By Group)  
**Application Name:** ZeroWaste Pantry — Smart Food Expiry & Household Waste Tracker  
**Platform:** Cross-Platform Mobile Application (React Native + Expo + TypeScript + SQLite)

---

## 1. Introduction & Team Overview

**ZeroWaste Pantry** is a cross-platform mobile solution built by a 5-member team to combat avoidable household food spoilage and grocery budget waste. By combining an intuitive urgency-driven user interface with a local SQLite database (`expo-sqlite`), the app transforms passive pantry tracking into an actionable, real-time sustainability assistant.

### Team Roles & Ownership
| Role | Ownership & Responsibilities | Assigned Files |
| :--- | :--- | :--- |
| **Member 1 — Project Lead & SQLite Architect** | Database schema design, parameterized SQL CRUD engine, seed data generation, live SQL query logger, and TypeScript models. | `src/database/db.ts`, `src/database/seedData.ts`, `src/types/pantry.ts` |
| **Member 2 — Core Developer (Create & Update)** | Item creation & editing form modal, Quick-Fill presets, input validation, quantity adjustment, and status transition handlers. | `src/components/ItemFormModal.tsx`, `App.tsx` |
| **Member 3 — Core Developer (Read, Filter & Delete)** | Main dashboard feed, keyword search, multi-criteria filtering (status, storage zone, category), sorting, Use First banner, and delete confirmation. | `src/screens/DashboardScreen.tsx`, `src/components/UseFirstBanner.tsx`, `src/utils/expiryUtils.ts` |
| **Member 4 — UI/UX & Design Lead** | Visual theme system, color-coded urgency hierarchy, KPI hero summary card, interactive item card layout, and bottom tab navigation. | `src/constants/theme.ts`, `HeaderBar.tsx`, `SummaryHeroCard.tsx`, `PantryItemCard.tsx` |
| **Member 5 — Analytics, QA & Documentation Lead** | Sustainability & financial analytics screen, shelf-life tips, automated CRUD test suite, technical documentation, and PowerPoint presentation. | `AnalyticsScreen.tsx`, `TeamGuideScreen.tsx`, `SqlInspectorModal.tsx`, `tests/crudAndUtils.test.ts`, docs & `.pptx` |

---

## 2. Problem Statement

Students, shared dormitories, and busy households lose significant money every month when perishable groceries (milk, meat, leafy greens, bread, leftovers) spoil unnoticed in the refrigerator or pantry:
1. **Lack of Visibility:** Items stored behind other containers are easily forgotten until they expire.
2. **No Urgency Prioritization:** Standard note apps or static lists do not sort food by **how many days remain** before spoilage.
3. **Unmeasured Financial Loss:** Households rarely see how much money (`₱`) is wasted versus saved when groceries expire unused.

---

## 3. Proposed Solution & Innovative Features

**ZeroWaste Pantry** solves these problems with four core innovations:
1. **Automatic Expiry Urgency Engine (`expiryUtils.ts`):** Computes exact calendar days remaining and automatically highlights items as **Expired** (red), **Expires Today / Use in ≤ 3 Days** (orange), **Use in 4–7 Days** (amber), or **Fresh** (green).
2. **"Priority: Use This First" Horizontal Strip (`UseFirstBanner.tsx`):** Immediately surfaces urgent items at the top of the dashboard with a single-tap **`✓ Mark Consumed`** action.
3. **Real-Time Waste & Financial Impact Dashboard (`AnalyticsScreen.tsx`):** Tracks **Waste Prevention Rate (%)**, **Money Saved (`₱`)** from consumed food, **Money Lost / At Risk (`₱`)** from wasted/expired food, and actionable shelf-life extension tips per category.
4. **Live SQL CRUD Inspector (`SqlInspectorModal.tsx`):** Captures and displays every parameterized SQL query (`CREATE TABLE`, `SELECT`, `INSERT`, `UPDATE`, `DELETE`) executed by the user in real time.

---

## 4. System Architecture

The application follows a clean 4-layer architecture:
1. **Presentation Layer (`src/screens/`, `src/components/`):** Responsive React Native components styled with a unified design system (`src/constants/theme.ts`).
2. **Application State Layer (`App.tsx`):** Coordinates tab navigation, modals, toast confirmations, and reactive refreshes after every database mutation.
3. **Domain & Business Logic Layer (`src/utils/expiryUtils.ts`):** Pure, unit-tested functions for local calendar date math, urgency classification, multi-filter sorting, and analytics aggregation.
4. **Data Persistence Layer (`src/database/db.ts`, `seedData.ts`):**
   - **Native (Android / iOS via Expo Go):** Uses **`expo-sqlite`** (`openDatabaseAsync('zerowaste_pantry.db')`) with parameterized SQL queries.
   - **Web Browser (`expo start --web`):** Automatically switches to a synchronized `localStorage` SQL table engine so evaluators can also test the app in any browser without native WASM header issues.

---

## 5. Database Schema & CRUD Implementation

### SQLite Table: `pantry_items`
```sql
CREATE TABLE IF NOT EXISTS pantry_items (
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
);
```

### CRUD Mapping & Validation
- **CREATE (`PantryDatabase.createItem`):** Validates non-empty name, `quantity > 0`, `estimatedCost >= 0`, and valid `YYYY-MM-DD` date before running `INSERT INTO pantry_items (...) VALUES (?, ?, ...)`.
- **READ (`PantryDatabase.getAllItems` + `filterAndSortItems`):** Runs `SELECT * FROM pantry_items ORDER BY expiryDate ASC, name ASC;` and supports client-side search, status tabs (`active`, `consumed`, `wasted`, `all`), storage zone filters (`Fridge`, `Freezer`, `Pantry`), category filters, and sorting (`expiry`, `name`, `cost`).
- **UPDATE (`PantryDatabase.updateItem`):** Supports full form editing via `ItemFormModal`, quick **`−` / `+`** quantity adjustments, and status transitions (`active` ↔ `consumed` / `wasted`) via `UPDATE pantry_items SET ... WHERE id = ?`.
- **DELETE (`PantryDatabase.deleteItem`):** Prompts for user confirmation (`Alert.alert` on mobile / `window.confirm` on web) before executing `DELETE FROM pantry_items WHERE id = ?`.

---

## 6. Verification & Testing

Automated tests in `tests/crudAndUtils.test.ts` verify:
1. Accurate day-difference and urgency badge calculations across expired, today, critical (1–3d), warning (4–7d), and fresh (>7d) cases.
2. Complete **Create → Read → Update → Delete** database lifecycle and SQL query log recording.
3. Input validation guards rejecting blank names, zero/negative quantities, and invalid dates.
4. Search, storage/status filtering, and financial analytics accuracy.

Run checks anytime with:
```bash
npm run typecheck
npm test
```
