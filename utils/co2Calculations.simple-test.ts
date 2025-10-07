#!/usr/bin/env tsx

import {
  calculateTotalCO2,
  calculateRecoveryMetrics,
  formatCO2Value
} from './co2Calculations';

console.log('🧪 Running CO2 Calculation Utility Tests...\n');

let passedTests = 0;
let failedTests = 0;

function test(description: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${description}`);
    passedTests++;
  } catch (error) {
    console.log(`✗ ${description}`);
    console.log(`  Error: ${error instanceof Error ? error.message : String(error)}`);
    failedTests++;
  }
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
    },
    toBeCloseTo(expected: number, decimals: number = 2) {
      const factor = Math.pow(10, decimals);
      const roundedActual = Math.round(actual * factor) / factor;
      const roundedExpected = Math.round(expected * factor) / factor;
      if (roundedActual !== roundedExpected) {
        throw new Error(`Expected ${expected} (±${1/factor}), but got ${actual}`);
      }
    },
    toThrow(expectedMessage?: string) {
      let threw = false;
      let thrownMessage = '';
      try {
        actual();
      } catch (error) {
        threw = true;
        thrownMessage = error instanceof Error ? error.message : String(error);
      }
      if (!threw) {
        throw new Error('Expected function to throw an error');
      }
      if (expectedMessage && !thrownMessage.includes(expectedMessage)) {
        throw new Error(`Expected error message to include "${expectedMessage}", but got "${thrownMessage}"`);
      }
    }
  };
}

// calculateTotalCO2 tests
console.log('📊 Testing calculateTotalCO2:\n');

test('calculates total CO2 with generation and transmission', () => {
  const result = calculateTotalCO2(100, 0.5, 1000);
  expect(result).toBe(600);
});

test('handles zero transmission CO2', () => {
  const result = calculateTotalCO2(100, 0, 1000);
  expect(result).toBe(100);
});

test('handles zero view count', () => {
  const result = calculateTotalCO2(100, 0.5, 0);
  expect(result).toBe(100);
});

test('handles large view counts', () => {
  const result = calculateTotalCO2(500, 0.15, 1000000);
  expect(result).toBe(150500);
});

test('handles decimal values', () => {
  const result = calculateTotalCO2(123.45, 0.678, 500);
  expect(result).toBeCloseTo(462.45, 2);
});

test('throws error for negative generation CO2', () => {
  expect(() => calculateTotalCO2(-100, 0.5, 1000)).toThrow('CO2 values and view count must be non-negative');
});

test('throws error for negative transmission CO2', () => {
  expect(() => calculateTotalCO2(100, -0.5, 1000)).toThrow('CO2 values and view count must be non-negative');
});

test('throws error for negative view count', () => {
  expect(() => calculateTotalCO2(100, 0.5, -1000)).toThrow('CO2 values and view count must be non-negative');
});

// calculateRecoveryMetrics tests
console.log('\n🌱 Testing calculateRecoveryMetrics:\n');

test('calculates recovery metrics for 1 kg CO2', () => {
  const result = calculateRecoveryMetrics(1);
  expect(result.treesToPlant).toBe(1);
  expect(result.plasticBottles).toBe(34);
  expect(result.bikeKilometers).toBe(4.8);
  expect(result.oceanAbsorptionHours).toBe(10000);
});

test('calculates recovery metrics for 21 kg CO2 (1 tree)', () => {
  const result = calculateRecoveryMetrics(21);
  expect(result.treesToPlant).toBe(1);
  expect(result.plasticBottles).toBe(700);
  expect(result.bikeKilometers).toBe(100);
  expect(result.oceanAbsorptionHours).toBe(210000);
});

test('calculates recovery metrics for large CO2 values', () => {
  const result = calculateRecoveryMetrics(1000);
  expect(result.treesToPlant).toBe(48);
  expect(result.plasticBottles).toBe(33334);
  expect(result.bikeKilometers).toBe(4761.9);
  expect(result.oceanAbsorptionHours).toBe(10000000);
});

test('handles small CO2 values', () => {
  const result = calculateRecoveryMetrics(0.1);
  expect(result.treesToPlant).toBe(1);
  expect(result.plasticBottles).toBe(4);
  expect(result.bikeKilometers).toBe(0.5);
  expect(result.oceanAbsorptionHours).toBe(1000);
});

test('handles zero CO2', () => {
  const result = calculateRecoveryMetrics(0);
  expect(result.treesToPlant).toBe(0);
  expect(result.plasticBottles).toBe(0);
  expect(result.bikeKilometers).toBe(0);
  expect(result.oceanAbsorptionHours).toBe(0);
});

test('throws error for negative CO2', () => {
  expect(() => calculateRecoveryMetrics(-10)).toThrow('Total CO2 must be non-negative');
});

// formatCO2Value tests
console.log('\n💨 Testing formatCO2Value:\n');

test('formats values less than 1kg in grams', () => {
  expect(formatCO2Value(0)).toBe('0g');
  expect(formatCO2Value(1)).toBe('1g');
  expect(formatCO2Value(500)).toBe('500g');
  expect(formatCO2Value(999)).toBe('999g');
});

test('formats values >= 1kg in kilograms with 2 decimals', () => {
  expect(formatCO2Value(1000)).toBe('1.00kg');
  expect(formatCO2Value(5000)).toBe('5.00kg');
  expect(formatCO2Value(9999)).toBe('10.00kg'); // 9.999 rounds to 10.00
});

test('uses 2 decimal places for values < 10kg', () => {
  expect(formatCO2Value(1234)).toBe('1.23kg');
  expect(formatCO2Value(5678)).toBe('5.68kg');
  expect(formatCO2Value(9500)).toBe('9.50kg');
});

test('uses 1 decimal place for values 10kg-100kg', () => {
  expect(formatCO2Value(10000)).toBe('10.0kg');
  expect(formatCO2Value(45678)).toBe('45.7kg');
  expect(formatCO2Value(99999)).toBe('100kg');
});

test('uses no decimal places for values >= 100kg', () => {
  expect(formatCO2Value(100000)).toBe('100kg');
  expect(formatCO2Value(500000)).toBe('500kg');
  expect(formatCO2Value(1234567)).toBe('1235kg');
});

test('rounds grams to nearest integer', () => {
  expect(formatCO2Value(123.4)).toBe('123g');
  expect(formatCO2Value(123.6)).toBe('124g');
});

test('throws error for negative values', () => {
  expect(() => formatCO2Value(-100)).toThrow('CO2 value must be non-negative');
});

test('handles very large values', () => {
  expect(formatCO2Value(10000000)).toBe('10000kg');
});

// Integration tests
console.log('\n🔗 Testing Integration:\n');

test('calculates and formats a complete CO2 analysis', () => {
  const generationCO2 = 500;
  const transmissionCO2PerView = 0.15;
  const viewCount = 1000000;

  const totalCO2 = calculateTotalCO2(generationCO2, transmissionCO2PerView, viewCount);
  expect(totalCO2).toBe(150500);

  const formatted = formatCO2Value(totalCO2);
  expect(formatted).toBe('151kg');

  const metrics = calculateRecoveryMetrics(totalCO2 / 1000);
  expect(metrics.treesToPlant).toBe(8);
  expect(metrics.plasticBottles).toBe(5017);
  expect(metrics.bikeKilometers).toBe(716.7);
  expect(metrics.oceanAbsorptionHours).toBe(1505000);
});

test('handles small image with few views', () => {
  const totalCO2 = calculateTotalCO2(50, 0.01, 100);
  expect(totalCO2).toBe(51);

  const formatted = formatCO2Value(totalCO2);
  expect(formatted).toBe('51g');

  const metrics = calculateRecoveryMetrics(totalCO2 / 1000);
  expect(metrics.treesToPlant).toBe(1);
  expect(metrics.plasticBottles).toBe(2);
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`📊 Test Results: ${passedTests} passed, ${failedTests} failed`);
console.log('='.repeat(50));

if (failedTests === 0) {
  console.log('\n✅ All tests passed!\n');
  process.exit(0);
} else {
  console.log(`\n❌ ${failedTests} test(s) failed!\n`);
  process.exit(1);
}
