import React from 'react';
import { TrendingDown, Lightbulb } from 'lucide-react';
import { ImageMetadata } from '../types';
import { getAllTierComparisons, getResolutionTier } from '../utils/adComparison';
import { AdComparisonChart } from './AdComparisonChart';

interface AIvsTraditionalComparisonProps {
  metadata: ImageMetadata;
  aiGeneratedCO2: number;
}

export const AIvsTraditionalComparison: React.FC<AIvsTraditionalComparisonProps> = ({
  metadata,
  aiGeneratedCO2
}) => {
  const currentTier = getResolutionTier(metadata);
  const allComparisons = getAllTierComparisons(metadata, aiGeneratedCO2);
  
  // Calculate average savings across all tiers
  const averageSavings = allComparisons.reduce((sum, comp) => sum + comp.savings.percentage, 0) / allComparisons.length;
  const totalSavingsGrams = allComparisons.reduce((sum, comp) => sum + Math.max(0, comp.savings.co2Grams), 0);

  return (
    <div className="relative group">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
      
      {/* Main card */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingDown className="w-8 h-8 text-emerald-400" />
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
              AI vs Traditional Ad Creation
            </h3>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Compare the environmental impact of AI-generated ads versus traditional design processes
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {averageSavings.toFixed(0)}%
            </div>
            <div className="text-sm text-emerald-300">Average CO₂ Reduction</div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              ~30s
            </div>
            <div className="text-sm text-green-300">AI Generation Time</div>
          </div>
          
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-teal-400">
              {Math.round(totalSavingsGrams / 21000)}
            </div>
            <div className="text-sm text-teal-300">Trees Equivalent Saved</div>
          </div>
        </div>

        {/* Comparison Charts */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Environmental Impact by Resolution
          </h4>
          
          {allComparisons.map((comparison) => (
            <AdComparisonChart
              key={comparison.tier.name}
              comparison={comparison}
              isCurrentTier={comparison.tier.name === currentTier.name}
            />
          ))}
        </div>

        {/* Key Insights */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-4">Key Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-200">
            <div>
              <h5 className="font-semibold mb-2">Traditional Process Includes:</h5>
              <ul className="space-y-1 text-blue-300">
                <li>• Designer time (3-12 hours)</li>
                <li>• Multiple revision cycles</li>
                <li>• Stock photo licensing</li>
                <li>• Potential photoshoots</li>
                <li>• Computer/software usage</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">AI Process Benefits:</h5>
              <ul className="space-y-1 text-blue-300">
                <li>• Instant generation (~30 seconds)</li>
                <li>• No human labor CO₂</li>
                <li>• No photoshoot requirements</li>
                <li>• Minimal revision cycles</li>
                <li>• Consistent quality output</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Methodology Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Traditional CO₂ estimates include designer work hours, computer usage, stock photos, and photoshoots.
            Calculations based on industry averages for professional ad creation workflows.
          </p>
        </div>
      </div>
    </div>
  );
};