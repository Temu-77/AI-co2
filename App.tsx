import { useState, useEffect } from 'react';
import './index.css';
import { ImageUpload } from './components/ImageUpload';
import { ImageMetadataDisplay } from './components/ImageMetadataDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { CO2EmissionCard } from './components/CO2EmissionCard';
import ViewCountSelector from './components/ViewCountSelector';
import EnvironmentalComparisons from './components/EnvironmentalComparisons';
import { ImpactSummary } from './components/ImpactSummary';
import { RecoveryMetrics } from './components/RecoveryMetrics';
import { TraditionalCO2Card } from './components/TraditionalCO2Card';
import { extractImageMetadata } from './utils/imageProcessing';
import { estimateCO2Emissions } from './utils/openai';
import { calculateTotalCO2 } from './utils/co2Calculations';
import type { ImageMetadata, CO2Data } from './types';

function App() {
  // State management
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null);
  const [co2Data, setCO2Data] = useState<CO2Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState<number>(1000000); // Default 1M views
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      setError(null);
      setUploadedImage(file);
      
      // Create image preview
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      
      // Extract metadata
      const metadata = await extractImageMetadata(file);
      setImageMetadata(metadata);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process image';
      setError(errorMessage);
      setUploadedImage(null);
      setImageMetadata(null);
      setImagePreview(null);
    }
  };

  // Call OpenAI API when imageMetadata changes
  useEffect(() => {
    if (!imageMetadata) return;

    const fetchCO2Data = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await estimateCO2Emissions(imageMetadata);
        setCO2Data(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to estimate CO2 emissions';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCO2Data();
  }, [imageMetadata]);

  // Handle view count change
  const handleViewCountChange = (count: number) => {
    setViewCount(count);
  };

  // Handle retry after error
  const handleRetry = () => {
    if (imageMetadata) {
      setError(null);
      // Trigger re-fetch by setting metadata again
      const metadata = imageMetadata;
      setImageMetadata(null);
      setTimeout(() => setImageMetadata(metadata), 0);
    }
  };

  // Handle upload new image
  const handleUploadNew = () => {
    // Clean up object URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    
    // Reset all state
    setUploadedImage(null);
    setImageMetadata(null);
    setCO2Data(null);
    setError(null);
    setImagePreview(null);
    setViewCount(1000000);
  };

  // Calculate transmission and total CO2
  const transmissionCO2 = co2Data ? co2Data.transmissionCO2PerView * viewCount : 0;
  const totalCO2 = co2Data ? calculateTotalCO2(co2Data.generationCO2, co2Data.transmissionCO2PerView, viewCount) : 0;
  const totalCO2kg = totalCO2 / 1000;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-slide-up px-2">
            AI Ad Banner CO₂ Calculator
          </h1>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto animate-fade-in px-4" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
            Discover the environmental impact of AI-generated ad banners 🌍
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
          {/* Image Upload Section */}
          {!uploadedImage && (
            <div className="animate-slide-up">
              <ImageUpload 
                onImageUpload={handleImageUpload} 
                isDisabled={isLoading} 
              />
            </div>
          )}

          {/* Image Metadata Display */}
          {imageMetadata && imagePreview && (
            <div className="animate-slide-up">
              <ImageMetadataDisplay 
                metadata={imageMetadata} 
                imagePreview={imagePreview} 
              />
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="animate-fade-in">
              <LoadingSpinner message="Analyzing your ad banner with AI... 🤖" />
            </div>
          )}

          {/* Error Display */}
          {error && !isLoading && (
            <div className="animate-slide-up">
              <ErrorDisplay 
                error={error} 
                onRetry={handleRetry}
              />
            </div>
          )}

          {/* Results Section - Only show when we have CO2 data and no error */}
          {co2Data && !error && !isLoading && (
            <>
              {/* CO2 Cards - Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
                {/* AI Creation CO2 Card */}
                <CO2EmissionCard 
                  generationCO2={co2Data.generationCO2} 
                  isAnimating={true} 
                />
                
                {/* Traditional Design CO2 Card */}
                {imageMetadata && (
                  <TraditionalCO2Card 
                    metadata={imageMetadata}
                    isAnimating={true}
                  />
                )}
              </div>

              {/* Environmental Comparisons */}
              <div className="animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
                <EnvironmentalComparisons 
                  generationCO2={co2Data.generationCO2} 
                  metadata={imageMetadata || undefined}
                />
              </div>

              {/* View Count Selector */}
              <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
                <ViewCountSelector 
                  selectedCount={viewCount} 
                  onCountChange={handleViewCountChange} 
                />
              </div>

              {/* Impact Summary */}
              <div className="animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
                <ImpactSummary 
                  generationCO2={co2Data.generationCO2}
                  transmissionCO2={transmissionCO2}
                  totalCO2={totalCO2}
                  viewCount={viewCount}
                  metadata={imageMetadata || undefined}
                />
              </div>

              {/* Recovery Metrics */}
              <div className="animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
                <RecoveryMetrics 
                  totalCO2kg={totalCO2kg}
                  metadata={imageMetadata || undefined}
                  transmissionCO2={transmissionCO2}
                />
              </div>



              {/* Upload New Image Button */}
              <div className="text-center pt-6 sm:pt-8 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
                <button
                  onClick={handleUploadNew}
                  className="min-h-[44px] min-w-[44px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50 text-sm sm:text-base"
                >
                  📤 Upload New Image
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 md:mt-20 text-center text-gray-500 text-xs sm:text-sm animate-fade-in px-4" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
          <p>
            💚 Understanding our digital carbon footprint is the first step toward a sustainable future
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
