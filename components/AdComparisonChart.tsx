import React from 'react';
import { Zap, Users, Camera, Clock, Recycle } from 'lucide-react';
import { ComparisonData } from '../utils/adComparison';
import { formatCO2Value } from '../utils/co2Calculations';

interface AdComparisonChartProps {
  comparison: ComparisonData;
  isCurrentTier?: boolean;
}

export const AdComparisonChart: React.FC<AdComparisonChartProps> = ({
  comparison,
  isCurrentTier = false
}) => {
  const { tier, aiGenerated, traditional, savings } = comparison;
  
  // Calculate bar widths for visual comparison
  const maxCO2 = Math.max(aiGenerated.co2, traditional.totalCO2);
  const aiBarWidth = (aiGenerated.co2 / maxCO2) * 100;
  const traditionalBarWidth = (traditional.totalCO2 / maxCO2) * 100;
  
  return (
    <div className={`bg-gray-900/50 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 ${
      isCurrentTier 
        ? 'border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/20' 
        : 'border-white/10 hover:border-white/20'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {tier.name}
            {isCurrentTier && (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                Your Image
              </span>
            )}
          </h3>
          <p className="text-gray-400 text-sm">{tier.range}</p>
        </div>
        
        {/* Savings Badge */}
        {savings.co2Grams > 0 && (
          <div className="text-right">
            <div className="text-emerald-400 font-bold text-lg">
              -{formatCO2Value(savings.co2Grams)}
            </div>
            <div className="text-emerald-400 text-sm">
              {savings.percentage.toFixed(1)}% less CO₂
            </div>
          </div>
        )}
      </div>

      {/* Visual Comparison Bars */}
      <div className="space-y-4 mb-6">
        {/* AI Generated Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">AI Generated</span>
            </div>
            <span className="text-sm font-bold text-white">
              {formatCO2Value(aiGenerated.co2)}
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${aiBarWidth}%` }}
            />
          </div>
        </div>

        {/* Traditional Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-gray-300">Traditional Design</span>
            </div>
            <span className="text-sm font-bold text-white">
              {formatCO2Value(traditional.totalCO2)}
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${traditionalBarWidth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Traditional Process Breakdown */}
      <div className="border-t border-white/10 pt-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Traditional Process Breakdown
        </h4>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Design Time:</span>
              <span className="text-white">{traditional.designTime}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Revisions:</span>
              <span className="text-white">{traditional.revisions}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stock Photos:</span>
              <span className="text-white">{traditional.stockPhotos}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Photoshoot:</span>
              <span className="text-white flex items-center gap-1">
                {traditional.photoshoot ? (
                  <>
                    <Camera className="w-3 h-3 text-orange-400" />
                    Yes
                  </>
                ) : (
                  'No'
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Computer Usage:</span>
              <span className="text-white">{formatCO2Value(traditional.computerUsageCO2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Process:</span>
              <span className="text-white font-semibold">{formatCO2Value(traditional.totalCO2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Process Summary */}
      <div className="border-t border-white/10 pt-4 mt-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          AI Process
        </h4>
        <div className="text-xs text-gray-400">
          <p>{aiGenerated.method}</p>
          <p className="mt-1">Generation time: ~30 seconds</p>
        </div>
      </div>

      {/* Environmental Impact */}
      {savings.co2Grams > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Recycle className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">Environmental Savings</span>
          </div>
          <div className="text-xs text-emerald-300">
            <p>By using AI generation instead of traditional design:</p>
            <p className="mt-1">• Saved {formatCO2Value(savings.co2Grams)} CO₂ emissions</p>
            <p>• {savings.percentage.toFixed(1)}% reduction in carbon footprint</p>
            <p>• Equivalent to {Math.round(savings.co2Grams / 21000)} trees planted</p>
          </div>
        </div>
      )}
    </div>
  );
};