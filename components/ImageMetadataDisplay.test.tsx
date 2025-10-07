import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageMetadataDisplay } from './ImageMetadataDisplay';
import { ImageMetadata } from '../types';

describe('ImageMetadataDisplay', () => {
  const mockMetadata: ImageMetadata = {
    width: 1920,
    height: 1080,
    resolution: '1920x1080',
    fileSize: 2457600,
    fileSizeFormatted: '2.4 MB',
    format: 'PNG',
    fileName: 'test-image.png',
  };

  const mockImagePreview = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  it('should render the component with metadata', () => {
    render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview={mockImagePreview}
      />
    );

    expect(screen.getByText('Image Details')).toBeInTheDocument();
  });

  it('should display resolution correctly', () => {
    render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview={mockImagePreview}
      />
    );

    expect(screen.getByText('1920x1080')).toBeInTheDocument();
    expect(screen.getByText('1920 × 1080 pixels')).toBeInTheDocument();
  });

  it('should display file size correctly', () => {
    render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview={mockImagePreview}
      />
    );

    expect(screen.getByText('2.4 MB')).toBeInTheDocument();
    expect(screen.getByText('2,457,600 bytes')).toBeInTheDocument();
  });

  it('should display format correctly', () => {
    render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview={mockImagePreview}
      />
    );

    expect(screen.getByText('PNG')).toBeInTheDocument();
  });

  it('should display file name', () => {
    render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview={mockImagePreview}
      />
    );

    expect(screen.getByText('test-image.png')).toBeInTheDocument();
  });

  it('should render image preview when provided', () => {
    render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview={mockImagePreview}
      />
    );

    const img = screen.getByAltText('test-image.png');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockImagePreview);
  });

  it('should show emoji placeholder when no image preview', () => {
    render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview=""
      />
    );

    expect(screen.getByText('📸')).toBeInTheDocument();
  });

  it('should display all metadata emojis', () => {
    render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview={mockImagePreview}
      />
    );

    expect(screen.getByText('🖼️')).toBeInTheDocument();
    expect(screen.getByText('📐')).toBeInTheDocument();
    expect(screen.getByText('💾')).toBeInTheDocument();
    expect(screen.getByText('🎨')).toBeInTheDocument();
  });

  it('should handle different image formats', () => {
    const jpgMetadata: ImageMetadata = {
      ...mockMetadata,
      format: 'JPG',
      fileName: 'photo.jpg',
    };

    render(
      <ImageMetadataDisplay
        metadata={jpgMetadata}
        imagePreview={mockImagePreview}
      />
    );

    expect(screen.getByText('JPG')).toBeInTheDocument();
    expect(screen.getByText('photo.jpg')).toBeInTheDocument();
  });

  it('should handle large file sizes', () => {
    const largeFileMetadata: ImageMetadata = {
      ...mockMetadata,
      fileSize: 10485760,
      fileSizeFormatted: '10.0 MB',
    };

    render(
      <ImageMetadataDisplay
        metadata={largeFileMetadata}
        imagePreview={mockImagePreview}
      />
    );

    expect(screen.getByText('10.0 MB')).toBeInTheDocument();
    expect(screen.getByText('10,485,760 bytes')).toBeInTheDocument();
  });

  it('should handle different resolutions', () => {
    const hdMetadata: ImageMetadata = {
      ...mockMetadata,
      width: 3840,
      height: 2160,
      resolution: '3840x2160',
    };

    render(
      <ImageMetadataDisplay
        metadata={hdMetadata}
        imagePreview={mockImagePreview}
      />
    );

    expect(screen.getByText('3840x2160')).toBeInTheDocument();
    expect(screen.getByText('3840 × 2160 pixels')).toBeInTheDocument();
  });

  it('should have proper CSS classes for animations', () => {
    const { container } = render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview={mockImagePreview}
      />
    );

    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('animate-fade-in');
  });

  it('should have glassmorphism styling classes', () => {
    const { container } = render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview={mockImagePreview}
      />
    );

    const card = container.querySelector('.bg-gray-900\\/90');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('backdrop-blur-xl');
  });

  it('should display section labels correctly', () => {
    render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview={mockImagePreview}
      />
    );

    expect(screen.getByText('Resolution')).toBeInTheDocument();
    expect(screen.getByText('File Size')).toBeInTheDocument();
    expect(screen.getByText('Format')).toBeInTheDocument();
  });
});
