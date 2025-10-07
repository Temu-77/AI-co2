import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageMetadataDisplay } from './ImageMetadataDisplay';
import { ImageMetadata } from '../types';

describe('ImageMetadataDisplay - Simple Tests', () => {
  const mockMetadata: ImageMetadata = {
    width: 1920,
    height: 1080,
    resolution: '1920x1080',
    fileSize: 2457600,
    fileSizeFormatted: '2.4 MB',
    format: 'PNG',
    fileName: 'test-image.png',
  };

  it('should render without crashing', () => {
    render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview=""
      />
    );
    
    expect(screen.getByText('Image Details')).toBeInTheDocument();
  });

  it('should display all metadata fields', () => {
    render(
      <ImageMetadataDisplay
        metadata={mockMetadata}
        imagePreview=""
      />
    );

    expect(screen.getByText('1920x1080')).toBeInTheDocument();
    expect(screen.getByText('2.4 MB')).toBeInTheDocument();
    expect(screen.getByText('PNG')).toBeInTheDocument();
  });
});
