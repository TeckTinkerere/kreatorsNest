import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';
import { scenarioPosts } from '../data/scenarioPosts';

const ScenarioArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = scenarioPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="p-8 text-center min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif text-organic-charcoal mb-4">Article not found.</h2>
        <Link to="/scenarios" className="text-primary-600 hover:underline">← Back to Scenarios</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 md:p-8 lg:p-12 max-w-3xl mx-auto min-h-screen"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-organic-clay mb-10 mt-2">
        <button
          onClick={() => navigate('/scenarios')}
          className="font-semibold text-organic-charcoal hover:text-primary-600 transition-colors"
        >
          Scenarios
        </button>
        <span>/</span>
        <span className="text-organic-clay truncate">{post.title}</span>
      </nav>

      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs font-semibold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-organic-charcoal leading-tight tracking-tight mb-6">
          {post.title}
        </h1>

        <p className="text-lg md:text-xl text-organic-clay leading-relaxed mb-8 border-l-4 border-primary-300 pl-5 italic">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-5 text-sm text-organic-clay border-t border-b border-organic-stone py-4">
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-primary-500" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Tag size={14} className="text-primary-500" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-primary-500" />
            {post.readTime}
          </span>
        </div>
      </motion.div>

      {/* Article Body */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-6 pb-20"
      >
        {post.content.map((block, i) => {
          if (block.type === 'heading') {
            return (
              <h2 key={i} className="text-2xl font-serif text-organic-charcoal mt-10 mb-2">
                {block.text}
              </h2>
            );
          }
          if (block.type === 'tip') {
            return (
              <div key={i} className="bg-primary-50 border border-primary-200 rounded-2xl p-5 flex gap-4">
                <span className="text-primary-600 font-bold text-sm uppercase tracking-widest shrink-0 mt-0.5">Tip</span>
                <p className="text-organic-charcoal text-sm leading-relaxed">{block.text}</p>
              </div>
            );
          }
          return (
            <p key={i} className="text-organic-clay leading-relaxed text-base md:text-lg">
              {block.text}
            </p>
          );
        })}
      </motion.div>

      {/* Back link */}
      <div className="border-t border-organic-stone pt-8 pb-16">
        <button
          onClick={() => navigate('/scenarios')}
          className="flex items-center gap-2 text-sm font-semibold text-organic-charcoal hover:text-primary-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Scenarios
        </button>
      </div>
    </motion.div>
  );
};

export default ScenarioArticle;
