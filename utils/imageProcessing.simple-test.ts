// Simple test file for image processing utilities
import { formatFileSize, validateImageFile } from './imageProcessing';

console.log('🧪 Running Image Processing Utility Tests...\n');

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${(error as Error).message}`);
    failed++;
  }
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected "${expected}", got "${actual}"`);
      }
    },
    toContain(substring: string) {
      if (!String(actual).includes(substring)) {
        throw new Error(`Expected "${actual}" to contain "${substring}"`);
      }
    },
    toBeUndefined() {
      if (actual !== undefined) {
        throw new Error(`Expected undefined, got "${actual}"`);
      }
    }
  };
}

// ===== formatFileSize tests =====
console.log('📏 Testing formatFileSize:\n');

test('formats 0 bytes correctly', () => {
  expect(formatFileSize(0)).toBe('0 Bytes');
});

test('formats bytes correctly', () => {
  expect(formatFileSize(500)).toBe('500 Bytes');
  expect(formatFileSize(1023)).toBe('1023 Bytes');
});

test('formats kilobytes correctly', () => {
  expect(formatFileSize(1024)).toBe('1.0 KB');
  expect(formatFileSize(1536)).toBe('1.5 KB');
  expect(formatFileSize(10240)).toBe('10.0 KB');
  expect(formatFileSize(159744)).toBe('156.0 KB');
});

test('formats megabytes correctly', () => {
  expect(formatFileSize(1048576)).toBe('1.0 MB');
  expect(formatFileSize(2516582)).toBe('2.4 MB');
  expect(formatFileSize(10485760)).toBe('10.0 MB');
  expect(formatFileSize(5242880)).toBe('5.0 MB');
});

test('handles edge cases', () => {
  expect(formatFileSize(1025)).toBe('1.0 KB');
  expect(formatFileSize(1048577)).toBe('1.0 MB');
});

// ===== validateImageFile tests =====
console.log('\n🔍 Testing validateImageFile:\n');

test('accepts valid PNG files', () => {
  const file = new File(['content'], 'test.png', { type: 'image/png' });
  const result = validateImageFile(file);
  if (!result.isValid) throw new Error('Should be valid');
  expect(result.error).toBeUndefined();
});

test('accepts valid JPG files', () => {
  const file = new File(['content'], 'test.jpg', { type: 'image/jpg' });
  const result = validateImageFile(file);
  if (!result.isValid) throw new Error('Should be valid');
});

test('accepts valid JPEG files', () => {
  const file = new File(['content'], 'test.jpeg', { type: 'image/jpeg' });
  const result = validateImageFile(file);
  if (!result.isValid) throw new Error('Should be valid');
});

test('accepts valid WebP files', () => {
  const file = new File(['content'], 'test.webp', { type: 'image/webp' });
  const result = validateImageFile(file);
  if (!result.isValid) throw new Error('Should be valid');
});

test('accepts valid GIF files', () => {
  const file = new File(['content'], 'test.gif', { type: 'image/gif' });
  const result = validateImageFile(file);
  if (!result.isValid) throw new Error('Should be valid');
});

test('rejects invalid file types', () => {
  const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
  const result = validateImageFile(file);
  if (result.isValid) throw new Error('Should be invalid');
  expect(result.error).toContain('Invalid file type');
});

test('rejects files exceeding default size limit (10MB)', () => {
  // Create a file larger than 10MB
  const largeContent = new Array(11 * 1024 * 1024).fill('a').join('');
  const file = new File([largeContent], 'large.png', { type: 'image/png' });
  const result = validateImageFile(file);
  if (result.isValid) throw new Error('Should be invalid');
  expect(result.error).toContain('exceeds');
});

test('accepts files within custom size limit', () => {
  const content = new Array(3 * 1024 * 1024).fill('a').join('');
  const file = new File([content], 'medium.png', { type: 'image/png' });
  const result = validateImageFile(file, 5);
  if (!result.isValid) throw new Error('Should be valid');
});

test('rejects files exceeding custom size limit', () => {
  const content = new Array(6 * 1024 * 1024).fill('a').join('');
  const file = new File([content], 'large.png', { type: 'image/png' });
  const result = validateImageFile(file, 5);
  if (result.isValid) throw new Error('Should be invalid');
  expect(result.error).toContain('5MB');
});

test('rejects empty files', () => {
  const file = new File([], 'empty.png', { type: 'image/png' });
  const result = validateImageFile(file);
  if (result.isValid) throw new Error('Should be invalid');
  expect(result.error).toContain('empty');
});

test('validates by extension when MIME type is missing', () => {
  const file = new File(['content'], 'test.png', { type: '' });
  const result = validateImageFile(file);
  if (!result.isValid) throw new Error('Should be valid');
});

test('handles case-insensitive file extensions', () => {
  const file = new File(['content'], 'test.PNG', { type: 'image/png' });
  const result = validateImageFile(file);
  if (!result.isValid) throw new Error('Should be valid');
});

test('handles case-insensitive MIME types', () => {
  const file = new File(['content'], 'test.jpg', { type: 'IMAGE/JPEG' });
  const result = validateImageFile(file);
  if (!result.isValid) throw new Error('Should be valid');
});

// ===== Summary =====
console.log(`\n${'='.repeat(50)}`);
console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n❌ Some tests failed');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed!');
  process.exit(0);
}
