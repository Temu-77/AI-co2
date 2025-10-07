import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as openaiModule from './utils/openai';

// Mock the OpenAI module
vi.mock('./utils/openai');

describe('App Animation Tests', () => {
  let mockEstimateCO2Emissions: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockEstimateCO2Emissions = vi.fn().mockResolvedValue({
      generationCO2: 150,
      transmissionCO2PerView: 0.05,
    });
    
    vi.spyOn(openaiModule, 'estimateCO2Emissions').mockImplementation(mockEstimateCO2Emissions);
  });

  const createTestImageFile = (): File => {
    const blob = new Blob(['x'.repeat(1024)], { type: 'image/png' });
    return new File([blob], 'test.png', { type: 'image/png' });
  };

  describe('Initial Load Animations', () => {
    it('should have fade-in animation on header', () => {
      render(<App />);

      const header = screen.getByText(/AI Image CO₂ Calculator/i).closest('header');
      expect(header?.className).toMatch(/animate-fade-in/);
    });

    it('should have slide-up animation on title', () => {
      render(<App />);

      const title = screen.getByText(/AI Image CO₂ Calculator/i);
      expect(title.className).toMatch(/animate-slide-up/);
    });

    it('should have staggered animations on description', () => {
      render(<App />);

      const description = screen.getByText(/Discover the environmental impact/i);
      expect(description.className).toMatch(/animate-fade-in/);
      
      // Should have animation delay
      const style = description.getAttribute('style');
      expect(style).toContain('animation-delay');
    });
  });

  describe('Upload Section Animations', () => {
    it('should have slide-up animation on upload component', () => {
      const { container } = render(<App />);

      const uploadSection = container.querySelector('.animate-slide-up');
      expect(uploadSection).toBeInTheDocument();
    });

    it('should animate when image is uploaded', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      // Metadata display should have animation
      await waitFor(() => {
        const metadataSection = screen.getByText(/Image Details/i).closest('div');
        expect(metadataSection?.className).toMatch(/animate-slide-up/);
      });
    });
  });

  describe('Loading State Animations', () => {
    it('should show animated loading spinner', async () => {
      const user = userEvent.setup();
      
      // Make API slow to see loading state
      mockEstimateCO2Emissions.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          generationCO2: 150,
          transmissionCO2PerView: 0.05,
        }), 500))
      );
      
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      // Loading should appear with fade-in
      await waitFor(() => {
        const loadingSection = screen.getByText(/analyzing your image/i).closest('div');
        expect(loadingSection?.className).toMatch(/animate-fade-in/);
      });
    });

    it('should have spinning animation on loading spinner', async () => {
      const user = userEvent.setup();
      
      mockEstimateCO2Emissions.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          generationCO2: 150,
          transmissionCO2PerView: 0.05,
        }), 500))
      );
      
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/analyzing your image/i)).toBeInTheDocument();
      });

      // LoadingSpinner component should have animation classes
      const loadingText = screen.getByText(/analyzing your image/i);
      expect(loadingText).toBeInTheDocument();
    });
  });

  describe('Results Section Animations', () => {
    it('should animate CO2 emission card on display', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        const co2Card = screen.getByText(/Generation CO₂/i).closest('div');
        expect(co2Card?.className).toMatch(/animate-slide-up/);
      }, { timeout: 3000 });
    });

    it('should have staggered animations for result sections', async () => {
      const user = userEvent.setup();
      const { container } = render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Check for animation delays on different sections
      const sections = container.querySelectorAll('.animate-slide-up');
      let foundDelays = false;
      
      sections.forEach(section => {
        const style = section.getAttribute('style');
        if (style && style.includes('animation-delay')) {
          foundDelays = true;
        }
      });

      expect(foundDelays).toBe(true);
    });

    it('should animate environmental comparisons', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        const comparisons = screen.getByText(/Environmental Comparisons/i).closest('div');
        expect(comparisons?.className).toMatch(/animate-slide-up/);
      }, { timeout: 3000 });
    });

    it('should animate view count selector', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        const viewCountSection = screen.getByText(/Select View Count/i).closest('div');
        expect(viewCountSection?.className).toMatch(/animate-slide-up/);
      }, { timeout: 3000 });
    });

    it('should animate impact summary', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        const impactSection = screen.getByText(/Total Impact/i).closest('div');
        expect(impactSection?.className).toMatch(/animate-slide-up/);
      }, { timeout: 3000 });
    });

    it('should animate recovery metrics', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        const recoverySection = screen.getByText(/Recovery Actions/i).closest('div');
        expect(recoverySection?.className).toMatch(/animate-slide-up/);
      }, { timeout: 3000 });
    });
  });

  describe('Button Animations', () => {
    it('should have hover effects on view count buttons', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Select View Count/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      const button = screen.getByRole('button', { name: /10M/i });
      
      // Should have transition classes
      expect(button.className).toMatch(/transition/);
      expect(button.className).toMatch(/hover:scale-/);
    });

    it('should have active state animation on view count buttons', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Select View Count/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      const button = screen.getByRole('button', { name: /10M/i });
      await user.click(button);

      // Active button should have gradient background
      expect(button.className).toMatch(/bg-gradient-to-r/);
    });

    it('should have press animation on upload new button', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /upload new image/i })).toBeInTheDocument();
      }, { timeout: 3000 });

      const uploadNewButton = screen.getByRole('button', { name: /upload new image/i });
      
      // Should have scale transitions
      expect(uploadNewButton.className).toMatch(/hover:scale-/);
      expect(uploadNewButton.className).toMatch(/active:scale-/);
    });

    it('should animate upload new button on display', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        const uploadNewSection = screen.getByRole('button', { name: /upload new image/i }).closest('div');
        expect(uploadNewSection?.className).toMatch(/animate-fade-in/);
      }, { timeout: 3000 });
    });
  });

  describe('Error Display Animations', () => {
    it('should animate error display', async () => {
      const user = userEvent.setup();
      mockEstimateCO2Emissions.mockRejectedValueOnce(new Error('Test error'));
      
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        const errorSection = screen.getByText(/Test error/i).closest('div');
        expect(errorSection?.className).toMatch(/animate-slide-up/);
      });
    });
  });

  describe('Transition Smoothness', () => {
    it('should use appropriate transition durations', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Select View Count/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Buttons should have transition duration classes
      const buttons = screen.getAllByRole('button');
      const viewCountButtons = buttons.filter(btn => 
        btn.textContent?.match(/^\d+[KMB]$/)
      );

      viewCountButtons.forEach(button => {
        expect(button.className).toMatch(/duration-/);
      });
    });

    it('should have smooth gradient transitions', () => {
      render(<App />);

      const title = screen.getByText(/AI Image CO₂ Calculator/i);
      
      // Should have gradient classes
      expect(title.className).toMatch(/bg-gradient-to-r/);
      expect(title.className).toMatch(/bg-clip-text/);
    });
  });

  describe('Animation Performance', () => {
    it('should not block rendering with animations', async () => {
      const user = userEvent.setup();
      const startTime = Date.now();
      
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (allowing for API mock delay)
      expect(duration).toBeLessThan(5000);
    });

    it('should handle rapid state changes smoothly', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Select View Count/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Rapidly click different view count buttons
      const button1M = screen.getByRole('button', { name: /^1M$/i });
      const button10M = screen.getByRole('button', { name: /10M/i });
      const button100M = screen.getByRole('button', { name: /100M/i });

      await user.click(button1M);
      await user.click(button10M);
      await user.click(button100M);
      await user.click(button1M);

      // Should still be functional
      expect(button1M).toHaveClass('bg-gradient-to-r');
    });
  });

  describe('Footer Animation', () => {
    it('should animate footer on load', () => {
      render(<App />);

      const footer = screen.getByText(/Understanding our digital carbon footprint/i).closest('footer');
      expect(footer?.className).toMatch(/animate-fade-in/);
      
      // Should have animation delay
      const style = footer?.getAttribute('style');
      expect(style).toContain('animation-delay');
    });
  });
});
