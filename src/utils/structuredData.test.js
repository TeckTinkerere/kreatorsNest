import {
  absoluteUrl,
  articleSchema,
  breadcrumbSchema,
  collectionSchema,
  organization,
  parseDate,
  siteOrigin,
  websiteSchema,
} from './structuredData';

const ORIGIN = 'https://kreatornest.test';

beforeEach(() => {
  process.env.REACT_APP_SITE_URL = ORIGIN;
});

afterEach(() => {
  delete process.env.REACT_APP_SITE_URL;
});

describe('siteOrigin', () => {
  it('uses the configured origin and strips a trailing slash', () => {
    process.env.REACT_APP_SITE_URL = `${ORIGIN}/`;
    expect(siteOrigin()).toBe(ORIGIN);
  });

  it('falls back to the running origin when unconfigured', () => {
    delete process.env.REACT_APP_SITE_URL;
    expect(siteOrigin()).toBe(window.location.origin);
  });
});

describe('absoluteUrl', () => {
  it('joins a site path onto the origin', () => {
    expect(absoluteUrl('/scenarios/pricing')).toBe(`${ORIGIN}/scenarios/pricing`);
  });
});

describe('parseDate', () => {
  it('converts a human-written date to ISO', () => {
    expect(parseDate('March 12, 2026')).toBe('2026-03-12');
  });

  it('returns null rather than an invalid date', () => {
    expect(parseDate('sometime last spring')).toBeNull();
    expect(parseDate('')).toBeNull();
    expect(parseDate(undefined)).toBeNull();
  });
});

describe('organization', () => {
  it('uses a stable @id so every page references one entity', () => {
    expect(organization()['@id']).toBe(`${ORIGIN}/#organization`);
    expect(organization().areaServed.name).toBe('Singapore');
  });
});

describe('websiteSchema', () => {
  it('publishes the organisation and website as one graph', () => {
    const graph = websiteSchema()['@graph'];
    expect(graph.map((node) => node['@type'])).toEqual(['Organization', 'WebSite']);
    expect(graph[1].publisher['@id']).toBe(`${ORIGIN}/#organization`);
  });
});

describe('articleSchema', () => {
  const post = {
    title: 'Pricing Your First Project',
    slug: 'pricing',
    excerpt: 'A framework for pricing without underselling.',
    author: 'Kreator Editorial',
    date: 'February 28, 2026',
    category: 'UX/UI & Web Design',
    tags: ['Pricing', 'Business'],
    content: [
      { type: 'paragraph', text: 'First paragraph.' },
      { type: 'heading', text: 'A heading' },
      { type: 'tip', text: 'A tip.' },
    ],
  };

  it('flattens the body so an engine reading only JSON-LD still gets the text', () => {
    const schema = articleSchema(post, '/scenarios/pricing');
    expect(schema.articleBody).toBe('First paragraph.\n\nA heading\n\nA tip.');
  });

  it('carries the metadata engines use to attribute a citation', () => {
    const schema = articleSchema(post, '/scenarios/pricing');
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBe(post.title);
    expect(schema.datePublished).toBe('2026-02-28');
    expect(schema.keywords).toBe('Pricing, Business');
    expect(schema.mainEntityOfPage['@id']).toBe(`${ORIGIN}/scenarios/pricing`);
  });

  it('treats the house byline as the organisation and a name as a person', () => {
    expect(articleSchema(post, '/x').author['@type']).toBe('Organization');
    expect(articleSchema({ ...post, author: 'Hari Krishna' }, '/x').author['@type']).toBe('Person');
  });

  it('omits an unparseable date instead of publishing a broken one', () => {
    const schema = articleSchema({ ...post, date: 'soon' }, '/x');
    expect(schema.datePublished).toBeUndefined();
  });

  it('returns null for an unusable post', () => {
    expect(articleSchema(null, '/x')).toBeNull();
    expect(articleSchema({ title: '' }, '/x')).toBeNull();
  });
});

describe('collectionSchema', () => {
  const items = [
    { title: 'Figma', description: 'Design tool', link: 'https://figma.com' },
    { title: 'Blender', description: '3D suite', link: 'https://blender.org' },
  ];

  it('lists the entries so the page can be cited for what it recommends', () => {
    const schema = collectionSchema({
      name: 'Tools', description: 'Curated tools', path: '/resources', items,
    });

    expect(schema.mainEntity.numberOfItems).toBe(2);
    expect(schema.mainEntity.itemListElement[0]).toMatchObject({
      position: 1, name: 'Figma', url: 'https://figma.com',
    });
    expect(schema.url).toBe(`${ORIGIN}/resources`);
  });

  it('caps the list so a large hub does not emit an enormous graph', () => {
    const many = Array.from({ length: 80 }, (_, i) => ({ title: `Item ${i}` }));
    const schema = collectionSchema({ name: 'n', description: 'd', path: '/p', items: many });
    expect(schema.mainEntity.numberOfItems).toBe(50);
  });

  it('skips entries with no title, and returns null when nothing is left', () => {
    expect(collectionSchema({ name: 'n', description: 'd', path: '/p', items: [] })).toBeNull();
    expect(collectionSchema({ name: 'n', description: 'd', path: '/p', items: [{}, null] })).toBeNull();
  });
});

describe('breadcrumbSchema', () => {
  it('numbers the trail from one', () => {
    const schema = breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Scenarios', path: '/scenarios' },
    ]);

    expect(schema.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Scenarios', item: `${ORIGIN}/scenarios` },
    ]);
  });

  it('returns null for a trail too short to be a breadcrumb', () => {
    expect(breadcrumbSchema([{ name: 'Home', path: '/' }])).toBeNull();
    expect(breadcrumbSchema(undefined)).toBeNull();
  });
});
