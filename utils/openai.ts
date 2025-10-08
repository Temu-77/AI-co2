import type { ImageMetadata, CO2Data, TraditionalCO2Data, CO2EstimationResponse, OpenAIRequest, OpenAIResponse } from '../types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const API_TIMEOUT = 30000; // 30 seconds

/**
 * Fallback estimation logic using formula-based calculations
 * Generation CO2 = (width × height × 0.000001) + (fileSize in MB × 0.5)
 * Transmission CO2 per view = fileSize in MB × 0.15
 */
function calculateFallbackEstimate(metadata: ImageMetadata): CO2Data {
  const fileSizeInMB = metadata.fileSize / (1024 * 1024);
  const pixelCount = metadata.width * metadata.height;
  
  const generationCO2 = (pixelCount * 0.000001) + (fileSizeInMB * 0.5);
  const transmissionCO2PerView = fileSizeInMB * 0.15;
  
  return {
    generationCO2: Math.max(0.01, Math.round(generationCO2 * 100) / 100), // Minimum 0.01g
    transmissionCO2PerView: Math.max(0.001, Math.round(transmissionCO2PerView * 1000) / 1000), // Minimum 0.001g, 3 decimal places
    confidence: 'low',
    modelInfo: {
      system: 'Fallback calculation'
    }
  };
}

/**
 * Fallback traditional estimation based on image complexity
 */
function calculateFallbackTraditionalEstimate(metadata: ImageMetadata): TraditionalCO2Data {
  const pixels = metadata.width * metadata.height;
  const fileSizeMB = metadata.fileSize / (1024 * 1024);
  
  // Determine complexity based on resolution and file size
  let complexity: 'Basic' | 'Standard' | 'Premium' | 'Enterprise';
  let designTime: number;
  let revisions: number;
  let stockPhotos: number;
  let photoshoot: boolean;
  
  if (pixels < 500000 || fileSizeMB < 0.5) {
    complexity = 'Basic';
    designTime = 2;
    revisions = 2;
    stockPhotos = 1;
    photoshoot = false;
  } else if (pixels < 2000000 || fileSizeMB < 2) {
    complexity = 'Standard';
    designTime = 4;
    revisions = 3;
    stockPhotos = 2;
    photoshoot = false;
  } else if (pixels < 8000000 || fileSizeMB < 5) {
    complexity = 'Premium';
    designTime = 8;
    revisions = 4;
    stockPhotos = 3;
    photoshoot = true;
  } else {
    complexity = 'Enterprise';
    designTime = 16;
    revisions = 5;
    stockPhotos = 5;
    photoshoot = true;
  }
  
  // Calculate CO2 based on design process
  // Designer work: ~0.5kg CO2/hour, Stock photos: ~0.1kg each, Photoshoot: ~2kg
  const designerCO2 = designTime * 500; // 500g per hour
  const stockPhotosCO2 = stockPhotos * 100; // 100g per photo
  const photoshootCO2 = photoshoot ? 2000 : 0; // 2kg for photoshoot
  const revisionsCO2 = revisions * 200; // 200g per revision
  
  const totalDesignCO2 = designerCO2 + stockPhotosCO2 + photoshootCO2 + revisionsCO2;
  
  return {
    designCO2: totalDesignCO2,
    designTime,
    revisions,
    stockPhotos,
    photoshoot,
    complexity,
    confidence: 'low'
  };
}

/**
 * Validates the CO2 estimation response from OpenAI
 */
function validateCO2Response(data: any): data is CO2EstimationResponse {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // Check required numeric fields
  if (typeof data.generationCO2 !== 'number' || isNaN(data.generationCO2)) {
    return false;
  }
  
  if (typeof data.transmissionCO2PerView !== 'number' || isNaN(data.transmissionCO2PerView)) {
    return false;
  }
  
  // Check reasonable ranges (CO2 values should be positive and not absurdly large)
  if (data.generationCO2 < 0 || data.generationCO2 > 1000000) {
    return false;
  }
  
  if (data.transmissionCO2PerView < 0 || data.transmissionCO2PerView > 10000) {
    return false;
  }
  
  return true;
}

/**
 * Validates the traditional CO2 estimation response from OpenAI
 */
function validateTraditionalCO2Response(data: any): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // Check required numeric fields
  if (typeof data.designCO2 !== 'number' || isNaN(data.designCO2)) {
    return false;
  }
  
  if (typeof data.designTime !== 'number' || isNaN(data.designTime)) {
    return false;
  }
  
  if (typeof data.revisions !== 'number' || isNaN(data.revisions)) {
    return false;
  }
  
  if (typeof data.stockPhotos !== 'number' || isNaN(data.stockPhotos)) {
    return false;
  }
  
  if (typeof data.photoshoot !== 'boolean') {
    return false;
  }
  
  // Check reasonable ranges
  if (data.designCO2 < 0 || data.designCO2 > 100000) {
    return false;
  }
  
  if (data.designTime < 0 || data.designTime > 100) {
    return false;
  }
  
  return true;
}

/**
 * Creates a timeout promise that rejects after the specified duration
 */
function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
}

/**
 * Estimates CO2 emissions for an AI-generated image using OpenAI API
 * Falls back to formula-based calculation if API fails
 */
export async function estimateCO2Emissions(metadata: ImageMetadata): Promise<CO2Data> {
  // Get API key from Vite environment
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  // If no API key, use fallback immediately
  if (!apiKey) {
    console.warn('No OpenAI API key found, using fallback estimation');
    return calculateFallbackEstimate(metadata);
  }
  
  try {
    // Get model from environment or use default
    const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';

    // Prepare the API request (without response_format for compatibility)
    const request: Partial<OpenAIRequest> = {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an environmental AI expert specializing in calculating CO2 emissions for AI-generated ad banners. You must respond ONLY with valid JSON, no other text.'
        },
        {
          role: 'user',
          content: `Calculate the CO2 emissions for an AI-generated ad banner with the following specifications:

Ad Image Specifications:
- Resolution: ${metadata.resolution} (${metadata.width * metadata.height} pixels)
- File Size: ${metadata.fileSizeFormatted}
- Format: ${metadata.format}

AI Generation System Details:
- AI Model: MugenAI Ads 2
- Image Generation Model: GPT-o3
- Prompt Generation Model: Gemini 2.0 Flash-Exp
- System: 4GB RAM, 1 CPU, Linux Kernel
- Server Location: Asia-Northeast (Tokyo)

Calculation Guidelines:
1. Generation CO2 (in grams):
   - Consider GPU compute time for image generation (typically 10-60 seconds for high-res images)
   - Factor in prompt processing by Gemini 2.0
   - Account for Tokyo datacenter energy mix (~500g CO2/kWh)
   - Higher resolution = more compute = more CO2
   - Typical range: 5-100g depending on resolution and complexity

2. Transmission CO2 per view (in grams):
   - Based on file size and network transmission
   - Formula: fileSize(MB) × 0.15g per view
   - Includes CDN delivery and end-user download

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "generationCO2": <number in grams>,
  "transmissionCO2PerView": <number in grams>,
  "confidence": "high" | "medium" | "low",
  "modelInfo": {
    "imageGen": "GPT-o3",
    "promptGen": "Gemini 2.0 Flash-Exp",
    "system": "4GB 1CPU Linux",
    "location": "Tokyo"
  }
}

Example for a 1920x1080 image (0.5MB):
{"generationCO2": 15.5, "transmissionCO2PerView": 0.075, "confidence": "high", "modelInfo": {"imageGen": "GPT-o3", "promptGen": "Gemini 2.0 Flash-Exp", "system": "4GB 1CPU Linux", "location": "Tokyo"}}`
        }
      ],
      temperature: 0.3
    };
    
    // Make the API call with timeout
    const fetchPromise = fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(request)
    });
    
    const response = await Promise.race([
      fetchPromise,
      createTimeoutPromise(API_TIMEOUT)
    ]) as Response;
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else {
        throw new Error(`API request failed with status ${response.status}`);
      }
    }
    
    // Parse the response
    const data: OpenAIResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Invalid API response: no choices returned');
    }
    
    let content = data.choices[0].message.content;
    
    // Clean up the content - remove markdown code blocks if present
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const parsedContent: CO2EstimationResponse = JSON.parse(content);
    
    // Validate the response
    if (!validateCO2Response(parsedContent)) {
      console.warn('Invalid CO2 data from API, using fallback');
      return calculateFallbackEstimate(metadata);
    }
    
    // Return the validated CO2 data
    return {
      generationCO2: parsedContent.generationCO2,
      transmissionCO2PerView: parsedContent.transmissionCO2PerView,
      modelInfo: parsedContent.modelInfo,
      confidence: parsedContent.confidence || 'medium'
    };
    
  } catch (error) {
    // Log the error and use fallback
    console.error('Error calling OpenAI API:', error);
    
    // Provide user-friendly error message
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        console.warn('API request timed out, using fallback estimation');
      } else if (error.message.includes('rate limit')) {
        console.warn('Rate limit exceeded, using fallback estimation');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        console.warn('Network error, using fallback estimation');
      }
    }
    
    // Always return fallback estimate on error
    return calculateFallbackEstimate(metadata);
  }
}

/**
 * Estimates CO2 emissions for traditional design process using GPT-4o-mini
 * Falls back to formula-based calculation if API fails
 */
export async function estimateTraditionalCO2Emissions(metadata: ImageMetadata): Promise<TraditionalCO2Data> {
  // Get API key from Vite environment
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  // If no API key, use fallback immediately
  if (!apiKey) {
    console.warn('No OpenAI API key found, using fallback traditional estimation');
    return calculateFallbackTraditionalEstimate(metadata);
  }
  
  try {
    // Use GPT-4o-mini for traditional estimation
    const model = 'gpt-4o-mini';

    // Prepare the API request
    const request: Partial<OpenAIRequest> = {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a design industry expert specializing in traditional ad banner creation processes and their environmental impact. You must respond ONLY with valid JSON, no other text.'
        },
        {
          role: 'user',
          content: `Analyze this ad banner image and estimate the traditional design process that would be required to create it:

Image Specifications:
- Resolution: ${metadata.resolution} (${metadata.width * metadata.height} pixels)
- File Size: ${metadata.fileSizeFormatted}
- Format: ${metadata.format}

Please estimate the traditional design process requirements:

1. Design Time: Hours needed for a human designer to create this banner
2. Revisions: Number of revision rounds typically needed
3. Stock Photos: Number of stock photos that would be purchased/used
4. Photoshoot: Whether a custom photoshoot would be required (boolean)
5. Complexity: Overall complexity tier (Basic/Standard/Premium/Enterprise)

CO2 Calculation Guidelines:
- Designer work: ~500g CO2 per hour (computer usage, office energy)
- Stock photos: ~100g CO2 per photo (server storage, processing, delivery)
- Photoshoot: ~2000g CO2 (equipment, lighting, travel, processing)
- Revisions: ~200g CO2 per revision (additional designer time, client communication)

Consider these factors:
- Higher resolution = more detailed work = more time
- Complex layouts require more design iterations
- Professional quality images may need photoshoots
- File size can indicate image complexity and quality

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "designCO2": <total CO2 in grams>,
  "designTime": <hours as number>,
  "revisions": <number of revisions>,
  "stockPhotos": <number of stock photos>,
  "photoshoot": <true or false>,
  "complexity": "Basic" | "Standard" | "Premium" | "Enterprise",
  "confidence": "high" | "medium" | "low"
}

Example for a 1920x1080 professional banner:
{"designCO2": 4800, "designTime": 6, "revisions": 3, "stockPhotos": 2, "photoshoot": true, "complexity": "Premium", "confidence": "high"}`
        }
      ],
      temperature: 0.3
    };
    
    // Make the API call with timeout
    const fetchPromise = fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(request)
    });
    
    const response = await Promise.race([
      fetchPromise,
      createTimeoutPromise(API_TIMEOUT)
    ]) as Response;
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error for traditional estimation:', response.status, errorText);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    // Parse the response
    const data: OpenAIResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('Invalid API response: no choices returned');
    }
    
    let content = data.choices[0].message.content;
    
    // Clean up the content - remove markdown code blocks if present
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const parsedContent = JSON.parse(content);
    
    // Validate the response
    if (!validateTraditionalCO2Response(parsedContent)) {
      console.warn('Invalid traditional CO2 data from API, using fallback');
      return calculateFallbackTraditionalEstimate(metadata);
    }
    
    // Return the validated traditional CO2 data
    return {
      designCO2: parsedContent.designCO2,
      designTime: parsedContent.designTime,
      revisions: parsedContent.revisions,
      stockPhotos: parsedContent.stockPhotos,
      photoshoot: parsedContent.photoshoot,
      complexity: parsedContent.complexity,
      confidence: parsedContent.confidence || 'medium'
    };
    
  } catch (error) {
    // Log the error and use fallback
    console.error('Error calling OpenAI API for traditional estimation:', error);
    
    // Always return fallback estimate on error
    return calculateFallbackTraditionalEstimate(metadata);
  }
}
