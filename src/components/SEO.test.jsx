import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SEO from './SEO';

const renderSEO = (props = {}) =>
  render(
    <MemoryRouter initialEntries={['/documents']}>
      <SEO title="Documents" description="Test description for documents page." {...props} />
    </MemoryRouter>
  );

describe('SEO', () => {
  beforeEach(() => {
    document.head.querySelectorAll('meta[data-seo-test]').forEach((el) => el.remove());
    document.querySelector('link[rel="canonical"]')?.remove();
  });

  it('sets document title with KreatorNest suffix', () => {
    renderSEO();
    expect(document.title).toBe('Documents | KreatorNest');
  });

  it('sets description meta tag', () => {
    renderSEO();
    const desc = document.querySelector('meta[name="description"]');
    expect(desc).toHaveAttribute('content', 'Test description for documents page.');
  });

  it('sets og tags with property attribute', () => {
    renderSEO();
    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle).toHaveAttribute('content', 'Documents | KreatorNest');
  });

  it('sets twitter tags with name attribute', () => {
    renderSEO();
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
    expect(document.querySelector('meta[property="twitter:card"]')).toBeNull();
  });

  it('sets canonical link', () => {
    renderSEO();
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical).toHaveAttribute('href', expect.stringContaining('/documents'));
  });
});
