import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay = 0 }) => {
  return (
    <div 
      className="card group cursor-pointer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col items-center text-center h-full">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>
        
        <p className="text-gray-300 leading-relaxed">
          {description}
        </p>
        
        <div className="mt-4 w-12 h-1 bg-accent rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </div>
    </div>
  );
};

export default FeatureCard; 