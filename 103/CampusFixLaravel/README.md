# CampusFix — Smart Campus & Community Facility Issue Tracker

**Course:** M094-ITWM103 (2026–2027) — Final Project (By Group)  
**Framework:** Laravel 11 (PHP 8.2+ MVC) + MySQL + Blade Templates

---

## Overview

**CampusFix** is a Laravel MVC + MySQL web application that solves the real-world problem of unrecorded, slow-to-fix campus and community facility issues (sparking outlets, leaking pipes, broken fans, Wi-Fi dead zones). Instead of using a generic table, CampusFix prioritizes **Critical/High** hazards first, tracks a **Reported → In Progress → Resolved** workflow, lets students confirm issues with **Community Upvotes**, and displays a live **Resolution Rate (%)** dashboard.

---

## Full CRUD Operations (Laravel MVC + MySQL)

| CRUD Operation | Controller & Route | MySQL / Eloquent Action |
| :--- | :--- | :--- |
| **CREATE** | `IssueReportController@create`, `@store` (`POST /reports`) | Validates input and runs `IssueReport::create(...)` (`INSERT INTO issue_reports`) |
| **READ** | `IssueReportController@index`, `@show` (`GET /reports`, `/reports/{id}`) | `IssueReport::filter()->orderByPriority()->get()` (`SELECT ... ORDER BY CASE ...`) |
| **UPDATE** | `IssueReportController@edit`, `@update`, `@advanceStatus`, `@upvote` (`PUT`/`PATCH`/`POST`) | Updates details, advances workflow status, or increments `upvotes` (`UPDATE issue_reports`) |
| **DELETE** | `IssueReportController@destroy` (`DELETE /reports/{id}`) | Confirmation dialog + `$report->delete()` (`DELETE FROM issue_reports`) |

---

## Setup & Running Locally (XAMPP / Laragon / MySQL)

1. Start **Apache & MySQL** (via XAMPP or Laragon) and import `database/schema.sql` in phpMyAdmin (or run `CREATE DATABASE campusfix_db;`).
2. Install PHP dependencies and run migrations + seeder:
   ```bash
   cd CampusFixLaravel
   composer install
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve
   ```
3. Open `http://127.0.0.1:8000` in your browser.
