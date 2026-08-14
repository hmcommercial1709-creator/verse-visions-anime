# GameCastle downloadable resources

These files are generated from the real anime records in `src/data/animes.ts`:

- `ultimate-anime-watchlist-2026.pdf` — a 15-page, spoiler-light roadmap covering 23 catalog titles.
- `anime-tracker-template.csv` — an editable tracker prefilled with the same 23 titles.
- `top-50-anime-infographic.png` — a legacy-stable filename containing the current 23-title, 1800 × 3200 starter-picks infographic.

The snapshot date and editorial-rating disclaimer appear inside the visual resources. Ongoing episode totals can change and must not be presented as permanently fixed.

Regenerate all three files from the repository root with:

```bash
python3 scripts/generate-download-resources.py
```
