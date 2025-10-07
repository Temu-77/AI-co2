import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ViewCountSelector from './ViewCountSelector';

describe('ViewCountSelector', () => {
  it('renders all view count options', () => {
    const mockOnCountChange = vi.fn();
    render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    // Check that all 7 options are rendered
    expect(screen.getByText('1K')).toBeInTheDocument();
    expect(screen.getByText('10K')).toBeInTheDocument();
    expect(screen.getByText('100K')).toBeInTheDocument();
    expect(screen.getByText('1M')).toBeInTheDocument();
    expect(screen.getByText('10M')).toBeInTheDocument();
    expect(screen.getByText('100M')).toBeInTheDocument();
    expect(screen.getByText('1B')).toBeInTheDocument();
  });

  it('highlights the selected count with gradient background', () => {
    const mockOnCountChange = vi.fn();
    render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    const selectedButton = screen.getByText('1M');
    expect(selectedButton).toHaveClass('from-emerald-500');
    expect(selectedButton).toHaveClass('to-cyan-500');
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('applies inactive styles to non-selected buttons', () => {
    const mockOnCountChange = vi.fn();
    render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    const inactiveButton = screen.getByText('10K');
    expect(inactiveButton).toHaveClass('bg-gray-800/50');
    expect(inactiveButton).toHaveClass('text-gray-300');
    expect(inactiveButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onCountChange with correct value when button is clicked', () => {
    const mockOnCountChange = vi.fn();
    render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    const button = screen.getByText('100K');
    fireEvent.click(button);

    expect(mockOnCountChange).toHaveBeenCalledTimes(1);
    expect(mockOnCountChange).toHaveBeenCalledWith(100000);
  });

  it('calls onCountChange for each different option', () => {
    const mockOnCountChange = vi.fn();
    render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    fireEvent.click(screen.getByText('1K'));
    expect(mockOnCountChange).toHaveBeenCalledWith(1000);

    fireEvent.click(screen.getByText('10M'));
    expect(mockOnCountChange).toHaveBeenCalledWith(10000000);

    fireEvent.click(screen.getByText('1B'));
    expect(mockOnCountChange).toHaveBeenCalledWith(1000000000);
  });

  it('has hover animation classes', () => {
    const mockOnCountChange = vi.fn();
    render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    const button = screen.getByText('10K');
    expect(button).toHaveClass('hover:scale-105');
    expect(button).toHaveClass('transition-all');
  });

  it('has click animation classes', () => {
    const mockOnCountChange = vi.fn();
    render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    const button = screen.getByText('10K');
    expect(button).toHaveClass('active:scale-95');
  });

  it('renders with proper accessibility attributes', () => {
    const mockOnCountChange = vi.fn();
    render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    const button = screen.getByLabelText('Select 1M views');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('has responsive wrapping classes', () => {
    const mockOnCountChange = vi.fn();
    const { container } = render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    const buttonContainer = container.querySelector('.flex-wrap');
    expect(buttonContainer).toBeInTheDocument();
    expect(buttonContainer).toHaveClass('gap-3');
  });

  it('displays section title with emoji', () => {
    const mockOnCountChange = vi.fn();
    render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('Select View Count')).toBeInTheDocument();
  });

  it('updates selection when selectedCount prop changes', () => {
    const mockOnCountChange = vi.fn();
    const { rerender } = render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    let selectedButton = screen.getByText('1M');
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true');

    // Change the selected count
    rerender(
      <ViewCountSelector
        selectedCount={100000}
        onCountChange={mockOnCountChange}
      />
    );

    selectedButton = screen.getByText('100K');
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true');

    const previousButton = screen.getByText('1M');
    expect(previousButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies shadow effects to active button', () => {
    const mockOnCountChange = vi.fn();
    render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    const activeButton = screen.getByText('1M');
    expect(activeButton).toHaveClass('shadow-lg');
    expect(activeButton).toHaveClass('shadow-emerald-500/50');
  });

  it('applies hover shadow to inactive buttons', () => {
    const mockOnCountChange = vi.fn();
    render(
      <ViewCountSelector
        selectedCount={1000000}
        onCountChange={mockOnCountChange}
      />
    );

    const inactiveButton = screen.getByText('10K');
    expect(inactiveButton).toHaveClass('hover:shadow-md');
  });
});
