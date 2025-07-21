"use client";
// src/app/admin/components/AdminSidebar.tsx - 관리자 사이드바 네비게이션
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  description: string;
}

const navigation: NavItem[] = [
  {
    name: "대시보드",
    href: "/admin/dashboard",
    icon: "📊",
    description: "전체 현황 및 통계"
  },
  {
    name: "블로그 작성",
    href: "/admin/blog-write",
    icon: "✏️",
    description: "새 블로그 글 작성"
  },
  {
    name: "게시글 관리",
    href: "/admin/blog",
    icon: "📝",
    description: "블로그 게시글 관리"
  },
  {
    name: "사용자 관리",
    href: "/admin/users",
    icon: "👥",
        description: "사용자 계정 관리"
  },
  {
    name: "댓글 관리",
    href: "/admin/comments",
    icon: "💬",
    description: "댓글 모더레이션 및 관리"
  },
  {
    name: "문의 관리",
    href: "/admin/inquiries",
    icon: "📞",
    description: "고객 문의 및 상담 관리"
  },
  {
    name: "메뉴관리",
    href: "/admin/menu-management",
    icon: "📋",
    description: "헤더 메뉴 관리"
  },
  {
    name: "SERP 분석",
    href: "/admin/serp-analysis",
    icon: "📈",
    description: "검색엔진 성과 분석"
  },
  {
    name: "사이트 설정",
    href: "/admin/site-settings",
    icon: "⚙️",
    description: "사이트 기본 설정"
  },
  {
    name: "AI 설정",
    href: "/admin/ai-settings",
    icon: "🤖",
    description: "AI 기능 설정"
  }
];

interface AdminSidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isMobile = false, 
  isOpen = false, 
  onClose 
}) => {
  const pathname = usePathname();

  // 모바일에서 메뉴 클릭 시 드로어 닫기
  const handleMenuClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  // ESC 키로 드로어 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobile && onClose) {
        onClose();
      }
    };

    if (isMobile) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobile, onClose]);

  // 모바일 오버레이 클릭 시 드로어 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className={`bg-white border-r border-gray-200 h-screen flex flex-col ${
      isMobile ? 'w-80' : 'w-64'
    }`}>
      {/* 로고/헤더 */}
      <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl sm:text-2xl mr-3">🔧</span>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">관리 패널</h1>
          </div>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="메뉴 닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={handleMenuClick}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900 border-l-4 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="text-lg sm:text-xl mr-3">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm sm:text-base">{item.name}</div>
                    <div className="text-xs text-gray-500 hidden sm:block">{item.description}</div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 하단 정보 */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="text-xs text-gray-500">
          <div>관리자 패널 v1.0</div>
          <div>© 2024 Awekers Blog</div>
        </div>
      </div>
    </div>
  );

  // 모바일 드로어
  if (isMobile) {
    return (
      <>
        {/* 오버레이 */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={handleOverlayClick}
          />
        )}
        
        {/* 드로어 */}
        <div className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {sidebarContent}
        </div>
      </>
    );
  }

  // 데스크톱 사이드바
  return (
    <div className="hidden lg:block flex-shrink-0">
      {sidebarContent}
    </div>
  );
};

export default AdminSidebar; 