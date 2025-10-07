import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { ImageUploadProps } from '../types';
import { validateImageFile } from '../utils/imageProcessing';

export function ImageUpload({ onImageUpload, isDisabled }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isDisabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);

    // Validate the file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Call the parent callback
    onImageUpload(file);
  };

  const handleClick = () => {
    if (!isDisabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-6 sm:p-8 md:p-12 text-center
          transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-emerald-400 bg-emerald-500/10 scale-105' 
            : 'border-gray-600 bg-gray-900/50 hover:border-gray-500'
          }
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          backdrop-blur-xl
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpg,image/jpeg,image/webp,image/gif"
          onChange={handleFileInput}
          disabled={isDisabled}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4 animate-fade-in">
            <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden border border-white/10">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto"
              />
            </div>
            <p className="text-gray-400 text-sm">
              ✅ Image uploaded successfully
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-center">
              {isDragging ? (
                <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400 animate-bounce" />
              ) : (
                <Upload className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                {isDragging ? '📥 Drop your ad banner here' : '📢 Upload AI-Generated Ad Banner'}
              </h3>
              <p className="text-sm sm:text-base text-gray-400">
                Drag and drop or click to select
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Supports PNG, JPG, JPEG, WebP, GIF (max 10MB)
              </p>
            </div>

            <button
              type="button"
              disabled={isDisabled}
              className="
                min-h-[44px] min-w-[44px] px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500
                text-white font-medium rounded-lg text-sm sm:text-base
                hover:from-emerald-600 hover:to-cyan-600
                active:scale-95
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              Select Image
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-fade-in">
          <p className="text-red-400 text-sm flex items-center gap-2">
            <span>❌</span>
            <span>{error}</span>
          </p>
        </div>
      )}
    </div>
  );
}
