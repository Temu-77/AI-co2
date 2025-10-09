import React, { useEffect, useState } from 'react';
import { Leaf, Recycle, Home, Footprints } from 'lucide-react';
import { RecoveryMetricsProps, TraditionalCO2Data } from '../types';
import { calculateRecoveryMetrics } from '../utils/co2Calculations';

interface ExtendedRecoveryMetricsProps extends RecoveryMetricsProps {
  traditionalData?: TraditionalCO2Data;
  transmissionCO2: number;
}

export const RecoveryMetrics: React.FC<ExtendedRecoveryMetricsProps> = ({ 
  totalCO2kg, 
  traditionalData, 
  transmissionCO2
}) => {
  const metrics = calculateRecoveryMetrics(totalCO2kg);
  
  // Get traditional CO2 from API data
  const traditionalCO2 = traditionalData?.designCO2 || null;

  const traditionalTotalCO2kg = traditionalCO2 ? (traditionalCO2 + transmissionCO2) / 1000 : null;
  const traditionalMetrics = traditionalTotalCO2kg ? calculateRecoveryMetrics(traditionalTotalCO2kg) : null;
  
  // AI animation states
  const [animatedTrees, setAnimatedTrees] = useState(0);
  const [animatedBeeHotels, setAnimatedBeeHotels] = useState(0);
  const [animatedWalking, setAnimatedWalking] = useState(0);
  const [animatedPlastic, setAnimatedPlastic] = useState(0);

  // Traditional animation states
  const [animatedTraditionalTrees, setAnimatedTraditionalTrees] = useState(0);
  const [animatedTraditionalBeeHotels, setAnimatedTraditionalBeeHotels] = useState(0);
  const [animatedTraditionalWalking, setAnimatedTraditionalWalking] = useState(0);
  const [animatedTraditionalPlastic, setAnimatedTraditionalPlastic] = useState(0);

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
      setAnimatedBeeHotels(Math.floor(metrics.beeHotels * progress));
      setAnimatedWalking(Math.floor(metrics.walkingWeeks * progress));
      setAnimatedPlastic(Math.floor(metrics.plasticBottles * progress));

      if (frame >= steps) {
        clearInterval(timer);
        // Set final values to ensure accuracy
        setAnimatedTrees(metrics.treesToPlant);
        setAnimatedBeeHotels(metrics.beeHotels);
        setAnimatedWalking(metrics.walkingWeeks);
        setAnimatedPlastic(metrics.plasticBottles);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [metrics.treesToPlant, metrics.beeHotels, metrics.walkingWeeks, metrics.plasticBottles]);

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
      setAnimatedTraditionalBeeHotels(Math.floor(traditionalMetrics.beeHotels * progress));
      setAnimatedTraditionalWalking(Math.floor(traditionalMetrics.walkingWeeks * progress));
      setAnimatedTraditionalPlastic(Math.floor(traditionalMetrics.plasticBottles * progress));

      if (frame >= steps) {
        clearInterval(timer);
        // Set final values to ensure accuracy
        setAnimatedTraditionalTrees(traditionalMetrics.treesToPlant);
        setAnimatedTraditionalBeeHotels(traditionalMetrics.beeHotels);
        setAnimatedTraditionalWalking(traditionalMetrics.walkingWeeks);
        setAnimatedTraditionalPlastic(traditionalMetrics.plasticBottles);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [traditionalMetrics?.treesToPlant, traditionalMetrics?.beeHotels, traditionalMetrics?.walkingWeeks, traditionalMetrics?.plasticBottles]);

  const aiRecoveryCards = [
    {
      icon: Leaf,
      value: animatedTrees,
      label: 'Trees to Plant',
      description: 'to clean the air for a year',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400'
    },
    {
      icon: Home,
      value: animatedBeeHotels,
      label: 'Bee Hotels to Build',
      description: 'to help bees make flowers grow',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-400'
    },
    {
      icon: Footprints,
      value: animatedWalking,
      label: 'Weeks Walking to School',
      description: 'instead of taking the car',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400'
    },
    {
      icon: Recycle,
      value: animatedPlastic,
      label: 'Bottles to Recycle',
      description: 'to help save the planet',
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
      description: 'to clean the air for a year',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400'
    },
    {
      icon: Home,
      value: animatedTraditionalBeeHotels,
      label: 'Bee Hotels to Build',
      description: 'to help bees make flowers grow',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-400'
    },
    {
      icon: Footprints,
      value: animatedTraditionalWalking,
      label: 'Weeks Walking to School',
      description: 'instead of taking the car',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-400'
    },
    {
      icon: Recycle,
      value: animatedTraditionalPlastic,
      label: 'Bottles to Recycle',
      description: 'to help save the planet',
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
