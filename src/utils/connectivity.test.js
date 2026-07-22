import {
  connectionRequiredPath,
  isBrowserOnline,
  isExternalHttpUrl,
} from './connectivity';

describe('connectivity utils', () => {
  describe('isExternalHttpUrl', () => {
    it('returns true for absolute external https URLs', () => {
      expect(isExternalHttpUrl('https://example.com/path')).toBe(true);
    });

    it('returns false for same-origin paths', () => {
      expect(isExternalHttpUrl('/resources')).toBe(false);
      expect(isExternalHttpUrl(`${window.location.origin}/starter-kit`)).toBe(false);
    });

    it('returns false for mailto, tel, and hash links', () => {
      expect(isExternalHttpUrl('mailto:hello@kreatornest.com')).toBe(false);
      expect(isExternalHttpUrl('tel:+15551212')).toBe(false);
      expect(isExternalHttpUrl('#section')).toBe(false);
    });

    it('returns false for empty or invalid values', () => {
      expect(isExternalHttpUrl('')).toBe(false);
      expect(isExternalHttpUrl(null)).toBe(false);
      expect(isExternalHttpUrl(undefined)).toBe(false);
    });
  });

  describe('isBrowserOnline', () => {
    const original = navigator.onLine;

    afterEach(() => {
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        get: () => original,
      });
    });

    it('reflects navigator.onLine', () => {
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        get: () => false,
      });
      expect(isBrowserOnline()).toBe(false);

      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        get: () => true,
      });
      expect(isBrowserOnline()).toBe(true);
    });
  });

  describe('connectionRequiredPath', () => {
    it('encodes the destination in the query string', () => {
      expect(connectionRequiredPath('https://example.com/a b')).toBe(
        '/connection-required?to=https%3A%2F%2Fexample.com%2Fa%20b'
      );
    });
  });
});
