"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface AdminBreadcrumbProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  className?: string;
}

const AdminBreadcrumb: React.FC<AdminBreadcrumbProps> = ({ 
  items, 
  showBackButton = true,
  className = ""
}) => {
  const router = useRouter();

  return (
    <div className={`flex items-center justify-between mb-4 sm:mb-6 ${className}`}>
      {/* 브레드크럼 네비게이션 */}
      <nav className="flex items-center space-x-2" aria-label="Breadcrumb">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="뒤로가기"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로가기
          </button>
        )}
        
        <div className="flex items-center space-x-2">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              
              {item.current ? (
                <span className="text-sm font-medium text-gray-900 px-3 py-2 bg-gray-100 rounded-lg">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm font-medium text-gray-500 px-3 py-2">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>

      {/* 홈 버튼 (모바일에서만 표시) */}
      <div className="lg:hidden">
        <Link
          href="/admin/dashboard"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="관리자 홈으로 이동"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          홈
        </Link>
      </div>
    </div>
  );
};

export default AdminBreadcrumb; 
 
 