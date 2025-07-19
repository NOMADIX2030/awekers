"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminSidebar from './components/AdminSidebar';
import FloatingAIButton from './components/FloatingAIButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <AdminSidebar 
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 모바일 헤더 */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">관리자</span>
            </div>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>
        )}

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* 플로팅 AI 버튼 */}
      <FloatingAIButton />
    </div>
  );
} 