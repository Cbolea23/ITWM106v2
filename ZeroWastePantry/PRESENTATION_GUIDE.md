# Presentation & Video Demo Guide (5-Member Script)

**Project:** ZeroWaste Pantry — Smart Food Expiry & Household Waste Tracker  
**Course:** M096-ITWM106 (2026–2027) — Final Project (By Group)  
**Target Video Length:** 7–10 minutes (covers every required presentation section in the rubric)

---

## Presentation Flow & Timing

| Section | Duration | Lead Speaker(s) | Slides |
| :--- | :--- | :--- | :--- |
| 1. Introduction (Team Name, Members & Expertise) | 1:00 | Member 1 | Slides 1–2 |
| 2. Problem Statement & Innovation | 1:15 | Member 4 | Slides 3–4 |
| 3. Overview of System & CRUD Architecture | 1:30 | Member 1 | Slides 5–6 |
| 4. UI/UX Design & Live System Demonstration | 3:00 | Members 2, 3, 4 | Slides 7–8 + Live App |
| 5. Individual Reflections & Contributions | 2:30 | All 5 Members (30s each) | Slides 9–10 |
| 6. Conclusion & Q&A Readiness | 0:45 | Member 5 | Slides 11–12 |

---

## Live System Demonstration Checklist (3 Minutes)

Before recording, open the app (on Expo Go mobile emulator/phone or `npx expo start --web`) and optionally click **`Team & Demo → ↺ Reset Demo Data`** so all 10 realistic items are fresh.

1. **READ & Priority Alert (Member 3):**
   - Show the **Summary Hero Card** (Active Items, Use Soon count, Waste Saved %, Money Saved `₱`).
   - Scroll the **Priority: Use This First** horizontal strip showing urgent items (`<= 3` days).
   - Type `"spinach"` in the search bar, clear it, then filter by **Fridge** vs **Pantry** to show real-time READ filtering.
2. **CREATE (Member 2):**
   - Tap **`+ Add Item`** in the header.
   - Tap the **`Fresh Cow Milk`** or **`Ripe Tomatoes`** Quick-Fill preset (or type a custom item) and adjust expiry date to **`+2d`**.
   - Tap **`Save to Pantry`** — point out the green toast banner and the newly added card automatically sorted into the urgent zone.
3. **UPDATE (Member 2):**
   - On any item card, tap **`+`** to increment quantity.
   - Tap **`✎ Edit`** on the newly created item, change its notes or cost, and tap **`Update Item`**.
   - Tap **`✓ Consumed`** on an urgent item and switch briefly to the **Analytics** tab to show **Money Saved (`₱`)** and **Waste Prevention Rate (%)** increased immediately!
4. **DELETE & SQL Inspector (Members 3 & 1):**
   - Switch back to **Pantry (CRUD)**, tap **`🗑`** on a test item, and confirm deletion.
   - Tap **`SQL (N)`** in the top-right header to show the live **`CREATE`**, **`READ`**, **`UPDATE`**, and **`DELETE`** parameterized SQL queries executed during the demo.

---

## Individual Reflections & Contributions Script (All 5 Members)

### Member 1 — Project Lead & SQLite Architect
- **Contribution:** *"I led the system architecture and implemented the SQLite data layer in `src/database/db.ts`, `seedData.ts`, and `src/types/pantry.ts`. I designed the `pantry_items` table schema, built parameterized Create, Read, Update, and Delete queries, and added the live SQL Query Inspector so our app's database operations are transparent."*
- **What I Learned:** *"I learned how to structure a clean repository layer in TypeScript with `expo-sqlite` and provide a seamless web fallback so our team could test and demo on both phones and browsers without code duplication."*

### Member 2 — Core Developer (Create & Update)
- **Contribution:** *"I developed the `ItemFormModal` component (`src/components/ItemFormModal.tsx`) and the Create/Update handlers in `App.tsx`. I implemented form validation for food names, positive quantities, costs, and ISO expiry dates, along with 1-tap Quick-Fill presets and expiry shortcuts (`Today`, `+2d`, `+7d`)."*
- **What I Learned:** *"I learned how reusable modal forms can support both Create and Update modes cleanly, and how important client-side input validation is to keep invalid records out of SQLite."*

### Member 3 — Core Developer (Read, Filter & Delete)
- **Contribution:** *"I built `DashboardScreen.tsx`, `UseFirstBanner.tsx`, and the search/filter/sort utilities in `expiryUtils.ts`. Users can search across names and notes, filter by status, storage zone, or category, sort by urgency or cost, and safely delete items with cross-platform confirmation."*
- **What I Learned:** *"I learned how to combine memoized filtering and date-difference calculations in React Native so lists update instantaneously after every CRUD action without lag."*

### Member 4 — UI/UX & Design Lead
- **Contribution:** *"I created the Eco-Fresh design system in `src/constants/theme.ts` and built the core visual components: `HeaderBar`, `SummaryHeroCard`, `PantryItemCard`, and the bottom tab bar. I designed the color-coded urgency system (Red for Expired, Orange for ≤ 3 days, Amber for 4–7 days, Green for Fresh) so users know what to cook at a glance."*
- **What I Learned:** *"I learned how visual hierarchy, consistent spacing, and color semantics reduce cognitive load on mobile screens and turn raw database rows into an intuitive user experience."*

### Member 5 — Analytics, QA, Documentation & Presentation Lead
- **Contribution:** *"I built the `AnalyticsScreen.tsx` financial and sustainability dashboard, the `TeamGuideScreen.tsx` demo hub, and the automated CRUD test suite (`tests/crudAndUtils.test.ts`). I also wrote the technical documentation and assembled our PowerPoint presentation."*
- **What I Learned:** *"I learned how to translate raw CRUD state into meaningful sustainability KPIs—like Waste Prevention Rate and Pesos Saved—and how automated unit tests catch date-calculation and validation bugs early."*

---

## Top Q&A Questions & Answers (Preparation)

1. **Q: Why did you use local SQLite instead of a cloud database?**  
   **A:** A pantry tracker is used right inside the kitchen or grocery store where Wi-Fi/mobile data can be spotty. Using `expo-sqlite` gives instant offline CRUD performance with zero latency and zero recurring server cost, while keeping a clean repository interface (`PantryDatabase`) that can easily sync to a cloud API later.
2. **Q: How is ZeroWaste Pantry different from a simple Notes or To-Do app?**  
   **A:** A generic to-do app cannot calculate days remaining until expiration, surface a prioritized "Use This First" strip, track food across Fridge/Freezer/Pantry zones, or quantify money saved (`₱`) vs. wasted.
3. **Q: How do you prevent invalid or duplicate bad data from entering SQLite?**  
   **A:** Both `ItemFormModal.tsx` (UI layer) and `PantryDatabase` (`db.ts` data layer) enforce validation: food name must be non-empty, quantity must be `> 0`, estimated cost must be `>= 0`, and expiry dates are strictly validated against calendar `YYYY-MM-DD` dates.
4. **Q: How does your app handle Delete safely so users don't lose items by accident?**  
   **A:** Tapping the trash icon triggers a confirmation dialog (`Alert.alert` on iOS/Android and `window.confirm` on web) before running `DELETE FROM pantry_items WHERE id = ?`. Users can also mark finished items as **Consumed** instead of deleting them so their savings analytics remain accurate.
5. **Q: How did you verify that all CRUD operations work properly?**  
   **A:** In addition to manual mobile/web testing, we wrote an automated test suite (`tests/crudAndUtils.test.ts`) that verifies Create, Read, Update, Delete, input validation errors, urgency math, and analytics formulas, and we exposed a live SQL Query Inspector inside the app header.
6. **Q: What would you add in Version 2.0?**  
   **A:** Barcode scanning for automatic expiry defaults, local push notifications 48 hours before expiration, and AI recipe suggestions based on items currently in the "Use This First" banner.
