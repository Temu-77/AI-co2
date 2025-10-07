import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecoveryMetrics } from './RecoveryMetrics';

describe('RecoveryMetrics - Simple Tests', () => {
  it('should render without crashing', () => {
    render(<RecoveryMetrics totalCO2kg={10} />);
    expect(screen.getByText(/Recovery Actions Needed/i)).toBeInTheDocument();
  });

  it('should display all four recovery metrics', () => {
    render(<RecoveryMetrics totalCO2kg={10} />);
    
    expect(screen.getByText('Trees to Plant')).toBeInTheDocument();
    expect(screen.getByText('Plastic Bottles')).toBeInTheDocument();
    expect(screen.getByText('Bike Kilometers')).toBeInTheDocument();
    expect(screen.getByText('Ocean Hours')).toBeInTheDocument();
  });

  it('should render with zero CO2', () => {
    render(<RecoveryMetrics totalCO2kg={0} />);
    expect(screen.getByText(/Recovery Actions Needed/i)).toBeInTheDocument();
  });

  it('should render with large CO2 values', () => {
    render(<RecoveryMetrics totalCO2kg={1000} />);
    expect(screen.getByText(/Recovery Actions Needed/i)).toBeInTheDocument();
  });
});
