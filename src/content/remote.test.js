/**
 * SHEET_ID is captured at module load, so each case re-imports the module with
 * the env var it needs.
 */
const SHEET_ID = 'test-sheet-id';

/**
 * Load remote.js fresh with REACT_APP_CONTENT_SHEET_ID set to `id`.
 *
 * @param {string} id - Sheet id for this load ('' disables remote content).
 * @returns {object} The remote module.
 */
function loadRemote(id) {
  let mod;
  jest.isolateModules(() => {
    process.env.REACT_APP_CONTENT_SHEET_ID = id;
    mod = require('./remote');
  });
  return mod;
}

const CSV = 'title,link,type\nSheet Tool,https://sheet.example/tool,Tools\n';

/** Build a fetch stub that answers every tab with the same body. */
const respondWith = (body, ok = true) =>
  jest.fn().mockResolvedValue({ ok, text: () => Promise.resolve(body) });

afterEach(() => {
  delete process.env.REACT_APP_CONTENT_SHEET_ID;
  window.localStorage.clear();
  jest.restoreAllMocks();
});

describe('isRemoteConfigured', () => {
  it('is false without a sheet id', () => {
    expect(loadRemote('').isRemoteConfigured()).toBe(false);
  });

  it('is true with a sheet id', () => {
    expect(loadRemote(SHEET_ID).isRemoteConfigured()).toBe(true);
  });
});

describe('sheetCsvUrl', () => {
  it('points at the CSV export for the named tab', () => {
    const url = loadRemote(SHEET_ID).sheetCsvUrl('resources');
    expect(url).toContain(`/d/${SHEET_ID}/gviz/tq`);
    expect(url).toContain('tqx=out:csv');
    expect(url).toContain('sheet=resources');
  });
});

describe('fetchRemoteContent', () => {
  it('returns null when no sheet is configured, without fetching', async () => {
    global.fetch = jest.fn();
    await expect(loadRemote('').fetchRemoteContent()).resolves.toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('maps CSV from every tab and caches the result', async () => {
    global.fetch = respondWith(CSV);
    const remote = loadRemote(SHEET_ID);

    const result = await remote.fetchRemoteContent();

    expect(result.resources[0].title).toBe('Sheet Tool');
    expect(remote.readCache().data.resources[0].title).toBe('Sheet Tool');
  });

  it('rejects an HTML sign-in page served for a private sheet', async () => {
    global.fetch = respondWith('<!DOCTYPE html><html>Sign in</html>');
    await expect(loadRemote(SHEET_ID).fetchRemoteContent()).resolves.toBeNull();
  });

  it('rejects a non-ok response', async () => {
    global.fetch = respondWith(CSV, false);
    await expect(loadRemote(SHEET_ID).fetchRemoteContent()).resolves.toBeNull();
  });

  it('rejects an empty tab rather than wiping content', async () => {
    global.fetch = respondWith('title,link,type\n');
    await expect(loadRemote(SHEET_ID).fetchRemoteContent()).resolves.toBeNull();
  });

  it('survives a network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
    await expect(loadRemote(SHEET_ID).fetchRemoteContent()).resolves.toBeNull();
  });

  it('keeps the tabs that loaded when one tab fails', async () => {
    global.fetch = jest.fn((url) =>
      String(url).includes('sheet=scenarios')
        ? Promise.reject(new Error('boom'))
        : Promise.resolve({ ok: true, text: () => Promise.resolve(CSV) })
    );

    const result = await loadRemote(SHEET_ID).fetchRemoteContent();

    expect(result.resources).toHaveLength(1);
    expect(result.scenarios).toBeUndefined();
  });
});

describe('cache', () => {
  it('treats a just-written entry as fresh and an old one as stale', () => {
    const remote = loadRemote(SHEET_ID);
    expect(remote.isCacheFresh({ fetchedAt: Date.now() })).toBe(true);
    expect(remote.isCacheFresh({ fetchedAt: Date.now() - 60 * 60 * 1000 })).toBe(false);
    expect(remote.isCacheFresh(null)).toBe(false);
  });

  it('ignores a corrupt cache entry', () => {
    window.localStorage.setItem('kreatornest:content:v1', 'not json');
    expect(loadRemote(SHEET_ID).readCache()).toBeNull();
  });
});
