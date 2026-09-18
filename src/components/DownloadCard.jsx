import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { EVENTS, trackEvent } from '../utils/analytics';

/**
 * DownloadCard
 * Displays a downloadable document template with metadata and a download CTA.
 *
 * @param {object} props
 * @param {object} props.doc - Document entry from downloadsData.
 * @param {boolean} [props.showHiddenGem=false] - Show "Hidden gem" badge for hidden-gem tier items.
 */
const DownloadCard = ({ doc, showHiddenGem = false }) => {
  const [downloaded, setDownloaded] = useState(false);

  /**
   * handleDownload
   * Triggers browser-native download for the .txt template file.
   */
  const handleDownload = () => {
    trackEvent(EVENTS.TEMPLATE_DOWNLOAD, { title: doc.title, category: doc.category });

    const link = document.createElement('a');
    link.href = doc.txtFile;
    link.download = doc.txtFile.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group flex flex-col bg-white border border-organic-stone rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 noise-bg opacity-10 pointer-events-none z-0" />

      {showHiddenGem && doc.tier === 'hidden-gem' && (
        <span className="absolute top-4 right-4 z-20 text-[10px] font-semibold uppercase tracking-wide text-primary-700 bg-primary-50 border border-primary-100 px-2 py-1 rounded-full">
          Hidden gem
        </span>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-organic-cream border border-organic-stone shadow-sm group-hover:scale-110 transition-transform duration-400 text-2xl select-none">
            {doc.icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
            {doc.category}
          </span>
        </div>

        <div className="flex-1 mb-5">
          <h3 className="font-sans font-bold text-lg text-organic-charcoal group-hover:text-primary-600 transition-colors duration-300 leading-tight mb-2">
            {doc.title}
          </h3>
          <p className="text-sm text-organic-clay leading-relaxed">
            {doc.description}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-organic-stone/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {doc.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-organic-clay bg-organic-cream px-2 py-1 rounded border border-organic-stone/30"
              >
                {tag}
              </span>
            ))}
          </div>

          <button
            onClick={handleDownload}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              downloaded
                ? 'bg-green-600 text-white'
                : 'bg-primary-700 hover:bg-primary-800 text-white'
            }`}
            aria-label={`Download ${doc.title} as editable text file`}
          >
            {downloaded ? (
              <>
                <span>✓</span>
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download size={14} className="shrink-0" />
                <span>Download .txt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DownloadCard;
