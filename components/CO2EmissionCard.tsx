import React, { useEffect, useRef, useState } from 'react';
import { CO2EmissionCardProps } from '../types';
import { formatCO2Value } from '../utils/co2Calculations';

export const CO2EmissionCard: React.FC<CO2EmissionCardProps> = ({
  generationCO2,
  isAnimating
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!isAnimating) {
      setDisplayValue(generationCO2);
      return;
    }

    // Reset to 0 when starting animation
    setDisplayValue(0);

    const startTime = performance.now();
    const duration = 1200; // 1.2 seconds for smooth animation
    const startValue = 0;
    const endValue = generationCO2;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth acceleration/deceleration
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOutCubic;

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [generationCO2, isAnimating]);

  return (
    <div className="relative group">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
      
      {/* Main card */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 animate-fade-in">
        <div className="text-center space-y-3 sm:space-y-4">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-300 flex items-center justify-center gap-2">
            <span>🎨</span>
            <span>Generation CO₂</span>
          </h3>

          {/* Large animated CO2 value */}
          <div className="py-4 sm:py-6">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              {formatCO2Value(displayValue)}
            </div>
          </div>

          {/* Contextual description */}
          <div className="space-y-2 text-gray-400">
            <p className="flex items-center justify-center gap-2 text-sm sm:text-base">
              <span>⚡</span>
              <span>Energy used to create this ad banner</span>
            </p>
            <p className="text-xs sm:text-sm flex items-center justify-center gap-2">
              <span>🌍</span>
              <span>One-time generation cost</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
