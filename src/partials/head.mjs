// @ts-check
import { html, raw } from '../lib/html.mjs';
import { url, asset, absoluteUrl } from '../lib/url.mjs';
import { isUnconfirmed } from '../lib/format.mjs';

/**
 * Structured data (one @graph): `NGO` on every page, `BreadcrumbList` on inner pages, `Article`
 * when meta.article is set (story pages), plus anything from meta.jsonLd(ctx).
 * Rendered as data, not script code; "<" is escaped so the JSON can't close the element.
 * @param {import('../../tools/build.mjs').RenderContext} ctx
 */
function jsonLd(ctx) {
  const { site, page } = ctx;
  if (page.isNotFound) return '';
  const abs = (/** @type {string} */ p) => absoluteUrl(site.url, p);
  /** @type {any[]} */
  const graph = [
    {
      '@type': 'NGO',
      '@id': abs('/#organization'),
      name: site.name,
      description: site.mission,
      url: abs('/'),
      logo: abs('/assets/images/og-default.png'),
      areaServed: { '@type': 'Country', name: 'Kenya' },
      // [CONFIRM] social profiles: only confirmed URLs are listed
      sameAs: (site.socials || []).map((/** @type {any} */ s) => s.url).filter((/** @type {string} */ u) => u && !isUnconfirmed(u)),
    },
  ];
  if (page.path !== '/') {
    const crumbs = [{ name: 'Home', path: '/' }];
    if (page.path.startsWith('/stories/') && page.path !== '/stories/') crumbs.push({ name: 'Stories', path: '/stories/' });
    crumbs.push({ name: page.meta.title, path: page.path });
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
    });
  }
  const article = /** @type {any} */ (page.meta).article;
  if (article) {
    graph.push({
      '@type': 'Article',
      headline: page.meta.title,
      description: page.meta.description,
      datePublished: article.date,
      author: { '@type': 'Organization', name: article.author || site.name },
      publisher: { '@id': abs('/#organization') },
      mainEntityOfPage: abs(page.path),
      image: abs(page.meta.ogImage || site.seo?.defaultOgImage || '/assets/images/og-default.png'),
    });
  }
  const extra = /** @type {any} */ (page.meta).jsonLd;
  if (typeof extra === 'function') graph.push(extra(ctx));
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return raw(`<script type="application/ld+json">${json}</script>`);
}

/**
 * <head> contents.
 * @param {import('../../tools/build.mjs').RenderContext} ctx
 */
export function head(ctx) {
  const { site, page, env } = ctx;
  const title = page.path === '/' ? `${site.name}: ${site.tagline}` : `${page.meta.title} · ${site.name}`;
  const canonical = absoluteUrl(site.url, page.path);
  const ogImage = page.meta.ogImage || site.seo?.defaultOgImage || null;
  const noindex = !site.seo?.indexing || page.meta.noindex;

  return html`
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${page.meta.description}">
    ${noindex ? html`<meta name="robots" content="noindex, nofollow">` : ''}
    ${page.isNotFound ? '' : html`<link rel="canonical" href="${canonical}">`}
    <meta name="theme-color" content="${ctx.tokens['--forest-900']}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${site.name}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${page.meta.description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:locale" content="${site.locale}">
    ${ogImage ? html`<meta property="og:image" content="${absoluteUrl(site.url, ogImage)}">` : ''}
    <meta name="twitter:card" content="${ogImage ? 'summary_large_image' : 'summary'}">
    ${ogImage ? html`<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${site.name}: ${site.tagline}">` : ''}
    ${jsonLd(ctx)}
    <link rel="icon" href="${asset('images/favicon.svg')}" type="image/svg+xml">
    <link rel="preload" href="${url('/assets/fonts/GeneralSans-Regular.woff2')}" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="${url('/assets/fonts/GeneralSans-Medium.woff2')}" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${asset('css/main.css')}">
    <noscript><style>
      @media (width < 64rem) {
        .site-header__inner { flex-wrap: wrap; padding-block: 1rem; }
        .site-nav { display: block; order: 3; flex-basis: 100%; }
        .menu-toggle { display: none !important; }
      }
      .js-only { display: none !important; }
    </style></noscript>
    ${page.meta.motion
      ? html`
    <script defer src="${asset('vendor/gsap/gsap.min.js')}"></script>`
      : ''}
    <script type="module" src="${asset('js/main.js')}"></script>
    ${env.dev ? raw(`<script type="module" src="${url('/__livereload.js')}"></script>`) : ''}
  `;
}
