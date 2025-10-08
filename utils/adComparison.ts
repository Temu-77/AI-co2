import { ImageMetadata } from '../types';

export interface ResolutionTier {
  name: string;
  range: string;
  pixelThreshold: number;
}

export interface TraditionalAdData {
  designTime: number; // hours
  revisions: number;
  photoshoot?: boolean;
  stockPhotos: number;
  designerCO2PerHour: number; // grams CO2 per hour
  photoshootCO2: number; // grams CO2 if photoshoot needed
  stockPhotoCO2: number; // grams CO2 per stock photo
  computerUsageCO2: number; // grams CO2 for computer usage
  totalCO2: number; // calculated total
}

export interface ComparisonData {
  tier: ResolutionTier;
  aiGenerated: {
    co2: number;
    method: string;
  };
  traditional: TraditionalAdData;
  savings: {
    co2Grams: number;
    percentage: number;
  };
}

// Resolution tier definitions
export const RESOLUTION_TIERS: ResolutionTier[] = [
  {
    name: 'Low Resolution',
    range: '≤ 1MP (e.g., 1024×768)',
    pixelThreshold: 1000000 // 1 megapixel
  },
  {
    name: 'Medium Resolution', 
    range: '1-4MP (e.g., 1920×1080)',
    pixelThreshold: 4000000 // 4 megapixels
  },
  {
    name: 'High Resolution',
    range: '> 4MP (e.g., 4K+)',
    pixelThreshold: Infinity
  }
];

// Traditional ad creation data by resolution tier
export const TRADITIONAL_AD_DATA: Record<string, TraditionalAdData> = {
  'Low Resolution': {
    designTime: 3, // 3 hours for simple banner
    revisions: 2,
    photoshoot: false,
    stockPhotos: 1,
    designerCO2PerHour: 150, // Designer working (computer + office)
    photoshootCO2: 0,
    stockPhotoCO2: 50, // CO2 for stock photo licensing/download
    computerUsageCO2: 200, // Photoshop/Illustrator usage
    totalCO2: 0 // Will be calculated
  },
  'Medium Resolution': {
    designTime: 6, // 6 hours for detailed banner
    revisions: 3,
    photoshoot: false,
    stockPhotos: 2,
    designerCO2PerHour: 150,
    photoshootCO2: 0,
    stockPhotoCO2: 50,
    computerUsageCO2: 400, // More intensive design work
    totalCO2: 0
  },
  'High Resolution': {
    designTime: 12, // 12 hours for high-end banner
    revisions: 4,
    photoshoot: true, // May need custom photography
    stockPhotos: 3,
    designerCO2PerHour: 150,
    photoshootCO2: 2500, // Studio, lighting, travel, equipment
    stockPhotoCO2: 50,
    computerUsageCO2: 800, // High-res design work
    totalCO2: 0
  }
};

// Calculate traditional ad CO2 emissions
function calculateTraditionalCO2(data: TraditionalAdData): number {
  const designerCO2 = data.designTime * data.designerCO2PerHour;
  const revisionCO2 = data.revisions * (data.designTime * 0.3) * data.designerCO2PerHour; // 30% of original time per revision
  const stockPhotoCO2 = data.stockPhotos * data.stockPhotoCO2;
  const photoshootCO2 = data.photoshoot ? data.photoshootCO2 : 0;
  
  return designerCO2 + revisionCO2 + stockPhotoCO2 + photoshootCO2 + data.computerUsageCO2;
}

// Initialize traditional data with calculated totals
Object.keys(TRADITIONAL_AD_DATA).forEach(tier => {
  TRADITIONAL_AD_DATA[tier].totalCO2 = calculateTraditionalCO2(TRADITIONAL_AD_DATA[tier]);
});

/**
 * Determine resolution tier based on image metadata
 */
export function getResolutionTier(metadata: ImageMetadata): ResolutionTier {
  const pixelCount = metadata.width * metadata.height;
  
  for (const tier of RESOLUTION_TIERS) {
    if (pixelCount <= tier.pixelThreshold) {
      return tier;
    }
  }
  
  return RESOLUTION_TIERS[RESOLUTION_TIERS.length - 1]; // Default to highest tier
}

/**
 * Generate comparison data between AI and traditional ad creation
 */
export function generateComparison(
  metadata: ImageMetadata, 
  aiGeneratedCO2: number
): ComparisonData {
  const tier = getResolutionTier(metadata);
  const traditionalData = { ...TRADITIONAL_AD_DATA[tier.name] };
  
  const co2Savings = traditionalData.totalCO2 - aiGeneratedCO2;
  const percentageSavings = ((co2Savings / traditionalData.totalCO2) * 100);
  
  return {
    tier,
    aiGenerated: {
      co2: aiGeneratedCO2,
      method: 'MugenAI Ads 2 (GPT-o3 + Gemini 2.0)'
    },
    traditional: traditionalData,
    savings: {
      co2Grams: co2Savings,
      percentage: Math.max(0, percentageSavings) // Ensure non-negative
    }
  };
}

/**
 * Get all resolution tiers for display purposes
 */
export function getAllTierComparisons(
  _metadata: ImageMetadata,
  aiGeneratedCO2: number
): ComparisonData[] {
  return RESOLUTION_TIERS.map(tier => {
    const traditionalData = { ...TRADITIONAL_AD_DATA[tier.name] };
    const co2Savings = traditionalData.totalCO2 - aiGeneratedCO2;
    const percentageSavings = ((co2Savings / traditionalData.totalCO2) * 100);
    
    return {
      tier,
      aiGenerated: {
        co2: aiGeneratedCO2,
        method: 'MugenAI Ads 2 (GPT-o3 + Gemini 2.0)'
      },
      traditional: traditionalData,
      savings: {
        co2Grams: co2Savings,
        percentage: Math.max(0, percentageSavings)
      }
    };
  });
}