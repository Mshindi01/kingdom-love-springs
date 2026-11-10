// @ts-check
/** Home §1: full-bleed photo hero (split | centered), script line across the headline, float card + badges. */
import { photoHero } from './media-blocks.mjs';
import { floatCard } from '../cards.mjs';
import { scriptLine } from '../script-line.mjs';
import { imageRef } from '../motifs.mjs';

/**
 * @param {import('../../../tools/build.mjs').RenderContext} ctx
 * @param {any} s section from home.json
 */
export default function homeHero(ctx, s) {
  return photoHero({
    layout: s.layout === 'centered' ? 'centered' : 'split',
    lines: s.lines,
    subline: s.subline,
    media: imageRef(ctx, s.image, { priority: true, sizes: '100vw', fallback: 'hero' }),
    // aria-hidden: the same words are in the headline
    script: scriptLine({ text: s.script, swoosh: 'rise', size: 'hero', color: 'sun' }),
    buttons: s.buttons.map((/** @type {any} */ b) => ({ label: b.label, href: b.path, icon: b.icon, variant: b.variant })),
    badges: s.badges,
    floatCard: s.floatCard
      ? floatCard({
          eyebrow: s.floatCard.eyebrow,
          meta: s.floatCard.meta,
          title: s.floatCard.title,
          text: s.floatCard.text,
          cta: { label: s.floatCard.button.label, href: s.floatCard.button.path },
        })
      : '',
  });
}
