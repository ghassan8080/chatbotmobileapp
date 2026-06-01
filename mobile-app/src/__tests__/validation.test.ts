import {
  validateProductName,
  validateProductDescription,
  validateProductPrice,
  validateProductForm,
  sanitizeString,
} from '../utils/validation';

// ─── validateProductName ────────────────────────────────────────────────────

describe('validateProductName', () => {
  it('returns valid for a proper name', () => {
    const result = validateProductName('Widget Pro');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns error for empty string', () => {
    const result = validateProductName('');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/مطلوب/);
  });

  it('returns error for whitespace-only string', () => {
    const result = validateProductName('   ');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/مطلوب/);
  });

  it('returns error when name is shorter than 3 characters', () => {
    const result = validateProductName('ab');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/3/);
  });

  it('returns valid for exactly 3 characters', () => {
    const result = validateProductName('abc');
    expect(result.isValid).toBe(true);
  });

  it('returns error when name exceeds 100 characters', () => {
    const longName = 'a'.repeat(101);
    const result = validateProductName(longName);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/100/);
  });

  it('returns valid for exactly 100 characters', () => {
    const result = validateProductName('a'.repeat(100));
    expect(result.isValid).toBe(true);
  });
});

// ─── validateProductDescription ────────────────────────────────────────────

describe('validateProductDescription', () => {
  it('returns valid for a proper description', () => {
    const result = validateProductDescription('This is a valid product description.');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('returns error for empty string', () => {
    const result = validateProductDescription('');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/مطلوب/);
  });

  it('returns error for whitespace-only string', () => {
    const result = validateProductDescription('     ');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/مطلوب/);
  });

  it('returns error when description is shorter than 10 characters', () => {
    const result = validateProductDescription('Short');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/10/);
  });

  it('returns valid for exactly 10 characters', () => {
    const result = validateProductDescription('1234567890');
    expect(result.isValid).toBe(true);
  });

  it('returns error when description exceeds 500 characters', () => {
    const longDesc = 'a'.repeat(501);
    const result = validateProductDescription(longDesc);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/500/);
  });

  it('returns valid for exactly 500 characters', () => {
    const result = validateProductDescription('a'.repeat(500));
    expect(result.isValid).toBe(true);
  });
});

// ─── validateProductPrice ───────────────────────────────────────────────────

describe('validateProductPrice', () => {
  it('returns valid for a positive number', () => {
    const result = validateProductPrice(99.99);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts a numeric string', () => {
    const result = validateProductPrice('150');
    expect(result.isValid).toBe(true);
  });

  it('returns error for NaN string', () => {
    const result = validateProductPrice('abc');
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/رقم/);
  });

  it('returns error for zero', () => {
    const result = validateProductPrice(0);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/أكبر من صفر/);
  });

  it('returns error for negative price', () => {
    const result = validateProductPrice(-5);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/أكبر من صفر/);
  });

  it('returns error when price exceeds 1,000,000', () => {
    const result = validateProductPrice(1000001);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toMatch(/كبير/);
  });

  it('returns valid for exactly 1,000,000', () => {
    const result = validateProductPrice(1000000);
    expect(result.isValid).toBe(true);
  });
});

// ─── validateProductForm ────────────────────────────────────────────────────

describe('validateProductForm', () => {
  it('returns valid when all fields are correct', () => {
    const result = validateProductForm('Widget Pro', 'A great product description here.', 50);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('aggregates errors from all three validators', () => {
    const result = validateProductForm('', '', -1);
    expect(result.isValid).toBe(false);
    // Expect errors from name + description + price
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  it('returns only price error when name and description are valid', () => {
    const result = validateProductForm('Valid Name', 'Valid description text here.', 0);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatch(/أكبر من صفر/);
  });
});

// ─── sanitizeString ─────────────────────────────────────────────────────────

describe('sanitizeString', () => {
  it('removes angle brackets', () => {
    expect(sanitizeString('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });

  it('leaves normal strings unchanged', () => {
    expect(sanitizeString('Normal product name')).toBe('Normal product name');
  });

  it('handles empty string', () => {
    expect(sanitizeString('')).toBe('');
  });

  it('removes multiple angle brackets', () => {
    expect(sanitizeString('<<bad>>')).toBe('bad');
  });
});
