import React from 'react';
import { ViewCountSelectorProps } from '../types';

const ViewCountSelector: React.FC<ViewCountSelectorProps> = ({
  selectedCount,
  onCountChange,
}) => {
  const viewOptions = [
    { value: 1000, label: '1K' },
    { value: 10000, label: '10K' },
    { value: 100000, label: '100K' },
    { value: 1000000, label: '1M' },
    { value: 10000000, label: '10M' },
    { value: 100000000, label: '100M' },
    { value: 1000000000, label: '1B' },
  ];

  return (
    <div className="w-full">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 justify-center sm:justify-start">
        <span>📊</span>
        <span>Select View Count</span>
      </h3>
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        {viewOptions.map((option) => {
          const isActive = selectedCount === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => onCountChange(option.value)}
              className={`
                min-h-[44px] min-w-[44px] px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm
                transition-all duration-200 ease-out
                transform hover:scale-105 active:scale-95
                border
                ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-transparent shadow-lg shadow-emerald-500/50'
                    : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:border-emerald-500/50 hover:text-white hover:shadow-md'
                }
              `}
              aria-pressed={isActive}
              aria-label={`Select ${option.label} views`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ViewCountSelector;
