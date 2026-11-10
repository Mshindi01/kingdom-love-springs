// @ts-check
/** Home §9: quote band with a verse (translation [CONFIRM]) and the script line "light & salt". */
import { quoteBand } from './bands.mjs';
import { isUnconfirmed } from '../../lib/format.mjs';

/**
 * @param {import('../../../tools/build.mjs').RenderContext} _ctx
 * @param {any} s
 */
export default function homeQuote(_ctx, s) {
  if (!s.text || isUnconfirmed(s.text)) return '';
  return quoteBand({
    id: 'home-quote-title',
    quote: s.text,
    cite: s.reference,
    citeDetail: s.translation || undefined,
    script: s.script,
  });
}
