import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImpactSummary } from './ImpactSummary';

describe('ImpactSummary', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders the component with title', () => {
    render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    expect(screen.getByText(/Total Environmental Impact/i)).toBeInTheDocument();
  });

  it('displays formatted total CO2 value', () => {
    render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    // Should display in grams since total is 2000g (2kg)
    expect(screen.getByText('2.00kg')).toBeInTheDocument();
  });

  it('displays formatted view count', () => {
    render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    expect(screen.getByText(/1.0M views/i)).toBeInTheDocument();
  });

  it('displays generation CO2 breakdown', () => {
    render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    expect(screen.getByText('Generation')).toBeInTheDocument();
    expect(screen.getByText('500g')).toBeInTheDocument();
  });

  it('displays transmission CO2 breakdown', () => {
    render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    expect(screen.getByText('Transmission')).toBeInTheDocument();
    expect(screen.getByText('1.50kg')).toBeInTheDocument();
  });

  it('calculates correct percentages for breakdown', () => {
    render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    // 500/2000 = 25%
    expect(screen.getByText('25.0% of total')).toBeInTheDocument();
    // 1500/2000 = 75%
    expect(screen.getByText('75.0% of total')).toBeInTheDocument();
  });

  it('displays emojis for visual enhancement', () => {
    render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    const component = screen.getByText(/Total Environmental Impact/i).closest('div');
    expect(component?.textContent).toContain('🌍');
    expect(component?.textContent).toContain('🎨');
    expect(component?.textContent).toContain('📡');
    expect(component?.textContent).toContain('💡');
  });

  it('formats large view counts correctly', () => {
    const { rerender } = render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000000}
      />
    );

    expect(screen.getByText(/1.0B views/i)).toBeInTheDocument();

    rerender(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={10000}
      />
    );

    expect(screen.getByText(/10.0K views/i)).toBeInTheDocument();
  });

  it('handles zero total CO2 gracefully', () => {
    render(
      <ImpactSummary
        generationCO2={0}
        transmissionCO2={0}
        totalCO2={0}
        viewCount={1000000}
      />
    );

    expect(screen.getByText('0g')).toBeInTheDocument();
  });

  it('displays breakdown section title', () => {
    render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    expect(screen.getByText('Emission Breakdown')).toBeInTheDocument();
  });

  it('includes contextual descriptions', () => {
    render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    expect(screen.getByText(/One-time AI image creation/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery across/i)).toBeInTheDocument();
  });

  it('displays adjustment hint', () => {
    render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    expect(screen.getByText(/Adjust view count above to see impact changes/i)).toBeInTheDocument();
  });

  it('handles very large CO2 values', () => {
    render(
      <ImpactSummary
        generationCO2={50000}
        transmissionCO2={150000}
        totalCO2={200000}
        viewCount={100000000}
      />
    );

    expect(screen.getByText('200kg')).toBeInTheDocument();
    expect(screen.getByText('50kg')).toBeInTheDocument();
    expect(screen.getByText('150kg')).toBeInTheDocument();
  });

  it('handles small CO2 values in grams', () => {
    render(
      <ImpactSummary
        generationCO2={100}
        transmissionCO2={200}
        totalCO2={300}
        viewCount={1000}
      />
    );

    expect(screen.getByText('300g')).toBeInTheDocument();
    expect(screen.getByText('100g')).toBeInTheDocument();
    expect(screen.getByText('200g')).toBeInTheDocument();
  });

  it('applies glassmorphism styling classes', () => {
    const { container } = render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    const card = container.querySelector('.backdrop-blur-xl');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('bg-gray-900/90');
  });

  it('applies gradient effects to total value', () => {
    const { container } = render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    const gradientText = container.querySelector('.bg-gradient-to-r.from-purple-400');
    expect(gradientText).toBeInTheDocument();
    expect(gradientText).toHaveClass('bg-clip-text', 'text-transparent');
  });

  it('updates when props change', () => {
    const { rerender } = render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    expect(screen.getByText('2.00kg')).toBeInTheDocument();

    rerender(
      <ImpactSummary
        generationCO2={1000}
        transmissionCO2={3000}
        totalCO2={4000}
        viewCount={10000000}
      />
    );

    expect(screen.getByText('4.00kg')).toBeInTheDocument();
    expect(screen.getByText(/10.0M views/i)).toBeInTheDocument();
  });
});
