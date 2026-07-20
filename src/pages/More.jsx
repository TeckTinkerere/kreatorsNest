import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { MORE_LINKS_GUIDED } from '../config/navigation';
import { NAV_ICONS } from '../utils/navIcons';

const More = () => (
  <>
    <SEO
      title="More"
      description="More guided links and support resources for your freelance journey."
    />

    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 md:p-8 lg:p-12 max-w-[1200px] mx-auto min-h-screen"
    >
      <div className="mb-10 max-w-4xl">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-organic-charcoal mb-4 leading-tight tracking-tight">
          More
        </h1>
        <p className="text-lg md:text-xl text-organic-clay leading-relaxed max-w-3xl">
          Keep your momentum with practical next steps: find gigs, join communities, meet contributors, and share feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {MORE_LINKS_GUIDED.map((item) => {
          const Icon = NAV_ICONS[item.iconKey];
          return (
            <Link
              key={item.path}
              to={item.path}
              className="group flex items-center justify-between gap-4 rounded-2xl bg-white border border-organic-stone px-4 py-4 md:px-5 md:py-5 transition-all duration-200 hover:bg-organic-stone/20 hover:border-primary-200 hover:shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-organic-cream border border-organic-stone flex items-center justify-center text-organic-clay group-hover:text-organic-charcoal transition-colors">
                  {Icon ? <Icon size={18} /> : null}
                </div>
                <span className="text-base md:text-lg font-medium text-organic-charcoal truncate">
                  {item.label}
                </span>
              </div>

              <ArrowRight
                size={18}
                className="text-organic-clay group-hover:text-primary-700 group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          );
        })}
      </div>
    </motion.section>
  </>
);

export default More;
