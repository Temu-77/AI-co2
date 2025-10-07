import { describe, it, expect, beforeEach, vi } from 'vitest';
import { extractImageMetadata, formatFileSize, validateImageFile } from './imageProcessing';

describe('formatFileSize', () => {
  it('should format bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(500)).toBe('500 Bytes');
    expect(formatFileSize(1023)).toBe('1023 Bytes');
  });

  it('should format kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(10240)).toBe('10.0 KB');
    expect(formatFileSize(159744)).toBe('156.0 KB');
  });

  it('should format megabytes correctly', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB');
    expect(formatFileSize(2516582)).toBe('2.4 MB');
    expect(formatFileSize(10485760)).toBe('10.0 MB');
    expect(formatFileSize(5242880)).toBe('5.0 MB');
  });

  it('should handle edge cases', () => {
    expect(formatFileSize(1025)).toBe('1.0 KB');
    expect(formatFileSize(1048577)).toBe('1.0 MB');
  });
});

describe('validateImageFile', () => {
  it('should accept valid PNG files', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid JPG files', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpg' });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
  });

  it('should accept valid JPEG files', () => {
    const file = new File(['content'], 'test.jpeg', { type: 'image/jpeg' });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
  });

  it('should accept valid WebP files', () => {
    const file = new File(['content'], 'test.webp', { type: 'image/webp' });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
  });

  it('should accept valid GIF files', () => {
    const file = new File(['content'], 'test.gif', { type: 'image/gif' });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid file types', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Invalid file type');
  });

  it('should reject files exceeding size limit', () => {
    // Create a file larger than 10MB
    const largeContent = new Array(11 * 1024 * 1024).fill('a').join('');
    const file = new File([largeContent], 'large.png', { type: 'image/png' });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('exceeds');
  });

  it('should accept files within custom size limit', () => {
    const content = new Array(3 * 1024 * 1024).fill('a').join('');
    const file = new File([content], 'medium.png', { type: 'image/png' });
    const result = validateImageFile(file, 5);
    expect(result.isValid).toBe(true);
  });

  it('should reject files exceeding custom size limit', () => {
    const content = new Array(6 * 1024 * 1024).fill('a').join('');
    const file = new File([content], 'large.png', { type: 'image/png' });
    const result = validateImageFile(file, 5);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('5MB');
  });

  it('should reject empty files', () => {
    const file = new File([], 'empty.png', { type: 'image/png' });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('should validate by extension when MIME type is missing', () => {
    const file = new File(['content'], 'test.png', { type: '' });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
  });

  it('should handle case-insensitive file extensions', () => {
    const file = new File(['content'], 'test.PNG', { type: 'image/png' });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
  });

  it('should handle case-insensitive MIME types', () => {
    const file = new File(['content'], 'test.jpg', { type: 'IMAGE/JPEG' });
    const result = validateImageFile(file);
    expect(result.isValid).toBe(true);
  });
});

describe('extractImageMetadata', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('should extract metadata from a valid image file', async () => {
    const file = new File([''], 'test-image.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 2516582 });

    // Mock Image constructor
    const mockImage = {
      width: 1920,
      height: 1080,
      onload: null as any,
      onerror: null as any,
      src: '',
    };

    global.Image = vi.fn(() => mockImage) as any;

    const metadataPromise = extractImageMetadata(file);

    // Simulate image load
    setTimeout(() => {
      if (mockImage.onload) {
        mockImage.onload();
      }
    }, 0);

    const metadata = await metadataPromise;

    expect(metadata.width).toBe(1920);
    expect(metadata.height).toBe(1080);
    expect(metadata.resolution).toBe('1920x1080');
    expect(metadata.fileSize).toBe(2516582);
    expect(metadata.fileSizeFormatted).toBe('2.4 MB');
    expect(metadata.format).toBe('PNG');
    expect(metadata.fileName).toBe('test-image.png');
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should handle JPEG format correctly', async () => {
    const file = new File([''], 'photo.jpeg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1048576 });

    const mockImage = {
      width: 800,
      height: 600,
      onload: null as any,
      onerror: null as any,
      src: '',
    };

    global.Image = vi.fn(() => mockImage) as any;

    const metadataPromise = extractImageMetadata(file);

    setTimeout(() => {
      if (mockImage.onload) {
        mockImage.onload();
      }
    }, 0);

    const metadata = await metadataPromise;

    expect(metadata.format).toBe('JPG');
    expect(metadata.resolution).toBe('800x600');
  });

  it('should handle JPG format correctly', async () => {
    const file = new File([''], 'photo.jpg', { type: 'image/jpg' });
    Object.defineProperty(file, 'size', { value: 512000 });

    const mockImage = {
      width: 1024,
      height: 768,
      onload: null as any,
      onerror: null as any,
      src: '',
    };

    global.Image = vi.fn(() => mockImage) as any;

    const metadataPromise = extractImageMetadata(file);

    setTimeout(() => {
      if (mockImage.onload) {
        mockImage.onload();
      }
    }, 0);

    const metadata = await metadataPromise;

    expect(metadata.format).toBe('JPG');
  });

  it('should reject when image fails to load', async () => {
    const file = new File([''], 'corrupt.png', { type: 'image/png' });

    const mockImage = {
      width: 0,
      height: 0,
      onload: null as any,
      onerror: null as any,
      src: '',
    };

    global.Image = vi.fn(() => mockImage) as any;

    const metadataPromise = extractImageMetadata(file);

    setTimeout(() => {
      if (mockImage.onerror) {
        mockImage.onerror();
      }
    }, 0);

    await expect(metadataPromise).rejects.toThrow('Failed to load image');
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should handle files without MIME type', async () => {
    const file = new File([''], 'image.webp', { type: '' });
    Object.defineProperty(file, 'size', { value: 204800 });

    const mockImage = {
      width: 500,
      height: 500,
      onload: null as any,
      onerror: null as any,
      src: '',
    };

    global.Image = vi.fn(() => mockImage) as any;

    const metadataPromise = extractImageMetadata(file);

    setTimeout(() => {
      if (mockImage.onload) {
        mockImage.onload();
      }
    }, 0);

    const metadata = await metadataPromise;

    expect(metadata.format).toBe('WEBP');
  });

  it('should handle unknown format gracefully', async () => {
    const file = new File([''], 'image', { type: '' });
    Object.defineProperty(file, 'size', { value: 100000 });

    const mockImage = {
      width: 300,
      height: 200,
      onload: null as any,
      onerror: null as any,
      src: '',
    };

    global.Image = vi.fn(() => mockImage) as any;

    const metadataPromise = extractImageMetadata(file);

    setTimeout(() => {
      if (mockImage.onload) {
        mockImage.onload();
      }
    }, 0);

    const metadata = await metadataPromise;

    expect(metadata.format).toBe('UNKNOWN');
  });
});
