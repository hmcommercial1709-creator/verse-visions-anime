#!/usr/bin/env python3
"""Build the public GameCastle resource downloads from the real anime catalog."""

from __future__ import annotations

import csv
import json
import re
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src" / "data" / "animes.ts"
OUTPUT = ROOT / "public" / "downloads"
SNAPSHOT_DATE = "August 14, 2026"


@dataclass(frozen=True)
class Anime:
    title: str
    year: int
    status: str
    episodes: str
    rating: float
    genres: list[str]
    tagline: str
    synopsis: str


def quoted_value(block: str, key: str) -> str:
    match = re.search(rf"\b{re.escape(key)}:\s*(\"(?:\\.|[^\"\\])*\")", block, re.S)
    if not match:
        raise ValueError(f"Missing {key} in anime block")
    return json.loads(match.group(1))


def scalar_value(block: str, key: str) -> str:
    match = re.search(rf"\b{re.escape(key)}:\s*([^,\n]+)", block)
    if not match:
        raise ValueError(f"Missing {key} in anime block")
    return match.group(1).strip()


def split_top_level_objects(source: str) -> list[str]:
    marker = "export const animes: Anime[] = ["
    start = source.index(marker) + len(marker)
    objects: list[str] = []
    depth = 0
    obj_start: int | None = None
    quote: str | None = None
    escaped = False

    for index, char in enumerate(source[start:], start=start):
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            continue
        if char in ('"', "'", "`"):
            quote = char
            continue
        if char == "{":
            if depth == 0:
                obj_start = index
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0 and obj_start is not None:
                objects.append(source[obj_start : index + 1])
                obj_start = None
        elif char == "]" and depth == 0:
            break

    return objects


def load_anime() -> list[Anime]:
    source = SOURCE.read_text(encoding="utf-8")
    anime: list[Anime] = []
    for block in split_top_level_objects(source):
        genres_match = re.search(r"\bgenres:\s*\[([^\]]*)\]", block, re.S)
        if not genres_match:
            raise ValueError("Missing genres in anime block")
        genres = re.findall(r'"([^"]+)"', genres_match.group(1))
        episode_value = scalar_value(block, "episodes")
        episodes = json.loads(episode_value) if episode_value.startswith('"') else episode_value
        anime.append(
            Anime(
                title=quoted_value(block, "title"),
                year=int(scalar_value(block, "year")),
                status=quoted_value(block, "status"),
                episodes=str(episodes),
                rating=float(scalar_value(block, "rating")),
                genres=genres,
                tagline=quoted_value(block, "tagline"),
                synopsis=quoted_value(block, "synopsis"),
            )
        )
    if len(anime) != 23:
        raise ValueError(f"Expected 23 published catalog anime, found {len(anime)}")
    return anime


def safe_text(value: str) -> str:
    replacements = {
        "—": "-",
        "–": "-",
        "’": "'",
        "“": '"',
        "”": '"',
        "…": "...",
        "★": "*",
    }
    for old, new in replacements.items():
        value = value.replace(old, new)
    return value.encode("latin-1", "replace").decode("latin-1")


def build_csv(anime: list[Anime]) -> None:
    path = OUTPUT / "anime-tracker-template.csv"
    with path.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.writer(stream, lineterminator="\n")
        writer.writerow(
            [
                "Title",
                "Year",
                "Genres",
                "Total Episodes",
                "Episodes Watched",
                "Status",
                "Personal Rating (1-10)",
                "Start Date (YYYY-MM-DD)",
                "Finish Date (YYYY-MM-DD)",
                "Notes",
            ]
        )
        for item in anime:
            writer.writerow(
                [
                    item.title,
                    item.year,
                    "; ".join(genre.replace("-", " ").title() for genre in item.genres),
                    item.episodes,
                    "",
                    "Plan to Watch",
                    "",
                    "",
                    "",
                    "",
                ]
            )


def pdf_footer(canvas, doc) -> None:
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#312e47"))
    canvas.line(0.55 * inch, 0.46 * inch, 7.95 * inch, 0.46 * inch)
    canvas.setFillColor(colors.HexColor("#6b6a80"))
    canvas.setFont("Helvetica", 8)
    canvas.drawString(0.55 * inch, 0.28 * inch, "GameCastle Anime - gamecastle.store/resources")
    canvas.drawRightString(7.95 * inch, 0.28 * inch, f"Page {doc.page}")
    canvas.restoreState()


def anime_card(item: Anime, styles) -> KeepTogether:
    meta = (
        f"{item.year}  |  {safe_text(item.status)}  |  "
        f"Episodes: {safe_text(item.episodes)}  |  GameCastle rating: {item.rating:.1f}/10"
    )
    genres = " / ".join(genre.replace("-", " ").title() for genre in item.genres[:5])
    synopsis = safe_text(item.synopsis)
    if len(synopsis) > 520:
        synopsis = synopsis[:517].rsplit(" ", 1)[0] + "..."
    data = [
        [Paragraph(safe_text(item.title), styles["CardTitle"])],
        [Paragraph(meta, styles["Meta"])],
        [Paragraph(f"<b>Genres:</b> {safe_text(genres)}", styles["BodySmall"])],
        [Paragraph(f"<i>{safe_text(item.tagline)}</i>", styles["Tagline"])],
        [Paragraph(synopsis, styles["BodySmall"])],
    ]
    table = Table(data, colWidths=[6.95 * inch], rowHeights=None)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#171525")),
                ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#393452")),
                ("LINEBELOW", (0, 0), (-1, 0), 1, colors.HexColor("#f04b75")),
                ("LEFTPADDING", (0, 0), (-1, -1), 14),
                ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return KeepTogether([table])


def build_pdf(anime: list[Anime]) -> None:
    path = OUTPUT / "ultimate-anime-watchlist-2026.pdf"
    doc = SimpleDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=0.55 * inch,
        rightMargin=0.55 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.62 * inch,
        title="GameCastle Anime Starter Watchlist 2026",
        author="GameCastle Anime",
        subject="A 23-title anime starter watchlist generated from the GameCastle catalog.",
    )
    base = getSampleStyleSheet()
    styles = {
        "CoverTitle": ParagraphStyle(
            "CoverTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=32,
            leading=36,
            textColor=colors.HexColor("#201d32"),
            alignment=TA_CENTER,
            spaceAfter=18,
        ),
        "CoverSub": ParagraphStyle(
            "CoverSub",
            parent=base["BodyText"],
            fontSize=14,
            leading=21,
            textColor=colors.HexColor("#5c586e"),
            alignment=TA_CENTER,
        ),
        "H1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=28,
            textColor=colors.HexColor("#f04b75"),
            spaceAfter=12,
        ),
        "H2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=17,
            leading=21,
            textColor=colors.HexColor("#201d32"),
            spaceAfter=8,
        ),
        "Body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontSize=10.5,
            leading=15,
            textColor=colors.HexColor("#4c4960"),
            spaceAfter=9,
        ),
        "BodySmall": ParagraphStyle(
            "BodySmall",
            parent=base["BodyText"],
            fontSize=9,
            leading=12.5,
            textColor=colors.HexColor("#d5d1e3"),
        ),
        "CardTitle": ParagraphStyle(
            "CardTitle",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=19,
            textColor=colors.HexColor("#ffffff"),
        ),
        "Meta": ParagraphStyle(
            "Meta",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor("#56d9d1"),
        ),
        "Tagline": ParagraphStyle(
            "Tagline",
            parent=base["BodyText"],
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#f6a8bd"),
        ),
    }

    story = [
        Spacer(1, 1.05 * inch),
        Paragraph(
            "GAMECASTLE ANIME",
            ParagraphStyle(
                "CoverKicker",
                parent=styles["Meta"],
                textColor=colors.HexColor("#15857f"),
                alignment=TA_CENTER,
            ),
        ),
        Spacer(1, 0.22 * inch),
        Paragraph("Anime Starter Watchlist 2026", styles["CoverTitle"]),
        Paragraph(
            "23 real titles from the GameCastle catalog, arranged as a practical roadmap with episode counts, genres and concise spoiler-free overviews.",
            styles["CoverSub"],
        ),
        Spacer(1, 0.42 * inch),
        Table(
            [["23 titles", "15 pages", "10+ genres"], ["Spoiler-light", "Beginner roadmap", "Free tracker included"]],
            colWidths=[2.25 * inch] * 3,
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#201d32")),
                    ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#ffffff")),
                    ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#f04b75")),
                    ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#393452")),
                    ("TOPPADDING", (0, 0), (-1, -1), 13),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 13),
                ]
            ),
        ),
        Spacer(1, 0.65 * inch),
        Paragraph(
            f"Catalog snapshot: {SNAPSHOT_DATE}. Ratings are GameCastle editorial scores, not live third-party rankings.",
            styles["CoverSub"],
        ),
        PageBreak(),
        Paragraph("How to use this watchlist", styles["H1"]),
        Paragraph(
            "Start with one short or completed series, then move into a longer franchise only after you know which genres and pacing styles you enjoy. The list is not a universal ranking; it is a structured sampler drawn from the titles GameCastle currently covers in depth.",
            styles["Body"],
        ),
        Paragraph("1. Pick by commitment", styles["H2"]),
        Paragraph(
            "Choose a shorter completed series when you want a clear ending. Select an ongoing title only when you are comfortable waiting for new seasons or checking current episode information before starting.",
            styles["Body"],
        ),
        Paragraph("2. Track progress honestly", styles["H2"]),
        Paragraph(
            "Use the included CSV in Excel, Google Sheets or Notion. Record episodes watched, your personal rating and the date you paused. Personal ratings are more useful than copying a public score.",
            styles["Body"],
        ),
        Paragraph("3. Verify changing details", styles["H2"]),
        Paragraph(
            "Episode totals for ongoing series can change. Treat the values in this snapshot as a starting point and verify current availability through a licensed streaming service in your country.",
            styles["Body"],
        ),
        Paragraph("Reading key", styles["H2"]),
        Table(
            [
                ["Field", "Meaning"],
                ["GameCastle rating", "Editorial score stored in the current GameCastle catalog."],
                ["Episodes", "Catalog total at the snapshot date; '?' means the total is still open or not fixed."],
                ["Genres", "Discovery labels used for internal browsing and related recommendations."],
                ["Status", "Completed, Ongoing or Upcoming at the catalog snapshot."],
            ],
            colWidths=[1.65 * inch, 5.25 * inch],
            style=TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f04b75")),
                    ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#ffffff")),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#171525")),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#393452")),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ]
            ),
        ),
        PageBreak(),
        Paragraph("A beginner-friendly roadmap", styles["H1"]),
        Paragraph(
            "There is no single correct route. This sequence moves from accessible hooks into denser world-building and larger franchise commitments.",
            styles["Body"],
        ),
    ]

    road_map = [
        ("Stage 1 - Fast hooks", "Death Note, Demon Slayer, Jujutsu Kaisen and Spy x Family offer clear premises and early payoffs."),
        ("Stage 2 - Character depth", "Attack on Titan, Vinland Saga, Frieren and The Apothecary Diaries reward slower observation."),
        ("Stage 3 - Systems and strategy", "Hunter x Hunter, Fullmetal Alchemist: Brotherhood, Steins;Gate and Code Geass add layered rules and consequences."),
        ("Stage 4 - Long adventures", "Naruto, Bleach, Black Clover and One Piece demand more time but build larger worlds and casts."),
        ("Stage 5 - Follow your taste", "Use genre labels in each card to branch into romance, sports, fantasy, horror, sci-fi or psychological stories."),
    ]
    for heading, body in road_map:
        story.extend([Paragraph(heading, styles["H2"]), Paragraph(body, styles["Body"]), Spacer(1, 0.08 * inch)])
    story.extend(
        [
            Spacer(1, 0.18 * inch),
            Paragraph("Before you press play", styles["H2"]),
            Paragraph(
                "Check GameCastle's watch-order pages for sequel order and use licensed services for regional availability. This PDF contains no streaming links and does not replace a current availability check.",
                styles["Body"],
            ),
            PageBreak(),
        ]
    )

    for index in range(0, len(anime), 2):
        page_number = index // 2 + 1
        story.append(Paragraph(f"Watchlist picks {index + 1}-{min(index + 2, len(anime))}", styles["H1"]))
        story.append(Paragraph(f"Catalog group {page_number} of 12", styles["Meta"]))
        story.append(Spacer(1, 0.14 * inch))
        story.append(anime_card(anime[index], styles))
        story.append(Spacer(1, 0.28 * inch))
        if index + 1 < len(anime):
            story.append(anime_card(anime[index + 1], styles))
        if index + 2 < len(anime):
            story.append(PageBreak())

    doc.build(story, onFirstPage=pdf_footer, onLaterPages=pdf_footer)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    return ImageFont.truetype(f"/usr/share/fonts/truetype/dejavu/{name}", size)


def fit_text(draw: ImageDraw.ImageDraw, text: str, max_width: int, start_size: int, bold: bool = False):
    size = start_size
    while size > 20:
        candidate = font(size, bold)
        if draw.textbbox((0, 0), text, font=candidate)[2] <= max_width:
            return candidate
        size -= 2
    return font(size, bold)


def build_infographic(anime: list[Anime]) -> None:
    width, height = 1800, 3200
    image = Image.new("RGB", (width, height), "#0b0a14")
    draw = ImageDraw.Draw(image)
    for y in range(height):
        mix = y / height
        color = (
            int(11 + 15 * mix),
            int(10 + 9 * mix),
            int(20 + 22 * mix),
        )
        draw.line((0, y, width, y), fill=color)
    draw.rounded_rectangle((80, 70, width - 80, 430), radius=38, fill="#171525", outline="#f04b75", width=4)
    draw.text((120, 112), "GAMECASTLE ANIME", font=font(34, True), fill="#56d9d1")
    draw.text((120, 170), "23 Must-Watch Starter Picks", font=font(72, True), fill="#ffffff")
    draw.text((120, 270), "Ranked by GameCastle editorial rating - 2026 catalog snapshot", font=font(31), fill="#c6c2d6")
    draw.text((120, 330), "Use the free CSV tracker to build your own ranking.", font=font(28), fill="#f6a8bd")

    ordered = sorted(anime, key=lambda item: (-item.rating, item.title.lower()))
    card_width = 770
    card_height = 178
    gap_x = 70
    gap_y = 24
    start_x = 95
    start_y = 500
    for index, item in enumerate(ordered):
        column = index // 12
        row = index % 12
        x = start_x + column * (card_width + gap_x)
        y = start_y + row * (card_height + gap_y)
        draw.rounded_rectangle((x, y, x + card_width, y + card_height), radius=24, fill="#171525", outline="#37324f", width=3)
        draw.rounded_rectangle((x + 20, y + 26, x + 102, y + 108), radius=20, fill="#f04b75")
        rank = str(index + 1)
        rank_font = font(38, True)
        rank_box = draw.textbbox((0, 0), rank, font=rank_font)
        draw.text((x + 61 - (rank_box[2] - rank_box[0]) / 2, y + 43), rank, font=rank_font, fill="#ffffff")
        title = safe_text(item.title)
        title_font = fit_text(draw, title, 530, 36, True)
        draw.text((x + 126, y + 25), title, font=title_font, fill="#ffffff")
        genre_text = " / ".join(g.replace("-", " ").title() for g in item.genres[:3])
        draw.text((x + 126, y + 82), safe_text(genre_text), font=font(22), fill="#aaa6bc")
        draw.text((x + 126, y + 127), f"{item.year}  |  {item.episodes} episodes", font=font(22), fill="#56d9d1")
        rating_text = f"{item.rating:.1f}"
        rating_font = font(34, True)
        box = draw.textbbox((0, 0), rating_text, font=rating_font)
        draw.text((x + card_width - 28 - (box[2] - box[0]), y + 124), rating_text, font=rating_font, fill="#f6c85f")

    footer_y = height - 150
    draw.line((95, footer_y - 30, width - 95, footer_y - 30), fill="#37324f", width=3)
    draw.text((95, footer_y), "Free PDF + tracker: gamecastle.store/resources", font=font(30, True), fill="#ffffff")
    draw.text((95, footer_y + 52), f"Snapshot: {SNAPSHOT_DATE}. Editorial ratings may be revised.", font=font(23), fill="#8f8ba0")
    image.quantize(colors=64, method=Image.Quantize.MEDIANCUT).save(
        OUTPUT / "top-50-anime-infographic.png",
        optimize=True,
    )


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    anime = load_anime()
    build_csv(anime)
    build_pdf(anime)
    build_infographic(anime)
    print(f"Generated {len(anime)} real catalog entries in {OUTPUT}")


if __name__ == "__main__":
    main()
