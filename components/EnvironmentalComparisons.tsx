import React, { useMemo } from 'react';
import { ComparisonItem, TraditionalCO2Data } from '../types';

interface EnvironmentalComparisonsProps {
  generationCO2: number;
  traditionalData?: TraditionalCO2Data;
}

const EnvironmentalComparisons: React.FC<EnvironmentalComparisonsProps> = ({ generationCO2, traditionalData }) => {
  // Get traditional CO2 from API data
  const traditionalCO2 = traditionalData?.designCO2 || null;
  // Define all comparison items
  const everydayComparisons: ComparisonItem[] = [
    { icon: '🚗', text: 'Driving a car for 0.5 km', category: 'everyday' },
    { icon: '💡', text: 'Running a LED bulb for 24 hours', category: 'everyday' },
    { icon: '☕', text: 'Making 2 cups of coffee', category: 'everyday' },
    { icon: '🍔', text: 'Eating a small burger', category: 'everyday' },
    { icon: '🚿', text: 'Taking a 5-minute hot shower', category: 'everyday' },
    { icon: '📱', text: 'Charging your phone 10 times', category: 'everyday' },
    { icon: '🌳', text: 'What a tree absorbs in 2 days', category: 'everyday' },
    { icon: '🔥', text: 'Burning a candle for 8 hours', category: 'everyday' },
  ];

  const digitalComparisons: ComparisonItem[] = [
    { icon: '📧', text: 'Sending 1,000 emails', category: 'digital' },
    { icon: '🎬', text: 'Streaming 30 minutes of HD video', category: 'digital' },
    { icon: '☁️', text: 'Storing 100 GB in the cloud for a month', category: 'digital' },
    { icon: '🎮', text: 'Gaming online for 2 hours', category: 'digital' },
    { icon: '💻', text: 'Running a laptop for 8 hours', category: 'digital' },
    { icon: '📹', text: 'A 1-hour Zoom call', category: 'digital' },
    { icon: '🔍', text: 'Making 500 Google searches', category: 'digital' },
    { icon: '📲', text: 'Scrolling social media for 3 hours', category: 'digital' },
  ];

  // Randomly select 2 everyday and 2 digital comparisons
  const selectedComparisons = useMemo(() => {
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const selectedEveryday = shuffleArray(everydayComparisons).slice(0, 2);
    const selectedDigital = shuffleArray(digitalComparisons).slice(0, 2);

    return [...selectedEveryday, ...selectedDigital];
  }, [generationCO2]); // Re-randomize when generationCO2 changes

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
        🌍 Environmental Context
      </h3>
      
      {/* AI Generation Comparisons */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          <h4 className="text-base sm:text-lg font-semibold text-white">AI Creation Impact</h4>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm mb-4">
          Generating this image has a similar CO2 impact as:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
          {selectedComparisons.map((comparison, index) => (
            <div
              key={`ai-${index}`}
              className={`
                relative p-4 sm:p-6 rounded-2xl backdrop-blur-xl border
                transition-all duration-300 hover:scale-105 hover:shadow-xl
                animate-slide-up
                ${
                  comparison.category === 'everyday'
                    ? 'bg-gradient-to-br from-emerald-900/30 to-green-900/20 border-emerald-500/30 hover:border-emerald-400/50'
                    : 'bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border-cyan-500/30 hover:border-cyan-400/50'
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient border effect */}
              <div
                className={`
                  absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300
                  ${
                    comparison.category === 'everyday'
                      ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/10'
                      : 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10'
                  }
                `}
              />
              
              <div className="relative flex items-start space-x-3 sm:space-x-4">
                <div className="text-3xl sm:text-4xl flex-shrink-0">
                  {comparison.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                    {comparison.text}
                  </p>
                  <span
                    className={`
                      inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full
                      ${
                        comparison.category === 'everyday'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }
                    `}
                  >
                    {comparison.category === 'everyday' ? '🌿 Everyday' : '💻 Digital'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traditional Design Comparisons */}
      {traditionalCO2 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
            <h4 className="text-base sm:text-lg font-semibold text-white">Traditional Creation Impact</h4>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            Creating this ad traditionally would have a similar CO2 impact as:
          </p>
          
          {/* Traditional comparisons with appropriate higher-impact activities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
            {(() => {
              // Create appropriate comparisons for traditional design's higher CO2 impact
              const traditionalComparisons: ComparisonItem[] = [
                { icon: '🚗', text: 'Driving a car for 5 km', category: 'everyday' },
                { icon: '💡', text: 'Running a LED bulb for 5 days', category: 'everyday' },
                { icon: '☕', text: 'Making 20 cups of coffee', category: 'everyday' },
                { icon: '🍔', text: 'Eating a large restaurant meal', category: 'everyday' },
                { icon: '🚿', text: 'Taking a 30-minute hot shower', category: 'everyday' },
                { icon: '📱', text: 'Charging your phone 100 times', category: 'everyday' },
                { icon: '🌳', text: 'What a tree absorbs in 3 weeks', category: 'everyday' },
                { icon: '🔥', text: 'Burning candles for 3 days', category: 'everyday' },
                { icon: '📧', text: 'Sending 10,000 emails', category: 'digital' },
                { icon: '🎬', text: 'Streaming 5 hours of HD video', category: 'digital' },
                { icon: '☁️', text: 'Storing 1TB in the cloud for a month', category: 'digital' },
                { icon: '🎮', text: 'Gaming online for 20 hours', category: 'digital' },
                { icon: '💻', text: 'Running a laptop for 3 days', category: 'digital' },
                { icon: '📹', text: 'A full day of video calls', category: 'digital' },
                { icon: '🔍', text: 'Making 5,000 Google searches', category: 'digital' },
                { icon: '📲', text: 'Scrolling social media for 2 days', category: 'digital' },
              ];

              // Randomly select 2 everyday and 2 digital comparisons for traditional
              const shuffleArray = <T,>(array: T[]): T[] => {
                const shuffled = [...array];
                for (let i = shuffled.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
              };

              const traditionalEveryday = traditionalComparisons.filter(c => c.category === 'everyday');
              const traditionalDigital = traditionalComparisons.filter(c => c.category === 'digital');
              
              const selectedTraditionalEveryday = shuffleArray(traditionalEveryday).slice(0, 2);
              const selectedTraditionalDigital = shuffleArray(traditionalDigital).slice(0, 2);
              
              const selectedTraditionalComparisons = [...selectedTraditionalEveryday, ...selectedTraditionalDigital];

              return selectedTraditionalComparisons.map((comparison, index) => {
                
                return (
                  <div
                    key={`traditional-${index}`}
                    className={`
                      relative p-4 sm:p-6 rounded-2xl backdrop-blur-xl border
                      transition-all duration-300 hover:scale-105 hover:shadow-xl
                      animate-slide-up
                      ${
                        comparison.category === 'everyday'
                          ? 'bg-gradient-to-br from-orange-900/30 to-red-900/20 border-orange-500/30 hover:border-orange-400/50'
                          : 'bg-gradient-to-br from-red-900/30 to-pink-900/20 border-red-500/30 hover:border-red-400/50'
                      }
                    `}
                    style={{ animationDelay: `${(index + 4) * 100}ms` }}
                  >
                    {/* Gradient border effect */}
                    <div
                      className={`
                        absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300
                        ${
                          comparison.category === 'everyday'
                            ? 'bg-gradient-to-br from-orange-500/20 to-red-500/10'
                            : 'bg-gradient-to-br from-red-500/20 to-pink-500/10'
                        }
                      `}
                    />
                    
                    <div className="relative flex items-start space-x-3 sm:space-x-4">
                      <div className="text-3xl sm:text-4xl flex-shrink-0">
                        {comparison.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                          {comparison.text}
                        </p>
                        <span
                          className={`
                            inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full
                            ${
                              comparison.category === 'everyday'
                                ? 'bg-orange-500/20 text-orange-300'
                                : 'bg-red-500/20 text-red-300'
                            }
                          `}
                        >
                          {comparison.category === 'everyday' ? '🌿 Everyday' : '💻 Digital'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentalComparisons;
