# Images & performance

## Adding a real photo (until the Part C CMS)

`cwebp`/`avifenc` aren't installed on the build machine, so images are prepared by hand with
**Squoosh** (https://squoosh.app, free, runs in the browser; nothing is uploaded).

1. **Consent first.** Only photos with guardian consent recorded by KLS (SAFEGUARDING §3). Prefer group
   photos at tournaments; never children in distress.
2. **Strip metadata.** Squoosh re-encodes the image, which removes EXIF/GPS. (`npm run check` warns if
   any JPEG still has GPS data.)
3. **Export three widths as WebP** (quality ~75): 640, 1280 and 1920 px wide. Hero photos must be
   **≤ 250 KB** at 1920; everything else ≤ 150 KB. The check fails any image over 300 KB.
4. Save to `src/assets/images/photos/`, e.g. `tournament-coast-640.webp`, `-1280.webp`, `-1920.webp`.
5. **Register it** in `src/data/photos.json`:
   ```json
   {
     "id": "tournament-coast",
     "file": "photos/tournament-coast-1280.webp",
     "srcset": [
       { "file": "photos/tournament-coast-640.webp", "width": 640 },
       { "file": "photos/tournament-coast-1280.webp", "width": 1280 },
       { "file": "photos/tournament-coast-1920.webp", "width": 1920 }
     ],
     "width": 1920, "height": 1200,
     "alt": "Young footballers celebrating a goal at a tournament on the Coast",
     "consent": true,
     "consentNote": "Guardian consent forms held by KLS, tournament March 2027",
     "childrenVisible": true
   }
   ```
6. Use it by id where a `{ "photo": null, "placeholder": … }` ref appears in `home.json` / `pages.json`
   (e.g. `"image": { "photo": "tournament-coast" }`). `media()` refuses any photo without `consent: true`.

(An `ffmpeg` command can also produce WebP if preferred: `ffmpeg -i in.jpg -vf scale=1280:-2 -map_metadata -1 -c:v libwebp -quality 75 out-1280.webp`.)

## Performance setup

- One CSS file (bundled + minified, ~11 KB gzipped). JS modules versioned and loaded as ES modules.
- **GSAP only** (deferred, motion pages only). ScrollTrigger was removed in A4: IntersectionObserver
  + a small scrub helper do the same job without a page-wide measuring pass.
- Fonts self-hosted, `font-display: swap`; General Sans 400 + 500 preloaded. (Subsetting needs a
  local font tool, which isn't installed. The Latin General Sans files are ~24 KB each.)
- No layout shift: images have width/height; the no-JS header lives in `<noscript>`.

## Page weight (mobile, production build, gzip; 11 Nov 2026)

Transfer sizes in KB. Images are SVG placeholders; real WebP photos will add roughly 60–250 KB per
page (hero ≤ 250 KB), which is why the budget matters.

| Page | Perf | A11y | LCP | TBT | Total | HTML | CSS | JS | Fonts | Images | Requests |
|---|---|---|---|---|---|---|---|---|---|---|---|
| / | 91–96 | 100 | 2.3–2.9 s | 100–280 ms | 185 | 8 | 14 | 52 | 105 | 3 | 33 |
| /about/ | 95 | 100 | 2.6 s | 120 ms | 172 | 4 | 14 | 44 | 105 | 1 | 23 |
| /education/ | 96 | 100 | 2.5 s | 80 ms | 176 | 5 | 14 | 46 | 105 | 2 | 26 |
| /sports/ | 94 | 100 | 2.7 s | 140 ms | 176 | 6 | 14 | 47 | 105 | 1 | 26 |
| /mentorship/ | 97 | 100 | 2.2 s | 130 ms | 175 | 5 | 14 | 46 | 105 | 2 | 26 |
| /stories/ | 99 | 100 | 1.8 s | 0 ms | 171 | 4 | 14 | 44 | 105 | 0 | 22 |
| /stories/tag/education/ | 100 | 100 | 1.7 s | 10 ms | 134 | 3 | 14 | 43 | 71 | 0 | 20 |
| /get-involved/ | 99 | 100 | 1.8 s | 60 ms | 172 | 6 | 14 | 44 | 105 | 0 | 22 |
| /contact/ | 99 | 100 | 2.0 s | 10 ms | 171 | 5 | 14 | 44 | 105 | 0 | 22 |
| /safeguarding/ | 98 | 100 | 2.0 s | 120 ms | 135 | 4 | 14 | 43 | 71 | 0 | 20 |
| /privacy/ | 99 | 100 | 1.8 s | 0 ms | 103 | 4 | 14 | 11 | 71 | 0 | 16 |
| /sponsor/ | 95 | 100 | 2.3 s | 180 ms | 173 | 6 | 14 | 44 | 105 | 1 | 23 |
| /styleguide/ (internal) | 70 | 100 | 2.8 s | 1.1 s | 192 | 20 | 14 | 50 | 105 | 0 | 28 |

Best practices 100 everywhere. SEO scores (63–66) are low **only** because the preview is
intentionally `noindex` (`site.seo.indexing: false`); flip it at launch.
Lighthouse runs on this machine vary by ±5 points between runs; Home was measured several times.
