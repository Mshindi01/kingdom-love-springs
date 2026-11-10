// @ts-check
/**
 * Home (A3): every section comes from data/home.json (order, visibility, copy, image refs),
 * rendered by one partial per section in partials/sections/home-*.mjs. Client changes in
 * Part B are data edits.
 */
import { html } from '../lib/html.mjs';
import { absoluteUrl } from '../lib/url.mjs';
import { isUnconfirmed } from '../lib/format.mjs';
import homeHero from '../partials/sections/home-hero.mjs';
import homeWhatWeDo from '../partials/sections/home-what-we-do.mjs';
import homeImpact from '../partials/sections/home-impact.mjs';
import homeEducation from '../partials/sections/home-education.mjs';
import homeNumbers from '../partials/sections/home-numbers.mjs';
import homeSports from '../partials/sections/home-sports.mjs';
import homeStories from '../partials/sections/home-stories.mjs';
import homeHelp from '../partials/sections/home-help.mjs';
import homeQuote from '../partials/sections/home-quote.mjs';
import homeMap from '../partials/sections/home-map.mjs';
import homeNewsletter from '../partials/sections/home-newsletter.mjs';

/** section id in home.json → renderer */
const SECTIONS = /** @type {Record<string, (ctx: any, s: any) => unknown>} */ ({
  hero: homeHero,
  'what-we-do': homeWhatWeDo,
  'impact-bento': homeImpact,
  education: homeEducation,
  'numbers-band': homeNumbers,
  sports: homeSports,
  stories: homeStories,
  help: homeHelp,
  quote: homeQuote,
  map: homeMap,
  newsletter: homeNewsletter,
});

export const meta = {
  title: 'Home',
  description:
    'Kingdom Love Springs helps children and youth from vulnerable communities across Kenya thrive in school, in life and in faith, through education sponsorship, football and mentorship.',
  path: '/',
  motion: true,
  header: /** @type {const} */ ('overlay'),
  /** @param {import('../../tools/build.mjs').RenderContext} ctx */
  jsonLd: (ctx) => ({
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: ctx.site.name,
    description: ctx.site.mission,
    url: absoluteUrl(ctx.site.url, '/'),
    logo: absoluteUrl(ctx.site.url, '/assets/images/og-default.png'),
    areaServed: { '@type': 'Country', name: 'Kenya' },
    // [CONFIRM] social profiles: only confirmed URLs are listed
    sameAs: (ctx.site.socials || []).map((/** @type {any} */ s) => s.url).filter((/** @type {string} */ u) => u && !isUnconfirmed(u)),
  }),
};

/** @param {import('../../tools/build.mjs').RenderContext} ctx */
export function render(ctx) {
  const sections = ctx.data.home.sections.filter((/** @type {any} */ s) => s.visible !== false);
  return html`${sections.map((/** @type {any} */ s) => {
    const renderSection = SECTIONS[s.id];
    if (!renderSection) throw new Error(`home.json: unknown section "${s.id}"`);
    return renderSection(ctx, s);
  })}`;
}
