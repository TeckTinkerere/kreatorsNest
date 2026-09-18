import { render, screen, waitFor } from '@testing-library/react';
import { ContentProvider, useContent } from './ContentContext';
import { resourceData } from '../data/resources';

jest.mock('./remote');

/** Renders the loaded source plus the first resource title. */
function Probe() {
  const { resources, source, categories } = useContent();
  return (
    <div>
      <span data-testid="source">{source}</span>
      <span data-testid="first">{resources[0]?.title}</span>
      <span data-testid="categories">{categories.join('|')}</span>
    </div>
  );
}

beforeEach(() => {
  // Default to "no sheet configured" so the bundled-content cases are unaffected.
  const remote = require('./remote');
  remote.isRemoteConfigured.mockReturnValue(false);
  remote.readCache.mockReturnValue(null);
  remote.isCacheFresh.mockReturnValue(false);
  remote.fetchRemoteContent.mockResolvedValue(null);
});

afterEach(() => {
  window.localStorage.clear();
  jest.resetAllMocks();
});

it('serves bundled content when no sheet is configured', () => {
  render(<ContentProvider><Probe /></ContentProvider>);

  expect(screen.getByTestId('source')).toHaveTextContent('bundled');
  expect(screen.getByTestId('first')).toHaveTextContent(resourceData[0].title);
});

it('falls back to bundled content outside a provider', () => {
  render(<Probe />);

  expect(screen.getByTestId('source')).toHaveTextContent('bundled');
  expect(screen.getByTestId('first')).toHaveTextContent(resourceData[0].title);
});

it('lists "All" first and hides categories with no resources', () => {
  render(<ContentProvider><Probe /></ContentProvider>);

  const categories = screen.getByTestId('categories').textContent.split('|');
  expect(categories[0]).toBe('All');
  categories.slice(1).forEach((category) => {
    expect(resourceData.some((r) => r.category === category)).toBe(true);
  });
});

it('upgrades to cached content, then to live sheet content', async () => {
  const { isRemoteConfigured, readCache, isCacheFresh, fetchRemoteContent } = require('./remote');

  const cached = [{ id: 'c1', title: 'Cached Pick', type: 'Tools', category: 'Photography', link: 'https://c.example', tags: [] }];
  const live = [{ id: 's1', title: 'Live Pick', type: 'Tools', category: 'Photography', link: 'https://s.example', tags: [] }];

  isRemoteConfigured.mockReturnValue(true);
  readCache.mockReturnValue({ fetchedAt: Date.now() - 60 * 60 * 1000, data: { resources: cached } });
  isCacheFresh.mockReturnValue(false);
  fetchRemoteContent.mockResolvedValue({ resources: live });

  render(<ContentProvider><Probe /></ContentProvider>);

  await waitFor(() => expect(screen.getByTestId('source')).toHaveTextContent('sheet'));
  expect(screen.getByTestId('first')).toHaveTextContent('Live Pick');
});

it('does not refetch when the cache is still fresh', async () => {
  const { isRemoteConfigured, readCache, isCacheFresh, fetchRemoteContent } = require('./remote');

  const cached = [{ id: 'c1', title: 'Cached Pick', type: 'Tools', category: 'Photography', link: 'https://c.example', tags: [] }];
  isRemoteConfigured.mockReturnValue(true);
  readCache.mockReturnValue({ fetchedAt: Date.now(), data: { resources: cached } });
  isCacheFresh.mockReturnValue(true);

  render(<ContentProvider><Probe /></ContentProvider>);

  await waitFor(() => expect(screen.getByTestId('source')).toHaveTextContent('cache'));
  expect(screen.getByTestId('first')).toHaveTextContent('Cached Pick');
  expect(fetchRemoteContent).not.toHaveBeenCalled();
});

it('keeps bundled content when the sheet fetch yields nothing', async () => {
  const { isRemoteConfigured, readCache, isCacheFresh, fetchRemoteContent } = require('./remote');

  isRemoteConfigured.mockReturnValue(true);
  readCache.mockReturnValue(null);
  isCacheFresh.mockReturnValue(false);
  fetchRemoteContent.mockResolvedValue(null);

  render(<ContentProvider><Probe /></ContentProvider>);

  await waitFor(() => expect(fetchRemoteContent).toHaveBeenCalled());
  expect(screen.getByTestId('source')).toHaveTextContent('bundled');
  expect(screen.getByTestId('first')).toHaveTextContent(resourceData[0].title);
});
