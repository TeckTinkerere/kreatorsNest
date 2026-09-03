import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteOrigin } from '../utils/structuredData';

/**
 * SEO
 * Updates document title and meta/OG/Twitter tags for the current page.
 *
 * @param {object} props
 * @param {string} [props.title] - Page title (appended with " | KreatorNest").
 * @param {string} [props.description] - Meta description text.
 * @param {string} [props.ogImage] - URL for the Open Graph image.
 * @param {string} [props.ogType] - Open Graph type, default "website".
 * @param {object|object[]} [props.schema] - JSON-LD graph(s) to publish for this page.
 */
const SEO = ({ title, description, ogImage, ogType = 'website', schema }) => {
  const location = useLocation();

  useEffect(() => {
    const defaults = {
      title: 'KreatorNest - Creative Freelance Resource Hub',
      description:
        'Curated resources, tools, templates, and community for creative freelancers. Level up your freelance career with KreatorNest.',
      image: `${siteOrigin() || window.location.origin}/logomain.png`,
    };

    const pageTitle = title ? `${title} | KreatorNest` : defaults.title;
    const pageDesc = description || defaults.description;
    const pageImage = ogImage || defaults.image;
    // Prefer the configured public origin so canonicals stay correct on
    // preview deploys and any alternate domain the site is reachable at.
    const pageUrl = `${siteOrigin() || window.location.origin}${location.pathname}`;

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

  // JSON-LD is managed in its own effect and fully removed on unmount, so a
  // route change can never leave the previous page's graph behind — a stale
  // Article claim on a hub page is worse than no structured data at all.
  useEffect(() => {
    // Clear any graph already in the document. On a prerendered page the build
    // baked one in; appending ours on top would publish it twice.
    document
      .querySelectorAll('script[data-seo="kreatornest"]')
      .forEach((el) => el.remove());

    const graphs = (Array.isArray(schema) ? schema : [schema]).filter(Boolean);
    if (graphs.length === 0) return undefined;

    const nodes = graphs.map((graph) => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.dataset.seo = 'kreatornest';
      el.textContent = JSON.stringify(graph);
      document.head.appendChild(el);
      return el;
    });

    return () => nodes.forEach((el) => el.remove());
  }, [schema]);

  return null;
};

export default SEO;
