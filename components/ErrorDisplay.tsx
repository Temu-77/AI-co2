import React from 'react';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="relative bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl">
        {/* Dismiss button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 hover:scale-110 active:scale-95"
            aria-label="Dismiss error"
          >
            <X className="w-5 h-5 text-red-400" />
          </button>
        )}

        {/* Error icon and message */}
        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 pr-10 sm:pr-0">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
            </div>
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2 flex items-center gap-2 flex-wrap">
              <span>⚠️</span>
              <span>Oops! Something went wrong</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{error}</p>
          </div>
        </div>

        {/* Retry button */}
        {onRetry && (
          <div className="flex justify-center">
            <button
              onClick={onRetry}
              className="group flex items-center gap-2 min-h-[44px] min-w-[44px] px-5 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-red-500/50 text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
