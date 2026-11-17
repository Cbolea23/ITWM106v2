"""Generate the 12-slide widescreen PowerPoint presentation for CampusFix (Laravel MVC + MySQL)."""

from pathlib import Path
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Inches, Pt

C_PRIMARY = RGBColor(30, 58, 138)     # #1E3A8A Royal Indigo
C_MID = RGBColor(37, 99, 235)         # #2563EB
C_ACCENT = RGBColor(13, 148, 136)     # #0D9488 Teal
C_SOFT = RGBColor(239, 246, 255)      # #EFF6FF
C_TINT = RGBColor(191, 219, 254)      # #BFDBFE
C_BG = RGBColor(241, 245, 249)        # #F1F5F9
C_WHITE = RGBColor(255, 255, 255)
C_DARK = RGBColor(15, 23, 42)
C_SLATE = RGBColor(71, 85, 105)
C_MUTED = RGBColor(100, 116, 139)
C_BORDER = RGBColor(203, 213, 225)

C_RED = RGBColor(220, 38, 38)
C_RED_BG = RGBColor(254, 226, 226)
C_ORANGE = RGBColor(234, 88, 12)
C_ORANGE_BG = RGBColor(255, 237, 213)
C_AMBER = RGBColor(217, 119, 6)
C_AMBER_BG = RGBColor(254, 243, 199)
C_GREEN = RGBColor(22, 163, 74)
C_GREEN_BG = RGBColor(220, 252, 231)

FONT_FAMILY = "Calibri"


def set_bg(slide, color: RGBColor) -> None:
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_rect(slide, left, top, width, height, fill_color, line_color=None, rounded=True):
    shape_type = MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE
    shape = slide.shapes.add_shape(shape_type, Inches(left), Inches(top), Inches(width), Inches(height))
    if rounded:
        try:
            shape.adjustments[0] = 0.06
        except Exception:
            pass
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    if line_color is not None:
        shape.line.color.rgb = line_color
        shape.line.width = Pt(1)
    else:
        shape.line.fill.background()
    return shape


def add_textbox(slide, left, top, width, height, text="", font_size=14, bold=False, color=C_DARK, align=PP_ALIGN.LEFT, font_name=FONT_FAMILY):
    tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.TOP
    p = tf.paragraphs[0]
    p.text = text
    p.alignment = align
    p.font.name = font_name
    p.font.size = Pt(font_size)
    p.font.bold = bold
    p.font.color.rgb = color
    return tb


def add_bullets(slide, left, top, width, height, items, font_size=13, body_color=C_SLATE, title_color=C_DARK, space_after=10):
    tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = tb.text_frame
    tf.word_wrap = True
    for idx, (lead, body) in enumerate(items):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        p.space_after = Pt(space_after)
        if lead:
            r1 = p.add_run()
            r1.text = lead + " "
            r1.font.name = FONT_FAMILY
            r1.font.size = Pt(font_size)
            r1.font.bold = True
            r1.font.color.rgb = title_color
        r2 = p.add_run()
        r2.text = body
        r2.font.name = FONT_FAMILY
        r2.font.size = Pt(font_size)
        r2.font.color.rgb = body_color
    return tb


def add_header(slide, section_tag, title, subtitle, slide_num):
    set_bg(slide, C_BG)
    add_rect(slide, 0, 0, 13.333, 1.18, C_PRIMARY, rounded=False)
    add_rect(slide, 0, 1.18, 13.333, 0.05, C_ACCENT, rounded=False)

    pill = add_rect(slide, 0.55, 0.16, 2.35, 0.28, C_MID, rounded=True)
    p = pill.text_frame.paragraphs[0]
    p.text = section_tag.upper()
    p.alignment = PP_ALIGN.CENTER
    p.font.name = FONT_FAMILY
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    add_textbox(slide, 0.55, 0.44, 10.8, 0.42, title, font_size=24, bold=True, color=C_WHITE)
    add_textbox(slide, 0.55, 0.86, 11.2, 0.28, subtitle, font_size=12, color=C_TINT)
    add_textbox(slide, 11.9, 0.35, 0.95, 0.45, f"{slide_num} / 12", font_size=13, bold=True, color=C_TINT, align=PP_ALIGN.RIGHT)
    add_textbox(slide, 0.55, 7.12, 8.5, 0.28, "CampusFix  •  M094-ITWM103 Final Project (Laravel MVC + MySQL CRUD)", font_size=10, color=C_MUTED)


def build_presentation(output_path: Path) -> None:
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    # SLIDE 1: TITLE
    s1 = prs.slides.add_slide(blank)
    set_bg(s1, C_PRIMARY)
    add_rect(s1, 0, 0, 0.35, 7.5, C_ACCENT, rounded=False)
    add_rect(s1, 0.85, 1.15, 3.3, 0.4, C_MID, rounded=True)
    add_textbox(s1, 0.95, 1.19, 3.1, 0.32, "M094-ITWM103  •  FINAL PROJECT", font_size=12, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
    add_textbox(s1, 0.85, 1.8, 8.2, 1.0, "CampusFix", font_size=52, bold=True, color=C_WHITE)
    add_textbox(s1, 0.85, 2.8, 8.3, 0.8, "Smart Campus & Community Facility Issue Tracker", font_size=24, bold=True, color=C_ACCENT)
    add_textbox(s1, 0.85, 3.65, 8.2, 0.95, "A Laravel MVC + MySQL web application that prioritizes critical facility hazards, streamlines repair workflows (Reported → In Progress → Resolved), and tracks community confirmations.", font_size=15, color=C_TINT)

    add_rect(s1, 9.35, 1.15, 3.35, 5.2, C_MID, C_ACCENT, rounded=True)
    add_textbox(s1, 9.55, 1.4, 2.95, 0.4, "PROJECT HIGHLIGHTS", font_size=13, bold=True, color=C_TINT)
    add_bullets(s1, 9.55, 1.9, 2.95, 4.2, [
        ("Framework:", "Laravel 11 (PHP 8.2+ MVC)"),
        ("Database:", "MySQL (campusfix_db) + Eloquent ORM"),
        ("Core Ops:", "Full Create, Read, Update, Delete"),
        ("Innovation:", "Priority Queue, Upvotes & Resolution KPIs"),
        ("Team:", "5-Member Group (Nov 2026)"),
    ], font_size=13, title_color=C_WHITE, body_color=C_TINT, space_after=12)

    # SLIDE 2: TEAM
    s2 = prs.slides.add_slide(blank)
    add_header(s2, "Introduction", "Meet the Team & Role Division", "5-Member task split covering MySQL/Model, MVC CRUD, Blade UI/UX, analytics, and video", 2)
    members = [
        ("Member 1", "Joshua V. Pornias", "Project Lead & MySQL Architect", "migrations, seeders, schema.sql, IssueReport.php", "Designed MySQL schema, Eloquent model & priority query scopes.", C_PRIMARY),
        ("Member 2", "Wayne Nagares", "Core Dev: Create & Update + Demo", "create/store/edit/update, create & edit Blade", "Built validated Create/Edit forms, status advance & live app demo.", C_MID),
        ("Member 3", "Christian Louis Bolea", "Core Dev: Read, Filter & Delete", "index/show/upvote/destroy, routes/web.php", "Built searchable priority feed, upvote confirmation & safe delete.", C_AMBER),
        ("Member 4", "Darryl Ingente", "UI/UX & Blade Layout Lead", "layouts/app.blade.php, public/css/campusfix.css", "Crafted Royal Indigo + Teal UI, severity badges & KPI cards.", C_GREEN),
        ("Member 5", "Allen Seares", "Analytics, Docs & Video Lead Editor", "KPIs, IssueReportCrudTest.php, Docs, PPTX & Video", "Built resolution rate KPIs, feature tests, docs, slides & video edit.", C_ORANGE),
    ]
    positions = [(0.55, 1.55, 3.9, 2.55), (4.7, 1.55, 3.9, 2.55), (8.85, 1.55, 3.9, 2.55), (2.0, 4.35, 4.4, 2.55), (6.9, 4.35, 4.4, 2.55)]
    for (tag, name, role, files, desc, accent), (x, y, w, h) in zip(members, positions):
        add_rect(s2, x, y, w, h, C_WHITE, C_BORDER, rounded=True)
        add_rect(s2, x, y, w, 0.1, accent, rounded=False)
        add_textbox(s2, x + 0.18, y + 0.18, 1.5, 0.25, tag.upper(), font_size=10, bold=True, color=accent)
        add_textbox(s2, x + 0.18, y + 0.42, w - 0.36, 0.32, name, font_size=16, bold=True, color=C_DARK)
        add_textbox(s2, x + 0.18, y + 0.76, w - 0.36, 0.3, role, font_size=12, bold=True, color=C_MID)
        add_textbox(s2, x + 0.18, y + 1.12, w - 0.36, 0.42, f"Files: {files}", font_size=10, color=C_MUTED)
        add_textbox(s2, x + 0.18, y + 1.62, w - 0.36, 0.8, desc, font_size=12, color=C_SLATE)

    # SLIDE 3: PROBLEM STATEMENT
    s3 = prs.slides.add_slide(blank)
    add_header(s3, "Problem Statement", "Why Campus & Facility Issues Go Unresolved", "Broken lights, leaks, and safety hazards are lost in verbal reports and unprioritized chats", 3)
    problems = [
        ("1. No Centralized Tracking", "Verbal reports and group chat messages get buried quickly, leaving maintenance teams without a single source of truth.", C_RED_BG, C_RED),
        ("2. No Severity Prioritization", "Minor cosmetic issues and urgent safety hazards (like sparking outlets) look identical without severity tagging.", C_ORANGE_BG, C_ORANGE),
        ("3. Zero Progress Visibility", "Students never know if an issue was seen, is currently In Progress, or has been Resolved—leading to duplicate complaints.", C_AMBER_BG, C_AMBER),
    ]
    for idx, (pt, pb, bgc, fg) in enumerate(problems):
        x = 0.55 + idx * 4.15
        add_rect(s3, x, 1.55, 3.9, 3.35, C_WHITE, C_BORDER, rounded=True)
        add_rect(s3, x + 0.2, 1.8, 3.5, 0.42, bgc, rounded=True)
        add_textbox(s3, x + 0.3, 1.86, 3.3, 0.32, pt, font_size=14, bold=True, color=fg)
        add_textbox(s3, x + 0.2, 2.4, 3.5, 2.2, pb, font_size=14, color=C_SLATE)
    add_rect(s3, 0.55, 5.2, 12.2, 1.65, C_PRIMARY, rounded=True)
    add_textbox(s3, 0.85, 5.4, 11.6, 0.35, "OUR CORE QUESTION", font_size=12, bold=True, color=C_ACCENT)
    add_textbox(s3, 0.85, 5.8, 11.6, 0.85, "How can we build a fast Laravel MVC + MySQL web app that surfaces critical hazards first, lets students confirm issues, and tracks repairs to resolution?", font_size=17, bold=True, color=C_WHITE)

    # SLIDE 4: SOLUTION & INNOVATION
    s4 = prs.slides.add_slide(blank)
    add_header(s4, "Solution & Innovation", "CampusFix: Priority-Driven & Transparent", "What makes CampusFix innovative beyond a basic CRUD table", 4)
    innovations = [
        ("🚨 Priority-Sorted Queue", "Eloquent scopeOrderByPriority() automatically places Reported Critical/High hazards at the top of the feed.", "app/Models/IssueReport.php"),
        ("🔄 3-Stage Workflow Pipeline", "One-click advancement (Reported → In Progress → Resolved) with automatic resolved_at timestamping.", "IssueReportController@advanceStatus"),
        ("▲ Community Confirmation Upvotes", "Students facing the same hazard click Confirm to bump priority instead of filing duplicate reports.", "IssueReportController@upvote"),
        ("📊 Live Resolution Rate KPIs", "Dashboard computes Total, Urgent Open, In Progress, and Resolution Rate (%) in real time from MySQL.", "resources/views/reports/index.blade.php"),
    ]
    for i, (it, ib, ifile) in enumerate(innovations):
        col, row = i % 2, i // 2
        x, y = 0.55 + col * 6.2, 1.55 + row * 2.65
        add_rect(s4, x, y, 5.95, 2.4, C_WHITE, C_BORDER, rounded=True)
        add_rect(s4, x, y, 0.12, 2.4, C_ACCENT, rounded=False)
        add_textbox(s4, x + 0.28, y + 0.2, 5.45, 0.36, it, font_size=16, bold=True, color=C_PRIMARY)
        add_textbox(s4, x + 0.28, y + 0.65, 5.45, 1.15, ib, font_size=13, color=C_SLATE)
        add_rect(s4, x + 0.28, y + 1.88, 3.8, 0.32, C_SOFT, C_TINT, rounded=True)
        add_textbox(s4, x + 0.38, y + 1.91, 3.6, 0.26, ifile, font_size=10, bold=True, color=C_PRIMARY, font_name="Consolas")

    # SLIDE 5: LARAVEL MVC ARCHITECTURE
    s5 = prs.slides.add_slide(blank)
    add_header(s5, "System Overview", "Laravel MVC 4-Layer Architecture", "Strict separation of Routes, Controller, Eloquent Model (MySQL), and Blade Views", 5)
    layers = [
        ("1. Routes (routes/web.php)", "Maps RESTful resource routes (/reports) plus advance-status and upvote actions", C_PRIMARY),
        ("2. Controller (IssueReportController.php)", "Validates requests, queries Eloquent, and passes stats & records to views", C_MID),
        ("3. Model (IssueReport.php + MySQL)", "Eloquent ORM with $fillable, $casts, scopeFilter(), and scopeOrderByPriority()", C_ACCENT),
        ("4. Views (resources/views/reports/*.blade.php)", "Blade templates with @csrf, @method spoofing, KPI cards & responsive CSS", C_GREEN),
    ]
    for idx, (lt, ld, lc) in enumerate(layers):
        y = 1.5 + idx * 1.38
        add_rect(s5, 0.55, y, 8.2, 1.15, C_WHITE, C_BORDER, rounded=True)
        add_rect(s5, 0.55, y, 0.16, 1.15, lc, rounded=False)
        add_textbox(s5, 0.85, y + 0.14, 7.7, 0.34, lt, font_size=15, bold=True, color=lc)
        add_textbox(s5, 0.85, y + 0.52, 7.7, 0.5, ld, font_size=12, color=C_SLATE)
    add_rect(s5, 9.05, 1.5, 3.7, 5.3, C_PRIMARY, rounded=True)
    add_textbox(s5, 9.3, 1.75, 3.2, 0.38, "TECH STACK", font_size=15, bold=True, color=C_ACCENT)
    add_bullets(s5, 9.3, 2.25, 3.2, 4.3, [
        ("Backend:", "Laravel 11 (PHP 8.2+)"),
        ("Database:", "MySQL (campusfix_db)"),
        ("ORM:", "Eloquent ActiveRecord"),
        ("Frontend:", "Blade + Custom CSS"),
        ("Testing:", "PHPUnit Feature Tests"),
    ], font_size=13, title_color=C_WHITE, body_color=C_TINT, space_after=14)

    # SLIDE 6: MYSQL SCHEMA & CRUD
    s6 = prs.slides.add_slide(blank)
    add_header(s6, "Database & CRUD", "MySQL Schema & Full MVC CRUD Operations", "Eloquent ORM & Blade forms backed by strict server-side validation", 6)
    add_rect(s6, 0.55, 1.5, 4.7, 5.35, C_DARK, rounded=True)
    add_textbox(s6, 0.8, 1.72, 4.2, 0.35, "TABLE: issue_reports (MySQL)", font_size=14, bold=True, color=C_ACCENT)
    schema_txt = (
        "id               BIGINT PK AI\n"
        "title            VARCHAR(120)\n"
        "location         VARCHAR(120)\n"
        "category         VARCHAR(60)\n"
        "severity         ENUM(Low..Critical)\n"
        "status           ENUM(Reported|In Progress|Resolved)\n"
        "reporter_name    VARCHAR(80)\n"
        "description      TEXT\n"
        "upvotes          INT UNSIGNED\n"
        "resolution_notes TEXT NULL\n"
        "resolved_at      TIMESTAMP NULL\n"
        "created_at / updated_at"
    )
    add_textbox(s6, 0.8, 2.15, 4.25, 4.4, schema_txt, font_size=11.5, color=C_TINT, font_name="Consolas")
    cruds = [
        ("CREATE", "POST /reports  →  store()", "Validates form inputs and inserts row via IssueReport::create().", C_GREEN, C_GREEN_BG),
        ("READ", "GET /reports & /reports/{id}", "Displays priority-sorted dashboard with search, status, severity & category filters.", C_MID, C_SOFT),
        ("UPDATE", "PUT /reports/{id}, PATCH advance-status", "Edits details, advances workflow status, or increments community upvotes.", C_AMBER, C_AMBER_BG),
        ("DELETE", "DELETE /reports/{id}  →  destroy()", "Prompts browser confirmation before deleting record via $report->delete().", C_RED, C_RED_BG),
    ]
    for idx, (op, sql, desc, fg, bgc) in enumerate(cruds):
        y = 1.5 + idx * 1.36
        add_rect(s6, 5.5, y, 7.25, 1.2, C_WHITE, C_BORDER, rounded=True)
        badge = add_rect(s6, 5.7, y + 0.16, 1.15, 0.34, bgc, rounded=True)
        bp = badge.text_frame.paragraphs[0]
        bp.text = op
        bp.alignment = PP_ALIGN.CENTER
        bp.font.name = FONT_FAMILY
        bp.font.size = Pt(11)
        bp.font.bold = True
        bp.font.color.rgb = fg
        add_textbox(s6, 7.0, y + 0.16, 5.55, 0.34, sql, font_size=11, bold=True, color=C_DARK, font_name="Consolas")
        add_textbox(s6, 5.7, y + 0.58, 6.85, 0.52, desc, font_size=12, color=C_SLATE)

    # SLIDE 7: UI/UX DESIGN
    s7 = prs.slides.add_slide(blank)
    add_header(s7, "Content & UI Design", "Intuitive Visual Hierarchy & Severity System", "Clean Royal Indigo + Teal UI with color-coded left borders and offline-ready CSS", 7)
    add_rect(s7, 0.55, 1.5, 6.0, 5.3, C_WHITE, C_BORDER, rounded=True)
    add_textbox(s7, 0.8, 1.72, 5.5, 0.36, "Color-Coded Severity Borders & Badges", font_size=16, bold=True, color=C_PRIMARY)
    sevs = [
        ("Critical", "Red Left Border & Pill", "Exposed Electrical Outlet Sparking", C_RED_BG, C_RED),
        ("High", "Orange Left Border & Pill", "Leaking Pipe / No Wi-Fi Signal", C_ORANGE_BG, C_ORANGE),
        ("Medium", "Amber Left Border & Pill", "Wobbling Ceiling Fan / Loose HDMI", C_AMBER_BG, C_AMBER),
        ("Low", "Green Left Border & Pill", "Aircon Not Cooling (Resolved)", C_GREEN_BG, C_GREEN),
    ]
    for i, (sn, sb, sex, sbg, sfg) in enumerate(sevs):
        y = 2.25 + i * 1.08
        add_rect(s7, 0.8, y, 5.5, 0.9, C_BG, C_BORDER, rounded=True)
        add_rect(s7, 0.8, y, 0.14, 0.9, sfg, rounded=False)
        add_textbox(s7, 1.08, y + 0.12, 2.7, 0.3, sn, font_size=13, bold=True, color=C_DARK)
        add_textbox(s7, 1.08, y + 0.46, 3.1, 0.32, sex, font_size=11, color=C_SLATE)
        pill = add_rect(s7, 4.15, y + 0.25, 1.95, 0.38, sbg, rounded=True)
        pp = pill.text_frame.paragraphs[0]
        pp.text = sb
        pp.alignment = PP_ALIGN.CENTER
        pp.font.name = FONT_FAMILY
        pp.font.size = Pt(11)
        pp.font.bold = True
        pp.font.color.rgb = sfg
    add_rect(s7, 6.8, 1.5, 5.95, 5.3, C_WHITE, C_BORDER, rounded=True)
    add_textbox(s7, 7.05, 1.72, 5.45, 0.36, "4 Core Blade Views", font_size=16, bold=True, color=C_PRIMARY)
    views = [
        ("index.blade.php (Dashboard)", "4 KPI summary cards, multi-filter bar, priority-sorted feed & quick actions."),
        ("create.blade.php (Report Form)", "Validated submission form with categories, severities & error alerts."),
        ("show.blade.php (Detail View)", "Full description, maintenance resolution notes, timestamps & workflow buttons."),
        ("edit.blade.php (Edit Form)", "Update issue fields, status dropdown & technician resolution notes."),
    ]
    for i, (vn, vd) in enumerate(views):
        y = 2.2 + i * 1.12
        add_rect(s7, 7.05, y, 5.45, 0.96, C_SOFT, C_TINT, rounded=True)
        add_textbox(s7, 7.25, y + 0.1, 5.05, 0.3, vn, font_size=13, bold=True, color=C_PRIMARY)
        add_textbox(s7, 7.25, y + 0.44, 5.05, 0.45, vd, font_size=11.5, color=C_SLATE)

    # SLIDE 8: LIVE DEMO
    s8 = prs.slides.add_slide(blank)
    add_header(s8, "System Demonstration", "End-to-End Live App Walkthrough", "Demonstrating full Laravel MVC + MySQL CRUD operations live in the browser", 8)
    steps = [
        ("STEP 1: READ", "Dashboard & Filters", "Show KPI cards, priority-sorted feed, search bar, and severity/status filters.", C_MID),
        ("STEP 2: CREATE", "Report New Issue", "Click '+ Report Issue', submit validated form, and confirm new MySQL record.", C_GREEN),
        ("STEP 3: UPDATE", "Upvote, Advance & Edit", "Click '▲ Confirm', 'Mark In Progress', and Edit to add resolution notes.", C_AMBER),
        ("STEP 4: DELETE", "Safe Removal", "Click 'Delete', confirm dialog, and verify record is removed from MySQL.", C_RED),
    ]
    for idx, (sb, st, sd, sc) in enumerate(steps):
        x = 0.55 + idx * 3.1
        add_rect(s8, x, 1.6, 2.9, 4.3, C_WHITE, C_BORDER, rounded=True)
        add_rect(s8, x, 1.6, 2.9, 0.52, sc, rounded=False)
        add_textbox(s8, x + 0.15, 1.7, 2.6, 0.32, sb, font_size=13, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
        add_textbox(s8, x + 0.18, 2.35, 2.54, 0.4, st, font_size=15, bold=True, color=C_DARK)
        add_textbox(s8, x + 0.18, 2.88, 2.54, 2.6, sd, font_size=13, color=C_SLATE)

    # SLIDE 9: REFLECTIONS 1/2
    s9 = prs.slides.add_slide(blank)
    add_header(s9, "Reflections (1/2)", "Individual Contributions — Members 1, 2 & 3", "Each member's technical ownership and key engineering takeaways", 9)
    ref_1_3 = [
        ("Member 1 — Joshua V. Pornias\nProject Lead & MySQL Architect", "Designed `issue_reports` MySQL schema, migrations, seeder, and `IssueReport` Eloquent model with priority scopes.", "Learned how Eloquent query scopes and SQL CASE ordering keep controller logic clean and scalable.", C_PRIMARY),
        ("Member 2 — Wayne Nagares\nCreate & Update Dev + Demo", "Built `create` / `store` / `edit` / `update` / `advanceStatus` flows and Blade forms with validation.", "Learned how Laravel server-side validation and method spoofing protect MySQL data integrity.", C_MID),
        ("Member 3 — Christian Louis Bolea\nRead, Filter, Upvote & Delete", "Built `index` and `show` views, multi-filter search, community upvote endpoint, and `destroy` confirmation.", "Learned how Laravel resource routing and Blade `@csrf` / `@method` enforce clean MVC separation.", C_AMBER),
    ]
    for idx, (mt, mc, ml, ma) in enumerate(ref_1_3):
        x = 0.55 + idx * 4.15
        add_rect(s9, x, 1.55, 3.9, 5.25, C_WHITE, C_BORDER, rounded=True)
        add_rect(s9, x, 1.55, 3.9, 0.85, ma, rounded=False)
        add_textbox(s9, x + 0.18, 1.65, 3.54, 0.65, mt, font_size=14, bold=True, color=C_WHITE)
        add_textbox(s9, x + 0.18, 2.55, 3.54, 0.28, "CONTRIBUTIONS", font_size=11, bold=True, color=ma)
        add_textbox(s9, x + 0.18, 2.85, 3.54, 1.6, mc, font_size=12, color=C_SLATE)
        add_rect(s9, x + 0.18, 4.55, 3.54, 2.05, C_BG, C_BORDER, rounded=True)
        add_textbox(s9, x + 0.3, 4.68, 3.3, 0.28, "KEY LEARNING & REFLECTION", font_size=11, bold=True, color=C_PRIMARY)
        add_textbox(s9, x + 0.3, 5.0, 3.3, 1.45, ml, font_size=12, color=C_DARK)

    # SLIDE 10: REFLECTIONS 2/2
    s10 = prs.slides.add_slide(blank)
    add_header(s10, "Reflections (2/2)", "Individual Contributions — Members 4 & 5", "UI/UX consistency, analytics KPIs, testing, documentation & video production", 10)
    ref_4_5 = [
        ("Member 4 — Darryl Ingente\nUI/UX & Blade Layout Lead", "Crafted `app.blade.php`, `campusfix.css`, KPI summary cards, and color-coded severity/status badges.", "Learned how consistent visual hierarchy and zero-CDN styling keep web apps fast and readable.", C_GREEN),
        ("Member 5 — Allen Seares\nAnalytics, Docs & Video Lead Editor", "Built resolution rate KPIs, `IssueReportCrudTest.php`, documentation, PowerPoint deck, and edited final video.", "Learned how Laravel feature tests verify end-to-end CRUD integrity against the database.", C_ORANGE),
    ]
    for idx, (mt, mc, ml, ma) in enumerate(ref_4_5):
        x = 0.55 + idx * 6.2
        add_rect(s10, x, 1.55, 5.95, 5.25, C_WHITE, C_BORDER, rounded=True)
        add_rect(s10, x, 1.55, 5.95, 0.85, ma, rounded=False)
        add_textbox(s10, x + 0.25, 1.65, 5.45, 0.65, mt, font_size=15, bold=True, color=C_WHITE)
        add_textbox(s10, x + 0.25, 2.58, 5.45, 0.28, "CONTRIBUTIONS & DELIVERABLES", font_size=11, bold=True, color=ma)
        add_textbox(s10, x + 0.25, 2.9, 5.45, 1.45, mc, font_size=13, color=C_SLATE)
        add_rect(s10, x + 0.25, 4.5, 5.45, 2.05, C_BG, C_BORDER, rounded=True)
        add_textbox(s10, x + 0.4, 4.65, 5.15, 0.28, "KEY LEARNING & REFLECTION", font_size=11, bold=True, color=C_PRIMARY)
        add_textbox(s10, x + 0.4, 4.98, 5.15, 1.45, ml, font_size=13, color=C_DARK)

    # SLIDE 11: IMPACT & ROADMAP
    s11 = prs.slides.add_slide(blank)
    add_header(s11, "Impact & Future", "Real-World Impact & Version 2.0 Roadmap", "Faster hazard resolution today with room for role-based maintenance workflows", 11)
    add_rect(s11, 0.55, 1.55, 5.95, 5.25, C_WHITE, C_BORDER, rounded=True)
    add_textbox(s11, 0.8, 1.8, 5.45, 0.36, "Measurable Real-World Impact", font_size=17, bold=True, color=C_PRIMARY)
    add_bullets(s11, 0.8, 2.3, 5.45, 4.2, [
        ("Faster Hazard Response:", "Critical safety issues automatically rise to the top of the queue."),
        ("Zero Duplicate Clutter:", "Community confirmation upvotes replace repetitive reports."),
        ("Full Accountability:", "Every repair records status transitions and resolution notes in MySQL."),
    ], font_size=13, title_color=C_MID, body_color=C_SLATE, space_after=14)
    add_rect(s11, 6.8, 1.55, 5.95, 5.25, C_SOFT, C_ACCENT, rounded=True)
    add_textbox(s11, 7.05, 1.8, 5.45, 0.36, "Future Enhancements (Version 2.0)", font_size=17, bold=True, color=C_PRIMARY)
    add_bullets(s11, 7.05, 2.3, 5.45, 4.2, [
        ("Photo Attachments:", "Upload images of damaged equipment directly with each report."),
        ("Role-Based Auth:", "Separate Student Reporter and Maintenance Admin dashboards."),
        ("Email / SMS Alerts:", "Instant notifications to facility staff when Critical hazards are filed."),
    ], font_size=13, title_color=C_PRIMARY, body_color=C_DARK, space_after=14)

    # SLIDE 12: THANK YOU
    s12 = prs.slides.add_slide(blank)
    set_bg(s12, C_PRIMARY)
    add_rect(s12, 0, 0, 0.35, 7.5, C_ACCENT, rounded=False)
    add_textbox(s12, 1.0, 2.4, 11.3, 0.9, "Thank You!  Questions & Answers", font_size=40, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
    add_textbox(s12, 1.4, 3.4, 10.5, 0.7, "CampusFix — Safer, Smarter Campuses Powered by Laravel MVC & MySQL", font_size=18, color=C_ACCENT, align=PP_ALIGN.CENTER)

    prs.save(str(output_path))
    print(f"Saved presentation to: {output_path}")


if __name__ == "__main__":
    build_presentation(Path(__file__).resolve().parent / "CampusFix_Presentation.pptx")
