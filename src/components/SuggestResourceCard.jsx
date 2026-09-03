import { motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SUGGEST_FORM_URL, isSuggestEnabled } from '../config/contribute';
import { EVENTS, trackEvent } from '../utils/analytics';

/**
 * SuggestResourceCard
 * Invites a visitor to add a resource, sized to sit in a resource grid as the
 * final card so contributing reads as part of browsing rather than a buried
 * link in a footer.
 *
 * Renders nothing when no form is configured, so the grid is never left with a
 * dead call to action.
 *
 * @param {object} props
 * @param {string} [props.context] - Where the card was shown, recorded with the click.
 * @param {'card'|'inline'} [props.variant='card'] - Grid card, or a slim inline row.
 */
const SuggestResourceCard = ({ context = 'unknown', variant = 'card' }) => {
  const shouldReduceMotion = useReducedMotion();

  if (!isSuggestEnabled()) return null;

  const handleClick = () => {
    trackEvent(EVENTS.SUGGEST_OPEN, { context });
  };

  if (variant === 'inline') {
    return (
      <a
        href={SUGGEST_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 underline underline-offset-4 decoration-primary-200 hover:decoration-primary-500 transition-colors"
      >
        <Plus size={15} className="shrink-0" />
        <span>Know something that belongs here? Add it</span>
      </a>
    );
  }

  return (
    <motion.a
      href={SUGGEST_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group flex flex-col justify-center items-center text-center gap-3 min-w-[280px] min-h-[280px] p-8 rounded-2xl border-2 border-dashed border-organic-stone hover:border-primary-400 bg-organic-cream/40 hover:bg-primary-50/50 transition-colors duration-300"
    >
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-organic-stone shadow-sm group-hover:scale-110 group-hover:border-primary-300 transition-all duration-500">
        <Plus size={22} className="text-primary-600" />
      </span>
      <span className="font-sans font-bold text-lg text-organic-charcoal group-hover:text-primary-700 transition-colors">
        Add a resource
      </span>
      <span className="text-sm text-organic-clay leading-relaxed max-w-[26ch]">
        Found something that helped you? Share it and it goes out to everyone else.
      </span>
    </motion.a>
  );
};

export default SuggestResourceCard;
