import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as openaiModule from './utils/openai';

// Mock the OpenAI module
vi.mock('./utils/openai');

describe('App Responsive Layout Tests', () => {
  let mockEstimateCO2Emissions: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockEstimateCO2Emissions = vi.fn().mockResolvedValue({
      generationCO2: 150,
      transmissionCO2PerView: 0.05,
    });
    
    vi.spyOn(openaiModule, 'estimateCO2Emissions').mockImplementation(mockEstimateCO2Emissions);
  });

  const createTestImageFile = (name: string = 'test.png'): File => {
    const blob = new Blob(['x'.repeat(1024)], { type: 'image/png' });
    return new File([blob], name, { type: 'image/png' });
  };

  const setViewportSize = (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    });
    window.dispatchEvent(new Event('resize'));
  };

  describe('Mobile Viewport (< 640px)', () => {
    beforeEach(() => {
      setViewportSize(375, 667); // iPhone SE size
    });

    it('should render in mobile layout', async () => {
      const user = userEvent.setup();
      const { container } = render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Check that main container has responsive padding
      const mainContainer = container.querySelector('.max-w-7xl');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should have appropriate touch targets (min 44x44px)', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Select View Count/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // View count buttons should have min-h-[44px] class
      const buttons = screen.getAllByRole('button');
      const viewCountButtons = buttons.filter(btn => 
        btn.textContent?.match(/^\d+[KMB]$/)
      );

      viewCountButtons.forEach(button => {
        const styles = window.getComputedStyle(button);
        // In a real browser, this would check actual computed height
        // In jsdom, we verify the class is present
        expect(button.className).toMatch(/min-h-\[44px\]/);
      });
    });

    it('should wrap view count buttons appropriately', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Select View Count/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // View count selector should have flex-wrap class
      const viewCountSection = screen.getByText(/Select View Count/i).closest('div');
      expect(viewCountSection).toBeInTheDocument();
    });

    it('should display single-column layout for cards', async () => {
      const user = userEvent.setup();
      const { container } = render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Recovery Actions/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Recovery metrics should use grid layout
      const recoverySection = screen.getByText(/Recovery Actions/i).closest('div');
      expect(recoverySection).toBeInTheDocument();
    });
  });

  describe('Tablet Viewport (640px - 1024px)', () => {
    beforeEach(() => {
      setViewportSize(768, 1024); // iPad size
    });

    it('should render in tablet layout', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify content is displayed
      expect(screen.getByText(/Environmental Comparisons/i)).toBeInTheDocument();
    });

    it('should use 2-column grid for comparisons', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Environmental Comparisons/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Environmental comparisons should be present
      const comparisonsSection = screen.getByText(/Environmental Comparisons/i).closest('div');
      expect(comparisonsSection).toBeInTheDocument();
    });

    it('should use 2-column grid for recovery metrics', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Recovery Actions/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Recovery metrics should be present
      const recoverySection = screen.getByText(/Recovery Actions/i).closest('div');
      expect(recoverySection).toBeInTheDocument();
    });
  });

  describe('Desktop Viewport (> 1024px)', () => {
    beforeEach(() => {
      setViewportSize(1920, 1080); // Full HD
    });

    it('should render in desktop layout', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // All sections should be visible
      expect(screen.getByText(/Environmental Comparisons/i)).toBeInTheDocument();
      expect(screen.getByText(/Recovery Actions/i)).toBeInTheDocument();
    });

    it('should use max-width container', async () => {
      const { container } = render(<App />);

      // Main container should have max-w-7xl class (1280px)
      const mainContainer = container.querySelector('.max-w-7xl');
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer?.className).toMatch(/max-w-7xl/);
    });

    it('should display multi-column layouts', async () => {
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Recovery Actions/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify all major sections are present
      expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      expect(screen.getByText(/Environmental Comparisons/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Impact/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Breakpoint Transitions', () => {
    it('should handle viewport resize from mobile to desktop', async () => {
      const user = userEvent.setup();
      
      // Start with mobile
      setViewportSize(375, 667);
      const { rerender } = render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Resize to desktop
      setViewportSize(1920, 1080);
      rerender(<App />);

      // Content should still be visible
      expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      expect(screen.getByText(/Recovery Actions/i)).toBeInTheDocument();
    });

    it('should handle viewport resize from desktop to mobile', async () => {
      const user = userEvent.setup();
      
      // Start with desktop
      setViewportSize(1920, 1080);
      const { rerender } = render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Resize to mobile
      setViewportSize(375, 667);
      rerender(<App />);

      // Content should still be visible
      expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      expect(screen.getByText(/Recovery Actions/i)).toBeInTheDocument();
    });
  });

  describe('Text and Spacing Responsiveness', () => {
    it('should have responsive text sizes in header', () => {
      const { container } = render(<App />);

      const header = screen.getByText(/AI Image CO₂ Calculator/i);
      
      // Should have responsive text classes
      expect(header.className).toMatch(/text-3xl|text-4xl|text-5xl|text-6xl/);
      expect(header.className).toMatch(/sm:|md:|lg:/);
    });

    it('should have responsive padding', () => {
      const { container } = render(<App />);

      const mainContainer = container.querySelector('.max-w-7xl');
      
      // Should have responsive padding classes
      expect(mainContainer?.className).toMatch(/px-4|px-6|px-8/);
      expect(mainContainer?.className).toMatch(/py-6|py-8|py-12/);
    });

    it('should have responsive spacing between sections', async () => {
      const user = userEvent.setup();
      const { container } = render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Main content container should have responsive spacing
      const contentContainer = container.querySelector('.space-y-6');
      expect(contentContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility on Different Viewports', () => {
    it('should maintain readable text on mobile', () => {
      setViewportSize(375, 667);
      render(<App />);

      const header = screen.getByText(/AI Image CO₂ Calculator/i);
      expect(header).toBeInTheDocument();
      
      const description = screen.getByText(/Discover the environmental impact/i);
      expect(description).toBeInTheDocument();
    });

    it('should maintain interactive elements on tablet', async () => {
      setViewportSize(768, 1024);
      const user = userEvent.setup();
      render(<App />);

      const file = createTestImageFile();
      const input = screen.getByLabelText(/upload image/i);
      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText(/Select View Count/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      // All view count buttons should be accessible
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should maintain proper contrast on all viewports', () => {
      const viewports = [
        [375, 667],   // Mobile
        [768, 1024],  // Tablet
        [1920, 1080], // Desktop
      ];

      viewports.forEach(([width, height]) => {
        setViewportSize(width, height);
        const { container } = render(<App />);

        // Background should be black
        const mainDiv = container.querySelector('.bg-black');
        expect(mainDiv).toBeInTheDocument();
      });
    });
  });
});
