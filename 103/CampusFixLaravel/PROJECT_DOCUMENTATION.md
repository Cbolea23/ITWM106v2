# Project Documentation: CampusFix

**Course:** M094-ITWM103 (2026–2027) — Final Project (By Group)  
**Application Name:** CampusFix — Smart Campus & Community Facility Issue Tracker  
**Architecture:** Laravel 11 MVC (Model–View–Controller) + MySQL Database

---

## 1. Introduction & Team Role Division

**CampusFix** is a web application built by a 5-member team using the **Laravel MVC framework** and **MySQL** to streamline how students and facility managers report, prioritize, and resolve campus maintenance hazards.

| Member | Role | Assigned Files & Ownership |
| :--- | :--- | :--- |
| **Member 1 — Joshua V. Pornias** | Project Lead & MySQL / Model Architect | `database/migrations/`, `database/seeders/`, `database/schema.sql`, `app/Models/IssueReport.php` |
| **Member 2 — Wayne Nagares** | Core Developer (Create & Update) + Live Demo | `IssueReportController` (`create`, `store`, `edit`, `update`, `advanceStatus`), `create.blade.php`, `edit.blade.php` |
| **Member 3 — Christian Louis Bolea** | Core Developer (Read, Filter, Upvote & Delete) | `IssueReportController` (`index`, `show`, `upvote`, `destroy`), `routes/web.php`, `index.blade.php`, `show.blade.php` |
| **Member 4 — Darryl Ingente** | UI/UX & Blade Layout Lead | `resources/views/layouts/app.blade.php`, `public/css/campusfix.css`, severity/status badge system & KPI cards |
| **Member 5 — Allen Seares** | Analytics, Docs & Video Lead Editor | Dashboard resolution KPIs, `tests/Feature/IssueReportCrudTest.php`, documentation, `.pptx` & video editing |

---

## 2. Problem Statement

In schools and shared communities, broken lights, leaking pipes, faulty air conditioners, and electrical hazards often remain unfixed for weeks because:
1. **No Centralized Tracking:** Verbal reports or chat messages get buried and forgotten.
2. **No Severity Prioritization:** Minor cosmetic issues and urgent safety hazards look identical without severity tagging.
3. **Zero Visibility on Progress:** Reporters never know if maintenance has started or resolved the issue.

---

## 3. Proposed Solution & Innovation

**CampusFix** addresses these gaps through:
1. **Priority-Sorted Queue (`scopeOrderByPriority`):** Automatically surfaces `Reported` and `Critical/High` hazards at the top of the dashboard.
2. **3-Stage Workflow (`Reported → In Progress → Resolved`):** One-click status progression updates MySQL and records `resolved_at` timestamps automatically.
3. **Community Confirmation Upvotes:** Students experiencing the same issue can click **`▲ Confirm`** to bump priority without creating duplicate reports.
4. **Live Resolution Analytics:** Tracks total reports, urgent open issues, in-progress count, and overall **Resolution Rate (%)**.

---

## 4. MVC Architecture & MySQL Schema

- **Model (`app/Models/IssueReport.php`):** Eloquent ORM model with `$fillable`, `$casts`, `scopeFilter()`, `scopeOrderByPriority()`, and `nextStatus()`.
- **View (`resources/views/reports/*.blade.php` + `layouts/app.blade.php`):** Blade templates with CSRF protection (`@csrf`), method spoofing (`@method('PUT')`, `@method('PATCH')`, `@method('DELETE')`), and validation error feedback.
- **Controller (`app/Http/Controllers/IssueReportController.php`):** Resource controller handling all HTTP requests, validation rules, MySQL queries, and redirects.

### MySQL Table: `issue_reports`
Columns: `id`, `title`, `location`, `category`, `severity` (`Low|Medium|High|Critical`), `status` (`Reported|In Progress|Resolved`), `reporter_name`, `description`, `upvotes`, `resolution_notes`, `resolved_at`, `created_at`, `updated_at`.

---

## 5. Verification & Testing

- All 13 PHP/Blade files pass `php -l` syntax checks with zero errors.
- Feature test `tests/Feature/IssueReportCrudTest.php` verifies Create, Read, Workflow Update, Upvote, and Delete assertions against `issue_reports`.
