import React, { useEffect, useRef, useState } from 'react';
import { ImpactSummaryProps } from '../types';
import { formatCO2Value } from '../utils/co2Calculations';

export const ImpactSummary: React.FC<ImpactSummaryProps> = ({
  generationCO2,
  transmissionCO2,
  totalCO2,
  viewCount
}) => {
  const [displayTotal, setDisplayTotal] = useState(0);
  const animationFrameRef = useRef<number>();

  // Animate total CO2 value
  useEffect(() => {
    setDisplayTotal(0);

    const startTime = performance.now();
    const duration = 1200; // 1.2 seconds
    const startValue = 0;
    const endValue = Math.max(0, totalCO2); // Ensure non-negative

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.max(0, startValue + (endValue - startValue) * easeOutCubic);

      setDisplayTotal(currentValue);

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
  }, [totalCO2]);

  // Calculate percentages for breakdown visualization
  const generationPercentage = totalCO2 > 0 ? (generationCO2 / totalCO2) * 100 : 0;
  const transmissionPercentage = totalCO2 > 0 ? (transmissionCO2 / totalCO2) * 100 : 0;

  // Format view count for display
  const formatViewCount = (count: number): string => {
    if (count >= 1000000000) return `${(count / 1000000000).toFixed(1)}B`;
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="relative group">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
      
      {/* Main card */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 animate-fade-in">
        <div className="space-y-4 sm:space-y-6">
          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-200 flex items-center justify-center gap-2">
            <span>🌍</span>
            <span className="text-center">Total Environmental Impact</span>
          </h3>

          {/* Total CO2 Display */}
          <div className="text-center py-4 sm:py-6">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              {formatCO2Value(displayTotal)}
            </div>
            <p className="text-gray-400 mt-2 sm:mt-3 text-xs sm:text-sm">
              Total CO₂ for {formatViewCount(viewCount)} views
            </p>
          </div>

          {/* Breakdown Visualization */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-300 text-center">
              Emission Breakdown
            </h4>

            {/* Visual bar breakdown */}
            <div className="relative h-6 sm:h-8 bg-gray-800/50 rounded-full overflow-hidden border border-white/10">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000 ease-out"
                style={{ width: `${generationPercentage}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                style={{ width: `${transmissionPercentage}%` }}
              />
            </div>

            {/* Breakdown details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Generation CO2 */}
              <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl sm:text-2xl">🎨</span>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-400">Generation</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {formatCO2Value(Math.max(0, generationCO2))}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {generationPercentage.toFixed(1)}% of total
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  One-time AI ad banner creation
                </p>
              </div>

              {/* Transmission CO2 */}
              <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4 border border-blue-500/20 hover:border-blue-500/40 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl sm:text-2xl">📡</span>
                  <span className="text-xs sm:text-sm font-semibold text-blue-400">Transmission</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {formatCO2Value(Math.max(0, transmissionCO2))}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {transmissionPercentage.toFixed(1)}% of total
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Delivery across {formatViewCount(viewCount)} views
                </p>
              </div>
            </div>
          </div>

          {/* Additional context */}
          <div className="text-center pt-3 sm:pt-4 border-t border-white/10">
            <p className="text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-2 flex-wrap">
              <span>💡</span>
              <span className="text-center">Adjust view count above to see impact changes</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
