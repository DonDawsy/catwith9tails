# A Cat With 9 Tales

Static bilingual portfolio site for storyteller **Neha Verma**.

## Structure

- `index.html` - single-page site with anchor navigation.
- `assets/css/styles.css` - design tokens, layout, typography, motion, responsive behavior.
- `assets/js/content.js` - bilingual copy and portfolio item data.
- `assets/js/app.js` - language toggle, dynamic rendering, active nav state, reveal animation, mobile menu.
- `images/` - original source photos (including `.heic`).
- `assets/images/optimized/` - web-ready generated assets (`.jpg` + `.webp`) and `manifest.csv`.
- `scripts/prepare-images.sh` - image conversion pipeline.

## Run Locally

From the project root:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Image Pipeline

Generate optimized images from originals:

```bash
./scripts/prepare-images.sh
```

Optional environment variables:

```bash
MAX_SIZE=2200 WEBP_QUALITY=82 JPG_FORMAT_OPTIONS=best ./scripts/prepare-images.sh
```

What the script does:

- Keeps originals in `images/` untouched.
- Rebuilds `assets/images/optimized/` on each run.
- Converts all source files to optimized `.jpg`.
- Creates `.webp` copies via `cwebp`.
- Writes `assets/images/optimized/manifest.csv` for traceability.

## Editing Content

- Update text in `assets/js/content.js` under `translations.en` and `translations.no`.
- Update gallery metadata in `portfolioItems`.
- Keep `srcBase` aligned with filenames generated in `assets/images/optimized/`.

## Deployment

Deploy as a plain static site folder to any generic static host (Netlify, Vercel static, GitHub Pages root, S3, etc.).
