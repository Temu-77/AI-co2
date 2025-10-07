import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorDisplay } from './ErrorDisplay';

describe('ErrorDisplay', () => {
  it('renders error message correctly', () => {
    render(<ErrorDisplay error="Test error message" />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
  });

  it('displays error emoji indicator', () => {
    render(<ErrorDisplay error="Test error" />);
    
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('renders retry button when onRetry callback is provided', () => {
    const onRetry = vi.fn();
    render(<ErrorDisplay error="Test error" onRetry={onRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorDisplay error="Test error" />);
    
    const retryButton = screen.queryByRole('button', { name: /try again/i });
    expect(retryButton).not.toBeInTheDocument();
  });

  it('calls onRetry callback when retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorDisplay error="Test error" onRetry={onRetry} />);
    
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders dismiss button when onDismiss callback is provided', () => {
    const onDismiss = vi.fn();
    render(<ErrorDisplay error="Test error" onDismiss={onDismiss} />);
    
    const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
    expect(dismissButton).toBeInTheDocument();
  });

  it('does not render dismiss button when onDismiss is not provided', () => {
    render(<ErrorDisplay error="Test error" />);
    
    const dismissButton = screen.queryByRole('button', { name: /dismiss error/i });
    expect(dismissButton).not.toBeInTheDocument();
  });

  it('calls onDismiss callback when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<ErrorDisplay error="Test error" onDismiss={onDismiss} />);
    
    const dismissButton = screen.getByRole('button', { name: /dismiss error/i });
    fireEvent.click(dismissButton);
    
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders both retry and dismiss buttons when both callbacks are provided', () => {
    const onRetry = vi.fn();
    const onDismiss = vi.fn();
    render(<ErrorDisplay error="Test error" onRetry={onRetry} onDismiss={onDismiss} />);
    
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dismiss error/i })).toBeInTheDocument();
  });

  it('applies appropriate styling classes', () => {
    const { container } = render(<ErrorDisplay error="Test error" />);
    
    const errorCard = container.querySelector('.bg-gradient-to-br');
    expect(errorCard).toBeInTheDocument();
    expect(errorCard).toHaveClass('border-red-500/30');
  });

  it('displays AlertCircle icon', () => {
    const { container } = render(<ErrorDisplay error="Test error" />);
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
