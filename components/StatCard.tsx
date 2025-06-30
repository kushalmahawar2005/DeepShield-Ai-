import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  color, 
  description 
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      case 'green':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'purple':
        return 'bg-purple-500/20 border-purple-500/30 text-purple-400';
      case 'orange':
        return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      case 'red':
        return 'bg-red-500/20 border-red-500/30 text-red-400';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return '↗️';
      case 'decrease':
        return '↘️';
      default:
        return '→';
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-400';
      case 'decrease':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="card group hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${getChangeColor(changeType)}`}>
            <span>{getChangeIcon(changeType)}</span>
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-sm mb-2">{title}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard; 