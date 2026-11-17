"""Generate the 12-slide widescreen PowerPoint presentation for ZeroWaste Pantry."""

from pathlib import Path
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.util import Inches, Pt

# Theme Colors (matches src/constants/theme.ts)
C_PRIMARY = RGBColor(15, 81, 50)       # #0F5132
C_PRIMARY_MID = RGBColor(21, 115, 71)  # #157347
C_ACCENT = RGBColor(16, 185, 129)      # #10B981
C_SOFT_MINT = RGBColor(236, 253, 245)  # #ECFDF5
C_MINT_TINT = RGBColor(209, 250, 229)  # #D1FAE5
C_BG = RGBColor(244, 247, 245)         # #F4F7F5
C_WHITE = RGBColor(255, 255, 255)
C_DARK = RGBColor(15, 23, 42)          # #0F172A
C_SLATE = RGBColor(71, 85, 105)        # #475569
C_MUTED = RGBColor(100, 116, 139)      # #64748B
C_BORDER = RGBColor(203, 213, 225)     # #CBD5E1

C_RED = RGBColor(220, 38, 38)
C_RED_BG = RGBColor(254, 226, 226)
C_ORANGE = RGBColor(234, 88, 12)
C_ORANGE_BG = RGBColor(255, 237, 213)
C_AMBER = RGBColor(217, 119, 6)
C_AMBER_BG = RGBColor(254, 243, 199)
C_GREEN = RGBColor(22, 163, 74)
C_GREEN_BG = RGBColor(220, 252, 231)
C_BLUE = RGBColor(2, 132, 199)
C_BLUE_BG = RGBColor(224, 242, 254)

FONT_FAMILY = "Calibri"


def set_bg(slide, color: RGBColor) -> None:
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_rect(
    slide,
    left: float,
    top: float,
    width: float,
    height: float,
    fill_color: RGBColor,
    line_color: RGBColor | None = None,
    rounded: bool = True,
):
    shape_type = MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE
    shape = slide.shapes.add_shape(
        shape_type, Inches(left), Inches(top), Inches(width), Inches(height)
    )
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


def add_textbox(
    slide,
    left: float,
    top: float,
    width: float,
    height: float,
    text: str = "",
    font_size: int = 14,
    bold: bool = False,
    color: RGBColor = C_DARK,
    align: PP_ALIGN = PP_ALIGN.LEFT,
    valign: MSO_ANCHOR = MSO_ANCHOR.TOP,
    font_name: str = FONT_FAMILY,
):
    tb = slide.shapes.add_textbox(
        Inches(left), Inches(top), Inches(width), Inches(height)
    )
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = valign
    tf.margin_left = Inches(0.05)
    tf.margin_right = Inches(0.05)
    tf.margin_top = Inches(0.04)
    tf.margin_bottom = Inches(0.04)
    p = tf.paragraphs[0]
    p.text = text
    p.alignment = align
    p.font.name = font_name
    p.font.size = Pt(font_size)
    p.font.bold = bold
    p.font.color.rgb = color
    return tb


def add_bullets(
    slide,
    left: float,
    top: float,
    width: float,
    height: float,
    items: list[tuple[str, str]],
    font_size: int = 13,
    body_color: RGBColor = C_SLATE,
    title_color: RGBColor = C_DARK,
    space_after: int = 8,
):
    tb = slide.shapes.add_textbox(
        Inches(left), Inches(top), Inches(width), Inches(height)
    )
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.04)
    tf.margin_right = Inches(0.04)
    tf.margin_top = Inches(0.02)
    tf.margin_bottom = Inches(0.02)

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
        r2.font.bold = False
        r2.font.color.rgb = body_color
    return tb


def add_header(slide, section_tag: str, title: str, subtitle: str, slide_num: int):
    set_bg(slide, C_BG)
    # Top emerald banner strip
    add_rect(slide, 0, 0, 13.333, 1.18, C_PRIMARY, rounded=False)
    add_rect(slide, 0, 1.18, 13.333, 0.05, C_ACCENT, rounded=False)

    # Section pill
    pill = add_rect(slide, 0.55, 0.16, 2.35, 0.28, C_PRIMARY_MID, rounded=True)
    pill.text_frame.word_wrap = False
    p = pill.text_frame.paragraphs[0]
    p.text = section_tag.upper()
    p.alignment = PP_ALIGN.CENTER
    p.font.name = FONT_FAMILY
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_MINT_TINT

    # Slide title & subtitle
    add_textbox(
        slide,
        0.55,
        0.44,
        10.8,
        0.42,
        title,
        font_size=24,
        bold=True,
        color=C_WHITE,
    )
    add_textbox(
        slide,
        0.55,
        0.86,
        11.2,
        0.28,
        subtitle,
        font_size=12,
        bold=False,
        color=C_MINT_TINT,
    )

    # Slide number badge
    add_textbox(
        slide,
        11.9,
        0.35,
        0.95,
        0.45,
        f"{slide_num} / 12",
        font_size=13,
        bold=True,
        color=C_MINT_TINT,
        align=PP_ALIGN.RIGHT,
    )

    # Subtle footer
    add_textbox(
        slide,
        0.55,
        7.12,
        8.5,
        0.28,
        "ZeroWaste Pantry  •  M096-ITWM106 Final Project (React Native + SQLite CRUD)",
        font_size=10,
        color=C_MUTED,
    )


def build_presentation(output_path: Path) -> None:
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    # ---------------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # ---------------------------------------------------------
    s1 = prs.slides.add_slide(blank)
    set_bg(s1, C_PRIMARY)
    add_rect(s1, 0, 0, 0.35, 7.5, C_ACCENT, rounded=False)
    add_rect(s1, 0.85, 1.15, 3.3, 0.4, C_PRIMARY_MID, rounded=True)
    add_textbox(
        s1,
        0.95,
        1.19,
        3.1,
        0.32,
        "M096-ITWM106  •  FINAL PROJECT",
        font_size=12,
        bold=True,
        color=C_MINT_TINT,
        align=PP_ALIGN.CENTER,
    )

    add_textbox(
        s1,
        0.85,
        1.8,
        8.2,
        1.0,
        "ZeroWaste Pantry",
        font_size=50,
        bold=True,
        color=C_WHITE,
    )
    add_textbox(
        s1,
        0.85,
        2.8,
        8.3,
        0.8,
        "Smart Food Expiry & Household Waste Tracker",
        font_size=24,
        bold=True,
        color=C_ACCENT,
    )
    add_textbox(
        s1,
        0.85,
        3.65,
        8.2,
        0.95,
        "A cross-platform React Native + Expo SQLite mobile application that turns static grocery tracking into an intelligent, urgency-sorted waste prevention assistant with full CRUD and real-time financial impact analytics.",
        font_size=15,
        color=C_MINT_TINT,
    )

    # Right showcase panel
    add_rect(s1, 9.35, 1.15, 3.35, 5.2, C_PRIMARY_MID, C_ACCENT, rounded=True)
    add_textbox(
        s1,
        9.55,
        1.4,
        2.95,
        0.4,
        "PROJECT HIGHLIGHTS",
        font_size=13,
        bold=True,
        color=C_MINT_TINT,
    )
    add_bullets(
        s1,
        9.55,
        1.9,
        2.95,
        4.2,
        [
            ("Framework:", "React Native (Expo SDK 52) + TypeScript"),
            ("Database:", "Local SQLite (expo-sqlite) + Web SQL fallback"),
            ("Core Ops:", "Full Create, Read, Update, Delete + SQL Log"),
            ("Innovation:", "Dynamic Expiry Engine & ₱ Savings Analytics"),
            ("Team Name:", "[Insert Your Team Name]"),
        ],
        font_size=13,
        title_color=C_WHITE,
        body_color=C_MINT_TINT,
        space_after=12,
    )

    add_textbox(
        s1,
        0.85,
        6.55,
        8.5,
        0.4,
        "Presented by: [Team Name]  |  5-Member Group  |  November 2026",
        font_size=13,
        bold=True,
        color=C_WHITE,
    )

    # ---------------------------------------------------------
    # SLIDE 2: MEET THE TEAM & ROLE DIVISION
    # ---------------------------------------------------------
    s2 = prs.slides.add_slide(blank)
    add_header(
        s2,
        "Introduction",
        "Meet the Team & Role Division",
        "5-Member cross-functional task split covering backend SQLite, CRUD flows, UI/UX, analytics, and QA",
        2,
    )

    members = [
        (
            "Member 1",
            "[Member 1 Name]",
            "Project Lead & SQLite Architect",
            "src/database/db.ts, seedData.ts, types/pantry.ts",
            "Schema design, parameterized SQL CRUD engine, seed dataset & live SQL query logger.",
            C_PRIMARY,
        ),
        (
            "Member 2",
            "[Member 2 Name]",
            "Core Dev: Create & Update",
            "ItemFormModal.tsx, App.tsx handlers",
            "Validated Add/Edit modal, Quick-Fill presets, expiry shortcuts & quantity/status updates.",
            C_BLUE,
        ),
        (
            "Member 3",
            "[Member 3 Name]",
            "Core Dev: Read, Filter & Delete",
            "DashboardScreen.tsx, UseFirstBanner.tsx, expiryUtils.ts",
            "Search bar, storage/category/status filters, sorting, Use First strip & safe delete.",
            C_AMBER,
        ),
        (
            "Member 4",
            "[Member 4 Name]",
            "UI/UX & Navigation Lead",
            "theme.ts, HeaderBar, SummaryHeroCard, PantryItemCard",
            "Eco-fresh design system, color-coded urgency hierarchy, KPI hero & bottom tabs.",
            C_GREEN,
        ),
        (
            "Member 5",
            "[Member 5 Name]",
            "Analytics, QA, Docs & Video Lead",
            "AnalyticsScreen, TeamGuideScreen, tests/, PPTX & Docs",
            "Waste prevention score, ₱ savings analytics, unit/CRUD tests & presentation deck.",
            C_ORANGE,
        ),
    ]

    positions = [
        (0.55, 1.55, 3.9, 2.55),
        (4.7, 1.55, 3.9, 2.55),
        (8.85, 1.55, 3.9, 2.55),
        (2.0, 4.35, 4.4, 2.55),
        (6.9, 4.35, 4.4, 2.55),
    ]

    for (tag, name, role, files, desc, accent), (x, y, w, h) in zip(members, positions):
        add_rect(s2, x, y, w, h, C_WHITE, C_BORDER, rounded=True)
        add_rect(s2, x, y, w, 0.1, accent, rounded=False)
        add_textbox(s2, x + 0.18, y + 0.18, 1.2, 0.25, tag.upper(), font_size=10, bold=True, color=accent)
        add_textbox(s2, x + 0.18, y + 0.42, w - 0.36, 0.32, name, font_size=16, bold=True, color=C_DARK)
        add_textbox(s2, x + 0.18, y + 0.76, w - 0.36, 0.3, role, font_size=12, bold=True, color=C_PRIMARY_MID)
        add_textbox(s2, x + 0.18, y + 1.12, w - 0.36, 0.42, f"Files: {files}", font_size=10, bold=False, color=C_MUTED)
        add_textbox(s2, x + 0.18, y + 1.62, w - 0.36, 0.8, desc, font_size=12, color=C_SLATE)

    # ---------------------------------------------------------
    # SLIDE 3: PROBLEM STATEMENT
    # ---------------------------------------------------------
    s3 = prs.slides.add_slide(blank)
    add_header(
        s3,
        "Problem Statement",
        "Why Households & Students Waste Food Every Week",
        "Groceries expire unseen behind fridge shelves, creating avoidable budget loss and environmental waste",
        3,
    )

    problems = [
        (
            "1. Forgotten Expiry Dates",
            "Perishables like milk, leafy greens, and cooked leftovers are pushed to the back of the fridge and forgotten until they spoil.",
            C_RED_BG,
            C_RED,
        ),
        (
            "2. No Urgency Prioritization",
            "Paper lists and generic Notes apps do not automatically compute days remaining or highlight what must be cooked first today.",
            C_ORANGE_BG,
            C_ORANGE,
        ),
        (
            "3. Hidden Financial Drain",
            "Students and families rarely measure how many Pesos (₱) are lost monthly to spoiled groceries versus saved through timely meal planning.",
            C_AMBER_BG,
            C_AMBER,
        ),
    ]

    for idx, (ptitle, pbody, bgc, fg) in enumerate(problems):
        x = 0.55 + idx * 4.15
        add_rect(s3, x, 1.55, 3.9, 3.35, C_WHITE, C_BORDER, rounded=True)
        add_rect(s3, x + 0.2, 1.8, 3.5, 0.42, bgc, rounded=True)
        add_textbox(s3, x + 0.3, 1.86, 3.3, 0.32, ptitle, font_size=14, bold=True, color=fg)
        add_textbox(s3, x + 0.2, 2.4, 3.5, 2.2, pbody, font_size=14, color=C_SLATE)

    # Bottom takeaway banner
    add_rect(s3, 0.55, 5.2, 12.2, 1.65, C_PRIMARY, rounded=True)
    add_textbox(
        s3,
        0.85,
        5.38,
        11.6,
        0.35,
        "OUR CORE QUESTION",
        font_size=12,
        bold=True,
        color=C_ACCENT,
    )
    add_textbox(
        s3,
        0.85,
        5.75,
        11.6,
        0.9,
        "How can we give every student and household an effortless mobile tool that tells them what to cook first, tracks storage zones offline, and quantifies every Peso saved from waste?",
        font_size=17,
        bold=True,
        color=C_WHITE,
    )

    # ---------------------------------------------------------
    # SLIDE 4: OUR SOLUTION & INNOVATION
    # ---------------------------------------------------------
    s4 = prs.slides.add_slide(blank)
    add_header(
        s4,
        "Solution & Innovation",
        "ZeroWaste Pantry: Smart, Proactive & Measurable",
        "What makes our solution innovative and game-changing compared to ordinary inventory or to-do apps",
        4,
    )

    innovations = [
        (
            "⏰ Dynamic Expiry Urgency Engine",
            "Automatically computes local calendar days remaining and sorts items by urgency: Expired (Red), Today/≤3d (Orange), 4–7d (Amber), and Fresh (Green).",
            "src/utils/expiryUtils.ts",
        ),
        (
            "🔥 'Use This First' Priority Banner",
            "Horizontal action strip pinned above the pantry list so urgent ingredients appear immediately on launch with a 1-tap '✓ Mark Consumed' button.",
            "src/components/UseFirstBanner.tsx",
        ),
        (
            "💰 Sustainability & ₱ Impact Score",
            "Calculates live Waste Prevention Rate (%), Money Saved (₱), Money Lost (₱), and provides category-specific tips to extend shelf life.",
            "src/screens/AnalyticsScreen.tsx",
        ),
        (
            "🗄️ Live SQL Query Inspector",
            "Built-in header inspector captures every CREATE TABLE, SELECT, INSERT, UPDATE, and DELETE statement with bound parameters in real time.",
            "src/components/SqlInspectorModal.tsx",
        ),
    ]

    for i, (ititle, ibody, ifile) in enumerate(innovations):
        col = i % 2
        row = i // 2
        x = 0.55 + col * 6.2
        y = 1.55 + row * 2.65
        add_rect(s4, x, y, 5.95, 2.4, C_WHITE, C_BORDER, rounded=True)
        add_rect(s4, x, y, 0.12, 2.4, C_ACCENT, rounded=False)
        add_textbox(s4, x + 0.28, y + 0.2, 5.45, 0.36, ititle, font_size=16, bold=True, color=C_PRIMARY)
        add_textbox(s4, x + 0.28, y + 0.65, 5.45, 1.15, ibody, font_size=13, color=C_SLATE)
        add_rect(s4, x + 0.28, y + 1.88, 3.4, 0.32, C_SOFT_MINT, C_MINT_TINT, rounded=True)
        add_textbox(s4, x + 0.38, y + 1.91, 3.2, 0.26, ifile, font_size=10, bold=True, color=C_PRIMARY_MID, font_name="Consolas")

    # ---------------------------------------------------------
    # SLIDE 5: SYSTEM OVERVIEW & ARCHITECTURE
    # ---------------------------------------------------------
    s5 = prs.slides.add_slide(blank)
    add_header(
        s5,
        "System Overview",
        "Cross-Platform 4-Layer Architecture",
        "Clean separation of UI, reactive state, pure domain logic, and dual-engine SQLite persistence",
        5,
    )

    layers = [
        (
            "Layer 1: Presentation UI (Screens & Components)",
            "DashboardScreen, AnalyticsScreen, TeamGuideScreen, ItemFormModal, PantryItemCard, SqlInspectorModal",
            C_SOFT_MINT,
            C_PRIMARY,
        ),
        (
            "Layer 2: Application State Controller (App.tsx)",
            "Manages tab navigation, modal state, delete confirmations, toast feedback & reactive SQL reloads",
            C_BLUE_BG,
            C_BLUE,
        ),
        (
            "Layer 3: Domain & Analytics Engine (expiryUtils.ts)",
            "Pure unit-tested functions: day-difference math, urgency classification, search/filter/sort & ₱ KPIs",
            C_AMBER_BG,
            C_AMBER,
        ),
        (
            "Layer 4: Dual-Engine Persistence (db.ts + seedData.ts)",
            "Native Android/iOS: expo-sqlite (zerowaste_pantry.db)  |  Expo Web & Node Tests: Synchronized SQL Table + Logger",
            C_GREEN_BG,
            C_GREEN,
        ),
    ]

    for idx, (ltitle, ldesc, lbg, lfg) in enumerate(layers):
        y = 1.5 + idx * 1.38
        add_rect(s5, 0.55, y, 8.2, 1.15, C_WHITE, C_BORDER, rounded=True)
        add_rect(s5, 0.55, y, 0.16, 1.15, lfg, rounded=False)
        add_textbox(s5, 0.85, y + 0.14, 7.7, 0.34, ltitle, font_size=15, bold=True, color=lfg)
        add_textbox(s5, 0.85, y + 0.52, 7.7, 0.5, ldesc, font_size=12, color=C_SLATE)

    # Right box: Tech stack summary
    add_rect(s5, 9.05, 1.5, 3.7, 5.3, C_PRIMARY, rounded=True)
    add_textbox(s5, 9.3, 1.75, 3.2, 0.38, "TECH STACK", font_size=15, bold=True, color=C_ACCENT)
    add_bullets(
        s5,
        9.3,
        2.25,
        3.2,
        4.3,
        [
            ("React Native:", "0.76.5 cross-platform mobile UI"),
            ("Expo SDK 52:", "Rapid testing on Expo Go & Web"),
            ("TypeScript:", "Strict end-to-end type safety"),
            ("expo-sqlite:", "Offline-first local SQL database"),
            ("Node Test Runner:", "Automated CRUD & math verification"),
        ],
        font_size=13,
        title_color=C_WHITE,
        body_color=C_MINT_TINT,
        space_after=14,
    )

    # ---------------------------------------------------------
    # SLIDE 6: DATABASE SCHEMA & FULL CRUD IMPLEMENTATION
    # ---------------------------------------------------------
    s6 = prs.slides.add_slide(blank)
    add_header(
        s6,
        "Database & CRUD",
        "SQLite Schema & Full CRUD Operations",
        "Parameterized SQL queries backed by input validation and live SQL query logging",
        6,
    )

    # Left: Schema card
    add_rect(s6, 0.55, 1.5, 4.7, 5.35, C_DARK, rounded=True)
    add_textbox(s6, 0.8, 1.72, 4.2, 0.35, "TABLE: pantry_items", font_size=14, bold=True, color=C_ACCENT)
    schema_text = (
        "id              TEXT PRIMARY KEY\n"
        "name            TEXT NOT NULL\n"
        "category        TEXT NOT NULL\n"
        "storageLocation TEXT NOT NULL\n"
        "quantity        REAL NOT NULL\n"
        "unit            TEXT NOT NULL\n"
        "estimatedCost   REAL NOT NULL\n"
        "expiryDate      TEXT (YYYY-MM-DD)\n"
        "status          TEXT (active|consumed|wasted)\n"
        "notes           TEXT NOT NULL\n"
        "createdAt       TEXT NOT NULL\n"
        "updatedAt       TEXT NOT NULL"
    )
    add_textbox(
        s6,
        0.8,
        2.15,
        4.25,
        4.4,
        schema_text,
        font_size=12,
        color=C_MINT_TINT,
        font_name="Consolas",
    )

    # Right: 4 CRUD cards
    cruds = [
        ("CREATE", "INSERT INTO pantry_items (...) VALUES (?, ...)", "Validated Add Item modal with Quick-Fill presets & 1-tap expiry dates.", C_GREEN, C_GREEN_BG),
        ("READ", "SELECT * FROM pantry_items ORDER BY expiryDate ASC", "Urgency-sorted feed with search, status tabs, storage zone & category filters.", C_BLUE, C_BLUE_BG),
        ("UPDATE", "UPDATE pantry_items SET ... WHERE id = ?", "Inline +/- quantity stepper, Consumed/Wasted toggles & full Edit modal.", C_AMBER, C_AMBER_BG),
        ("DELETE", "DELETE FROM pantry_items WHERE id = ?", "Safe removal with cross-platform confirmation prompt before deleting.", C_RED, C_RED_BG),
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

    # ---------------------------------------------------------
    # SLIDE 7: UI/UX DESIGN & VISUAL CONSISTENCY
    # ---------------------------------------------------------
    s7 = prs.slides.add_slide(blank)
    add_header(
        s7,
        "Content & UI Design",
        "Intuitive, Mobile-First Visual Hierarchy",
        "Consistent Eco-Fresh design tokens, clear touch targets, and instant urgency feedback",
        7,
    )

    # Left: Urgency System Table
    add_rect(s7, 0.55, 1.5, 6.0, 5.3, C_WHITE, C_BORDER, rounded=True)
    add_textbox(s7, 0.8, 1.72, 5.5, 0.36, "Color-Coded Urgency Badges", font_size=16, bold=True, color=C_PRIMARY)
    urgencies = [
        ("Expired (< 0 days)", "Red Alert Badge", "Leftover Cooked Adobo (-1d)", C_RED_BG, C_RED),
        ("Critical (0–3 days)", "Orange Priority Badge", "Chicken Breast (+1d), Milk (+2d)", C_ORANGE_BG, C_ORANGE),
        ("Warning (4–7 days)", "Amber Caution Badge", "Whole Wheat Loaf (+5d)", C_AMBER_BG, C_AMBER),
        ("Fresh (> 7 days)", "Green Safe Badge", "Free-Range Eggs (+12d), Rice (+45d)", C_GREEN_BG, C_GREEN),
    ]
    for i, (u_name, u_badge, u_ex, u_bg, u_fg) in enumerate(urgencies):
        y = 2.25 + i * 1.08
        add_rect(s7, 0.8, y, 5.5, 0.9, C_BG, C_BORDER, rounded=True)
        add_rect(s7, 0.8, y, 0.14, 0.9, u_fg, rounded=False)
        add_textbox(s7, 1.08, y + 0.12, 2.7, 0.3, u_name, font_size=13, bold=True, color=C_DARK)
        add_textbox(s7, 1.08, y + 0.46, 3.1, 0.32, u_ex, font_size=11, color=C_SLATE)
        pill = add_rect(s7, 4.15, y + 0.25, 1.95, 0.38, u_bg, rounded=True)
        pp = pill.text_frame.paragraphs[0]
        pp.text = u_badge
        pp.alignment = PP_ALIGN.CENTER
        pp.font.name = FONT_FAMILY
        pp.font.size = Pt(11)
        pp.font.bold = True
        pp.font.color.rgb = u_fg

    # Right: 3 Navigation Tabs
    add_rect(s7, 6.8, 1.5, 5.95, 5.3, C_WHITE, C_BORDER, rounded=True)
    add_textbox(s7, 7.05, 1.72, 5.45, 0.36, "3-Tab Streamlined Navigation", font_size=16, bold=True, color=C_PRIMARY)
    tabs = [
        ("🥬 Tab 1: Pantry (CRUD)", "Summary Hero KPIs, 'Use This First' horizontal strip, instant search, zone/category filters, and interactive item cards."),
        ("📊 Tab 2: Analytics", "Sustainability Waste Prevention %, Money Saved (₱) vs Lost (₱), Storage Zone breakdown, and Shelf-Life Extension Tips."),
        ("👥 Tab 3: Team & Demo", "In-app 5-member role ownership, CRUD verification checklist, 1-tap Reset Demo Data, and SQL Inspector launch."),
    ]
    for i, (tname, tdesc) in enumerate(tabs):
        y = 2.25 + i * 1.45
        add_rect(s7, 7.05, y, 5.45, 1.25, C_SOFT_MINT, C_MINT_TINT, rounded=True)
        add_textbox(s7, 7.25, y + 0.14, 5.05, 0.34, tname, font_size=14, bold=True, color=C_PRIMARY)
        add_textbox(s7, 7.25, y + 0.5, 5.05, 0.65, tdesc, font_size=12, color=C_SLATE)

    # ---------------------------------------------------------
    # SLIDE 8: LIVE SYSTEM DEMONSTRATION GUIDE
    # ---------------------------------------------------------
    s8 = prs.slides.add_slide(blank)
    add_header(
        s8,
        "System Demonstration",
        "End-to-End Live App Walkthrough",
        "4-step demonstration proving full CRUD, real-time urgency sorting, analytics & SQL logging",
        8,
    )

    steps = [
        ("STEP 1: READ & FILTER", "Dashboard Overview", "Show Hero KPIs & 'Use First' banner. Search 'spinach' and filter by Fridge vs Pantry.", C_BLUE),
        ("STEP 2: CREATE", "Add New Food Item", "Tap '+ Add Item', pick a Quick-Fill preset (e.g., Fresh Milk), choose +2d expiry, and tap Save.", C_GREEN),
        ("STEP 3: UPDATE", "Quantity, Edit & Consume", "Tap '+' stepper, Edit modal, and '✓ Consumed' — verify Money Saved (₱) ticks up in Analytics!", C_AMBER),
        ("STEP 4: DELETE & SQL", "Safe Remove & SQL Log", "Tap '🗑' and confirm deletion. Open 'SQL (N)' in the header to verify live SQL statements.", C_RED),
    ]

    for idx, (sbadge, stitle, sdesc, scolor) in enumerate(steps):
        x = 0.55 + idx * 3.1
        add_rect(s8, x, 1.6, 2.9, 4.1, C_WHITE, C_BORDER, rounded=True)
        add_rect(s8, x, 1.6, 2.9, 0.52, scolor, rounded=False)
        add_textbox(s8, x + 0.15, 1.7, 2.6, 0.32, sbadge, font_size=13, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
        add_textbox(s8, x + 0.18, 2.32, 2.54, 0.4, stitle, font_size=15, bold=True, color=C_DARK)
        add_textbox(s8, x + 0.18, 2.82, 2.54, 2.6, sdesc, font_size=13, color=C_SLATE)

    add_rect(s8, 0.55, 5.95, 12.2, 0.9, C_SOFT_MINT, C_ACCENT, rounded=True)
    add_textbox(
        s8,
        0.8,
        6.15,
        11.7,
        0.5,
        "Pro Tip for Video Recording: Use 'Team & Demo → ↺ Reset Demo Data' before recording to start cleanly with 10 dynamic items.",
        font_size=13,
        bold=True,
        color=C_PRIMARY,
    )

    # ---------------------------------------------------------
    # SLIDE 9: REFLECTIONS & CONTRIBUTIONS (MEMBERS 1, 2, 3)
    # ---------------------------------------------------------
    s9 = prs.slides.add_slide(blank)
    add_header(
        s9,
        "Reflections (1/2)",
        "Individual Contributions & Reflections — Members 1, 2 & 3",
        "Each member's technical ownership, impact on the app, and key engineering takeaways",
        9,
    )

    ref_1_3 = [
        (
            "Member 1 — [Name]\nProject Lead & SQLite Architect",
            "Built `src/database/db.ts`, `seedData.ts`, and `pantry.ts`. Designed the `pantry_items` SQLite schema, parameterized CRUD queries, and live SQL query logger.",
            "Learned how to architect a dual-engine repository (`expo-sqlite` + Web SQL table) so the app runs offline on mobile and cleanly in browser tests.",
            C_PRIMARY,
        ),
        (
            "Member 2 — [Name]\nCreate & Update Developer",
            "Built `ItemFormModal.tsx` and Create/Update handlers in `App.tsx`. Implemented 1-tap Quick-Fill presets, expiry shortcuts, and inline quantity/status controls.",
            "Learned how shared modal components handle both Create and Edit modes cleanly and why strict validation protects database integrity.",
            C_BLUE,
        ),
        (
            "Member 3 — [Name]\nRead, Filter & Delete Developer",
            "Built `DashboardScreen.tsx`, `UseFirstBanner.tsx`, and `expiryUtils.ts` search/filter/sort utilities plus cross-platform Delete confirmation.",
            "Learned how memoized filtering and calendar-normalized date math keep large item lists responsive immediately after every CRUD mutation.",
            C_AMBER,
        ),
    ]

    for idx, (mtitle, mcontrib, mlearn, maccent) in enumerate(ref_1_3):
        x = 0.55 + idx * 4.15
        add_rect(s9, x, 1.55, 3.9, 5.25, C_WHITE, C_BORDER, rounded=True)
        add_rect(s9, x, 1.55, 3.9, 0.85, maccent, rounded=False)
        add_textbox(s9, x + 0.18, 1.65, 3.54, 0.65, mtitle, font_size=14, bold=True, color=C_WHITE)

        add_textbox(s9, x + 0.18, 2.55, 3.54, 0.28, "CONTRIBUTIONS", font_size=11, bold=True, color=maccent)
        add_textbox(s9, x + 0.18, 2.85, 3.54, 1.6, mcontrib, font_size=12, color=C_SLATE)

        add_rect(s9, x + 0.18, 4.55, 3.54, 2.05, C_BG, C_BORDER, rounded=True)
        add_textbox(s9, x + 0.3, 4.68, 3.3, 0.28, "KEY LEARNING & REFLECTION", font_size=11, bold=True, color=C_PRIMARY)
        add_textbox(s9, x + 0.3, 5.0, 3.3, 1.45, mlearn, font_size=12, color=C_DARK)

    # ---------------------------------------------------------
    # SLIDE 10: REFLECTIONS & CONTRIBUTIONS (MEMBERS 4 & 5)
    # ---------------------------------------------------------
    s10 = prs.slides.add_slide(blank)
    add_header(
        s10,
        "Reflections (2/2)",
        "Individual Contributions & Reflections — Members 4 & 5",
        "UI/UX consistency, analytics metrics, automated QA testing, documentation & presentation delivery",
        10,
    )

    ref_4_5 = [
        (
            "Member 4 — [Name]\nUI/UX & Navigation Lead",
            "Designed the Eco-Fresh design tokens (`src/constants/theme.ts`) and crafted `HeaderBar`, `SummaryHeroCard`, `PantryItemCard`, and the 3-tab bottom navigation bar.",
            "Learned how color-coded urgency borders, badges, and spacious mobile touch targets transform raw SQL rows into a clear, effortless daily workflow.",
            C_GREEN,
        ),
        (
            "Member 5 — [Name]\nAnalytics, QA, Docs & Video Lead",
            "Built `AnalyticsScreen.tsx`, `TeamGuideScreen.tsx`, `SqlInspectorModal.tsx`, and automated CRUD/math tests (`tests/crudAndUtils.test.ts`), plus full documentation and PowerPoint deck.",
            "Learned how to convert pantry status changes into measurable sustainability KPIs (Waste Prevention Rate & ₱ Saved) and validate all edge cases via automated tests.",
            C_ORANGE,
        ),
    ]

    for idx, (mtitle, mcontrib, mlearn, maccent) in enumerate(ref_4_5):
        x = 0.55 + idx * 6.2
        add_rect(s10, x, 1.55, 5.95, 5.25, C_WHITE, C_BORDER, rounded=True)
        add_rect(s10, x, 1.55, 5.95, 0.85, maccent, rounded=False)
        add_textbox(s10, x + 0.25, 1.65, 5.45, 0.65, mtitle, font_size=15, bold=True, color=C_WHITE)

        add_textbox(s10, x + 0.25, 2.58, 5.45, 0.28, "CONTRIBUTIONS & DELIVERABLES", font_size=11, bold=True, color=maccent)
        add_textbox(s10, x + 0.25, 2.9, 5.45, 1.45, mcontrib, font_size=13, color=C_SLATE)

        add_rect(s10, x + 0.25, 4.5, 5.45, 2.05, C_BG, C_BORDER, rounded=True)
        add_textbox(s10, x + 0.4, 4.65, 5.15, 0.28, "KEY LEARNING & REFLECTION", font_size=11, bold=True, color=C_PRIMARY)
        add_textbox(s10, x + 0.4, 4.98, 5.15, 1.45, mlearn, font_size=13, color=C_DARK)

    # ---------------------------------------------------------
    # SLIDE 11: IMPACT, FUTURE ENHANCEMENTS & CONCLUSION
    # ---------------------------------------------------------
    s11 = prs.slides.add_slide(blank)
    add_header(
        s11,
        "Impact & Future",
        "Real-World Impact & Version 2.0 Roadmap",
        "Practical value today with a scalable foundation for future smart-kitchen upgrades",
        11,
    )

    add_rect(s11, 0.55, 1.55, 5.95, 5.25, C_WHITE, C_BORDER, rounded=True)
    add_textbox(s11, 0.8, 1.8, 5.45, 0.36, "Measurable Real-World Impact", font_size=17, bold=True, color=C_PRIMARY)
    add_bullets(
        s11,
        0.8,
        2.3,
        5.45,
        4.2,
        [
            ("Saves Household Budget:", "Tracks actual ₱ saved per consumed item and flags at-risk groceries before they spoil."),
            ("Works Offline Anywhere:", "Local SQLite ensures instant access in supermarkets and kitchens with weak Wi-Fi."),
            ("Encourages Sustainable Habits:", "Visual Waste Prevention Score gamifies finishing food before expiration."),
            ("Zero Learning Curve:", "Quick-Fill presets and 1-tap status updates take under 3 seconds."),
        ],
        font_size=13,
        title_color=C_PRIMARY_MID,
        body_color=C_SLATE,
        space_after=14,
    )

    add_rect(s11, 6.8, 1.55, 5.95, 5.25, C_SOFT_MINT, C_ACCENT, rounded=True)
    add_textbox(s11, 7.05, 1.8, 5.45, 0.36, "Future Enhancements (Version 2.0)", font_size=17, bold=True, color=C_PRIMARY)
    add_bullets(
        s11,
        7.05,
        2.3,
        5.45,
        4.2,
        [
            ("Barcode & Receipt Scan:", "Auto-populate product names and default shelf-life estimates from grocery barcodes."),
            ("Push Reminders:", "Scheduled local notifications 48 hours prior to item expiration."),
            ("AI Recipe Matching:", "Recommend recipes using ingredients currently inside the 'Use This First' strip."),
            ("Shared Household Sync:", "Optional cloud sync so roommates and family members share one live pantry."),
        ],
        font_size=13,
        title_color=C_PRIMARY,
        body_color=C_DARK,
        space_after=14,
    )

    # ---------------------------------------------------------
    # SLIDE 12: Q&A SLIDE
    # ---------------------------------------------------------
    s12 = prs.slides.add_slide(blank)
    set_bg(s12, C_PRIMARY)
    add_rect(s12, 0, 0, 0.35, 7.5, C_ACCENT, rounded=False)

    add_textbox(
        s12,
        1.0,
        1.75,
        11.3,
        0.9,
        "Thank You!  Questions & Answers",
        font_size=40,
        bold=True,
        color=C_WHITE,
        align=PP_ALIGN.CENTER,
    )
    add_textbox(
        s12,
        1.4,
        2.7,
        10.5,
        0.7,
        "ZeroWaste Pantry — Turning Expiry Awareness into Everyday Savings",
        font_size=18,
        color=C_ACCENT,
        align=PP_ALIGN.CENTER,
    )

    add_rect(s12, 2.2, 3.8, 8.9, 2.35, C_PRIMARY_MID, C_ACCENT, rounded=True)
    add_textbox(
        s12,
        2.5,
        4.0,
        8.3,
        0.35,
        "SUBMITTED DELIVERABLES SUMMARY",
        font_size=13,
        bold=True,
        color=C_MINT_TINT,
        align=PP_ALIGN.CENTER,
    )
    add_bullets(
        s12,
        2.6,
        4.45,
        8.1,
        1.5,
        [
            ("1. Source Code:", "React Native (Expo + TypeScript + SQLite) with full CRUD & automated tests"),
            ("2. Documentation:", "README.md, PROJECT_DOCUMENTATION.md & PRESENTATION_GUIDE.md"),
            ("3. Presentation & Video:", "12-Slide PPTX Deck + Live App Demonstration Recording"),
        ],
        font_size=13,
        title_color=C_WHITE,
        body_color=C_MINT_TINT,
        space_after=10,
    )

    prs.save(str(output_path))
    print(f"Saved presentation to: {output_path}")


if __name__ == "__main__":
    out = Path(__file__).resolve().parent / "ZeroWaste_Pantry_Presentation.pptx"
    build_presentation(out)
