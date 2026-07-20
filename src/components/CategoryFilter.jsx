import { motion } from 'framer-motion';

/**
 * CategoryFilter
 * Renders a horizontal scrollable row of category buttons.
 *
 * @param {object} props
 * @param {string[]} props.categories - List of category names to display.
 * @param {string} props.activeCategory - Currently selected category.
 * @param {(cat: string) => void} props.setActiveCategory - Callback invoked when a category is clicked.
 */
const CategoryFilter = ({ categories, activeCategory, setActiveCategory }) => {
  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-2 py-4">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveCategory(cat)}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            activeCategory === cat
              ? "bg-organic-charcoal text-white shadow-md border-transparent"
              : "bg-white text-organic-charcoal hover:bg-organic-stone/30 border border-organic-stone"
          }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
