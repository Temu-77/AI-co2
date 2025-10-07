import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as imageProcessing from './utils/imageProcessing';
import * as openai from './utils/openai';

// Mock the utility modules
vi.mock('./utils/imageProcessing');
vi.mock('./utils/openai');

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the app with header and upload section', () => {
    render(<App />);
    
    expect(screen.getByText(/AI Image CO₂ Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Discover the environmental impact/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload AI-Generated Image/i)).toBeInTheDocument();
  });

  it('handles image upload and displays metadata', async () => {
    const mockMetadata = {
      width: 1920,
      height: 1080,
      resolution: '1920x1080',
      fileSize: 2048000,
      fileSizeFormatted: '2.0 MB',
      format: 'PNG',
      fileName: 'test-image.png'
    };

    const mockCO2Data = {
      generationCO2: 50.5,
      transmissionCO2PerView: 0.15,
      confidence: 'high'
    };

    vi.mocked(imageProcessing.extractImageMetadata).mockResolvedValue(mockMetadata);
    vi.mocked(openai.estimateCO2Emissions).mockResolvedValue(mockCO2Data);

    render(<App />);

    // Create a mock file
    const file = new File(['test'], 'test-image.png', { type: 'image/png' });
    
    // Find the file input and upload
    const input = screen.getByLabelText(/upload/i, { selector: 'input[type="file"]' });
    await userEvent.upload(input, file);

    // Wait for metadata to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Image Details/i)).toBeInTheDocument();
    });

    expect(imageProcessing.extractImageMetadata).toHaveBeenCalledWith(file);
  });

  it('displays loading state while fetching CO2 data', async () => {
    const mockMetadata = {
      width: 1920,
      height: 1080,
      resolution: '1920x1080',
      fileSize: 2048000,
      fileSizeFormatted: '2.0 MB',
      format: 'PNG',
      fileName: 'test-image.png'
    };

    vi.mocked(imageProcessing.extractImageMetadata).mockResolvedValue(mockMetadata);
    vi.mocked(openai.estimateCO2Emissions).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        generationCO2: 50.5,
        transmissionCO2PerView: 0.15,
        confidence: 'high'
      }), 100))
    );

    render(<App />);

    const file = new File(['test'], 'test-image.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload/i, { selector: 'input[type="file"]' });
    await userEvent.upload(input, file);

    // Should show loading spinner
    await waitFor(() => {
      expect(screen.getByText(/Analyzing your image with AI/i)).toBeInTheDocument();
    });
  });

  it('displays error when image processing fails', async () => {
    vi.mocked(imageProcessing.extractImageMetadata).mockRejectedValue(
      new Error('Failed to load image')
    );

    render(<App />);

    const file = new File(['test'], 'test-image.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload/i, { selector: 'input[type="file"]' });
    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load image/i)).toBeInTheDocument();
    });
  });

  it('displays CO2 results after successful API call', async () => {
    const mockMetadata = {
      width: 1920,
      height: 1080,
      resolution: '1920x1080',
      fileSize: 2048000,
      fileSizeFormatted: '2.0 MB',
      format: 'PNG',
      fileName: 'test-image.png'
    };

    const mockCO2Data = {
      generationCO2: 50.5,
      transmissionCO2PerView: 0.15,
      confidence: 'high'
    };

    vi.mocked(imageProcessing.extractImageMetadata).mockResolvedValue(mockMetadata);
    vi.mocked(openai.estimateCO2Emissions).mockResolvedValue(mockCO2Data);

    render(<App />);

    const file = new File(['test'], 'test-image.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload/i, { selector: 'input[type="file"]' });
    await userEvent.upload(input, file);

    // Wait for results to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Generation CO₂/i)).toBeInTheDocument();
      expect(screen.getByText(/Environmental Context/i)).toBeInTheDocument();
      expect(screen.getByText(/Select View Count/i)).toBeInTheDocument();
    });
  });

  it('updates calculations when view count changes', async () => {
    const mockMetadata = {
      width: 1920,
      height: 1080,
      resolution: '1920x1080',
      fileSize: 2048000,
      fileSizeFormatted: '2.0 MB',
      format: 'PNG',
      fileName: 'test-image.png'
    };

    const mockCO2Data = {
      generationCO2: 50.5,
      transmissionCO2PerView: 0.15,
      confidence: 'high'
    };

    vi.mocked(imageProcessing.extractImageMetadata).mockResolvedValue(mockMetadata);
    vi.mocked(openai.estimateCO2Emissions).mockResolvedValue(mockCO2Data);

    render(<App />);

    const file = new File(['test'], 'test-image.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload/i, { selector: 'input[type="file"]' });
    await userEvent.upload(input, file);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText(/Select View Count/i)).toBeInTheDocument();
    });

    // Click on a different view count button
    const button10M = screen.getByRole('button', { name: /10M/i });
    await userEvent.click(button10M);

    // The component should re-render with new calculations
    // (We can't easily test the exact values without more complex setup)
    expect(button10M).toHaveAttribute('aria-pressed', 'true');
  });

  it('allows uploading a new image after viewing results', async () => {
    const mockMetadata = {
      width: 1920,
      height: 1080,
      resolution: '1920x1080',
      fileSize: 2048000,
      fileSizeFormatted: '2.0 MB',
      format: 'PNG',
      fileName: 'test-image.png'
    };

    const mockCO2Data = {
      generationCO2: 50.5,
      transmissionCO2PerView: 0.15,
      confidence: 'high'
    };

    vi.mocked(imageProcessing.extractImageMetadata).mockResolvedValue(mockMetadata);
    vi.mocked(openai.estimateCO2Emissions).mockResolvedValue(mockCO2Data);

    render(<App />);

    const file = new File(['test'], 'test-image.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload/i, { selector: 'input[type="file"]' });
    await userEvent.upload(input, file);

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText(/Upload New Image/i)).toBeInTheDocument();
    });

    // Click upload new image button
    const uploadNewButton = screen.getByRole('button', { name: /Upload New Image/i });
    await userEvent.click(uploadNewButton);

    // Should show upload interface again
    await waitFor(() => {
      expect(screen.getByText(/Upload AI-Generated Image/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully with retry option', async () => {
    const mockMetadata = {
      width: 1920,
      height: 1080,
      resolution: '1920x1080',
      fileSize: 2048000,
      fileSizeFormatted: '2.0 MB',
      format: 'PNG',
      fileName: 'test-image.png'
    };

    vi.mocked(imageProcessing.extractImageMetadata).mockResolvedValue(mockMetadata);
    vi.mocked(openai.estimateCO2Emissions).mockRejectedValue(
      new Error('API request failed')
    );

    render(<App />);

    const file = new File(['test'], 'test-image.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload/i, { selector: 'input[type="file"]' });
    await userEvent.upload(input, file);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText(/API request failed/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    });
  });
});
