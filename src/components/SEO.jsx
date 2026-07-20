import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO
 * Updates document title and meta/OG/Twitter tags for the current page.
 *
 * @param {object} props
 * @param {string} [props.title] - Page title (appended with " | KreatorNest").
 * @param {string} [props.description] - Meta description text.
 * @param {string} [props.ogImage] - URL for the Open Graph image.
 * @param {string} [props.ogType] - Open Graph type, default "website".
 */
const SEO = ({ title, description, ogImage, ogType = 'website' }) => {
  const location = useLocation();

  useEffect(() => {
    const defaults = {
      title: 'KreatorNest - Creative Freelance Resource Hub',
      description:
        'Curated resources, tools, templates, and community for creative freelancers. Level up your freelance career with KreatorNest.',
      image: `${window.location.origin}/logomain.png`,
    };

    const pageTitle = title ? `${title} | KreatorNest` : defaults.title;
    const pageDesc = description || defaults.description;
    const pageImage = ogImage || defaults.image;
    const pageUrl = `${window.location.origin}${location.pathname}`;

    document.title = pageTitle;

    const setMeta = (attr, value, key = 'name') => {
      const selector = `meta[${key}="${attr}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(key, attr);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    setMeta('description', pageDesc);
    setLink('canonical', pageUrl);

    setMeta('og:title', pageTitle, 'property');
    setMeta('og:description', pageDesc, 'property');
    setMeta('og:type', ogType, 'property');
    setMeta('og:image', pageImage, 'property');
    setMeta('og:url', pageUrl, 'property');

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', pageDesc);
    setMeta('twitter:image', pageImage);
  }, [title, description, ogImage, ogType, location.pathname]);

  return null;
};

export default SEO;
