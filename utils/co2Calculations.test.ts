import { describe, it, expect } from 'vitest';
import {
  calculateTotalCO2,
  calculateRecoveryMetrics,
  formatCO2Value
} from './co2Calculations';

describe('calculateTotalCO2', () => {
  it('should calculate total CO2 with generation and transmission', () => {
    const result = calculateTotalCO2(100, 0.5, 1000);
    expect(result).toBe(600); // 100 + (0.5 * 1000)
  });

  it('should handle zero transmission CO2', () => {
    const result = calculateTotalCO2(100, 0, 1000);
    expect(result).toBe(100);
  });

  it('should handle zero view count', () => {
    const result = calculateTotalCO2(100, 0.5, 0);
    expect(result).toBe(100);
  });

  it('should handle large view counts', () => {
    const result = calculateTotalCO2(500, 0.15, 1000000);
    expect(result).toBe(150500); // 500 + (0.15 * 1000000)
  });

  it('should handle decimal values', () => {
    const result = calculateTotalCO2(123.45, 0.678, 500);
    expect(result).toBeCloseTo(462.45, 2);
  });

  it('should throw error for negative generation CO2', () => {
    expect(() => calculateTotalCO2(-100, 0.5, 1000)).toThrow(
      'CO2 values and view count must be non-negative'
    );
  });

  it('should throw error for negative transmission CO2', () => {
    expect(() => calculateTotalCO2(100, -0.5, 1000)).toThrow(
      'CO2 values and view count must be non-negative'
    );
  });

  it('should throw error for negative view count', () => {
    expect(() => calculateTotalCO2(100, 0.5, -1000)).toThrow(
      'CO2 values and view count must be non-negative'
    );
  });
});

describe('calculateRecoveryMetrics', () => {
  it('should calculate recovery metrics for 1 kg CO2', () => {
    const result = calculateRecoveryMetrics(1);
    
    expect(result.treesToPlant).toBe(1); // ceil(1/21)
    expect(result.plasticBottles).toBe(34); // ceil(1/0.03)
    expect(result.bikeKilometers).toBe(4.8); // round(1/0.21, 1)
    expect(result.oceanAbsorptionHours).toBe(10000); // round(1/0.0001)
  });

  it('should calculate recovery metrics for 21 kg CO2 (1 tree)', () => {
    const result = calculateRecoveryMetrics(21);
    
    expect(result.treesToPlant).toBe(1);
    expect(result.plasticBottles).toBe(700);
    expect(result.bikeKilometers).toBe(100);
    expect(result.oceanAbsorptionHours).toBe(210000);
  });

  it('should calculate recovery metrics for large CO2 values', () => {
    const result = calculateRecoveryMetrics(1000);
    
    expect(result.treesToPlant).toBe(48); // ceil(1000/21)
    expect(result.plasticBottles).toBe(33334); // ceil(1000/0.03)
    expect(result.bikeKilometers).toBe(4761.9); // round(1000/0.21, 1)
    expect(result.oceanAbsorptionHours).toBe(10000000);
  });

  it('should handle small CO2 values', () => {
    const result = calculateRecoveryMetrics(0.1);
    
    expect(result.treesToPlant).toBe(1); // ceil always rounds up
    expect(result.plasticBottles).toBe(4);
    expect(result.bikeKilometers).toBe(0.5);
    expect(result.oceanAbsorptionHours).toBe(1000);
  });

  it('should handle zero CO2', () => {
    const result = calculateRecoveryMetrics(0);
    
    expect(result.treesToPlant).toBe(0);
    expect(result.plasticBottles).toBe(0);
    expect(result.bikeKilometers).toBe(0);
    expect(result.oceanAbsorptionHours).toBe(0);
  });

  it('should throw error for negative CO2', () => {
    expect(() => calculateRecoveryMetrics(-10)).toThrow(
      'Total CO2 must be non-negative'
    );
  });

  it('should round trees up to ensure full coverage', () => {
    const result = calculateRecoveryMetrics(10.5);
    expect(result.treesToPlant).toBe(1); // ceil(10.5/21) = ceil(0.5) = 1
  });

  it('should round plastic bottles up', () => {
    const result = calculateRecoveryMetrics(0.05);
    expect(result.plasticBottles).toBe(2); // ceil(0.05/0.03) = ceil(1.67) = 2
  });
});

describe('formatCO2Value', () => {
  it('should format values less than 1kg in grams', () => {
    expect(formatCO2Value(0)).toBe('0g');
    expect(formatCO2Value(1)).toBe('1g');
    expect(formatCO2Value(500)).toBe('500g');
    expect(formatCO2Value(999)).toBe('999g');
  });

  it('should format values >= 1kg in kilograms', () => {
    expect(formatCO2Value(1000)).toBe('1.00kg');
    expect(formatCO2Value(5000)).toBe('5.00kg');
    expect(formatCO2Value(9999)).toBe('10.00kg'); // 9.999 rounds to 10.00
  });

  it('should use 2 decimal places for values < 10kg', () => {
    expect(formatCO2Value(1234)).toBe('1.23kg');
    expect(formatCO2Value(5678)).toBe('5.68kg');
    expect(formatCO2Value(9500)).toBe('9.50kg');
  });

  it('should use 1 decimal place for values 10kg-100kg', () => {
    expect(formatCO2Value(10000)).toBe('10.0kg');
    expect(formatCO2Value(45678)).toBe('45.7kg');
    expect(formatCO2Value(99999)).toBe('100kg');
  });

  it('should use no decimal places for values >= 100kg', () => {
    expect(formatCO2Value(100000)).toBe('100kg');
    expect(formatCO2Value(500000)).toBe('500kg');
    expect(formatCO2Value(1234567)).toBe('1235kg');
  });

  it('should round grams to nearest integer', () => {
    expect(formatCO2Value(123.4)).toBe('123g');
    expect(formatCO2Value(123.6)).toBe('124g');
  });

  it('should handle decimal gram values', () => {
    expect(formatCO2Value(0.5)).toBe('1g'); // rounds to 1
    expect(formatCO2Value(0.4)).toBe('0g'); // rounds to 0
  });

  it('should throw error for negative values', () => {
    expect(() => formatCO2Value(-100)).toThrow(
      'CO2 value must be non-negative'
    );
  });

  it('should handle very large values', () => {
    expect(formatCO2Value(10000000)).toBe('10000kg');
  });
});

describe('Integration: Full calculation flow', () => {
  it('should calculate and format a complete CO2 analysis', () => {
    // Scenario: 500g generation, 0.15g per view, 1M views
    const generationCO2 = 500;
    const transmissionCO2PerView = 0.15;
    const viewCount = 1000000;

    const totalCO2 = calculateTotalCO2(generationCO2, transmissionCO2PerView, viewCount);
    expect(totalCO2).toBe(150500); // 500 + 150000

    const formatted = formatCO2Value(totalCO2);
    expect(formatted).toBe('151kg');

    const metrics = calculateRecoveryMetrics(totalCO2 / 1000);
    expect(metrics.treesToPlant).toBe(8);
    expect(metrics.plasticBottles).toBe(5017);
    expect(metrics.bikeKilometers).toBe(716.7);
    expect(metrics.oceanAbsorptionHours).toBe(1505000);
  });

  it('should handle small image with few views', () => {
    const totalCO2 = calculateTotalCO2(50, 0.01, 100);
    expect(totalCO2).toBe(51);

    const formatted = formatCO2Value(totalCO2);
    expect(formatted).toBe('51g');

    const metrics = calculateRecoveryMetrics(totalCO2 / 1000);
    expect(metrics.treesToPlant).toBe(1);
    expect(metrics.plasticBottles).toBe(2);
  });
});
