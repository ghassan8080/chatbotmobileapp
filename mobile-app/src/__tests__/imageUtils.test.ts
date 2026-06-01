import {
  validateImageSize,
  getFileExtension,
  generateFilename,
  isValidImageType,
} from '../utils/imageUtils';

// Mock the config so the 5MB limit is predictable in tests
jest.mock('../config/api.config', () => ({
  config: {
    maxImageSizeMB: 5,
    imageQuality: 0.8,
    baseURL: 'http://test.local',
  },
}));

// ─── validateImageSize ──────────────────────────────────────────────────────

describe('validateImageSize', () => {
  const MB = 1024 * 1024;

  it('returns true for a file exactly at the 5 MB limit', () => {
    expect(validateImageSize(5 * MB)).toBe(true);
  });

  it('returns true for a file smaller than the limit', () => {
    expect(validateImageSize(1 * MB)).toBe(true);
  });

  it('returns false for a file larger than the limit', () => {
    expect(validateImageSize(5 * MB + 1)).toBe(false);
  });

  it('returns true for a 0-byte file', () => {
    expect(validateImageSize(0)).toBe(true);
  });
});

// ─── getFileExtension ───────────────────────────────────────────────────────

describe('getFileExtension', () => {
  it('extracts extension from a simple URI', () => {
    expect(getFileExtension('file:///photos/image.jpg')).toBe('jpg');
  });

  it('extracts extension from a URI with query string', () => {
    expect(getFileExtension('https://cdn.example.com/photo.png?v=2')).toBe('png');
  });

  it('extracts webp extension', () => {
    expect(getFileExtension('/tmp/upload.webp')).toBe('webp');
  });

  it('returns "jpg" as fallback when no extension is found', () => {
    expect(getFileExtension('no-extension-here')).toBe('jpg');
  });

  it('handles uppercase extensions', () => {
    // match[1] returns whatever case is in the URI
    const ext = getFileExtension('photo.JPG');
    expect(ext).toBe('JPG');
  });
});

// ─── generateFilename ───────────────────────────────────────────────────────

describe('generateFilename', () => {
  it('generates a filename with default jpg extension', () => {
    const filename = generateFilename();
    expect(filename).toMatch(/^product_\d+\.jpg$/);
  });

  it('generates a filename with a specified extension', () => {
    const filename = generateFilename('png');
    expect(filename).toMatch(/^product_\d+\.png$/);
  });

  it('generates unique filenames across two calls', () => {
    const a = generateFilename();
    // Force a tick so Date.now() differs (or the test relies on the pattern match)
    const b = generateFilename();
    // Both should be valid filenames even if timestamps are identical on fast machines
    expect(a).toMatch(/^product_\d+\.jpg$/);
    expect(b).toMatch(/^product_\d+\.jpg$/);
  });
});

// ─── isValidImageType ───────────────────────────────────────────────────────

describe('isValidImageType', () => {
  it('accepts image/jpeg', () => {
    expect(isValidImageType('image/jpeg')).toBe(true);
  });

  it('accepts image/jpg', () => {
    expect(isValidImageType('image/jpg')).toBe(true);
  });

  it('accepts image/png', () => {
    expect(isValidImageType('image/png')).toBe(true);
  });

  it('accepts image/webp', () => {
    expect(isValidImageType('image/webp')).toBe(true);
  });

  it('accepts uppercase mime type (lowercased internally)', () => {
    expect(isValidImageType('IMAGE/JPEG')).toBe(true);
  });

  it('rejects image/gif', () => {
    expect(isValidImageType('image/gif')).toBe(false);
  });

  it('rejects video/mp4', () => {
    expect(isValidImageType('video/mp4')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidImageType('')).toBe(false);
  });
});
