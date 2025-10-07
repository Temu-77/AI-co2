import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageUpload } from './ImageUpload';

// Mock the imageProcessing utility
vi.mock('../utils/imageProcessing', () => ({
  validateImageFile: vi.fn((file: File) => {
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'Invalid file type. Please upload a PNG, JPG, JPEG, WebP, or GIF image.' };
    }
    if (file.size > 10 * 1024 * 1024) {
      return { isValid: false, error: 'File size exceeds 10MB limit. Please upload a smaller image.' };
    }
    return { isValid: true };
  }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Upload: () => <div data-testid="upload-icon">Upload Icon</div>,
  Image: () => <div data-testid="image-icon">Image Icon</div>,
}));

describe('ImageUpload Component', () => {
  const mockOnImageUpload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('renders upload interface with correct text', () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={false} />);
    
    expect(screen.getByText(/Upload AI-Generated Image/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag and drop or click to select/i)).toBeInTheDocument();
    expect(screen.getByText(/Supports PNG, JPG, JPEG, WebP, GIF/i)).toBeInTheDocument();
  });

  it('shows upload icon when not dragging', () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={false} />);
    
    expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
  });

  it('handles drag enter event and shows visual feedback', () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={false} />);
    
    const dropZone = screen.getByText(/Upload AI-Generated Image/i).closest('div')?.parentElement;
    
    fireEvent.dragEnter(dropZone!, { dataTransfer: { files: [] } });
    
    expect(screen.getByText(/Drop your image here/i)).toBeInTheDocument();
    expect(screen.getByTestId('image-icon')).toBeInTheDocument();
  });

  it('handles drag leave event and removes visual feedback', () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={false} />);
    
    const dropZone = screen.getByText(/Upload AI-Generated Image/i).closest('div')?.parentElement;
    
    fireEvent.dragEnter(dropZone!, { dataTransfer: { files: [] } });
    expect(screen.getByText(/Drop your image here/i)).toBeInTheDocument();
    
    fireEvent.dragLeave(dropZone!, { dataTransfer: { files: [] } });
    expect(screen.getByText(/Upload AI-Generated Image/i)).toBeInTheDocument();
  });

  it('handles valid file drop', async () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={false} />);
    
    const dropZone = screen.getByText(/Upload AI-Generated Image/i).closest('div')?.parentElement;
    const file = new File(['image content'], 'test.png', { type: 'image/png' });
    
    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [file] },
    });
    
    await waitFor(() => {
      expect(mockOnImageUpload).toHaveBeenCalledWith(file);
    });
  });

  it('validates file and shows error for invalid file type', async () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={false} />);
    
    const dropZone = screen.getByText(/Upload AI-Generated Image/i).closest('div')?.parentElement;
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [file] },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
      expect(screen.getByText(/❌/)).toBeInTheDocument();
    });
    
    expect(mockOnImageUpload).not.toHaveBeenCalled();
  });

  it('validates file and shows error for oversized file', async () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={false} />);
    
    const dropZone = screen.getByText(/Upload AI-Generated Image/i).closest('div')?.parentElement;
    // Create a file larger than 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    
    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [largeFile] },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/File size exceeds 10MB/i)).toBeInTheDocument();
    });
    
    expect(mockOnImageUpload).not.toHaveBeenCalled();
  });

  it('handles file input change', async () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={false} />);
    
    const fileInput = screen.getByRole('button', { name: /Select Image/i })
      .closest('div')
      ?.querySelector('input[type="file"]') as HTMLInputElement;
    
    const file = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(mockOnImageUpload).toHaveBeenCalledWith(file);
    });
  });

  it('shows preview after successful upload', async () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={false} />);
    
    const dropZone = screen.getByText(/Upload AI-Generated Image/i).closest('div')?.parentElement;
    const file = new File(['image content'], 'test.png', { type: 'image/png' });
    
    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [file] },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Image uploaded successfully/i)).toBeInTheDocument();
      expect(screen.getByAltText('Preview')).toBeInTheDocument();
    });
  });

  it('disables interaction when isDisabled is true', () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={true} />);
    
    const dropZone = screen.getByText(/Upload AI-Generated Image/i).closest('div')?.parentElement;
    const file = new File(['image content'], 'test.png', { type: 'image/png' });
    
    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [file] },
    });
    
    expect(mockOnImageUpload).not.toHaveBeenCalled();
  });

  it('prevents drag state change when disabled', () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={true} />);
    
    const dropZone = screen.getByText(/Upload AI-Generated Image/i).closest('div')?.parentElement;
    
    fireEvent.dragEnter(dropZone!, { dataTransfer: { files: [] } });
    
    // Should still show the original text, not the drag text
    expect(screen.getByText(/Upload AI-Generated Image/i)).toBeInTheDocument();
  });

  it('opens file dialog when clicking select button', () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={false} />);
    
    const selectButton = screen.getByRole('button', { name: /Select Image/i });
    const fileInput = selectButton.closest('div')?.querySelector('input[type="file"]') as HTMLInputElement;
    
    const clickSpy = vi.spyOn(fileInput, 'click');
    
    fireEvent.click(selectButton);
    
    expect(clickSpy).toHaveBeenCalled();
  });

  it('clears error when uploading a new valid file after error', async () => {
    render(<ImageUpload onImageUpload={mockOnImageUpload} isDisabled={false} />);
    
    const dropZone = screen.getByText(/Upload AI-Generated Image/i).closest('div')?.parentElement;
    
    // First, drop an invalid file
    const invalidFile = new File(['content'], 'test.txt', { type: 'text/plain' });
    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [invalidFile] },
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
    });
    
    // Then, drop a valid file
    const validFile = new File(['image content'], 'test.png', { type: 'image/png' });
    fireEvent.drop(dropZone!, {
      dataTransfer: { files: [validFile] },
    });
    
    await waitFor(() => {
      expect(screen.queryByText(/Invalid file type/i)).not.toBeInTheDocument();
      expect(mockOnImageUpload).toHaveBeenCalledWith(validFile);
    });
  });
});
