import React from 'react';
import { ImageMetadataDisplayProps } from '../types';

export const ImageMetadataDisplay: React.FC<ImageMetadataDisplayProps> = ({
  metadata,
  imagePreview,
}) => {
  
  return (
    <div className="w-full animate-fade-in">
      <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl opacity-50 blur-xl"></div>
        
        <div className="relative z-10">
          {/* Ad Banner Details Header (Always Visible) */}
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Ad Banner Details
            </h2>
          </div>

          {/* Ad Banner Content Grid (Always Visible) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {/* Image Preview Section */}
            <div className="flex flex-col items-center justify-center bg-black/30 rounded-xl p-3 sm:p-4 border border-white/5">
              <div className="w-full max-w-xs aspect-video bg-gray-800/50 rounded-lg overflow-hidden flex items-center justify-center mb-3">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={metadata.fileName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-4xl sm:text-6xl">📸</span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-400 text-center truncate w-full px-2">
                {metadata.fileName}
              </p>
            </div>

            {/* Metadata Info Section */}
            <div className="flex flex-col justify-center space-y-3 sm:space-y-4">
              {/* Resolution */}
              <div className="bg-black/20 rounded-lg p-3 sm:p-4 border border-white/5 hover:border-cyan-500/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">Resolution</span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  {metadata.resolution}
                </p>
                <p className="text-xs text-gray-500">
                  {metadata.width} × {metadata.height} pixels
                </p>
              </div>

              {/* File Size */}
              <div className="bg-black/20 rounded-lg p-3 sm:p-4 border border-white/5 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">File Size</span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  {metadata.fileSizeFormatted}
                </p>
                <p className="text-xs text-gray-500">
                  {metadata.fileSize.toLocaleString()} bytes
                </p>
              </div>

              {/* Format */}
              <div className="bg-black/20 rounded-lg p-3 sm:p-4 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">Format</span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                  {metadata.format}
                </p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};
