import { motion, useReducedMotion } from 'framer-motion';
import { layoutSpring } from '../utils/motion';

/**
 * CategoryFilter
 * Renders a horizontal scrollable row of category buttons with a sliding active pill.
 *
 * @param {object} props
 * @param {string[]} props.categories - List of category names to display.
 * @param {string} props.activeCategory - Currently selected category.
 * @param {(cat: string) => void} props.setActiveCategory - Callback invoked when a category is clicked.
 * @param {string} [props.layoutGroupId='category-pill'] - Unique layoutId namespace per page instance.
 */
const CategoryFilter = ({
  categories,
  activeCategory,
  setActiveCategory,
  layoutGroupId = 'category-pill',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const spring = layoutSpring(shouldReduceMotion);

  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-2 py-4">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <motion.button
            key={cat}
            type="button"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            onClick={() => setActiveCategory(cat)}
            className={`relative whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium border ${
              isActive
                ? 'text-white border-transparent'
                : 'bg-white text-organic-charcoal hover:bg-organic-stone/30 border-organic-stone'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={layoutGroupId}
                className="absolute inset-0 rounded-full bg-organic-charcoal shadow-md"
                transition={spring}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
