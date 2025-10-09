import { RecoveryMetrics } from '../types';

/**
 * Calculate total CO2 emissions combining generation and transmission
 * @param generationCO2 - CO2 from image generation in grams
 * @param transmissionCO2PerView - CO2 per view in grams
 * @param viewCount - Number of views
 * @returns Total CO2 in grams
 */
export function calculateTotalCO2(
  generationCO2: number,
  transmissionCO2PerView: number,
  viewCount: number
): number {
  if (generationCO2 < 0 || transmissionCO2PerView < 0 || viewCount < 0) {
    throw new Error('CO2 values and view count must be non-negative');
  }
  
  const transmissionTotal = transmissionCO2PerView * viewCount;
  return generationCO2 + transmissionTotal;
}

/**
 * Calculate environmental recovery metrics based on total CO2
 * @param totalCO2kg - Total CO2 in kilograms
 * @returns Recovery metrics object
 */
export function calculateRecoveryMetrics(totalCO2kg: number): RecoveryMetrics {
  if (totalCO2kg < 0) {
    throw new Error('Total CO2 must be non-negative');
  }

  // Based on environmental research averages:
  // - One tree absorbs ~21 kg CO2 per year
  // - One bee hotel supports pollinators that offset ~5 kg CO2 through ecosystem services
  // - Walking to school instead of car ride saves ~2 kg CO2 per week
  // - Recycling one plastic bottle saves ~0.03 kg CO2
  
  const treesToPlant = totalCO2kg / 21;
  const beeHotels = totalCO2kg / 5;
  const walkingWeeks = totalCO2kg / 2;
  const plasticBottles = totalCO2kg / 0.03;

  return {
    treesToPlant: Math.ceil(treesToPlant),
    beeHotels: Math.ceil(beeHotels),
    walkingWeeks: Math.ceil(walkingWeeks),
    plasticBottles: Math.ceil(plasticBottles)
  };
}

/**
 * Format CO2 value for display (grams or kilograms)
 * @param co2Grams - CO2 value in grams
 * @returns Formatted string with appropriate unit
 */
export function formatCO2Value(co2Grams: number): string {
  // Handle edge cases: negative values, NaN, or very small values
  if (isNaN(co2Grams) || co2Grams < 0) {
    co2Grams = 0;
  }

  // Use grams for values less than 1kg
  if (co2Grams < 1000) {
    return `${Math.round(co2Grams)}g`;
  }

  // Use kilograms for values >= 1kg
  const co2Kg = co2Grams / 1000;
  
  // Format with appropriate decimal places
  if (co2Kg < 10) {
    return `${co2Kg.toFixed(2)}kg`;
  } else if (co2Kg < 100) {
    // Round to 1 decimal, but if it rounds to 100, show without decimals
    const rounded = Math.round(co2Kg * 10) / 10;
    if (rounded >= 100) {
      return `${Math.round(co2Kg)}kg`;
    }
    return `${co2Kg.toFixed(1)}kg`;
  } else {
    return `${Math.round(co2Kg)}kg`;
  }
}
