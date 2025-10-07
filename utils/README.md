# Utility Functions

This module provides utility functions for the AI Image CO2 Calculator application, including image processing, CO2 calculations, and OpenAI API integration.

## Functions

### `extractImageMetadata(file: File): Promise<ImageMetadata>`

Extracts metadata from an uploaded image file including dimensions, file size, and format.

**Parameters:**
- `file` (File): The uploaded File object

**Returns:**
- Promise<ImageMetadata>: Resolves with image metadata

**Example:**
```typescript
const file = document.querySelector('input[type="file"]').files[0];
const metadata = await extractImageMetadata(file);
console.log(metadata);
// {
//   width: 1920,
//   height: 1080,
//   resolution: "1920x1080",
//   fileSize: 2516582,
//   fileSizeFormatted: "2.4 MB",
//   format: "PNG",
//   fileName: "banner.png"
// }
```

**Error Handling:**
- Rejects with Error if the image fails to load
- Automatically cleans up object URLs

---

### `formatFileSize(bytes: number): string`

Converts file size in bytes to a human-readable format (Bytes, KB, or MB).

**Parameters:**
- `bytes` (number): File size in bytes

**Returns:**
- string: Formatted file size

**Examples:**
```typescript
formatFileSize(0);        // "0 Bytes"
formatFileSize(1024);     // "1.0 KB"
formatFileSize(1536);     // "1.5 KB"
formatFileSize(1048576);  // "1.0 MB"
formatFileSize(2516582);  // "2.4 MB"
```

**Format Rules:**
- < 1024 bytes: Displays as "X Bytes"
- >= 1024 bytes and < 1MB: Displays as "X.X KB"
- >= 1MB: Displays as "X.X MB"
- Always shows 1 decimal place for KB and MB

---

### `validateImageFile(file: File, maxSizeMB?: number): ValidationResult`

Validates an image file for type and size constraints.

**Parameters:**
- `file` (File): The File object to validate
- `maxSizeMB` (number, optional): Maximum file size in megabytes (default: 10)

**Returns:**
- ValidationResult: Object with `isValid` boolean and optional `error` message

**Supported Formats:**
- PNG (.png, image/png)
- JPG/JPEG (.jpg, .jpeg, image/jpg, image/jpeg)
- WebP (.webp, image/webp)
- GIF (.gif, image/gif)

**Validation Rules:**
1. File must have a valid image MIME type or extension
2. File size must not exceed the specified limit (default 10MB)
3. File must not be empty (0 bytes)
4. Validation is case-insensitive for both MIME types and extensions

**Examples:**
```typescript
// Valid file
const validFile = new File(['content'], 'image.png', { type: 'image/png' });
const result1 = validateImageFile(validFile);
// { isValid: true }

// Invalid file type
const invalidFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });
const result2 = validateImageFile(invalidFile);
// { isValid: false, error: "Invalid file type. Please upload a PNG, JPG, JPEG, WebP, or GIF image." }

// File too large
const largeFile = new File([new Array(11 * 1024 * 1024).fill('a')], 'large.png', { type: 'image/png' });
const result3 = validateImageFile(largeFile);
// { isValid: false, error: "File size exceeds 10MB limit. Please upload a smaller image." }

// Custom size limit
const mediumFile = new File([new Array(3 * 1024 * 1024).fill('a')], 'medium.png', { type: 'image/png' });
const result4 = validateImageFile(mediumFile, 5);
// { isValid: true }

// Empty file
const emptyFile = new File([], 'empty.png', { type: 'image/png' });
const result5 = validateImageFile(emptyFile);
// { isValid: false, error: "File is empty. Please upload a valid image." }
```

## Testing

Run the test suite:

```bash
npm test
```

The test suite covers:
- ✅ File size formatting (bytes, KB, MB)
- ✅ Image file validation (type, size, empty files)
- ✅ Edge cases and error handling
- ✅ Case-insensitive validation
- ✅ Custom size limits

## Requirements Satisfied

This module satisfies the following requirements from the specification:

- **Requirement 1.3**: Extract image metadata including resolution, file size, and format
- **Requirement 1.5**: Validate image file type and size limits

## Dependencies

- TypeScript
- Browser File API
- Browser Image API
- URL API (for object URL management)

---

## OpenAI API Integration

### `estimateCO2Emissions(metadata: ImageMetadata): Promise<CO2Data>`

Estimates CO2 emissions for an AI-generated image using OpenAI's API. Automatically falls back to formula-based calculations if the API is unavailable or fails.

**Parameters:**
- `metadata` (ImageMetadata): Image metadata including resolution, file size, and format

**Returns:**
- Promise<CO2Data>: Resolves with CO2 emission data

**Example:**
```typescript
const metadata = await extractImageMetadata(file);
const co2Data = await estimateCO2Emissions(metadata);
console.log(co2Data);
// {
//   generationCO2: 15.5,
//   transmissionCO2PerView: 0.36,
//   confidence: "high",
//   modelInfo: {
//     imageGen: "DALL-E 3",
//     system: "Azure OpenAI"
//   }
// }
```

**API Configuration:**
- Requires `VITE_OPENAI_API_KEY` environment variable
- Uses GPT-4 model for estimation
- 30-second timeout for API requests
- Structured JSON response format

**Fallback Calculation:**
If the API is unavailable or fails, the function uses formula-based estimates:
- Generation CO2 = (width × height × 0.000001) + (fileSize in MB × 0.5)
- Transmission CO2 per view = fileSize in MB × 0.15
- Minimum values: 0.01g for generation, 0.001g for transmission

**Error Handling:**
- Network failures → Fallback calculation
- API timeouts (>30s) → Fallback calculation
- Rate limit errors (429) → Fallback calculation
- Authentication errors (401) → Fallback calculation
- Invalid response format → Fallback calculation
- Out-of-range values → Fallback calculation

**Response Validation:**
- Ensures numeric values for CO2 emissions
- Validates reasonable ranges (0-1,000,000g for generation, 0-10,000g for transmission)
- Checks for required fields (generationCO2, transmissionCO2PerView)

**Examples:**
```typescript
// With API key configured
const result1 = await estimateCO2Emissions(metadata);
// Uses OpenAI API, returns high-confidence estimate

// Without API key
const result2 = await estimateCO2Emissions(metadata);
// Uses fallback calculation, returns low-confidence estimate
// { generationCO2: 3.27, transmissionCO2PerView: 0.36, confidence: "low" }

// API timeout or error
const result3 = await estimateCO2Emissions(metadata);
// Automatically falls back, no error thrown
```

## Requirements Satisfied

This module satisfies the following requirements from the specification:

**Image Processing:**
- **Requirement 1.3**: Extract image metadata including resolution, file size, and format
- **Requirement 1.5**: Validate image file type and size limits

**OpenAI API Integration:**
- **Requirement 2.1**: Send image metadata to OpenAI API for CO2 estimation
- **Requirement 2.2**: Use structured prompts for CO2 estimation requests
- **Requirement 2.5**: Parse CO2 emission data from API responses
- **Requirement 2.6**: Validate numeric values and reasonable ranges
- **Requirement 2.7**: Use fallback estimates when API fails

**CO2 Calculations:**
- **Requirement 3.1**: Calculate total emissions based on generation and transmission
- **Requirement 3.4**: Format CO2 values appropriately
- **Requirement 3.6**: Compute recovery metrics (trees, plastic, bike, ocean)

## Notes

- The `extractImageMetadata` function uses the browser's native Image API to load and analyze images
- Object URLs are automatically cleaned up to prevent memory leaks
- All functions are fully typed with TypeScript
- Validation works with both MIME types and file extensions for maximum compatibility
- OpenAI API integration gracefully degrades to fallback calculations
- No errors are thrown to the user - all failures result in fallback estimates
