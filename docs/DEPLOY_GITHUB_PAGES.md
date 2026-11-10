# Deploying to GitHub Pages

> Status (2026-11-10): **not deployed yet.** The repo exists only locally, and the workflow's
> push trigger is commented out. Follow the steps below when you're ready.

## Work locally

```bash
npm install          # only installs lucide-static (dev tool for the icon sprite)
npm run dev          # build + watch + live reload → http://localhost:4000/kingdom-love-springs/
npm run build        # production build into dist/ (draft stories hidden)
npm run check        # links, alt text, meta, image sizes, hex colours, safeguarding
npm run icons        # rebuild src/assets/icons/sprite.svg after editing icons.json
npm run placeholders # regenerate placeholder SVGs + favicon from tokens.css
```

The site build itself needs **no** `npm install`: only Node (LTS).

## 1. Create the GitHub repo and push

1. On GitHub, create an empty repository, e.g. `kingdom-love-springs` (no README, no licence).
2. In this folder:
   ```bash
   git remote add origin https://github.com/<user>/kingdom-love-springs.git
   git push -u origin main
   ```
   The planning PDF, the biography `.docx` and `kingdom-love-springs-plan/` are git-ignored on purpose.

## 2. Turn on Pages

1. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Turn on deploy-on-push: in `.github/workflows/pages.yml`, uncomment
   ```yaml
   push:
     branches: [main]
   ```
   Commit and push. (Or leave it off and run it by hand: **Actions → Deploy to GitHub Pages → Run workflow**.)
3. When the run is green, the site is at `https://<user>.github.io/<repo>/`.

## 3. Base path and site URL

Every internal link and asset goes through `url()` / `asset()` (`src/lib/url.mjs`), using `basePath`.

- **In CI** the workflow passes the real values from `actions/configure-pages` (`SITE_URL`, `BASE_PATH`),
  so a different repo name or a custom domain just works.
- **Locally** they come from `src/data/site.json`:
  - `"basePath": "/kingdom-love-springs"`: must match the repo name for the github.io sub-path.
  - `"url": "https://<user>.github.io/kingdom-love-springs"`: the full public URL **including** the base path
    (used for the sitemap, canonical and Open Graph URLs). Replace `USERNAME`.

If you rename the repo, update `basePath` (and `url`) in `site.json` so `npm run dev` matches.

## 4. Custom domain (optional)

1. In `src/data/site.json` set:
   ```json
   "url": "https://www.example.org",
   "basePath": "",
   "customDomain": "www.example.org"
   ```
   The build then writes `dist/CNAME`.
2. DNS at your registrar:
   - **`www` subdomain** (recommended): a `CNAME` record `www → <user>.github.io`
   - **Apex** (`example.org`): `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     and `AAAA` records → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
3. Repo → Settings → Pages → **Custom domain**: enter the domain, wait for the DNS check, then tick **Enforce HTTPS**.
4. Verify the domain in your GitHub account settings (Pages → verified domains) to prevent takeovers.

### Switching basePath to `""`

Set `"basePath": ""` and `"url"` to the domain root. Nothing else changes: links are generated.
Run `npm run build && npm run check`; the check fails if any URL still assumes the old sub-path.

## 5. Going live (A5)

The preview is hidden from search engines (`site.json → seo.indexing: false` writes a `Disallow: /`
robots.txt and `noindex` on every page). Set it to `true` at launch.

## Later: cPanel (Part C)

URLs stay identical, so moving the domain from GitHub Pages to cPanel breaks nothing (see `LATER_BACKEND.md`).
