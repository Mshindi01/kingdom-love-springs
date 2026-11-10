# Part C: cPanel + Studio CMS (technical design, for later)

> **Don't build any of this during Part A.** Part A is shaped so this migration is smooth: same URLs, partials that map to PHP views, and JSON data that seeds the database.

## 1. Stack
- **PHP 8.1+** (no framework, no Composer), **MySQL/MariaDB** via PDO, **vanilla JS** Studio, **cPanel Cron Jobs**, **PHPMailer** (vendored) for email, Lucide + GSAP as before.
- The code lives outside `public_html` (`/home/<user>/kls-app/`). Only `public/` is uploaded to `public_html/`.
- The same security baseline as our other cPanel builds: prepared statements, `e()` escaping, CSRF, hashed passwords + login throttling, an HTML allow-list sanitizer, GD re-encoding of uploads (which strips EXIF/GPS: a safeguarding win), rate limits + honeypots on public forms, a CSP, and secrets outside the web root.

## 2. Migration from Part A
| Part A | Part C |
|---|---|
| `src/partials/*.mjs` | `app/templates/site/partials/*.php` (1:1, the same class names and markup) |
| `src/pages/*.page.mjs` | `app/templates/site/*.php` + controllers |
| `src/data/*.json` | Database tables. `bin/import-part-a.php` reads the JSON files and seeds them |
| WhatsApp/email form composers | `POST /api/<form>` endpoints. WhatsApp kept as an optional quick link |
| `url()` base path | `url()` helper in PHP (same behaviour) |
| GitHub Actions deploy | A release zip + cPanel File Manager upload (GitHub remains the code home) |

URLs stay identical (`/about/`, `/stories/<slug>/` …), so moving the domain from GitHub Pages to cPanel breaks nothing.

## 3. Database (outline)
`users`, `pages` (sections JSON), `programmes`, `stories` (blocks JSON, consent flags, status), `photos` (consent, consent_note, people_visible, minors_visible, alt, focal), `stats`, `team`, `partners`, `faqs`, `regions`, `events` (tournaments & clinics), `enquiries` (type `sponsor|volunteer|partner|prayer|contact|tournament`, status pipeline, notes, assigned_to), `subscribers` + `letters` + `email_queue` (newsletter), `children` (**private, Studio-only**: first name/alias, age band, region, school level, sponsor link; never exposed to public routes; restricted to admin roles), `settings`, `audit_log`, `rate_limits`.

## 4. Studio CMS (C2)
- Plain-language, big-button UX (our Her Quiet Place Studio principles): Home sections, pages, programmes, stories (block editor: paragraph, heading, photo, quote, verse, list, button, video), impact numbers, team, partners, FAQs, events, and a photo library with **mandatory consent fields** before a photo can be used publicly.
- Roles: `admin` (everything), `editor` (content), `pastoral` (enquiries + children records).
- Autosave, previews, revisions, "Recently removed".

## 5. Enquiries & sponsor pipeline (C3)
- Sponsor enquiry → `enquiries` (New → Contacted → Meeting → Sponsoring / Not now), an email notification to staff, an auto-reply to the enquirer, notes, and an assignee.
- Optional matching to a private child record (admin/pastoral only). Sponsor updates are sent personally (not public).
- Data protection: consent text stored, delete-on-request, retention settings, and exports for staff.

## 6. Newsletter (C4)
Double opt-in, welcome email, one-click unsubscribe (+ `List-Unsubscribe` headers), letters built from stories, batched sending under the host's hourly limit via cron, and a progress view.

## 7. Online giving (C5, optional)
Choose in Part B: **M-Pesa Daraja** (STK Push + callback, Paybill/Till), **Paystack/Flutterwave** (cards + M-Pesa, recurring), or an external **PayPal/Givebutter** link for the diaspora. Requires KLS's registered entity, business accounts and API credentials. Webhook verification, idempotent transaction records, receipts by email, and a recurring "sponsor monthly" option.

## 8. Launch (C6)
A security review, a cPanel deploy guide (DB, files, config, installer, cron, Email Deliverability SPF/DKIM/DMARC, SSL), the DNS move from GitHub Pages, 301s if any URL changed, backups, a staff handover guide, and a usability session.
