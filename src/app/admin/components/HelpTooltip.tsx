"use client";
import React, { useState } from 'react';

interface HelpTooltipProps {
  title: string;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  trigger?: 'hover' | 'click';
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  title,
  content,
  position = 'top',
  size = 'md',
  trigger = 'hover'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const sizeClasses = {
    sm: 'min-w-[200px] max-w-[280px]',
    md: 'min-w-[280px] max-w-[400px]',
    lg: 'min-w-[350px] max-w-[500px]'
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') setIsVisible(true);
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === 'click') setIsVisible(!isVisible);
  };

  return (
    <div className="relative inline-block">
      <button
        className="inline-flex items-center justify-center w-6 h-6 text-gray-400 hover:text-blue-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        title={title}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </button>

      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} ${sizeClasses[size]} bg-gray-900 text-white text-sm rounded-lg shadow-xl p-4 whitespace-normal transition-all duration-200 ease-in-out animate-in fade-in-0 zoom-in-95`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            wordBreak: 'keep-all',
            wordWrap: 'break-word',
            hyphens: 'auto',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="font-semibold mb-3 text-base">{title}</div>
          <div className="text-gray-200 leading-relaxed text-sm">
            {content}
          </div>
          {/* 화살표 */}
          <div className={`absolute w-3 h-3 bg-gray-900 transform rotate-45 ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1.5' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1.5' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1.5' :
            'right-full top-1/2 -translate-y-1/2 -mr-1.5'
          }`} />
        </div>
      )}
    </div>
  );
};

export default HelpTooltip; 
 
 