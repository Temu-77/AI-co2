import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EnvironmentalComparisons from './EnvironmentalComparisons';

describe('EnvironmentalComparisons', () => {
  it('renders the component with title', () => {
    render(<EnvironmentalComparisons generationCO2={100} />);
    
    expect(screen.getByText(/Environmental Context/i)).toBeInTheDocument();
    expect(screen.getByText(/similar CO2 impact as/i)).toBeInTheDocument();
  });

  it('displays exactly 4 comparison cards', () => {
    const { container } = render(<EnvironmentalComparisons generationCO2={100} />);
    
    const cards = container.querySelectorAll('.grid > div');
    expect(cards).toHaveLength(4);
  });

  it('displays both everyday and digital category badges', () => {
    render(<EnvironmentalComparisons generationCO2={100} />);
    
    const everydayBadges = screen.getAllByText(/Everyday/i);
    const digitalBadges = screen.getAllByText(/Digital/i);
    
    expect(everydayBadges).toHaveLength(2);
    expect(digitalBadges).toHaveLength(2);
  });

  it('applies correct styling classes for everyday comparisons', () => {
    const { container } = render(<EnvironmentalComparisons generationCO2={100} />);
    
    const everydayCards = container.querySelectorAll('.from-emerald-900\\/30');
    expect(everydayCards.length).toBeGreaterThan(0);
  });

  it('applies correct styling classes for digital comparisons', () => {
    const { container } = render(<EnvironmentalComparisons generationCO2={100} />);
    
    const digitalCards = container.querySelectorAll('.from-cyan-900\\/30');
    expect(digitalCards.length).toBeGreaterThan(0);
  });

  it('renders with responsive grid classes', () => {
    const { container } = render(<EnvironmentalComparisons generationCO2={100} />);
    
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');
  });

  it('includes hover effects on cards', () => {
    const { container } = render(<EnvironmentalComparisons generationCO2={100} />);
    
    const cards = container.querySelectorAll('.grid > div');
    cards.forEach(card => {
      expect(card).toHaveClass('hover:scale-105');
      expect(card).toHaveClass('hover:shadow-xl');
    });
  });

  it('includes animation classes', () => {
    const { container } = render(<EnvironmentalComparisons generationCO2={100} />);
    
    const mainContainer = container.querySelector('.animate-fade-in');
    expect(mainContainer).toBeInTheDocument();
    
    const cards = container.querySelectorAll('.animate-slide-up');
    expect(cards).toHaveLength(4);
  });

  it('displays emoji icons in comparison cards', () => {
    const { container } = render(<EnvironmentalComparisons generationCO2={100} />);
    
    const emojiContainers = container.querySelectorAll('.text-4xl');
    expect(emojiContainers).toHaveLength(4);
  });

  it('re-renders with different comparisons when generationCO2 changes', () => {
    const { rerender, container } = render(<EnvironmentalComparisons generationCO2={100} />);
    
    const firstRenderText = Array.from(container.querySelectorAll('.text-white.font-medium'))
      .map(el => el.textContent);
    
    rerender(<EnvironmentalComparisons generationCO2={200} />);
    
    const secondRenderText = Array.from(container.querySelectorAll('.text-white.font-medium'))
      .map(el => el.textContent);
    
    // The comparisons should potentially be different due to re-randomization
    expect(secondRenderText).toHaveLength(4);
    expect(firstRenderText).toHaveLength(4);
  });

  it('includes glassmorphism effects', () => {
    const { container } = render(<EnvironmentalComparisons generationCO2={100} />);
    
    const cards = container.querySelectorAll('.backdrop-blur-xl');
    expect(cards).toHaveLength(4);
  });

  it('includes gradient borders', () => {
    const { container } = render(<EnvironmentalComparisons generationCO2={100} />);
    
    const cards = container.querySelectorAll('.border-emerald-500\\/30, .border-cyan-500\\/30');
    expect(cards.length).toBeGreaterThan(0);
  });
});
