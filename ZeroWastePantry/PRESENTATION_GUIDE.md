# Presentation Script — The Boleas (Members 1, 3, 4 & 5)

**Project:** ZeroWaste Pantry — Smart Food Expiry & Household Waste Tracker  
**Team Name:** The Boleas  
**Course:** M096-ITWM106 (2026–2027) — Final Project (By Group)

---

## Speaker Assignment Overview

| Slide(s) | Topic | Speaker |
| :--- | :--- | :--- |
| **Slides 1–2** | Title, Team Intro & Role Division | **Member 1 — Joshua V. Pornias** |
| **Slides 3–4** | Problem Statement & Innovation | **Member 4 — Darryl Ingente** |
| **Slides 5–6** | System Overview, Schema & CRUD | **Member 1 — Joshua V. Pornias** |
| **Slide 7** | Content & UI/UX Design | **Member 4 — Darryl Ingente** |
| **Slide 8 + Live App** | End-to-End Live App Demonstration | **Member 2 — Wayne Nagares** *(uses own script)* |
| **Slide 9** | Reflections & Contributions (Members 1 & 3) | **Joshua V. Pornias** & **Christian Louis Bolea** |
| **Slide 10** | Reflections & Contributions (Members 4 & 5) | **Darryl Ingente** & **Allen Seares** |
| **Slide 11** | Impact & Version 2.0 Roadmap | **Member 5 — Allen Seares** |
| **Last Part / Handoff** | Member 2 Individual Contribution & Closing | **Member 2 — Wayne Nagares** *(own script)* → **Member 5** closes on **Slide 12** |

---

## Word-for-Word Slide Script

### Slide 1 & Slide 2: Introduction & Team Roles — **Member 1 (Joshua V. Pornias)**

**[Slide 1 — Title Slide]**  
> **Joshua:**  
> *"Good day everyone! We are **The Boleas**, and today we are presenting our final project for ITWM106: **ZeroWaste Pantry — Smart Food Expiry and Household Waste Tracker**.*  
> *It is a cross-platform React Native and Expo SQLite mobile application that turns static grocery tracking into an intelligent, urgency-sorted waste prevention assistant with full CRUD and real-time financial impact analytics."*

**[Slide 2 — Meet the Team & Role Division]**  
> **Joshua:**  
> *"Let me introduce our five-member team and each member's role:*  
> - *I am **Joshua Pornias**, Project Lead and SQLite Architect, responsible for the database schema, parameterized SQL CRUD engine, seed dataset, and live SQL query logger.*  
> - ***Wayne Nagares** is our Core Developer for Create and Update, who built the validated Add/Edit modal, Quick-Fill presets, expiry shortcuts, and quantity/status updates—and he will also lead our live app demonstration shortly.*  
> - ***Christian Louis Bolea** is our Core Developer for Read, Filter, and Delete, handling the search bar, storage/category/status filters, sorting, the Use First strip, and safe delete confirmation.*  
> - ***Darryl Ingente** is our UI/UX and Navigation Lead, who designed the Eco-Fresh design system, color-coded urgency hierarchy, KPI hero card, and bottom navigation.*  
> - *And **Allen Seares** is our Analytics, QA, Docs, and Video Lead, who built the waste prevention score, Peso savings analytics, automated unit/CRUD tests, and our documentation and presentation deck."*

---

### Slide 3 & Slide 4: Problem Statement & Innovation — **Member 4 (Darryl Ingente)**

**[Slide 3 — Problem Statement]**  
> **Darryl:**  
> *"Why do households and students waste food every week? Groceries often expire unseen behind fridge shelves, creating avoidable budget loss and environmental waste. Specifically, there are three problems:*  
> *First, **Forgotten Expiry Dates** — perishables like milk, leafy greens, and cooked leftovers get pushed to the back of the fridge until they spoil.*  
> *Second, **No Urgency Prioritization** — paper lists and generic Notes apps cannot automatically compute days remaining or highlight what must be cooked first today.*  
> *And third, **Hidden Financial Drain** — students and families rarely measure how many Pesos are lost monthly to spoiled groceries versus saved through timely meal planning.*  
> *That led us to our core question: How can we give every student and household an effortless mobile tool that tells them what to cook first, tracks storage zones offline, and quantifies every Peso saved from waste?"*

**[Slide 4 — Solution & Innovation]**  
> **Darryl:**  
> *"Our answer is **ZeroWaste Pantry**. What makes our solution innovative and game-changing compared to ordinary inventory or to-do apps are four core features:*  
> *First, our **Dynamic Expiry Urgency Engine** in `expiryUtils.ts`, which automatically computes local calendar days remaining and sorts items into Expired, Today or ≤ 3 days, 4–7 days, and Fresh.*  
> *Second, the **'Use This First' Priority Banner** in `UseFirstBanner.tsx`—a horizontal strip pinned above the pantry list so urgent ingredients appear immediately on launch with a one-tap 'Mark Consumed' button.*  
> *Third, our **Sustainability & Peso Impact Score** in `AnalyticsScreen.tsx`, which calculates live Waste Prevention Rate, Money Saved, Money Lost, and category-specific shelf-life tips.*  
> *And fourth, our **Live SQL Query Inspector** in `SqlInspectorModal.tsx`, which captures every `CREATE TABLE`, `SELECT`, `INSERT`, `UPDATE`, and `DELETE` statement with bound parameters in real time."*

---

### Slide 5 & Slide 6: System Overview, Schema & CRUD — **Member 1 (Joshua V. Pornias)**

**[Slide 5 — System Overview & Architecture]**  
> **Joshua:**  
> *"Moving on to our system overview, ZeroWaste Pantry uses a clean four-layer architecture:*  
> - ***Layer 1** is our **Presentation UI**, containing our screens and reusable components.*  
> - ***Layer 2** is the **Application State Controller** in `App.tsx`, which manages tab navigation, modal state, delete confirmations, toast feedback, and reactive SQL reloads.*  
> - ***Layer 3** is our **Domain and Analytics Engine** in `expiryUtils.ts`, consisting of pure unit-tested functions for day-difference math, urgency classification, search/filter/sort, and Peso KPIs.*  
> - ***Layer 4** is our **Dual-Engine Persistence** in `db.ts` and `seedData.ts`: on Android and iOS, it uses `expo-sqlite` (`zerowaste_pantry.db`) for offline-first local storage, while on Expo Web and Node tests it uses a synchronized SQL table and logger.*  
> *Our tech stack combines React Native 0.76.5, Expo SDK 52, strict TypeScript, `expo-sqlite`, and the Node Test Runner."*

**[Slide 6 — Database Schema & Full CRUD Operations]**  
> **Joshua:**  
> *"Here is our SQLite schema and full CRUD implementation. All records are stored in the `pantry_items` table with `id` as primary key, plus `name`, `category`, `storageLocation`, `quantity`, `unit`, `estimatedCost`, `expiryDate`, `status`, `notes`, and timestamps.*  
> *Each CRUD operation executes parameterized SQL with strict validation:*  
> - ***CREATE** runs `INSERT INTO pantry_items` from our validated Add Item modal with Quick-Fill presets and one-tap expiry dates.*  
> - ***READ** runs `SELECT * FROM pantry_items ORDER BY expiryDate ASC` to power our urgency-sorted feed with search and filters.*  
> - ***UPDATE** runs `UPDATE pantry_items SET ... WHERE id = ?` for inline quantity steppers, Consumed/Wasted toggles, and full edits.*  
> - *And **DELETE** runs `DELETE FROM pantry_items WHERE id = ?` with a cross-platform confirmation prompt before removing any record."*

---

### Slide 7: Content & UI/UX Design — **Member 4 (Darryl Ingente)**

**[Slide 7 — Intuitive, Mobile-First Visual Hierarchy]**  
> **Darryl:**  
> *"For our UI design, we focused on visual consistency and effortless mobile interaction.*  
> *On the left, you can see our **Color-Coded Urgency Badges**: Red for Expired items, Orange for Critical items expiring in 0 to 3 days, Amber for Warning items in 4 to 7 days, and Green for Fresh items over 7 days.*  
> *On the right is our **3-Tab Streamlined Navigation**:*  
> - *Tab 1, **Pantry (CRUD)**, houses the Summary Hero KPIs, 'Use This First' strip, search, filters, and interactive item cards.*  
> - *Tab 2, **Analytics**, displays the Sustainability Waste Prevention percentage, Money Saved versus Lost, Storage Zone breakdown, and Shelf-Life Extension Tips.*  
> - *And Tab 3, **Team & Demo**, provides our 5-member role ownership, CRUD checklist, 1-tap Reset Demo Data button, and SQL Inspector launch.*  
> *Now, I'll hand it over to **Wayne** for Slide 8 and our live end-to-end system demonstration."*

---

### Slide 8 + Live App Demo — **Member 2 (Wayne Nagares)**
> *[Handoff: **Wayne Nagares** presents Slide 8 and runs the live end-to-end app demonstration using his own script.]*

---

### Slide 9 & Slide 10: Reflections & Contributions — **Members 1, 3, 4 & 5**

**[Slide 9 — Reflections & Contributions (Part 1)]**  
> **Member 1 — Joshua V. Pornias:**  
> *"For my individual contribution, I led the project architecture and built `src/database/db.ts`, `seedData.ts`, and `pantry.ts`. I designed the `pantry_items` SQLite schema, parameterized CRUD queries, and the live SQL query logger. My key takeaway was learning how to architect a dual-engine repository with `expo-sqlite` and a Web SQL table so the app runs offline on mobile and cleanly in browser tests."*

> **Member 3 — Christian Louis Bolea:**  
> *"For my contribution, I built `DashboardScreen.tsx`, `UseFirstBanner.tsx`, and the search, filter, and sort utilities in `expiryUtils.ts`, along with the cross-platform Delete confirmation flow. Through this, I learned how memoized filtering and calendar-normalized date math keep large item lists responsive immediately after every CRUD mutation."*

**[Slide 10 — Reflections & Contributions (Part 2)]**  
> **Member 4 — Darryl Ingente:**  
> *"For my contribution, I designed our Eco-Fresh design tokens in `src/constants/theme.ts` and crafted `HeaderBar`, `SummaryHeroCard`, `PantryItemCard`, and the 3-tab bottom navigation bar. My key reflection is how color-coded urgency borders, badges, and spacious mobile touch targets transform raw SQL rows into a clear, effortless daily workflow."*

> **Member 5 — Allen Seares:**  
> *"For my contribution, I built `AnalyticsScreen.tsx`, `TeamGuideScreen.tsx`, `SqlInspectorModal.tsx`, and our automated CRUD and math tests in `tests/crudAndUtils.test.ts`, along with our technical documentation and PowerPoint deck. I learned how to convert pantry status changes into measurable sustainability KPIs—like Waste Prevention Rate and Pesos Saved—and validate all edge cases via automated tests."*

---

### Slide 11: Impact & Future Roadmap — **Member 5 (Allen Seares)**

**[Slide 11 — Real-World Impact & Version 2.0 Roadmap]**  
> **Member 5 — Allen Seares:**  
> *"To wrap up our system's value, ZeroWaste Pantry delivers immediate real-world impact:*  
> *It **saves household budgets** by tracking actual Pesos saved per consumed item and flagging at-risk groceries before they spoil.*  
> *It **works offline anywhere** using local SQLite, encourages **sustainable habits** through the Waste Prevention Score, and has **zero learning curve** with Quick-Fill presets and one-tap status updates.*  
> *For Version 2.0, we plan to add **Barcode and Receipt Scanning**, **Push Reminders** 48 hours before expiration, **AI Recipe Matching** for urgent items, and **Shared Household Sync** for roommates and families.*  
> *Before we close, I'll turn it over to **Wayne** to share his individual contribution and reflection."*

---

### Last Part: Member 2 Individual Contribution & Closing — **Member 2 (Wayne Nagares) → Member 5 (Allen Seares)**
> *[Handoff: **Wayne Nagares** speaks his individual contribution & reflection using his own script.]*

**[Slide 12 — Thank You!]**  
> **Member 5 — Allen Seares:**  
> *"Thank you so much for watching our presentation! Once again, we are **The Boleas**, and this has been **ZeroWaste Pantry — Turning Expiry Awareness into Everyday Savings**. Thank you!"*
