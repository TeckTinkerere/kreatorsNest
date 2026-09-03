/**
 * WEBSITE_ID is captured at module load, so each case re-imports with the env
 * it needs.
 */
function loadAnalytics(websiteId, scriptUrl) {
  let mod;
  jest.isolateModules(() => {
    if (websiteId === undefined) delete process.env.REACT_APP_UMAMI_WEBSITE_ID;
    else process.env.REACT_APP_UMAMI_WEBSITE_ID = websiteId;

    if (scriptUrl === undefined) delete process.env.REACT_APP_UMAMI_SCRIPT_URL;
    else process.env.REACT_APP_UMAMI_SCRIPT_URL = scriptUrl;

    mod = require('./analytics');
  });
  return mod;
}

afterEach(() => {
  delete process.env.REACT_APP_UMAMI_WEBSITE_ID;
  delete process.env.REACT_APP_UMAMI_SCRIPT_URL;
  document.head.querySelectorAll('script').forEach((s) => s.remove());
  delete window.umami;
});

describe('isAnalyticsEnabled', () => {
  it('is false with no website id', () => {
    expect(loadAnalytics(undefined).isAnalyticsEnabled()).toBe(false);
    expect(loadAnalytics('   ').isAnalyticsEnabled()).toBe(false);
  });

  it('is true once a website id is set', () => {
    expect(loadAnalytics('abc-123').isAnalyticsEnabled()).toBe(true);
  });
});

describe('initAnalytics', () => {
  it('injects nothing when unconfigured', () => {
    loadAnalytics(undefined).initAnalytics();
    expect(document.head.querySelector('script')).toBeNull();
  });

  it('injects the tracker with the website id attached', () => {
    loadAnalytics('abc-123').initAnalytics();

    const script = document.head.querySelector('script');
    expect(script.src).toBe('https://cloud.umami.is/script.js');
    expect(script.getAttribute('data-website-id')).toBe('abc-123');
    expect(script.async).toBe(true);
  });

  it('honours a self-hosted script url', () => {
    loadAnalytics('abc-123', 'https://stats.example.com/script.js').initAnalytics();
    expect(document.head.querySelector('script').src).toBe('https://stats.example.com/script.js');
  });

  it('injects only once even under StrictMode double-mounting', () => {
    const analytics = loadAnalytics('abc-123');
    analytics.initAnalytics();
    analytics.initAnalytics();
    analytics.initAnalytics();

    expect(document.head.querySelectorAll('script')).toHaveLength(1);
  });
});

describe('trackEvent', () => {
  it('does nothing when unconfigured, even if a tracker is present', () => {
    window.umami = { track: jest.fn() };
    loadAnalytics(undefined).trackEvent('template-download', { title: 'Invoice' });
    expect(window.umami.track).not.toHaveBeenCalled();
  });

  it('forwards the event name and properties', () => {
    window.umami = { track: jest.fn() };
    loadAnalytics('abc-123').trackEvent('template-download', { title: 'Invoice' });
    expect(window.umami.track).toHaveBeenCalledWith('template-download', { title: 'Invoice' });
  });

  it('is a no-op when the tracker has not loaded yet', () => {
    expect(() => loadAnalytics('abc-123').trackEvent('resource-click')).not.toThrow();
  });

  it('swallows a throwing tracker rather than breaking the interaction', () => {
    window.umami = { track: () => { throw new Error('blocked'); } };
    expect(() => loadAnalytics('abc-123').trackEvent('resource-click')).not.toThrow();
  });

  it('ignores an empty event name', () => {
    window.umami = { track: jest.fn() };
    loadAnalytics('abc-123').trackEvent('');
    expect(window.umami.track).not.toHaveBeenCalled();
  });
});

describe('EVENTS', () => {
  it('exposes the metrics that answer whether the site is used', () => {
    const { EVENTS } = loadAnalytics('abc-123');
    expect(EVENTS.TEMPLATE_DOWNLOAD).toBe('template-download');
    expect(EVENTS.RESOURCE_CLICK).toBe('resource-click');
    expect(EVENTS.SUGGEST_OPEN).toBe('suggest-open');
  });
});
