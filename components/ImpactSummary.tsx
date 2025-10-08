import React, { useEffect, useRef, useState } from 'react';
import { ImpactSummaryProps, TraditionalCO2Data } from '../types';
import { formatCO2Value } from '../utils/co2Calculations';

interface ExtendedImpactSummaryProps extends ImpactSummaryProps {
  traditionalData?: TraditionalCO2Data;
}

export const ImpactSummary: React.FC<ExtendedImpactSummaryProps> = ({
  generationCO2,
  transmissionCO2,
  totalCO2,
  viewCount,
  traditionalData
}) => {
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayTraditionalTotal, setDisplayTraditionalTotal] = useState(0);
  const animationFrameRef = useRef<number>();
  const traditionalAnimationFrameRef = useRef<number>();

  // Get traditional CO2 from API data
  const traditionalCO2 = traditionalData?.designCO2 || null;

  // Traditional total includes design CO2 + transmission (same as AI)
  const traditionalTotalCO2 = traditionalCO2 ? traditionalCO2 + transmissionCO2 : null;

  // Animate AI total CO2 value
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

  // Animate traditional total CO2 value
  useEffect(() => {
    if (!traditionalTotalCO2) return;

    setDisplayTraditionalTotal(0);

    const startTime = performance.now();
    const duration = 1200; // 1.2 seconds
    const startValue = 0;
    const endValue = Math.max(0, traditionalTotalCO2); // Ensure non-negative

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.max(0, startValue + (endValue - startValue) * easeOutCubic);

      setDisplayTraditionalTotal(currentValue);

      if (progress < 1) {
        traditionalAnimationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    traditionalAnimationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (traditionalAnimationFrameRef.current) {
        cancelAnimationFrame(traditionalAnimationFrameRef.current);
      }
    };
  }, [traditionalTotalCO2]);

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
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-200 flex items-center justify-center gap-2">
        <span>🌍</span>
        <span className="text-center">Total Environmental Impact</span>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Impact Summary */}
        <div className="relative group">
          {/* Gradient border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
          
          {/* Main card */}
          <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10">
            <div className="space-y-4 sm:space-y-6">
              {/* AI Title */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                  <h4 className="text-lg sm:text-xl font-semibold text-white">AI Creation</h4>
                </div>
              </div>

              {/* AI Total CO2 Display */}
              <div className="text-center py-4 sm:py-6">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {formatCO2Value(displayTotal)}
                </div>
                <p className="text-gray-400 mt-2 sm:mt-3 text-xs sm:text-sm">
                  Total CO₂ for {formatViewCount(viewCount)} views
                </p>
              </div>

              {/* AI Breakdown Visualization */}
              <div className="space-y-3 sm:space-y-4">
                <h5 className="text-sm sm:text-base font-semibold text-gray-300 text-center">
                  Emission Breakdown
                </h5>

                {/* Visual bar breakdown */}
                <div className="relative h-4 sm:h-6 bg-gray-800/50 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000 ease-out"
                    style={{ width: `${generationPercentage}%` }}
                  />
                  <div
                    className="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                    style={{ width: `${transmissionPercentage}%` }}
                  />
                </div>

                {/* AI Breakdown details */}
                <div className="space-y-2">
                  {/* Creation CO2 */}
                  <div className="bg-gray-800/30 rounded-lg p-3 border border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎨</span>
                        <span className="text-xs font-semibold text-emerald-400">Creation</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {formatCO2Value(Math.max(0, generationCO2))}
                        </div>
                        <div className="text-xs text-gray-400">
                          {generationPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transmission CO2 */}
                  <div className="bg-gray-800/30 rounded-lg p-3 border border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📡</span>
                        <span className="text-xs font-semibold text-blue-400">Transmission</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {formatCO2Value(Math.max(0, transmissionCO2))}
                        </div>
                        <div className="text-xs text-gray-400">
                          {transmissionPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Traditional Impact Summary */}
        {traditionalTotalCO2 && traditionalCO2 && (
          <div className="relative group">
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
            
            {/* Main card */}
            <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10">
              <div className="space-y-4 sm:space-y-6">
                {/* Traditional Title */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
                    <h4 className="text-lg sm:text-xl font-semibold text-white">Traditional Creation</h4>
                  </div>
                </div>

                {/* Traditional Total CO2 Display */}
                <div className="text-center py-4 sm:py-6">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                    {formatCO2Value(displayTraditionalTotal)}
                  </div>
                  <p className="text-gray-400 mt-2 sm:mt-3 text-xs sm:text-sm">
                    Total CO₂ for {formatViewCount(viewCount)} views
                  </p>
                </div>

                {/* Traditional Breakdown Visualization */}
                <div className="space-y-3 sm:space-y-4">
                  <h5 className="text-sm sm:text-base font-semibold text-gray-300 text-center">
                    Emission Breakdown
                  </h5>

                  {/* Calculate traditional percentages */}
                  {(() => {
                    const traditionalDesignPercentage = traditionalTotalCO2 > 0 ? (traditionalCO2 / traditionalTotalCO2) * 100 : 0;
                    const traditionalTransmissionPercentage = traditionalTotalCO2 > 0 ? (transmissionCO2 / traditionalTotalCO2) * 100 : 0;

                    return (
                      <>
                        {/* Visual bar breakdown */}
                        <div className="relative h-4 sm:h-6 bg-gray-800/50 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000 ease-out"
                            style={{ width: `${traditionalDesignPercentage}%` }}
                          />
                          <div
                            className="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                            style={{ width: `${traditionalTransmissionPercentage}%` }}
                          />
                        </div>

                        {/* Traditional Breakdown details */}
                        <div className="space-y-2">
                          {/* Creation CO2 */}
                          <div className="bg-gray-800/30 rounded-lg p-3 border border-orange-500/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🎨</span>
                                <span className="text-xs font-semibold text-orange-400">Creation</span>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-white">
                                  {formatCO2Value(Math.max(0, traditionalCO2))}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {traditionalDesignPercentage.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Transmission CO2 */}
                          <div className="bg-gray-800/30 rounded-lg p-3 border border-blue-500/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">📡</span>
                                <span className="text-xs font-semibold text-blue-400">Transmission</span>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-white">
                                  {formatCO2Value(Math.max(0, transmissionCO2))}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {traditionalTransmissionPercentage.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional context */}
      <div className="text-center pt-3 sm:pt-4 border-t border-white/10">
        <p className="text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-2 flex-wrap">
          <span>💡</span>
          <span className="text-center">Adjust view count above to see impact changes</span>
        </p>
      </div>
    </div>
  );
};
