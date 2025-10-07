import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  const [emojiIndex, setEmojiIndex] = useState(0);
  const emojis = ['⏳', '🌱', '🌍'];

  useEffect(() => {
    const interval = setInterval(() => {
      setEmojiIndex((prev) => (prev + 1) % emojis.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl px-4">
      <div className="relative overflow-hidden rounded-3xl p-[2px] bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-blue-500/50 animate-gradient-shift">
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 flex flex-col items-center gap-4 sm:gap-6">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl animate-pulse-slow">
              {emojis[emojiIndex]}
            </div>
          </div>
          {message && (
            <p className="text-gray-300 text-base sm:text-lg font-medium animate-fade-in text-center">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
