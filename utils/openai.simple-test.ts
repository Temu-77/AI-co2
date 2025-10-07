// Simple test file for OpenAI service
import { estimateCO2Emissions } from './openai';
import type { ImageMetadata } from '../types';

console.log('🧪 Running OpenAI Service Tests...\n');

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void | Promise<void>) {
  return async () => {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${name}`);
      console.log(`  Error: ${(error as Error).message}`);
      failed++;
    }
  };
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected "${expected}", got "${actual}"`);
      }
    },
    toBeGreaterThan(value: number) {
      if (!(actual > value)) {
        throw new Error(`Expected ${actual} to be greater than ${value}`);
      }
    },
    toBeLessThan(value: number) {
      if (!(actual < value)) {
        throw new Error(`Expected ${actual} to be less than ${value}`);
      }
    },
    toContain(substring: string) {
      if (!String(actual).includes(substring)) {
        throw new Error(`Expected "${actual}" to contain "${substring}"`);
      }
    }
  };
}

// Mock metadata for testing
const mockMetadata: ImageMetadata = {
  width: 1920,
  height: 1080,
  resolution: '1920x1080',
  fileSize: 2500000, // ~2.4 MB
  fileSizeFormatted: '2.4 MB',
  format: 'PNG',
  fileName: 'test-image.png'
};

const smallImageMetadata: ImageMetadata = {
  width: 800,
  height: 600,
  resolution: '800x600',
  fileSize: 500000, // ~0.48 MB
  fileSizeFormatted: '488 KB',
  format: 'JPG',
  fileName: 'small.jpg'
};

// ===== Fallback calculation tests =====
console.log('🔧 Testing fallback CO2 calculations:\n');

await test('calculates fallback for standard image', async () => {
  // This will use fallback since no API key is configured in test
  const result = await estimateCO2Emissions(mockMetadata);
  
  expect(result.generationCO2).toBeGreaterThan(0);
  expect(result.transmissionCO2PerView).toBeGreaterThan(0);
  expect(result.confidence).toBe('low');
})();

await test('calculates fallback for small image', async () => {
  const result = await estimateCO2Emissions(smallImageMetadata);
  
  expect(result.generationCO2).toBeGreaterThan(0);
  expect(result.transmissionCO2PerView).toBeGreaterThan(0);
  expect(result.confidence).toBe('low');
})();

await test('returns reasonable values for standard image', async () => {
  const result = await estimateCO2Emissions(mockMetadata);
  
  // Generation CO2 should be reasonable (not negative, not absurdly large)
  expect(result.generationCO2).toBeGreaterThan(0);
  expect(result.generationCO2).toBeLessThan(1000);
  
  // Transmission CO2 should be reasonable
  expect(result.transmissionCO2PerView).toBeGreaterThan(0);
  expect(result.transmissionCO2PerView).toBeLessThan(10);
})();

await test('returns reasonable values for small image', async () => {
  const result = await estimateCO2Emissions(smallImageMetadata);
  
  // Small image should have lower values
  expect(result.generationCO2).toBeGreaterThan(0);
  expect(result.generationCO2).toBeLessThan(100);
  
  expect(result.transmissionCO2PerView).toBeGreaterThan(0);
  expect(result.transmissionCO2PerView).toBeLessThan(1);
})();

await test('includes fallback system info', async () => {
  const result = await estimateCO2Emissions(mockMetadata);
  
  if (!result.modelInfo?.system) {
    throw new Error('Expected modelInfo.system to be defined');
  }
  expect(result.modelInfo.system).toContain('Fallback');
})();

await test('handles large images correctly', async () => {
  const largeImage: ImageMetadata = {
    width: 3840,
    height: 2160,
    resolution: '3840x2160',
    fileSize: 10000000, // 10 MB
    fileSizeFormatted: '9.5 MB',
    format: 'PNG',
    fileName: 'large.png'
  };
  
  const result = await estimateCO2Emissions(largeImage);
  
  // Large image should have higher values
  expect(result.generationCO2).toBeGreaterThan(0);
  expect(result.transmissionCO2PerView).toBeGreaterThan(0);
})();

await test('handles very small images correctly', async () => {
  const tinyImage: ImageMetadata = {
    width: 100,
    height: 100,
    resolution: '100x100',
    fileSize: 10000, // 10 KB
    fileSizeFormatted: '9.8 KB',
    format: 'PNG',
    fileName: 'tiny.png'
  };
  
  const result = await estimateCO2Emissions(tinyImage);
  
  // Tiny image should have very low values
  expect(result.generationCO2).toBeGreaterThan(0);
  expect(result.generationCO2).toBeLessThan(1);
  expect(result.transmissionCO2PerView).toBeGreaterThan(0);
  expect(result.transmissionCO2PerView).toBeLessThan(0.1);
})();

// ===== Formula verification tests =====
console.log('\n📐 Testing calculation formulas:\n');

await test('generation CO2 formula is correct', async () => {
  const result = await estimateCO2Emissions(mockMetadata);
  
  // Formula: (width × height × 0.000001) + (fileSize in MB × 0.5)
  const fileSizeInMB = mockMetadata.fileSize / (1024 * 1024);
  const pixelCount = mockMetadata.width * mockMetadata.height;
  const expectedGeneration = (pixelCount * 0.000001) + (fileSizeInMB * 0.5);
  
  // Allow small rounding differences
  const difference = Math.abs(result.generationCO2 - expectedGeneration);
  if (difference > 0.01) {
    throw new Error(`Generation CO2 calculation mismatch: expected ~${expectedGeneration}, got ${result.generationCO2}`);
  }
})();

await test('transmission CO2 formula is correct', async () => {
  const result = await estimateCO2Emissions(mockMetadata);
  
  // Formula: fileSize in MB × 0.15
  const fileSizeInMB = mockMetadata.fileSize / (1024 * 1024);
  const expectedTransmission = fileSizeInMB * 0.15;
  
  // Allow small rounding differences
  const difference = Math.abs(result.transmissionCO2PerView - expectedTransmission);
  if (difference > 0.01) {
    throw new Error(`Transmission CO2 calculation mismatch: expected ~${expectedTransmission}, got ${result.transmissionCO2PerView}`);
  }
})();

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
