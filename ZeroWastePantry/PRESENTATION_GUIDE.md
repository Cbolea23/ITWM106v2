# Short Presentation Script — ZeroWaste Pantry (ITWM106)

**Team:** The Boleas *(update if renamed)*  
**Speaker Split (3 turns each for Joshua, Christian, Darryl, Allen; Wayne does Slide 8 + Live Demo + End Reflection)**

---

### Slides 1–2: Intro & Team — **Joshua V. Pornias**
- **Slide 1:** *"Good day! We are **[Team Name]**, presenting **ZeroWaste Pantry**—a React Native and SQLite mobile app that tracks food expiry dates and prevents household waste."*
- **Slide 2:** *"Our team: I'm **Joshua Pornias** (SQLite & Lead), **Wayne Nagares** (Create, Update & Live Demo), **Christian Bolea** (Read, Filter & Delete), **Darryl Ingente** (UI/UX Lead), and **Allen Seares** (Analytics, Docs & Video Lead Editor)."*

### Slide 3: Problem Statement — **Darryl Ingente**
- *"Households and students waste food because groceries get forgotten in the fridge, notes apps don't sort by days remaining, and nobody tracks how many Pesos are lost to spoilage. Now **Christian** will present our solution."*

### Slides 4–5: Innovation & Architecture — **Christian Louis Bolea**
- **Slide 4:** *"ZeroWaste Pantry solves this with four features: a **Dynamic Expiry Engine**, a **'Use This First' Priority Strip** for items expiring within 3 days, **Peso Savings Analytics**, and a **Live SQL Query Inspector**."*
- **Slide 5:** *"Our app uses a 4-layer architecture: **Presentation UI**, **App State (`App.tsx`)**, **Domain Logic (`expiryUtils.ts`)**, and **Dual-Engine Persistence (`db.ts`)** powered by `expo-sqlite` offline on mobile with a Web SQL fallback. Next is **Joshua** for our database."*

### Slide 6: Database & CRUD — **Joshua V. Pornias**
- *"All items live in our `pantry_items` SQLite table with full validated CRUD: **CREATE** via `INSERT`, **READ** sorted by `expiryDate`, **UPDATE** for edits, steppers, and `Consumed` status, and **DELETE** with confirmation."*

### Slide 7: UI/UX Design — **Darryl Ingente**
- *"Our Eco-Fresh UI uses color-coded urgency badges—Red for Expired, Orange for ≤ 3 days, Amber for 4–7 days, Green for Fresh—across three tabs: **Pantry**, **Analytics**, and **Team & Demo**. Over to **Wayne** for the live demo!"*

### Slide 8 + Live Demo — **Wayne Nagares** *(Own Script)*

### Slides 9–10: Reflections & Contributions
- **Joshua (Slide 9):** *"I built `db.ts`, `seedData.ts`, and `pantry.ts`. I learned how to build an offline-first `expo-sqlite` repository with a Web fallback."*
- **Christian (Slide 9):** *"I built `DashboardScreen`, `UseFirstBanner`, `expiryUtils.ts`, and safe delete. I learned how memoized filtering and date math keep lists fast."*
- **Darryl (Slide 10):** *"I designed `theme.ts`, `HeaderBar`, `SummaryHeroCard`, and `PantryItemCard`. I learned how color semantics make mobile UIs effortless."*
- **Allen (Slide 10):** *"I built `AnalyticsScreen`, `TeamGuideScreen`, `SqlInspectorModal`, CRUD tests, docs, slides, and edited our video. I learned how to turn CRUD data into Peso-savings KPIs."*

### Slide 11 → Wayne Reflection → Slide 12
- **Allen (Slide 11):** *"ZeroWaste Pantry saves budgets offline and gamifies waste prevention. Version 2.0 will add barcode scanning, expiry notifications, and AI recipes. Now **Wayne** will share his reflection."*
- **Wayne:** *(Own reflection script)*
- **Allen (Slide 12):** *"Thank you for watching our presentation of **ZeroWaste Pantry**!"*
