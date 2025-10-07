import { ImageMetadata, ValidationResult } from '../types';

/**
 * Extracts metadata from an uploaded image file
 * @param file - The uploaded File object
 * @returns Promise resolving to ImageMetadata
 */
export async function extractImageMetadata(file: File): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Clean up the object URL
      URL.revokeObjectURL(objectUrl);

      // Extract format from MIME type or file extension
      const format = file.type.split('/')[1]?.toUpperCase() || 
                     file.name.split('.').pop()?.toUpperCase() || 
                     'UNKNOWN';

      const metadata: ImageMetadata = {
        width: img.width,
        height: img.height,
        resolution: `${img.width}x${img.height}`,
        fileSize: file.size,
        fileSizeFormatted: formatFileSize(file.size),
        format: format === 'JPEG' ? 'JPG' : format,
        fileName: file.name,
      };

      resolve(metadata);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = objectUrl;
  });
}

/**
 * Formats file size in bytes to human-readable format (KB/MB)
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.4 MB", "156 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const mb = k * k;
  
  if (bytes >= mb) {
    // Format as MB with 1 decimal place
    return `${(bytes / mb).toFixed(1)} MB`;
  } else if (bytes >= k) {
    // Format as KB with 1 decimal place
    return `${(bytes / k).toFixed(1)} KB`;
  } else {
    // Format as Bytes
    return `${bytes} Bytes`;
  }
}

/**
 * Validates an image file for type and size constraints
 * @param file - The File object to validate
 * @param maxSizeMB - Maximum file size in megabytes (default: 10)
 * @returns ValidationResult with isValid flag and optional error message
 */
export function validateImageFile(file: File, maxSizeMB: number = 10): ValidationResult {
  // Check file type
  const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif'];
  const validExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
  
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  const hasValidType = validTypes.includes(fileType);
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidType && !hasValidExtension) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a PNG, JPG, JPEG, WebP, or GIF image.',
    };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeMB}MB limit. Please upload a smaller image.`,
    };
  }
  
  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty. Please upload a valid image.',
    };
  }
  
  return {
    isValid: true,
  };
}
