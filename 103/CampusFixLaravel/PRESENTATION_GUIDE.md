# Short Presentation Script — CampusFix (ITWM103)

**Framework:** Laravel 11 MVC + MySQL  
**Speaker Split (3 turns each for Joshua, Christian, Darryl, Allen; Wayne does Slide 8 + Live Demo + End Reflection)**

---

### Slides 1–2: Intro & Team — **Joshua V. Pornias**
- **Slide 1:** *"Good day! We are presenting **CampusFix**—a Laravel MVC and MySQL web app for reporting, prioritizing, and resolving campus facility issues."*
- **Slide 2:** *"Our team: I'm **Joshua Pornias** (MySQL & Model Lead), **Wayne Nagares** (Create, Update & Live Demo), **Christian Bolea** (Read, Filter, Upvote & Delete), **Darryl Ingente** (UI/UX & Blade Lead), and **Allen Seares** (Analytics, Docs & Video Lead Editor)."*

### Slide 3: Problem Statement — **Darryl Ingente**
- *"Broken lights, leaks, and safety hazards often go unfixed because there is no centralized tracker, no severity tagging, and no visibility on repair progress. Now **Christian** will present our solution."*

### Slides 4–5: Innovation & Laravel MVC — **Christian Louis Bolea**
- **Slide 4:** *"CampusFix adds four innovations: a **Priority-Sorted Queue** for Critical/High hazards, a **3-Stage Workflow** (`Reported → In Progress → Resolved`), **Community Upvotes** to prevent duplicate reports, and **Live Resolution Rate KPIs**."*
- **Slide 5:** *"It follows **Laravel MVC**: `routes/web.php` routes requests to `IssueReportController`, which validates inputs, queries our `IssueReport` Eloquent Model in MySQL, and renders Blade views. Next is **Joshua** for our schema and CRUD."*

### Slide 6: MySQL Schema & CRUD — **Joshua V. Pornias**
- *"Our `issue_reports` MySQL table powers full Eloquent CRUD: **Create** via `store()`, **Read** via priority-sorted `index()` and `show()`, **Update** via `update()`, `advanceStatus()`, and `upvote()`, and **Delete** via `destroy()` with confirmation."*

### Slide 7: UI/UX Design — **Darryl Ingente**
- *"Our Royal Indigo and Teal interface uses color-coded left borders and badges for Critical, High, Medium, and Low severities, plus four live KPI cards at the top. Over to **Wayne** for the live demo!"*

### Slide 8 + Live Demo — **Wayne Nagares** *(Own Script)*

### Slides 9–10: Reflections & Contributions
- **Joshua (Slide 9):** *"I built the MySQL schema, migrations, seeder, and `IssueReport` model. I learned how Eloquent scopes keep queries clean."*
- **Christian (Slide 9):** *"I built the dashboard `index` and `show` views, filters, upvotes, and `destroy`. I learned how Laravel resource routes enforce clean MVC."*
- **Darryl (Slide 10):** *"I built `app.blade.php`, `campusfix.css`, KPI cards, and severity badges. I learned how visual hierarchy makes urgent hazards stand out."*
- **Allen (Slide 10):** *"I built the resolution KPIs, `IssueReportCrudTest.php`, docs, slides, and edited our video. I learned how feature tests verify full CRUD integrity."*

### Slide 11 → Wayne Reflection → Slide 12
- **Allen (Slide 11):** *"CampusFix speeds up hazard response and eliminates duplicate reports. Version 2.0 will add photo uploads, role-based logins, and Critical alerts. Now **Wayne** will share his reflection."*
- **Wayne:** *(Own reflection script)*
- **Allen (Slide 12):** *"Thank you for watching our presentation of **CampusFix**!"*
