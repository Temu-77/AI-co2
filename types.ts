// Core Data Interfaces

export interface ImageMetadata {
  width: number;
  height: number;
  resolution: string; // "1920x1080"
  fileSize: number; // in bytes
  fileSizeFormatted: string; // "2.4 MB"
  format: string; // "PNG", "JPG", etc.
  fileName: string;
}

export interface CO2Data {
  generationCO2: number; // in grams
  transmissionCO2PerView: number; // in grams per view
  modelInfo?: {
    imageGen?: string;
    promptGen?: string;
    system?: string;
    location?: string;
  };
  confidence?: string; // "high", "medium", "low"
}

export interface TraditionalCO2Data {
  designCO2: number; // in grams
  designTime: number; // in hours
  revisions: number;
  stockPhotos: number;
  photoshoot: boolean;
  complexity: 'Basic' | 'Standard' | 'Premium' | 'Enterprise';
  confidence?: string; // "high", "medium", "low"
}

export interface ComparisonItem {
  icon: string; // emoji
  text: string;
  category: 'everyday' | 'digital';
}

// Component Props Types

export interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isDisabled: boolean;
}

export interface ImageMetadataDisplayProps {
  metadata: ImageMetadata;
  imagePreview: string;
}

export interface CO2EmissionCardProps {
  generationCO2: number;
  isAnimating: boolean;
}

export interface ViewCountSelectorProps {
  selectedCount: number;
  onCountChange: (count: number) => void;
}

export interface EnvironmentalComparisonsProps {
  generationCO2: number;
}

export interface ImpactSummaryProps {
  generationCO2: number;
  transmissionCO2: number;
  totalCO2: number;
  viewCount: number;
}

export interface RecoveryMetricsProps {
  totalCO2kg: number;
}

export interface LoadingSpinnerProps {
  message?: string;
}

export interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

// API Request/Response Types

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  response_format?: { type: 'json_object' };
  temperature?: number;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface CO2EstimationResponse {
  generationCO2: number;
  transmissionCO2PerView: number;
  modelInfo?: {
    imageGen?: string;
    promptGen?: string;
    system?: string;
    location?: string;
  };
  confidence?: string;
}

// Utility Types

export type ViewCountOption = 1000 | 10000 | 100000 | 1000000 | 10000000 | 100000000 | 1000000000;

export interface RecoveryMetrics {
  treesToPlant: number;
  plasticBottles: number;
  bikeKilometers: number;
  oceanAbsorptionHours: number;
}

export type ImageFormat = 'PNG' | 'JPG' | 'JPEG' | 'WEBP' | 'GIF';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
