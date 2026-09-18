import { readFileSync } from 'fs';
import { join } from 'path';
import { parseCsvToObjects } from './csv';
import {
  mapRows,
  parseScenarioBody,
  serialiseScenarioBody,
  safeUrl,
  safePath,
  splitList,
  toBoolean,
} from './schema';
import { resourceData } from '../data/resources';
import { downloadsData } from '../data/downloads';
import { scenarioPosts } from '../data/scenarioPosts';

/** Read one of the CSVs produced by scripts/export-content-csv.mjs. */
const readFixture = (name) =>
  readFileSync(join(__dirname, '..', '..', 'content-csv', name), 'utf8');

describe('splitList', () => {
  it('splits on pipes and commas and drops blanks', () => {
    expect(splitList('One | Two ,, Three ')).toEqual(['One', 'Two', 'Three']);
    expect(splitList('')).toEqual([]);
  });
});

describe('toBoolean', () => {
  it('accepts the spellings a spreadsheet produces', () => {
    ['TRUE', 'true', 'Yes', 'y', '1', 'x'].forEach((v) => expect(toBoolean(v)).toBe(true));
    ['FALSE', 'no', '0', '', '   '].forEach((v) => expect(toBoolean(v)).toBe(false));
  });
});

describe('safeUrl', () => {
  it('keeps http(s) URLs', () => {
    expect(safeUrl('https://example.com/a')).toBe('https://example.com/a');
  });

  it('assumes https for a bare domain', () => {
    expect(safeUrl('example.com')).toBe('https://example.com/');
  });

  it('rejects non-http schemes', () => {
    /* eslint-disable no-script-url */
    expect(safeUrl('javascript:alert(1)')).toBe('');
    /* eslint-enable no-script-url */
    expect(safeUrl('data:text/html,<script>')).toBe('');
    expect(safeUrl('')).toBe('');
  });
});

describe('safePath', () => {
  it('keeps site-relative paths and rejects anything else', () => {
    expect(safePath('/downloads/invoice.txt')).toBe('/downloads/invoice.txt');
    expect(safePath('//evil.com/x')).toBe('');
    expect(safePath('https://evil.com/x')).toBe('');
    expect(safePath('')).toBe('');
  });
});

describe('parseScenarioBody', () => {
  it('maps the block syntax to content blocks', () => {
    expect(parseScenarioBody('## Title\n\nA paragraph.\n\n> A tip.')).toEqual([
      { type: 'heading', text: 'Title' },
      { type: 'paragraph', text: 'A paragraph.' },
      { type: 'tip', text: 'A tip.' },
    ]);
  });

  it('round-trips through serialiseScenarioBody', () => {
    const blocks = scenarioPosts[0].content;
    expect(parseScenarioBody(serialiseScenarioBody(blocks))).toEqual(blocks);
  });
});

describe('mapRows', () => {
  it('drops unpublished rows', () => {
    const rows = parseCsvToObjects(
      'title,link,type,published\nKeep,https://a.com,Tools,TRUE\nDrop,https://b.com,Tools,FALSE'
    );
    expect(mapRows('resources', rows).map((r) => r.title)).toEqual(['Keep']);
  });

  it('treats a missing published column as published', () => {
    const rows = parseCsvToObjects('title,link,type\nKeep,https://a.com,Tools');
    expect(mapRows('resources', rows)).toHaveLength(1);
  });

  it('drops rows missing a title, link, or type', () => {
    const rows = parseCsvToObjects(
      'title,link,type\n,https://a.com,Tools\nNo link,,Tools\nNo type,https://c.com,'
    );
    expect(mapRows('resources', rows)).toEqual([]);
  });

  it('strips a resource link that is not http(s)', () => {
    /* eslint-disable no-script-url */
    const rows = parseCsvToObjects('title,link,type\nBad,javascript:alert(1),Tools');
    /* eslint-enable no-script-url */
    expect(mapRows('resources', rows)).toEqual([]);
  });

  it('drops a download pointing outside the site', () => {
    const rows = parseCsvToObjects('title,txtFile\nBad,https://evil.com/x.txt');
    expect(mapRows('downloads', rows)).toEqual([]);
  });

  it('drops a contributor social that is not a valid URL', () => {
    const rows = parseCsvToObjects('name,instagram\nAda,not a url');
    expect(mapRows('contributors', rows)[0].socials).toEqual({});
  });

  it('returns nothing for an unknown dataset', () => {
    expect(mapRows('nope', [{ a: '1' }])).toEqual([]);
  });
});

describe('exported CSV fixtures round-trip back to the bundled data', () => {
  it('rebuilds every resource', () => {
    const mapped = mapRows('resources', parseCsvToObjects(readFixture('resources.csv')));
    expect(mapped).toHaveLength(resourceData.length);
    expect(mapped[0].title).toBe(resourceData[0].title);
    expect(mapped[0].tags).toEqual(resourceData[0].tags);
    expect(mapped[0].tier).toBe(resourceData[0].tier);
  });

  it('rebuilds every download', () => {
    const mapped = mapRows('downloads', parseCsvToObjects(readFixture('downloads.csv')));
    expect(mapped).toHaveLength(downloadsData.length);
    expect(mapped.filter((d) => d.featured)).toHaveLength(
      downloadsData.filter((d) => d.featured).length
    );
  });

  it('rebuilds every scenario, including its content blocks', () => {
    const mapped = mapRows('scenarios', parseCsvToObjects(readFixture('scenarios.csv')));
    expect(mapped).toHaveLength(scenarioPosts.length);

    const first = mapped.find((p) => p.slug === scenarioPosts[0].slug);
    expect(first.content).toEqual(scenarioPosts[0].content);
    expect(first.pinned).toBe(scenarioPosts[0].pinned);
  });

  it('rebuilds contributors with their socials intact', () => {
    const mapped = mapRows('contributors', parseCsvToObjects(readFixture('contributors.csv')));
    expect(mapped[0].name).toBe('Hari Krishna');
    expect(mapped[0].socials.instagram).toContain('starboy_hk');
  });
});
