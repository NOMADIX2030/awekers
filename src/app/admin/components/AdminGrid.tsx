"use client";
import React from 'react';

interface AdminGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface AdminSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

const AdminGrid: React.FC<AdminGridProps> = ({ 
  children, 
  cols = 1, 
  gap = 'md',
  className = ""
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8'
  };

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return (
    <div className={`grid ${gridClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

const AdminSection: React.FC<AdminSectionProps> = ({ 
  children, 
  title, 
  description,
  className = ""
}) => {
  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {(title || description) && (
        <div className="border-b border-gray-200 pb-4">
          {title && (
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm sm:text-base text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export { AdminSection };
export default AdminGrid; 
 
 