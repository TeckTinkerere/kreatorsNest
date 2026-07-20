import { motion } from 'framer-motion';
import { ICON_MAP } from '../utils/iconMap';

/**
 * ResourceCard
 * Displays a single resource as a styled card with icon, tags, and an explore link.
 *
 * @param {object} props
 * @param {object} props.resource - Resource data object.
 * @param {string} props.resource.icon - Lucide icon name (must be in ICON_MAP) or emoji string.
 * @param {string} props.resource.type - Resource type (e.g. "Learning", "Scenarios").
 * @param {string} props.resource.category - Resource category label.
 * @param {string} props.resource.title - Resource title.
 * @param {string} props.resource.description - Short description text.
 * @param {string[]} props.resource.tags - List of tag strings.
 * @param {string} props.resource.link - External URL for the resource.
 * @param {(category: string) => void} [props.onInteract] - Optional callback fired when the explore link is clicked.
 * @param {'full'|'compact'} [props.variant='full'] - Card layout variant; compact hides badge, category, and tags.
 */
const ResourceCard = ({ resource, onInteract, variant = 'full' }) => {
  const isCompact = variant === 'compact';
  /**
   * handleLinkClick
   * Calls onInteract with the resource category when the explore link is clicked.
   */
  const handleLinkClick = () => {
    if (onInteract) onInteract(resource.category);
  };

  const isEditorial = resource.type === 'Learning' || resource.type === 'Scenarios';

  // Resolve icon from the explicit map; fall back to rendering as an emoji string.
  // Using ICON_MAP instead of `import * as LucideIcons` keeps the bundle lean —
  // only the icons actually used in resourceData are included.
  const IconComponent = typeof resource.icon === 'string'
    ? ICON_MAP[resource.icon] ?? null
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`group flex flex-col relative overflow-hidden bg-white border border-organic-stone shadow-sm hover:shadow-md transition-shadow duration-500 min-w-[280px]
        ${isCompact
          ? 'rounded-2xl p-6 min-h-[200px]'
          : isEditorial
            ? 'rounded-tl-3xl rounded-br-3xl rounded-tr-xl rounded-bl-xl p-8 min-h-[320px]'
            : 'rounded-2xl p-6 min-h-[280px]'
        }
      `}
    >
      {/* Organic texture overlay */}
      <div className="absolute inset-0 noise-bg z-0 opacity-20"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Header area */}
        <div className="flex items-start justify-between mb-5 select-none">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-organic-cream border border-organic-stone shadow-sm group-hover:scale-110 transition-transform duration-500">
            {IconComponent
              ? <IconComponent size={22} className="text-primary-600" />
              : <span className="text-2xl">{resource.icon}</span>
            }
          </div>
          {!isCompact && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
              {resource.type}
            </span>
          )}
        </div>

        {/* Content area */}
        <div className="mb-4">
          {!isCompact && (
            <p className="text-xs font-semibold tracking-wide text-organic-clay uppercase mb-1.5">{resource.category}</p>
          )}
          <h3 className={`${isEditorial && !isCompact ? 'font-serif text-2xl mb-3' : 'font-sans font-bold text-lg mb-2'} text-organic-charcoal group-hover:text-primary-600 transition-colors duration-300 leading-tight`}>
            {resource.title}
          </h3>
          <p className={`text-sm text-organic-clay flex-grow leading-relaxed break-words${isCompact ? ' line-clamp-1' : ''}`}>
            {resource.description}
          </p>
        </div>

        {/* Footer Area */}
        <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-organic-stone/50">
          {!isCompact && (
            <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
              {resource.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[11px] font-medium text-organic-clay bg-organic-cream px-2 py-1 rounded border border-organic-stone/30 truncate max-w-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="flex-shrink-0 text-sm font-semibold text-white bg-primary-700 hover:bg-primary-800 px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>Explore</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourceCard;
