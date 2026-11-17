# ZeroWaste Pantry — Smart Food Expiry & Household Waste Tracker

**Course:** M096-ITWM106 (2026–2027) — Final Project (By Group)  
**Framework:** React Native (Expo SDK 52) + TypeScript + SQLite (`expo-sqlite`)

---

## Overview

**ZeroWaste Pantry** is a cross-platform mobile application built with React Native and SQLite that helps students, roommates, and households stop forgetting perishable food in their fridge, freezer, and pantry. Instead of acting as a static shopping list, the app automatically calculates **days remaining until expiration**, surfaces a **"Use This First"** priority strip for items expiring within 3 days, tracks **money saved vs. wasted (`₱`)**, and logs live **SQL CRUD statements** in an interactive SQL Inspector.

---

## Key Features & Full CRUD Operations

| CRUD Operation | User Flow in App | SQLite Statement Executed |
| :--- | :--- | :--- |
| **CREATE** | Tap **`+ Add Item`**, pick a 1-tap Quick-Fill preset or enter custom fields, and tap **Save to Pantry**. | `INSERT INTO pantry_items (...) VALUES (?, ?, ...);` |
| **READ** | View urgency-sorted dashboard, search by keyword, filter by **Fridge / Freezer / Pantry**, category, or status, and sort by expiry, name, or cost. | `SELECT * FROM pantry_items ORDER BY expiryDate ASC, name ASC;` |
| **UPDATE** | Tap **`−` / `+`** quantity steppers, **`✓ Consumed`**, **`✗ Wasted`**, **`↩ Restore Active`**, or **`✎ Edit`** to update any field. | `UPDATE pantry_items SET ... WHERE id = ?;` |
| **DELETE** | Tap **`🗑`** on any item card and confirm deletion in the prompt. | `DELETE FROM pantry_items WHERE id = ?;` |

---

## Innovative Features
1. **Dynamic Urgency Engine:** Automatically classifies items into **Expired** (red), **Expires Today / Use in ≤ 3d** (orange), **Use in 4–7d** (amber), and **Fresh** (green).
2. **"Priority: Use This First" Horizontal Strip:** Instantly surfaces items expiring within 3 days with a 1-tap **`✓ Mark Consumed`** button.
3. **Financial & Sustainability Analytics:** Calculates Waste Prevention Score (`%`), Money Saved (`₱`), Money Lost/At Risk (`₱`), and storage zone/category breakdowns.
4. **Live SQL Query Inspector:** Built-in **`SQL (N)`** button in the header lets presenters display the exact parameterized SQL statements executed during the demo.
5. **Dual-Engine Persistence:** Uses native `expo-sqlite` on iOS/Android devices and a synchronized `localStorage` SQL table engine on Expo Web so the app works seamlessly everywhere.

---

## Project Structure

```text
ZeroWastePantry/
├── App.tsx                             # App shell, navigation bar, state & CRUD handlers
├── app.json                            # Expo configuration with expo-sqlite plugin
├── package.json                        # Dependencies and verification scripts
├── README.md                           # Quick setup & feature summary
├── PROJECT_DOCUMENTATION.md            # Full academic & technical project documentation
├── PRESENTATION_GUIDE.md               # 5-member presentation script, reflections & Q&A prep
├── ZeroWaste_Pantry_Presentation.pptx  # Ready-to-present 12-slide PowerPoint deck
├── src/
│   ├── types/pantry.ts                 # TypeScript interfaces for items, analytics, SQL logs
│   ├── constants/theme.ts              # Eco-fresh color palette, presets & shelf-life tips
│   ├── utils/expiryUtils.ts            # Expiry math, urgency badges, filter/sort, analytics
│   ├── database/
│   │   ├── seedData.ts                 # 10 realistic dynamic-date demo records
│   │   └── db.ts                       # Dual-engine SQLite CRUD repository + SQL query logger
│   ├── components/
│   │   ├── HeaderBar.tsx               # App header with SQL Inspector & Add Item CTA
│   │   ├── SummaryHeroCard.tsx         # 4-metric KPI summary card
│   │   ├── UseFirstBanner.tsx          # Priority expiring-soon horizontal banner
│   │   ├── PantryItemCard.tsx          # Item card with stepper, status & Edit/Delete actions
│   │   ├── ItemFormModal.tsx           # Validated Create & Edit modal with Quick-Fill presets
│   │   └── SqlInspectorModal.tsx       # Live SQL Query Log viewer
│   └── screens/
│       ├── DashboardScreen.tsx         # Main READ, search, filter, sort & CRUD dashboard
│       ├── AnalyticsScreen.tsx         # Waste prevention score, ₱ savings & storage tips
│       └── TeamGuideScreen.tsx         # In-app 5-member roles, CRUD checklist & demo reset
└── tests/
    └── crudAndUtils.test.ts            # Automated unit & CRUD verification tests
```

---

## Setup & Running Locally

```bash
cd ZeroWastePantry
npm install

# Start Expo dev server (scan QR code in Expo Go on Android/iOS)
npx expo start

# Or run directly in browser
npx expo start --web

# Run TypeScript typecheck and automated CRUD tests
npm run typecheck
npm test
```
