import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImpactSummary } from './ImpactSummary';

describe('ImpactSummary - Simple Tests', () => {
  it('renders without crashing', () => {
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

  it('displays total CO2 value', () => {
    render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    expect(screen.getByText('2.00kg')).toBeInTheDocument();
  });

  it('shows generation and transmission breakdown', () => {
    render(
      <ImpactSummary
        generationCO2={500}
        transmissionCO2={1500}
        totalCO2={2000}
        viewCount={1000000}
      />
    );

    expect(screen.getByText('Generation')).toBeInTheDocument();
    expect(screen.getByText('Transmission')).toBeInTheDocument();
    expect(screen.getByText('500g')).toBeInTheDocument();
    expect(screen.getByText('1.50kg')).toBeInTheDocument();
  });
});
