"use client";
import React from 'react';

interface AdminCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const AdminCard: React.FC<AdminCardProps> = ({ 
  children, 
  title, 
  description, 
  className = '',
  padding = 'md',
  onClick
}) => {
  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  const baseClasses = `bg-white rounded-xl shadow-sm border border-gray-200 ${paddingClasses[padding]} ${className}`;
  const interactiveClasses = onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '';

  return (
    <div 
      className={`${baseClasses} ${interactiveClasses}`}
      onClick={onClick}
    >
      {(title || description) && (
        <div className="mb-4 sm:mb-6">
          {title && (
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

// 통계 카드 컴포넌트
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change !== undefined && (
            <p className={`text-sm font-medium mt-1 ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? '↗' : '↘'} {Math.abs(change)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="text-2xl sm:text-3xl text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCard; 
 
 