import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecoveryMetrics } from './RecoveryMetrics';
import * as co2Calculations from '../utils/co2Calculations';

describe('RecoveryMetrics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render recovery metrics title and description', () => {
    render(<RecoveryMetrics totalCO2kg={10} />);
    
    expect(screen.getByText(/Recovery Actions Needed/i)).toBeInTheDocument();
    expect(screen.getByText(/Here's what it would take to offset this carbon footprint/i)).toBeInTheDocument();
  });

  it('should call calculateRecoveryMetrics with correct totalCO2kg', () => {
    const spy = vi.spyOn(co2Calculations, 'calculateRecoveryMetrics');
    
    render(<RecoveryMetrics totalCO2kg={25.5} />);
    
    expect(spy).toHaveBeenCalledWith(25.5);
  });

  it('should display all four recovery metric cards', () => {
    render(<RecoveryMetrics totalCO2kg={10} />);
    
    expect(screen.getByText('Trees to Plant')).toBeInTheDocument();
    expect(screen.getByText('Plastic Bottles')).toBeInTheDocument();
    expect(screen.getByText('Bike Kilometers')).toBeInTheDocument();
    expect(screen.getByText('Ocean Hours')).toBeInTheDocument();
  });

  it('should display correct descriptions for each metric', () => {
    render(<RecoveryMetrics totalCO2kg={10} />);
    
    expect(screen.getByText('to absorb this CO2 in a year')).toBeInTheDocument();
    expect(screen.getByText('to recycle to offset')).toBeInTheDocument();
    expect(screen.getByText('vs driving to offset')).toBeInTheDocument();
    expect(screen.getByText('for natural absorption')).toBeInTheDocument();
  });

  it('should animate numbers from 0 to final values', () => {
    vi.spyOn(co2Calculations, 'calculateRecoveryMetrics').mockReturnValue({
      treesToPlant: 100,
      plasticBottles: 500,
      bikeKilometers: 50.5,
      oceanAbsorptionHours: 10000
    });

    render(<RecoveryMetrics totalCO2kg={10} />);
    
    // Initially should show 0 or low values
    const initialTrees = screen.getByText('Trees to Plant').parentElement?.querySelector('.text-3xl');
    expect(initialTrees?.textContent).toBe('0');
    
    // Fast-forward through animation
    vi.advanceTimersByTime(1000);
    
    // Should show final values after animation
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('50.5')).toBeInTheDocument();
    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  it('should format large numbers with commas', () => {
    vi.spyOn(co2Calculations, 'calculateRecoveryMetrics').mockReturnValue({
      treesToPlant: 1000,
      plasticBottles: 50000,
      bikeKilometers: 5000.5,
      oceanAbsorptionHours: 1000000
    });

    render(<RecoveryMetrics totalCO2kg={100} />);
    
    vi.advanceTimersByTime(1000);
    
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('50,000')).toBeInTheDocument();
    expect(screen.getByText('5,000.5')).toBeInTheDocument();
    expect(screen.getByText('1,000,000')).toBeInTheDocument();
  });

  it('should handle zero CO2 values', () => {
    vi.spyOn(co2Calculations, 'calculateRecoveryMetrics').mockReturnValue({
      treesToPlant: 0,
      plasticBottles: 0,
      bikeKilometers: 0,
      oceanAbsorptionHours: 0
    });

    render(<RecoveryMetrics totalCO2kg={0} />);
    
    vi.advanceTimersByTime(1000);
    
    const zeroValues = screen.getAllByText('0');
    expect(zeroValues.length).toBeGreaterThan(0);
  });

  it('should display correct icons for each metric', () => {
    const { container } = render(<RecoveryMetrics totalCO2kg={10} />);
    
    // Check that lucide-react icons are rendered (they have specific SVG structure)
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBe(4); // 4 recovery metrics
  });

  it('should apply correct color classes to each card', () => {
    const { container } = render(<RecoveryMetrics totalCO2kg={10} />);
    
    // Check for gradient color classes
    expect(container.innerHTML).toContain('from-emerald-500');
    expect(container.innerHTML).toContain('from-blue-500');
    expect(container.innerHTML).toContain('from-orange-500');
    expect(container.innerHTML).toContain('from-cyan-500');
  });

  it('should use 2-column grid on larger screens', () => {
    const { container } = render(<RecoveryMetrics totalCO2kg={10} />);
    
    const grid = container.querySelector('.grid');
    expect(grid?.className).toContain('grid-cols-1');
    expect(grid?.className).toContain('sm:grid-cols-2');
  });

  it('should re-animate when totalCO2kg changes', () => {
    const { rerender } = render(<RecoveryMetrics totalCO2kg={10} />);
    
    vi.advanceTimersByTime(1000);
    
    // Change the prop
    rerender(<RecoveryMetrics totalCO2kg={20} />);
    
    // Animation should restart
    const treesElement = screen.getByText('Trees to Plant').parentElement?.querySelector('.text-3xl');
    expect(treesElement?.textContent).toBe('0');
    
    vi.advanceTimersByTime(1000);
    
    // Should show new values
    expect(co2Calculations.calculateRecoveryMetrics).toHaveBeenCalledWith(20);
  });

  it('should clean up animation timer on unmount', () => {
    const { unmount } = render(<RecoveryMetrics totalCO2kg={10} />);
    
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('should display decimal values for bike kilometers', () => {
    vi.spyOn(co2Calculations, 'calculateRecoveryMetrics').mockReturnValue({
      treesToPlant: 5,
      plasticBottles: 100,
      bikeKilometers: 12.7,
      oceanAbsorptionHours: 500
    });

    render(<RecoveryMetrics totalCO2kg={5} />);
    
    vi.advanceTimersByTime(1000);
    
    expect(screen.getByText('12.7')).toBeInTheDocument();
  });

  it('should apply glassmorphism and hover effects', () => {
    const { container } = render(<RecoveryMetrics totalCO2kg={10} />);
    
    // Check for glassmorphism classes
    expect(container.innerHTML).toContain('backdrop-blur-xl');
    expect(container.innerHTML).toContain('bg-gray-900/90');
    
    // Check for hover effects
    expect(container.innerHTML).toContain('hover:scale-105');
    expect(container.innerHTML).toContain('group-hover:opacity-100');
  });
});
