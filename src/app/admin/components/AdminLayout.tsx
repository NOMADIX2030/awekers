"use client";
import React from 'react';
import AdminBreadcrumb from './AdminBreadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBackButton?: boolean;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title, 
  description,
  breadcrumbs = [],
  showBackButton = true
}) => {
  return (
    <>
      {/* 브레드크럼 네비게이션 */}
      {breadcrumbs.length > 0 && (
        <AdminBreadcrumb 
          items={breadcrumbs}
          showBackButton={showBackButton}
        />
      )}
      
      {/* 페이지 헤더 */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-sm sm:text-base text-gray-600">
            {description}
          </p>
        )}
      </div>
      
      {/* 페이지 콘텐츠 */}
      {children}
    </>
  );
};

export default AdminLayout; 
 
 