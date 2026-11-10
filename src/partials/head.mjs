// @ts-check
import { html, raw } from '../lib/html.mjs';
import { url, asset, absoluteUrl } from '../lib/url.mjs';

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
    <link rel="icon" href="${asset('images/favicon.svg')}" type="image/svg+xml">
    <link rel="preload" href="${url('/assets/fonts/GeneralSans-Regular.woff2')}" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="${url('/assets/fonts/GeneralSans-Medium.woff2')}" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${asset('css/main.css')}">
    ${page.meta.motion
      ? html`
    <script defer src="${asset('vendor/gsap/gsap.min.js')}"></script>
    <script defer src="${asset('vendor/gsap/ScrollTrigger.min.js')}"></script>`
      : ''}
    <script type="module" src="${asset('js/main.js')}"></script>
    ${env.dev ? raw(`<script type="module" src="${url('/__livereload.js')}"></script>`) : ''}
  `;
}
