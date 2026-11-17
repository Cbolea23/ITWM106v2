# Presentation & Video Demo Script (5-Member Word-for-Word Guide)

**Project:** ZeroWaste Pantry — Smart Food Expiry & Household Waste Tracker  
**Course:** M096-ITWM106 (2026–2027) — Final Project (By Group)  
**Target Video Length:** 8–10 minutes

---

## Presentation Flow & Timing

| Part | On Screen | Speaker(s) | Duration |
| :--- | :--- | :--- | :--- |
| **Part 1: Introduction** | Slides 1–2 | **Member 1** | ~1:00 |
| **Part 2: Problem & Innovation** | Slides 3–4 | **Member 4** | ~1:15 |
| **Part 3: System Overview & CRUD** | Slides 5–6 | **Member 1** | ~1:30 |
| **Part 4: UI/UX & Live App Demo** | Slides 7–8 + **Live App** | **Members 4, 3, 2 & 1** | ~3:00 |
| **Part 5: Reflections & Contributions** | Slides 9–10 | **All 5 Members** | ~2:30 |
| **Part 6: Impact, Roadmap & Q&A** | Slides 11–12 | **Member 5** (+ any member for Q&A) | ~1:00 |

---

## Full Word-for-Word Spoken Script

### Part 1: Introduction (Slides 1–2) — **Member 1**

**[Show Slide 1 — Title Slide]**  
> **Member 1:**  
> *"Good day everyone! We are **[Team Name]**, and today we are presenting our final project for ITWM106: **ZeroWaste Pantry — a Smart Food Expiry and Household Waste Tracker** built with React Native, Expo, TypeScript, and SQLite."*

**[Show Slide 2 — Meet the Team & Role Division]**  
> **Member 1:**  
> *"Before we dive in, let me introduce our five-member team and each member's expertise:*  
> - *I am **[Member 1 Name]**, the Project Lead and SQLite Architect, responsible for the database schema, parameterized CRUD engine, and live SQL query logger.*  
> - ***[Member 2 Name]** is our Create & Update Developer, who built the validated Add/Edit form modal and quick-fill presets.*  
> - ***[Member 3 Name]** is our Read, Filter & Delete Developer, who built the urgency-sorted dashboard, search, filters, and safe delete flow.*  
> - ***[Member 4 Name]** is our UI/UX & Navigation Lead, who designed our Eco-Fresh theme, urgency color system, and card components.*  
> - *And **[Member 5 Name]** is our Analytics, QA, Documentation & Presentation Lead, who built the waste and Peso-savings analytics, automated tests, and documentation."*

---

### Part 2: Problem Statement & Innovation (Slides 3–4) — **Member 4**

**[Show Slide 3 — Problem Statement]**  
> **Member 4:**  
> *"Every week, students, dormers, and households throw away perfectly good groceries simply because items get pushed to the back of the fridge and forgotten. Generic notes or to-do apps don't solve this because:*  
> *First, they don't track **how many days remain** before an item expires.*  
> *Second, they don't prioritize **what needs to be cooked first** today.*  
> *And third, households rarely see how much money—in Pesos—is actually being lost to spoiled food."*

**[Show Slide 4 — Our Solution & Innovation]**  
> **Member 4:**  
> *"That is why we built **ZeroWaste Pantry**. What makes our solution innovative compared to a basic list app are four smart features:*  
> *First, a **Dynamic Expiry Urgency Engine** that automatically calculates days remaining and color-codes every item.*  
> *Second, a **'Use This First' Priority Strip** pinned at the top for items expiring within 3 days.*  
> *Third, a **Sustainability & Financial Impact Dashboard** that calculates your Waste Prevention Rate and Pesos saved.*  
> *And fourth, a **Live SQL Query Inspector** right inside the app header so we can verify every database operation in real time."*

---

### Part 3: System Overview & CRUD Architecture (Slides 5–6) — **Member 1**

**[Show Slide 5 — System Overview & Architecture]**  
> **Member 1:**  
> *"Let's look at how the system is structured. ZeroWaste Pantry follows a clean four-layer architecture:*  
> *Layer 1 is our **Presentation UI** built in React Native and Expo.*  
> *Layer 2 is the **Application State Controller** in `App.tsx`, which manages navigation, modals, and reactive refreshes.*  
> *Layer 3 is our **Domain & Analytics Engine** in `expiryUtils.ts`, handling date math, urgency classification, filtering, and analytics.*  
> *And Layer 4 is our **Dual-Engine Persistence Layer** in `db.ts`. On Android and iOS devices, it uses `expo-sqlite` (`zerowaste_pantry.db`) so it works 100% offline in the kitchen or grocery store, with a synchronized browser SQL table fallback for web demos."*

**[Show Slide 6 — Database Schema & Full CRUD Implementation]**  
> **Member 1:**  
> *"All items are stored in our `pantry_items` SQLite table with columns for ID, name, category, storage location, quantity, unit, estimated cost in Pesos, expiry date, status (`active`, `consumed`, or `wasted`), and storage notes.*  
> *Every CRUD operation runs parameterized SQL queries with strict validation:*  
> - ***CREATE** runs `INSERT INTO pantry_items` from our Add modal.*  
> - ***READ** runs `SELECT * FROM pantry_items ORDER BY expiryDate ASC`.*  
> - ***UPDATE** runs `UPDATE pantry_items SET ... WHERE id = ?` for edits, quantity steppers, and status updates.*  
> - *And **DELETE** runs `DELETE FROM pantry_items WHERE id = ?` after user confirmation."*

---

### Part 4: UI/UX & Live System Demonstration (Slides 7–8 → Live App)

**[Show Slide 7 — UI/UX Design]**  
> **Member 4:**  
> *"For our UI design, we used an Eco-Fresh Emerald theme with consistent card spacing and clear color-coded urgency badges: Red for Expired, Orange for Critical (0 to 3 days), Amber for Warning (4 to 7 days), and Green for Fresh. The app has three clean tabs: **Pantry (CRUD)**, **Analytics**, and **Team & Demo**."*

**[Show Slide 8 — Live App Demo Transition → Switch screen to the running ZeroWaste Pantry app]**

#### Step 1: READ, Search & Filter — **Member 3**
> **Member 3:**  
> *"Now let's demonstrate the live application. Right here on the **Pantry** tab, we see our Summary Hero Card showing active items, items needing attention, our Waste Prevention percentage, and Money Saved in Pesos.*  
> *Directly below is the **Priority: Use This First** horizontal strip highlighting items expiring within 3 days.*  
> *For our **READ** and filtering features: if I type `'spinach'` in the search bar, it filters immediately. Clearing that, I can filter by storage zone—such as **Fridge** or **Pantry**—or filter by category and sort by soonest expiry, name, or highest value."*

#### Step 2: CREATE — **Member 2**
> **Member 2:**  
> *"Next, let's demonstrate **CREATE**. I'll tap **`+ Add Item`** in the header. Users can type any custom food item, or tap one of our 1-tap Quick-Fill presets—let's tap **Fresh Cow Milk**, set the expiry shortcut to **`+2d`**, and tap **Save to Pantry**.*  
> *As you can see from the green toast banner, the item is saved to SQLite and automatically sorted into the urgent section of the dashboard."*

#### Step 3: UPDATE & Analytics — **Member 2 (then Member 5 briefly)**
> **Member 2:**  
> *"For **UPDATE**, we support three ways to modify a record: first, tapping the **`+`** or **`−`** stepper updates quantity immediately. Second, tapping **`✎ Edit`** opens the modal pre-filled—let's update the notes or cost and tap **Update Item**.*  
> *Third, when you finish a food item before it spoils, tapping **`✓ Consumed`** updates its status in the database."*  
> *(Tap **Analytics** tab)*  
> **Member 5:**  
> *"Switching to the **Analytics** tab, you can immediately see our **Waste Prevention Rate** and **Money Saved (₱)** increase, alongside our Storage Zone breakdown, Category value bars, and practical shelf-life extension tips."*

#### Step 4: DELETE & Live SQL Inspector — **Member 3 & Member 1**
> **Member 3:**  
> *"Finally, let's demonstrate **DELETE**. Back on the **Pantry** tab, I'll tap the trash icon **`🗑`** on our test item. A confirmation prompt appears so users don't delete items by accident. Once I confirm, the item is removed."*  
> **Member 1:**  
> *"And to prove every operation ran against our database layer, I'll tap **`SQL (N)`** in the top-right header. Here in the **Live SQL Query Log**, you can inspect the exact `SELECT`, `INSERT`, `UPDATE`, and `DELETE` statements and bound parameters executed during our demo."*

---

### Part 5: Individual Reflections & Contributions (Slides 9–10) — **All 5 Members**

**[Show Slide 9 — Reflections (Members 1, 2 & 3)]**

> **Member 1:**  
> *"To summarize my contribution, I led the system architecture and implemented the SQLite data layer in `src/database/db.ts`, `seedData.ts`, and `src/types/pantry.ts`. I designed the `pantry_items` table schema, built parameterized Create, Read, Update, and Delete queries, and added the live SQL Query Inspector. Through this project, I learned how to structure a clean repository layer in TypeScript with `expo-sqlite` and provide a seamless web fallback so our team could test on both phones and browsers."*

> **Member 2:**  
> *"My main contribution was developing the `ItemFormModal` component in `src/components/ItemFormModal.tsx` and the Create and Update handlers in `App.tsx`. I implemented input validation for food names, positive quantities, costs, and ISO expiry dates, along with 1-tap Quick-Fill presets and expiry shortcuts. I learned how reusable modal forms can cleanly handle both Create and Edit modes, and why strict validation is essential to keep bad data out of SQLite."*

> **Member 3:**  
> *"I built `DashboardScreen.tsx`, `UseFirstBanner.tsx`, and the search, filter, and sort utilities in `expiryUtils.ts`, as well as the cross-platform Delete confirmation flow. I learned how to combine memoized filtering and calendar-normalized date calculations in React Native so lists update instantaneously after every CRUD action without lag."*

**[Show Slide 10 — Reflections (Members 4 & 5)]**

> **Member 4:**  
> *"I created the Eco-Fresh design system in `src/constants/theme.ts` and built our core visual components: `HeaderBar`, `SummaryHeroCard`, `PantryItemCard`, and the three-tab bottom navigation bar. I designed the color-coded urgency badges so users know what to cook at a glance. I learned how visual hierarchy, consistent spacing, and color semantics reduce cognitive load on mobile screens."*

> **Member 5:**  
> *"I built the `AnalyticsScreen.tsx` financial and sustainability dashboard, the `TeamGuideScreen.tsx` demo hub, and our automated CRUD test suite in `tests/crudAndUtils.test.ts`, along with our technical documentation and PowerPoint deck. I learned how to translate raw CRUD records into meaningful sustainability KPIs—like Waste Prevention Rate and Pesos Saved—and how automated unit tests catch date and validation bugs early."*

---

### Part 6: Impact, Future Roadmap & Q&A (Slides 11–12) — **Member 5**

**[Show Slide 11 — Impact & Version 2.0 Roadmap]**  
> **Member 5:**  
> *"In conclusion, ZeroWaste Pantry delivers real-world impact by saving household budgets, working offline anywhere via SQLite, and encouraging sustainable habits. In Version 2.0, we plan to add barcode scanning, push notifications 48 hours before expiration, and AI recipe suggestions using items in the 'Use This First' strip."*

**[Show Slide 12 — Q&A]**  
> **Member 5:**  
> *"Thank you for listening! To wrap up, let's quickly address two common technical questions about our system:"*  
> - **Member 1:** *"First, why did we choose local SQLite instead of a cloud server? Because a pantry tracker is used inside kitchens and grocery stores where Wi-Fi can be spotty—`expo-sqlite` gives instant offline CRUD with zero latency and zero server cost."*  
> - **Member 3:** *"Second, how do we prevent accidental deletions? Every delete triggers a confirmation dialog, and users can mark finished items as **Consumed** instead of deleting them so their Peso savings stay accurate."*  
> **Member 5:** *"That concludes our presentation for ZeroWaste Pantry. We are ready for any further questions. Thank you!"*

---

## Extra Q&A Prep (If Asked Live)

1. **Q: How is ZeroWaste Pantry different from a simple Notes or To-Do app?**  
   **A:** A generic to-do app cannot calculate days remaining until expiration, surface a prioritized "Use This First" strip, track food across Fridge/Freezer/Pantry zones, or quantify money saved (`₱`) vs. wasted.
2. **Q: How do you prevent invalid data from entering SQLite?**  
   **A:** Both `ItemFormModal.tsx` (UI layer) and `PantryDatabase` (`db.ts` data layer) enforce validation: food name must be non-empty, quantity must be `> 0`, estimated cost must be `>= 0`, and expiry dates are strictly validated against `YYYY-MM-DD` calendar dates.
3. **Q: How did you verify that all CRUD operations work properly?**  
   **A:** Alongside manual mobile/web testing, our automated test suite (`tests/crudAndUtils.test.ts`) verifies Create, Read, Update, Delete, validation guards, urgency math, and analytics formulas, and our in-app SQL Inspector shows live queries.
