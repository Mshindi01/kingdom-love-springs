# Safeguarding rules for the website (non-negotiable)

Most of the people KLS serves are **minors**. The website must protect them.

1. **Names:** sponsored children appear by **first name only**, or a chosen alias. No surnames, ever.
2. **Location:** never publish a sponsored child's **school name, village/estate, or exact location**. Regions only ("Western Kenya").
3. **Photos:** use only photos marked `consent: true` in `src/data/photos.json` (guardian consent obtained by KLS). No photos of children in distress, partially dressed, or identifiable alongside personal details. Group photos at tournaments are preferred over individual portraits of sponsored children.
4. **Stories:** a child's story is published only with guardian consent and the child's assent where age-appropriate. Focus on growth and hope, not trauma details. No health, family-conflict or abuse details.
5. **Metadata:** strip EXIF/GPS from every image (the build does it via re-encoding in Part C; in Part A, export photos without metadata and run `tools/check.mjs`, which warns if EXIF GPS is found).
6. **No individual "sponsor this specific child" profiles on the public site.** Sponsorship enquiries are handled personally by KLS staff. Child profiles (if any) live only in the private Part C Studio.
7. **Forms:** never ask enquirers for information about children. Collect only what's needed from adults.
8. **The `/safeguarding/` page** states KLS's commitment and a contact for concerns [CONFIRM contact person].

`tools/check.mjs` enforces what it can: no `surname`/`school` fields in children/story data, consent flags on images used in pages, and no EXIF GPS.
