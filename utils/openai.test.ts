import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { estimateCO2Emissions } from './openai';
import type { ImageMetadata } from '../types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_OPENAI_API_KEY: 'test-api-key'
    }
  }
});

describe('estimateCO2Emissions', () => {
  const mockMetadata: ImageMetadata = {
    width: 1920,
    height: 1080,
    resolution: '1920x1080',
    fileSize: 2500000, // ~2.4 MB
    fileSizeFormatted: '2.4 MB',
    format: 'PNG',
    fileName: 'test-image.png'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should successfully call OpenAI API and return CO2 data', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              generationCO2: 15.5,
              transmissionCO2PerView: 0.36,
              confidence: 'high',
              modelInfo: {
                imageGen: 'DALL-E 3',
                system: 'Azure OpenAI'
              }
            })
          }
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await estimateCO2Emissions(mockMetadata);

    expect(result.generationCO2).toBe(15.5);
    expect(result.transmissionCO2PerView).toBe(0.36);
    expect(result.confidence).toBe('high');
    expect(result.modelInfo?.imageGen).toBe('DALL-E 3');
  });

  it('should use fallback calculation when API key is missing', async () => {
    // Temporarily remove API key
    vi.stubGlobal('import', {
      meta: {
        env: {
          VITE_OPENAI_API_KEY: undefined
        }
      }
    });

    const result = await estimateCO2Emissions(mockMetadata);

    // Verify fallback calculation
    // Generation: (1920 * 1080 * 0.000001) + (2.38 * 0.5) ≈ 3.27
    // Transmission: 2.38 * 0.15 ≈ 0.36
    expect(result.generationCO2).toBeGreaterThan(0);
    expect(result.transmissionCO2PerView).toBeGreaterThan(0);
    expect(result.confidence).toBe('low');
    expect(result.modelInfo?.system).toBe('Fallback calculation');

    // Restore API key
    vi.stubGlobal('import', {
      meta: {
        env: {
          VITE_OPENAI_API_KEY: 'test-api-key'
        }
      }
    });
  });

  it('should handle network errors and use fallback', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await estimateCO2Emissions(mockMetadata);

    expect(result.confidence).toBe('low');
    expect(result.modelInfo?.system).toBe('Fallback calculation');
  });

  it('should handle API timeout and use fallback', async () => {
    // Mock a delayed response that exceeds timeout
    mockFetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 35000))
    );

    const result = await estimateCO2Emissions(mockMetadata);

    expect(result.confidence).toBe('low');
    expect(result.modelInfo?.system).toBe('Fallback calculation');
  }, 35000);

  it('should handle 429 rate limit error and use fallback', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: async () => 'Rate limit exceeded'
    });

    const result = await estimateCO2Emissions(mockMetadata);

    expect(result.confidence).toBe('low');
    expect(result.modelInfo?.system).toBe('Fallback calculation');
  });

  it('should handle 401 authentication error and use fallback', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Invalid API key'
    });

    const result = await estimateCO2Emissions(mockMetadata);

    expect(result.confidence).toBe('low');
    expect(result.modelInfo?.system).toBe('Fallback calculation');
  });

  it('should handle invalid response format and use fallback', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              generationCO2: 'invalid', // Should be number
              transmissionCO2PerView: 0.36
            })
          }
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await estimateCO2Emissions(mockMetadata);

    expect(result.confidence).toBe('low');
    expect(result.modelInfo?.system).toBe('Fallback calculation');
  });

  it('should handle missing required fields and use fallback', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              generationCO2: 15.5
              // Missing transmissionCO2PerView
            })
          }
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await estimateCO2Emissions(mockMetadata);

    expect(result.confidence).toBe('low');
    expect(result.modelInfo?.system).toBe('Fallback calculation');
  });

  it('should handle out-of-range values and use fallback', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              generationCO2: -10, // Negative value
              transmissionCO2PerView: 0.36
            })
          }
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await estimateCO2Emissions(mockMetadata);

    expect(result.confidence).toBe('low');
    expect(result.modelInfo?.system).toBe('Fallback calculation');
  });

  it('should handle empty choices array and use fallback', async () => {
    const mockResponse = {
      choices: []
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await estimateCO2Emissions(mockMetadata);

    expect(result.confidence).toBe('low');
    expect(result.modelInfo?.system).toBe('Fallback calculation');
  });

  it('should calculate fallback correctly for different image sizes', async () => {
    vi.stubGlobal('import', {
      meta: {
        env: {
          VITE_OPENAI_API_KEY: undefined
        }
      }
    });

    const smallImage: ImageMetadata = {
      width: 800,
      height: 600,
      resolution: '800x600',
      fileSize: 500000, // 0.48 MB
      fileSizeFormatted: '488 KB',
      format: 'JPG',
      fileName: 'small.jpg'
    };

    const result = await estimateCO2Emissions(smallImage);

    // Generation: (800 * 600 * 0.000001) + (0.48 * 0.5) ≈ 0.72
    // Transmission: 0.48 * 0.15 ≈ 0.07
    expect(result.generationCO2).toBeGreaterThan(0);
    expect(result.generationCO2).toBeLessThan(2);
    expect(result.transmissionCO2PerView).toBeGreaterThan(0);
    expect(result.transmissionCO2PerView).toBeLessThan(0.2);

    // Restore API key
    vi.stubGlobal('import', {
      meta: {
        env: {
          VITE_OPENAI_API_KEY: 'test-api-key'
        }
      }
    });
  });
});
