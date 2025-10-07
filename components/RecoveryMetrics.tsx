import React, { useEffect, useState } from 'react';
import { Leaf, Recycle, Bike, Droplet } from 'lucide-react';
import { RecoveryMetricsProps } from '../types';
import { calculateRecoveryMetrics } from '../utils/co2Calculations';

export const RecoveryMetrics: React.FC<RecoveryMetricsProps> = ({ totalCO2kg }) => {
  const metrics = calculateRecoveryMetrics(totalCO2kg);
  
  const [animatedTrees, setAnimatedTrees] = useState(0);
  const [animatedPlastic, setAnimatedPlastic] = useState(0);
  const [animatedBike, setAnimatedBike] = useState(0);
  const [animatedOcean, setAnimatedOcean] = useState(0);

  useEffect(() => {
    // Animate each metric with count-up effect
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

  const recoveryCards = [
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
      icon: Recycle,
      value: animatedPlastic,
      label: 'Plastic Bottles',
      description: 'to recycle to offset',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-400'
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
      icon: Droplet,
      value: animatedOcean,
      label: 'Ocean Hours',
      description: 'for natural absorption',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400'
    }
  ];

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in">
      <h2 className="text-xl sm:text-2xl font-bold text-white">
        🌿 Recovery Actions Needed
      </h2>
      <p className="text-sm sm:text-base text-gray-400">
        Here's what it would take to offset this carbon footprint
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
        {recoveryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient border effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${card.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
              
              <div className={`relative bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 hover:scale-105 transition-transform duration-300 ${card.bgColor}`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-2 sm:p-3 rounded-xl ${card.bgColor} ${card.iconColor} flex-shrink-0`}>
                    <Icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent mb-1`}>
                      {card.value.toLocaleString()}
                    </div>
                    <div className="text-sm sm:text-base text-white font-semibold mb-1">
                      {card.label}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      {card.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
