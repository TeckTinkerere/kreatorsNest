import {
  detectInstallPlatform,
  getPwaBridge,
  isPwaInstalled,
  markPwaInstalled,
  clearPwaInstalledMark,
  supportsNativeInstallPrompt,
} from './pwaInstall';

describe('pwaInstall utils', () => {
  const originalUA = navigator.userAgent;
  const originalPlatform = navigator.platform;
  const originalMaxTouch = navigator.maxTouchPoints;
  const originalStandalone = window.navigator.standalone;

  afterEach(() => {
    clearPwaInstalledMark();
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      get: () => originalUA,
    });
    Object.defineProperty(navigator, 'platform', {
      configurable: true,
      get: () => originalPlatform,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      configurable: true,
      get: () => originalMaxTouch,
    });
    Object.defineProperty(window.navigator, 'standalone', {
      configurable: true,
      get: () => originalStandalone,
    });
  });

  function mockUA(ua, { platform = 'Win32', maxTouchPoints = 0 } = {}) {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      get: () => ua,
    });
    Object.defineProperty(navigator, 'platform', {
      configurable: true,
      get: () => platform,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      configurable: true,
      get: () => maxTouchPoints,
    });
  }

  it('detects iPhone', () => {
    mockUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)');
    expect(detectInstallPlatform().id).toBe('ios');
    expect(supportsNativeInstallPrompt()).toBe(false);
  });

  it('detects Android', () => {
    mockUA('Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile');
    expect(detectInstallPlatform().id).toBe('android');
    expect(supportsNativeInstallPrompt()).toBe(true);
  });

  it('detects Linux desktop', () => {
    mockUA('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0', {
      platform: 'Linux x86_64',
    });
    expect(detectInstallPlatform().id).toBe('linux');
    expect(supportsNativeInstallPrompt()).toBe(true);
  });

  it('exposes a shared install bridge', () => {
    const bridge = getPwaBridge();
    expect(bridge).toHaveProperty('deferredPrompt');
    expect(getPwaBridge()).toBe(bridge);
  });

  it('detects standalone install via display-mode', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (query) => ({
      matches: query.includes('display-mode: standalone'),
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
    expect(isPwaInstalled()).toBe(true);
    window.matchMedia = originalMatchMedia;
  });

  it('hides install after a recorded install mark', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = () => ({
      matches: false,
      media: '',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
    expect(isPwaInstalled()).toBe(false);
    markPwaInstalled();
    expect(isPwaInstalled()).toBe(true);
    window.matchMedia = originalMatchMedia;
  });
});
