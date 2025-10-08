import React, { useEffect, useState } from 'react';
import { Leaf, Recycle, Bike, Droplet } from 'lucide-react';
import { RecoveryMetricsProps, ImageMetadata } from '../types';
import { calculateRecoveryMetrics } from '../utils/co2Calculations';
import { getResolutionTier, TRADITIONAL_AD_DATA } from '../utils/adComparison';

interface ExtendedRecoveryMetricsProps extends RecoveryMetricsProps {
  metadata?: ImageMetadata;
  transmissionCO2: number;
}

export const RecoveryMetrics: React.FC<ExtendedRecoveryMetricsProps> = ({ 
  totalCO2kg, 
  metadata, 
  transmissionCO2
}) => {
  const metrics = calculateRecoveryMetrics(totalCO2kg);
  
  // Calculate traditional CO2 and metrics if metadata is provided
  const traditionalCO2 = metadata ? (() => {
    const tier = getResolutionTier(metadata);
    return TRADITIONAL_AD_DATA[tier.name].totalCO2;
  })() : null;

  const traditionalTotalCO2kg = traditionalCO2 ? (traditionalCO2 + transmissionCO2) / 1000 : null;
  const traditionalMetrics = traditionalTotalCO2kg ? calculateRecoveryMetrics(traditionalTotalCO2kg) : null;
  
  // AI animation states
  const [animatedTrees, setAnimatedTrees] = useState(0);
  const [animatedPlastic, setAnimatedPlastic] = useState(0);
  const [animatedBike, setAnimatedBike] = useState(0);
  const [animatedOcean, setAnimatedOcean] = useState(0);

  // Traditional animation states
  const [animatedTraditionalTrees, setAnimatedTraditionalTrees] = useState(0);
  const [animatedTraditionalPlastic, setAnimatedTraditionalPlastic] = useState(0);
  const [animatedTraditionalBike, setAnimatedTraditionalBike] = useState(0);
  const [animatedTraditionalOcean, setAnimatedTraditionalOcean] = useState(0);

  // Animate AI metrics
  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 60; // 60 frames
    const interval = duration / steps;

    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / steps;

      setAnimatedTrees(Math.floor(metrics.treesToPlant * progress));
      setAnimatedPlastic(Math.floor(metrics.plasticBottles * progress));
      setAnimatedBike(Math.floor(metrics.bikeKilometers * progress * 10) / 10);
      setAnimatedOcean(Math.floor(metrics.oceanAbsorptionHours * progress));

      if (frame >= steps) {
        clearInterval(timer);
        // Set final values to ensure accuracy
        setAnimatedTrees(metrics.treesToPlant);
        setAnimatedPlastic(metrics.plasticBottles);
        setAnimatedBike(metrics.bikeKilometers);
        setAnimatedOcean(metrics.oceanAbsorptionHours);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [metrics.treesToPlant, metrics.plasticBottles, metrics.bikeKilometers, metrics.oceanAbsorptionHours]);

  // Animate traditional metrics
  useEffect(() => {
    if (!traditionalMetrics) return;

    const duration = 1000; // 1 second
    const steps = 60; // 60 frames
    const interval = duration / steps;

    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / steps;

      setAnimatedTraditionalTrees(Math.floor(traditionalMetrics.treesToPlant * progress));
      setAnimatedTraditionalPlastic(Math.floor(traditionalMetrics.plasticBottles * progress));
      setAnimatedTraditionalBike(Math.floor(traditionalMetrics.bikeKilometers * progress * 10) / 10);
      setAnimatedTraditionalOcean(Math.floor(traditionalMetrics.oceanAbsorptionHours * progress));

      if (frame >= steps) {
        clearInterval(timer);
        // Set final values to ensure accuracy
        setAnimatedTraditionalTrees(traditionalMetrics.treesToPlant);
        setAnimatedTraditionalPlastic(traditionalMetrics.plasticBottles);
        setAnimatedTraditionalBike(traditionalMetrics.bikeKilometers);
        setAnimatedTraditionalOcean(traditionalMetrics.oceanAbsorptionHours);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [traditionalMetrics?.treesToPlant, traditionalMetrics?.plasticBottles, traditionalMetrics?.bikeKilometers, traditionalMetrics?.oceanAbsorptionHours]);

  const aiRecoveryCards = [
    {
      icon: Leaf,
      value: animatedTrees,
      label: 'Trees to Plant',
      description: 'to absorb this CO2 in a year',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400'
    },
    {
      icon: Droplet,
      value: animatedOcean,
      label: 'Ocean Hours',
      description: 'for natural absorption',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400'
    },
    {
      icon: Bike,
      value: animatedBike,
      label: 'Bike Kilometers',
      description: 'vs driving to offset',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-400'
    },
    {
      icon: Recycle,
      value: animatedPlastic,
      label: 'Plastic Bottles',
      description: 'to recycle to offset',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400'
    }
  ];

  const traditionalRecoveryCards = traditionalMetrics ? [
    {
      icon: Leaf,
      value: animatedTraditionalTrees,
      label: 'Trees to Plant',
      description: 'to absorb this CO2 in a year',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400'
    },
    {
      icon: Droplet,
      value: animatedTraditionalOcean,
      label: 'Ocean Hours',
      description: 'for natural absorption',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400'
    },
    {
      icon: Bike,
      value: animatedTraditionalBike,
      label: 'Bike Kilometers',
      description: 'vs driving to offset',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-400'
    },
    {
      icon: Recycle,
      value: animatedTraditionalPlastic,
      label: 'Plastic Bottles',
      description: 'to recycle to offset',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400'
    }
  ] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
        🌿 Recovery Actions Needed
      </h2>
      <p className="text-sm sm:text-base text-gray-400 text-center">
        Here's what it would take to offset the carbon footprint
      </p>
      
      {/* AI Recovery Actions */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          <h3 className="text-lg sm:text-xl font-semibold text-white">AI Creation Recovery</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {aiRecoveryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={`ai-${index}`}
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient border effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${card.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
                
                <div className={`relative bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:scale-105 transition-transform duration-300 ${card.bgColor}`}>
                  <div className="text-center space-y-2">
                    <div className={`p-2 sm:p-3 rounded-xl ${card.bgColor} ${card.iconColor} mx-auto w-fit`}>
                      <Icon size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    
                    <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                      {card.value.toLocaleString()}
                    </div>
                    <div className="text-sm sm:text-base text-white font-semibold">
                      {card.label}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      {card.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traditional Recovery Actions */}
      {traditionalRecoveryCards && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Traditional Creation Recovery</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {traditionalRecoveryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={`traditional-${index}`}
                  className="relative group"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
                  
                  <div className={`relative bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:scale-105 transition-transform duration-300 ${card.bgColor}`}>
                    <div className="text-center space-y-2">
                      <div className={`p-2 sm:p-3 rounded-xl ${card.bgColor} ${card.iconColor} mx-auto w-fit`}>
                        <Icon size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      
                      <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                        {card.value.toLocaleString()}
                      </div>
                      <div className="text-sm sm:text-base text-white font-semibold">
                        {card.label}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {card.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
