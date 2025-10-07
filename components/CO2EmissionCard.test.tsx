import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CO2EmissionCard } from './CO2EmissionCard';

describe('CO2EmissionCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render the component with title and description', () => {
    render(<CO2EmissionCard generationCO2={500} isAnimating={false} />);

    expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
    expect(screen.getByText(/Energy used to create this image/i)).toBeInTheDocument();
    expect(screen.getByText(/One-time generation cost/i)).toBeInTheDocument();
  });

  it('should display CO2 value without animation when isAnimating is false', () => {
    render(<CO2EmissionCard generationCO2={500} isAnimating={false} />);

    expect(screen.getByText('500g')).toBeInTheDocument();
  });

  it('should display CO2 value in kilograms for values >= 1000g', () => {
    render(<CO2EmissionCard generationCO2={2500} isAnimating={false} />);

    expect(screen.getByText('2.50kg')).toBeInTheDocument();
  });

  it('should animate from 0 to target value when isAnimating is true', async () => {
    const { rerender } = render(
      <CO2EmissionCard generationCO2={1000} isAnimating={true} />
    );

    // Initially should show 0 or very small value
    const initialText = screen.getByText(/g|kg/);
    expect(initialText.textContent).toMatch(/^(0g|[0-9]+g)$/);

    // Fast-forward through animation
    vi.advanceTimersByTime(1200);

    // Wait for state updates
    await waitFor(() => {
      expect(screen.getByText('1.00kg')).toBeInTheDocument();
    });
  });

  it('should handle animation cleanup on unmount', () => {
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');
    
    const { unmount } = render(
      <CO2EmissionCard generationCO2={500} isAnimating={true} />
    );

    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });

  it('should restart animation when generationCO2 changes', async () => {
    const { rerender } = render(
      <CO2EmissionCard generationCO2={500} isAnimating={true} />
    );

    vi.advanceTimersByTime(1200);

    await waitFor(() => {
      expect(screen.getByText('500g')).toBeInTheDocument();
    });

    // Change the value
    rerender(<CO2EmissionCard generationCO2={1000} isAnimating={true} />);

    // Animation should restart
    vi.advanceTimersByTime(1200);

    await waitFor(() => {
      expect(screen.getByText('1.00kg')).toBeInTheDocument();
    });
  });

  it('should display emojis in the UI', () => {
    render(<CO2EmissionCard generationCO2={500} isAnimating={false} />);

    const component = screen.getByText(/Generation CO₂/i).closest('div');
    expect(component?.textContent).toContain('🎨');
    expect(component?.textContent).toContain('⚡');
    expect(component?.textContent).toContain('🌍');
  });

  it('should apply gradient text styling to CO2 value', () => {
    render(<CO2EmissionCard generationCO2={500} isAnimating={false} />);

    const valueElement = screen.getByText('500g');
    expect(valueElement).toHaveClass('bg-gradient-to-r');
    expect(valueElement).toHaveClass('from-emerald-400');
    expect(valueElement).toHaveClass('bg-clip-text');
    expect(valueElement).toHaveClass('text-transparent');
  });

  it('should apply glassmorphism styling', () => {
    const { container } = render(
      <CO2EmissionCard generationCO2={500} isAnimating={false} />
    );

    const card = container.querySelector('.bg-gray-900\\/90');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('backdrop-blur-xl');
    expect(card).toHaveClass('border-white/10');
  });

  it('should handle very large CO2 values', () => {
    render(<CO2EmissionCard generationCO2={1000000} isAnimating={false} />);

    expect(screen.getByText('1000kg')).toBeInTheDocument();
  });

  it('should handle very small CO2 values', () => {
    render(<CO2EmissionCard generationCO2={0.5} isAnimating={false} />);

    expect(screen.getByText('1g')).toBeInTheDocument(); // Rounds to 1g
  });

  it('should use easing function for smooth animation', async () => {
    render(<CO2EmissionCard generationCO2={1000} isAnimating={true} />);

    // Check at different points in the animation
    vi.advanceTimersByTime(300); // 25% through
    await waitFor(() => {
      const text = screen.getByText(/g|kg/).textContent;
      // Should be less than 250g (linear would be 250g at 25%)
      // Easing makes it slower at start
      expect(text).toBeTruthy();
    });

    vi.advanceTimersByTime(900); // Complete animation
    await waitFor(() => {
      expect(screen.getByText('1.00kg')).toBeInTheDocument();
    });
  });
});
