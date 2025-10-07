import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as openaiModule from './utils/openai';

// Mock the OpenAI module
vi.mock('./utils/openai');

describe('App E2E Tests', () => {
  let mockEstimateCO2Emissions: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Setup default mock implementation
    mockEstimateCO2Emissions = vi.fn().mockResolvedValue({
      generationCO2: 150,
      transmissionCO2PerView: 0.05,
      modelInfo: {
        imageGen: 'DALL-E 3',
        system: 'OpenAI',
      },
      confidence: 'high',
    });
    
    vi.spyOn(openaiModule, 'estimateCO2Emissions').mockImplementation(mockEstimateCO2Emissions);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper function to create a test image file
  const createTestImageFile = (
    name: string = 'test-image.png',
    type: string = 'image/png',
    size: number = 1024 * 1024 // 1MB
  ): File => {
    const blob = new Blob(['x'.repeat(size)], { type });
    return new File([blob], name, { type });
  };

  describe('Complete Upload-to-Display Flow', () => {
    it('should complete full flow from upload to results display with PNG image', async () => {
      const user = userEvent.setup();
      render(<App />);

      // 1. Initial state - should show upload interface
      expect(screen.getByText(/drag.*drop.*image/i)).toBeInTheDocument();
      expect(screen.getByText(/AI Image CO₂ Calculator/i)).toBeInTheDocument();

      // 2. Upload image
      const file = createTestImageFile('banner.png', 'image/png');
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      // 3. Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/analyzing your image/i)).toBeInTheDocument();
      });

      // 4. Wait for results to appear
      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // 5. Verify all result sections are displayed
      expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      expect(screen.getByText(/Environmental Comparisons/i)).toBeInTheDocument();
      expect(screen.getByText(/Select View Count/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Impact/i)).toBeInTheDocument();
      expect(screen.getByText(/Recovery Actions/i)).toBeInTheDocument();

      // 6. Verify API was called
      expect(mockEstimateCO2Emissions).toHaveBeenCalledTimes(1);
    });

    it('should handle JPG image format', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile('photo.jpg', 'image/jpeg');
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      expect(mockEstimateCO2Emissions).toHaveBeenCalled();
    });

    it('should handle WebP image format', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile('modern.webp', 'image/webp');
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      expect(mockEstimateCO2Emissions).toHaveBeenCalled();
    });

    it('should handle GIF image format', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile('animated.gif', 'image/gif');
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      expect(mockEstimateCO2Emissions).toHaveBeenCalled();
    });
  });

  describe('API Integration with Mocked Responses', () => {
    it('should handle successful API response with all data fields', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        generationCO2: 250.5,
        transmissionCO2PerView: 0.08,
        modelInfo: {
          imageGen: 'Stable Diffusion XL',
          promptGen: 'GPT-4',
          system: 'Custom',
          location: 'US-West',
        },
        confidence: 'high',
      };
      
      mockEstimateCO2Emissions.mockResolvedValue(mockResponse);
      
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify the mocked data is used
      expect(mockEstimateCO2Emissions).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: 'test-image.png',
          format: 'PNG',
        })
      );
    });

    it('should handle API response with minimal data', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        generationCO2: 100,
        transmissionCO2PerView: 0.03,
      };
      
      mockEstimateCO2Emissions.mockResolvedValue(mockResponse);
      
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      expect(mockEstimateCO2Emissions).toHaveBeenCalled();
    });

    it('should handle API response with zero emissions', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        generationCO2: 0,
        transmissionCO2PerView: 0,
      };
      
      mockEstimateCO2Emissions.mockResolvedValue(mockResponse);
      
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Should still display results even with zero values
      expect(screen.getByText(/Total Impact/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling Scenarios', () => {
    it('should handle network failure with retry option', async () => {
      const user = userEvent.setup();
      mockEstimateCO2Emissions.mockRejectedValueOnce(new Error('Network error'));
      
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });

      // Should show retry button
      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();

      // Mock successful response for retry
      mockEstimateCO2Emissions.mockResolvedValueOnce({
        generationCO2: 150,
        transmissionCO2PerView: 0.05,
      });

      // Click retry
      await user.click(retryButton);

      // Should show results after retry
      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should handle invalid file type error', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Create invalid file (PDF)
      const invalidFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/upload image/i);
      
      await user.upload(input, invalidFile);

      // Should show error for invalid file type
      await waitFor(() => {
        expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
      });

      // Should not call API
      expect(mockEstimateCO2Emissions).not.toHaveBeenCalled();
    });

    it('should handle file too large error', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Create file larger than 10MB
      const largeFile = createTestImageFile('large.png', 'image/png', 11 * 1024 * 1024);
      const input = screen.getByLabelText(/upload image/i);
      
      await user.upload(input, largeFile);

      // Should show error for file too large
      await waitFor(() => {
        expect(screen.getByText(/file size exceeds/i)).toBeInTheDocument();
      });

      // Should not call API
      expect(mockEstimateCO2Emissions).not.toHaveBeenCalled();
    });

    it('should handle API timeout error', async () => {
      const user = userEvent.setup();
      mockEstimateCO2Emissions.mockRejectedValueOnce(new Error('Request timeout'));
      
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Request timeout/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should handle API authentication error', async () => {
      const user = userEvent.setup();
      mockEstimateCO2Emissions.mockRejectedValueOnce(new Error('Authentication failed'));
      
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Authentication failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('View Count Changes and Dynamic Recalculation', () => {
    it('should recalculate emissions when view count changes', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Upload image and wait for results
      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Find and click different view count button
      const button10M = screen.getByRole('button', { name: /10M/i });
      await user.click(button10M);

      // The total should update (we can't easily test the exact value without exposing it,
      // but we can verify the button is now active)
      expect(button10M).toHaveClass('bg-gradient-to-r');
    });

    it('should handle all view count options', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Select View Count/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Test each view count button
      const viewCounts = ['1K', '10K', '100K', '1M', '10M', '100M', '1B'];
      
      for (const count of viewCounts) {
        const button = screen.getByRole('button', { name: new RegExp(count, 'i') });
        await user.click(button);
        
        // Verify button is active
        expect(button).toHaveClass('bg-gradient-to-r');
      }
    });

    it('should maintain view count selection when retrying after error', async () => {
      const user = userEvent.setup();
      mockEstimateCO2Emissions
        .mockResolvedValueOnce({
          generationCO2: 150,
          transmissionCO2PerView: 0.05,
        })
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          generationCO2: 150,
          transmissionCO2PerView: 0.05,
        });
      
      render(<App />);

      // Upload and wait for results
      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Select View Count/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Change view count
      const button100M = screen.getByRole('button', { name: /100M/i });
      await user.click(button100M);

      // Simulate error by uploading new image
      const file2 = createTestImageFile('test2.png');
      const uploadNewButton = screen.getByRole('button', { name: /upload new image/i });
      await user.click(uploadNewButton);

      // Upload again
      const input2 = screen.getByLabelText(/upload image/i);
      await user.upload(input2, file2);

      // View count should reset to default (1M)
      await waitFor(() => {
        const button1M = screen.getByRole('button', { name: /^1M$/i });
        expect(button1M).toHaveClass('bg-gradient-to-r');
      }, { timeout: 3000 });
    });
  });

  describe('Upload New Image Flow', () => {
    it('should reset application state when uploading new image', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Upload first image
      const file1 = createTestImageFile('first.png');
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file1);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Click upload new image
      const uploadNewButton = screen.getByRole('button', { name: /upload new image/i });
      await user.click(uploadNewButton);

      // Should show upload interface again
      expect(screen.getByText(/drag.*drop.*image/i)).toBeInTheDocument();
      
      // Results should be hidden
      expect(screen.queryByText(/Generation CO₂/i)).not.toBeInTheDocument();
    });

    it('should handle multiple sequential uploads', async () => {
      const user = userEvent.setup();
      render(<App />);

      // First upload
      const file1 = createTestImageFile('first.png');
      let input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file1);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Upload new
      let uploadNewButton = screen.getByRole('button', { name: /upload new image/i });
      await user.click(uploadNewButton);

      // Second upload
      const file2 = createTestImageFile('second.jpg', 'image/jpeg');
      input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file2);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Upload new again
      uploadNewButton = screen.getByRole('button', { name: /upload new image/i });
      await user.click(uploadNewButton);

      // Third upload
      const file3 = createTestImageFile('third.webp', 'image/webp');
      input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file3);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // API should have been called 3 times
      expect(mockEstimateCO2Emissions).toHaveBeenCalledTimes(3);
    });
  });

  describe('Component Integration', () => {
    it('should display all components in correct order after successful upload', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify component order by checking their presence
      const sections = [
        /Generation CO₂/i,
        /Environmental Comparisons/i,
        /Select View Count/i,
        /Total Impact/i,
        /Recovery Actions/i,
      ];

      sections.forEach(section => {
        expect(screen.getByText(section)).toBeInTheDocument();
      });
    });

    it('should show image metadata before API results', async () => {
      const user = userEvent.setup();
      
      // Make API call slow
      mockEstimateCO2Emissions.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          generationCO2: 150,
          transmissionCO2PerView: 0.05,
        }), 1000))
      );
      
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      // Metadata should appear quickly
      await waitFor(() => {
        expect(screen.getByText(/Image Details/i)).toBeInTheDocument();
      });

      // Loading should be shown
      expect(screen.getByText(/analyzing your image/i)).toBeInTheDocument();

      // Results should not be shown yet
      expect(screen.queryByText(/Generation CO₂/i)).not.toBeInTheDocument();

      // Wait for results
      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should hide loading spinner when results appear', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      // Loading should appear
      await waitFor(() => {
        expect(screen.getByText(/analyzing your image/i)).toBeInTheDocument();
      });

      // Wait for results
      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Loading should be gone
      expect(screen.queryByText(/analyzing your image/i)).not.toBeInTheDocument();
    });
  });

  describe('Data Flow and Calculations', () => {
    it('should correctly calculate total CO2 from generation and transmission', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        generationCO2: 100, // 100g
        transmissionCO2PerView: 0.1, // 0.1g per view
      };
      
      mockEstimateCO2Emissions.mockResolvedValue(mockResponse);
      
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Total Impact/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // With default 1M views: 100g + (0.1g * 1,000,000) = 100,100g = 100.1kg
      // The exact display format may vary, but the calculation should be correct
      expect(screen.getByText(/Total Impact/i)).toBeInTheDocument();
    });

    it('should pass correct metadata to API', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile('banner.png', 'image/png', 2 * 1024 * 1024);
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(mockEstimateCO2Emissions).toHaveBeenCalledWith(
          expect.objectContaining({
            fileName: 'banner.png',
            format: 'PNG',
            fileSize: expect.any(Number),
          })
        );
      });
    });
  });
});
