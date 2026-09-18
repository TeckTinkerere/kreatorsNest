import { parseCsv, parseCsvToObjects, normaliseHeader } from './csv';

describe('parseCsv', () => {
  it('parses plain rows', () => {
    expect(parseCsv('a,b\n1,2')).toEqual([['a', 'b'], ['1', '2']]);
  });

  it('keeps commas and newlines inside quoted fields', () => {
    const csv = 'title,body\n"Hello, world","line one\nline two"';
    expect(parseCsv(csv)).toEqual([
      ['title', 'body'],
      ['Hello, world', 'line one\nline two'],
    ]);
  });

  it('unescapes doubled quotes', () => {
    expect(parseCsv('a\n"He said ""hi"""')).toEqual([['a'], ['He said "hi"']]);
  });

  it('normalises CRLF line endings', () => {
    expect(parseCsv('a,b\r\n1,2\r\n')).toEqual([['a', 'b'], ['1', '2']]);
  });

  it('drops fully blank rows', () => {
    expect(parseCsv('a,b\n1,2\n,\n3,4')).toEqual([['a', 'b'], ['1', '2'], ['3', '4']]);
  });

  it('returns an empty list for an empty document', () => {
    expect(parseCsv('')).toEqual([]);
  });
});

describe('normaliseHeader', () => {
  it('collapses spacing and casing variants to one key', () => {
    expect(normaliseHeader('Read Time')).toBe('readtime');
    expect(normaliseHeader('read_time')).toBe('readtime');
    expect(normaliseHeader('readTime')).toBe('readtime');
  });
});

describe('parseCsvToObjects', () => {
  it('keys rows by normalised header', () => {
    expect(parseCsvToObjects('Title,Read Time\nHello,6 min')).toEqual([
      { title: 'Hello', readtime: '6 min' },
    ]);
  });

  it('fills missing trailing cells with empty strings', () => {
    expect(parseCsvToObjects('a,b,c\n1,2')).toEqual([{ a: '1', b: '2', c: '' }]);
  });

  it('returns nothing when there are no data rows', () => {
    expect(parseCsvToObjects('a,b')).toEqual([]);
  });
});
