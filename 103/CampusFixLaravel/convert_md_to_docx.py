"""Convert Markdown documentation files into styled Word (.docx) documents."""

import re
from pathlib import Path
from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

EMERALD = RGBColor(15, 81, 50)      # #0F5132
EMERALD_MID = RGBColor(21, 115, 71) # #157347
DARK_TEXT = RGBColor(15, 23, 42)    # #0F172A
SLATE_TEXT = RGBColor(51, 65, 85)   # #334155
MUTED_TEXT = RGBColor(100, 116, 139)

INLINE_PATTERN = re.compile(r"(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)")


def set_cell_shading(cell, hex_color: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_color)
    tc_pr.append(shd)


def set_cell_margins(cell, top=80, bottom=80, left=120, right=120) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = OxmlElement("w:tcMar")
    for side, val in (("top", top), ("bottom", bottom), ("left", left), ("right", right)):
        node = OxmlElement(f"w:{side}")
        node.set(qn("w:w"), str(val))
        node.set(qn("w:type"), "dxa")
        tc_mar.append(node)
    tc_pr.append(tc_mar)


def add_formatted_runs(paragraph, text: str, base_color: RGBColor = SLATE_TEXT, base_size: int = 11) -> None:
    parts = INLINE_PATTERN.split(text)
    for part in parts:
        if not part:
            continue
        if part.startswith("**") and part.endswith("**"):
            r = paragraph.add_run(part[2:-2])
            r.bold = True
            r.font.name = "Calibri"
            r.font.size = Pt(base_size)
            r.font.color.rgb = DARK_TEXT
        elif part.startswith("*") and part.endswith("*"):
            r = paragraph.add_run(part[1:-1])
            r.italic = True
            r.font.name = "Calibri"
            r.font.size = Pt(base_size)
            r.font.color.rgb = base_color
        elif part.startswith("`") and part.endswith("`"):
            r = paragraph.add_run(part[1:-1])
            r.font.name = "Consolas"
            r.font.size = Pt(base_size - 1)
            r.font.color.rgb = EMERALD_MID
        else:
            r = paragraph.add_run(part)
            r.font.name = "Calibri"
            r.font.size = Pt(base_size)
            r.font.color.rgb = base_color


def add_code_block(doc: Document, code_lines: list[str]) -> None:
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    set_cell_shading(cell, "F1F5F9")
    set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run("\n".join(code_lines))
    run.font.name = "Consolas"
    run.font.size = Pt(9.5)
    run.font.color.rgb = DARK_TEXT
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_before = Pt(0)
    spacer.paragraph_format.space_after = Pt(4)


def add_md_table(doc: Document, table_lines: list[str]) -> None:
    rows = []
    for idx, line in enumerate(table_lines):
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if idx == 1 and all(set(c) <= set("-: ") for c in cells):
            continue
        rows.append(cells)

    if not rows:
        return

    num_cols = max(len(r) for r in rows)
    table = doc.add_table(rows=len(rows), cols=num_cols)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    for r_idx, row_data in enumerate(rows):
        for c_idx in range(num_cols):
            cell = table.cell(r_idx, c_idx)
            set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            text = row_data[c_idx] if c_idx < len(row_data) else ""
            if r_idx == 0:
                set_cell_shading(cell, "0F5132")
                clean = text.replace("**", "")
                run = p.add_run(clean)
                run.bold = True
                run.font.name = "Calibri"
                run.font.size = Pt(10.5)
                run.font.color.rgb = RGBColor(255, 255, 255)
            else:
                if r_idx % 2 == 0:
                    set_cell_shading(cell, "F8FAFC")
                add_formatted_runs(p, text, base_color=SLATE_TEXT, base_size=10)

    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_before = Pt(0)
    spacer.paragraph_format.space_after = Pt(4)


def convert_markdown_to_docx(md_path: Path, docx_path: Path) -> None:
    doc = Document()
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.85)
        section.right_margin = Inches(0.85)

    lines = md_path.read_text(encoding="utf-8").splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Fenced code block
        if stripped.startswith("```"):
            i += 1
            code_lines = []
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            add_code_block(doc, code_lines)
            i += 1
            continue

        # Markdown table
        if stripped.startswith("|") and "|" in stripped[1:]:
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i])
                i += 1
            add_md_table(doc, table_lines)
            continue

        # Horizontal rule
        if stripped in ("---", "***", "___"):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(4)
            p_pr = p._p.get_or_add_pPr()
            p_bdr = OxmlElement("w:pBdr")
            bottom = OxmlElement("w:bottom")
            bottom.set(qn("w:val"), "single")
            bottom.set(qn("w:sz"), "6")
            bottom.set(qn("w:space"), "1")
            bottom.set(qn("w:color"), "CBD5E1")
            p_bdr.append(bottom)
            p_pr.append(p_bdr)
            i += 1
            continue

        # Headings
        if stripped.startswith("### "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(4)
            r = p.add_run(stripped[4:].strip())
            r.bold = True
            r.font.name = "Calibri"
            r.font.size = Pt(13)
            r.font.color.rgb = EMERALD_MID
            i += 1
            continue

        if stripped.startswith("## "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(5)
            r = p.add_run(stripped[3:].strip())
            r.bold = True
            r.font.name = "Calibri"
            r.font.size = Pt(16)
            r.font.color.rgb = EMERALD
            i += 1
            continue

        if stripped.startswith("# "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(8)
            r = p.add_run(stripped[2:].strip())
            r.bold = True
            r.font.name = "Calibri"
            r.font.size = Pt(22)
            r.font.color.rgb = EMERALD
            i += 1
            continue

        # Blank line
        if not stripped:
            i += 1
            continue

        # Bullet list (including indented sub-bullets)
        bullet_match = re.match(r"^(\s*)[-*]\s+(.*)$", line)
        if bullet_match:
            indent_spaces = len(bullet_match.group(1))
            content = bullet_match.group(2)
            p = doc.add_paragraph(style="List Bullet")
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(3)
            if indent_spaces >= 2:
                p.paragraph_format.left_indent = Inches(0.5)
            add_formatted_runs(p, content)
            i += 1
            continue

        # Numbered list
        num_match = re.match(r"^(\s*)\d+\.\s+(.*)$", line)
        if num_match:
            indent_spaces = len(num_match.group(1))
            content = num_match.group(2)
            p = doc.add_paragraph(style="List Number")
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(3)
            if indent_spaces >= 2:
                p.paragraph_format.left_indent = Inches(0.5)
            add_formatted_runs(p, content)
            i += 1
            continue

        # Regular paragraph
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(5)
        add_formatted_runs(p, stripped)
        i += 1

    doc.save(str(docx_path))
    print(f"Converted {md_path.name} -> {docx_path.name}")


if __name__ == "__main__":
    base = Path(__file__).resolve().parent
    for name in ("README.md", "PROJECT_DOCUMENTATION.md", "PRESENTATION_GUIDE.md"):
        src = base / name
        if src.exists():
            convert_markdown_to_docx(src, src.with_suffix(".docx"))
