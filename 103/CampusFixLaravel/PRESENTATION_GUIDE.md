# Presentation Script — CampusFix (Members 1, 3, 4 & 5)

**Project:** CampusFix — Smart Campus & Community Facility Issue Tracker  
**Course:** M094-ITWM103 (2026–2027) — Final Project (By Group)  
**Note:** Wayne Nagares handles Slide 8 + Live App Demo and his individual reflection at the end using his own script.

---

## Balanced Speaker Assignment (3 Turns Each)

| Slide(s) | Topic | Speaker |
| :--- | :--- | :--- |
| **Slides 1–2** | Title, Team Intro & Role Division | **Member 1 — Joshua V. Pornias** *(1 turn)* |
| **Slide 3** | Problem Statement | **Member 4 — Darryl Ingente** |
| **Slide 4** | Solution & Innovation | **Member 3 — Christian Louis Bolea** |
| **Slide 5** | Laravel MVC 4-Layer Architecture | **Member 3 — Christian Louis Bolea** |
| **Slide 6** | MySQL Schema & Full CRUD Operations | **Member 1 — Joshua V. Pornias** |
| **Slide 7** | Content & UI/UX Design | **Member 4 — Darryl Ingente** |
| **Slide 8 + Live App** | End-to-End Live App Demonstration | **Member 2 — Wayne Nagares** *(own script)* |
| **Slide 9** | Reflections & Contributions (Members 1 & 3) | **Joshua V. Pornias** & **Christian Louis Bolea** |
| **Slide 10** | Reflections & Contributions (Members 4 & 5) | **Darryl Ingente** & **Allen Seares** |
| **Slide 11** | Impact & Version 2.0 Roadmap | **Member 5 — Allen Seares** |
| **Last Part → Slide 12** | Wayne's Reflection → Closing | **Wayne Nagares** *(own script)* → **Allen Seares** *(Slide 12)* |

---

## Word-for-Word Slide Script

### Slides 1–2: Introduction — **Member 1 (Joshua V. Pornias)**
> **Joshua:**  
> *"Good day everyone! Today our five-member team is presenting our final project for ITWM103: **CampusFix — a Smart Campus and Community Facility Issue Tracker** built with **Laravel MVC and MySQL**.*  
> *Let me introduce our team and each member's expertise:*  
> - *I am **Joshua Pornias**, Project Lead and MySQL/Model Architect, responsible for the `issue_reports` schema, migrations, seeders, and Eloquent model.*  
> - ***Wayne Nagares** is our Core Developer for Create and Update, who built the validated report and edit forms—and he will also lead our live app demo shortly.*  
> - ***Christian Louis Bolea** is our Core Developer for Read, Filter, Upvote, and Delete, handling the dashboard feed, search, filtering, and safe deletion.*  
> - ***Darryl Ingente** is our UI/UX and Blade Layout Lead, who designed the visual hierarchy, severity badges, and responsive layout.*  
> - *And **Allen Seares** is our Analytics, Docs, and Video Lead Editor, who built the resolution KPIs, CRUD feature tests, documentation, and presentation."*

### Slide 3: Problem Statement — **Member 4 (Darryl Ingente)**
> **Darryl:**  
> *"In schools and shared communities, broken lights, leaking pipes, faulty air conditioners, and electrical hazards often remain unfixed for weeks because of three problems: **no centralized tracking**, **no severity prioritization**, and **zero visibility** on whether repairs have started or finished. Our goal was to build a fast Laravel web app where anyone can report, upvote, and track repairs from start to finish. Now **Christian** will present our solution and MVC architecture."*

### Slides 4–5: Solution, Innovation & Laravel MVC Architecture — **Member 3 (Christian Louis Bolea)**
> **Christian:**  
> *"Our solution is **CampusFix**, which goes beyond a basic CRUD table with four key innovations: a **Priority-Sorted Queue** (`scopeOrderByPriority`) that pushes Critical and High hazards to the top; a **3-Stage Workflow** (`Reported → In Progress → Resolved`) with one-click advancement; **Community Confirmation Upvotes** so multiple students can confirm the same hazard without duplicates; and **Live Resolution Rate Analytics**.*  
> *On Slide 5, CampusFix follows the **Laravel MVC Architecture**: **Routes** (`routes/web.php`) dispatch requests to our **Controller** (`IssueReportController`), which validates inputs and communicates with our **Model** (`IssueReport` + MySQL `issue_reports` table) before rendering responsive **Blade Views** (`resources/views/reports/`). Now **Joshua** will explain our MySQL schema and CRUD operations."*

### Slide 6: MySQL Schema & Full CRUD — **Member 1 (Joshua V. Pornias)**
> **Joshua:**  
> *"Our MySQL database `campusfix_db` stores all records in the `issue_reports` table with columns for title, location, category, severity (`Low` to `Critical`), status (`Reported`, `In Progress`, `Resolved`), reporter name, description, upvotes, and resolution notes. Every CRUD operation uses Eloquent ORM and CSRF-protected forms: **Create** via `store()`, **Read** via `index()` and `show()`, **Update** via `update()`, `advanceStatus()`, and `upvote()`, and **Delete** via `destroy()` with confirmation."*

### Slide 7: UI/UX Design — **Member 4 (Darryl Ingente)**
> **Darryl:**  
> *"For UI/UX design, we built a clean Royal Indigo and Teal interface with zero external CDN dependencies so it loads reliably offline. Color-coded left borders and pill badges distinguish Critical, High, Medium, and Low severities at a glance, while four KPI cards at the top summarize Total Reports, Urgent Open issues, In Progress count, and Resolution Rate. Now I'll hand it over to **Wayne** for Slide 8 and our live app demonstration."*

### Slide 8 + Live App Demo — **Member 2 (Wayne Nagares)**
> *[Handoff: **Wayne Nagares** presents Slide 8 and runs the live app demo using his own script.]*

### Slides 9–10: Individual Reflections & Contributions
> **Joshua (Slide 9):** *"I designed the MySQL schema, Laravel migrations, seeder, and `IssueReport` Eloquent model with priority query scopes. I learned how Eloquent scopes and SQL `CASE` ordering keep controller code clean and readable."*  
> **Christian (Slide 9):** *"I built the dashboard `index` and `show` views, multi-filter search, community upvote endpoint, and `destroy` flow. I learned how Laravel resource routes and Blade directives (`@csrf`, `@method`) enforce clean MVC separation."*  
> **Darryl (Slide 10):** *"I crafted the `app.blade.php` layout, `campusfix.css` design system, KPI summary cards, and color-coded severity badges. I learned how consistent visual hierarchy makes urgent hazards immediately recognizable."*  
> **Allen (Slide 10):** *"I built the resolution rate KPI logic, `IssueReportCrudTest.php`, our technical documentation, PowerPoint deck, and edited our final video. I learned how Laravel feature tests verify full Create–Read–Update–Delete database integrity."*

### Slide 11: Impact & Version 2.0 Roadmap — **Member 5 (Allen Seares)**
> **Allen:**  
> *"CampusFix helps schools and communities resolve safety hazards faster and measure maintenance efficiency. In Version 2.0, we plan to add photo uploads for damaged equipment, role-based technician logins, and email/SMS alerts for Critical hazards. Before we close, **Wayne** will share his individual contribution and reflection."*

### Last Part → Slide 12: Wayne's Reflection → Closing
> *[Handoff: **Wayne Nagares** speaks his individual contribution & reflection using his own script.]*  
> **Allen (Slide 12):** *"Thank you for watching our presentation of **CampusFix**!"*
