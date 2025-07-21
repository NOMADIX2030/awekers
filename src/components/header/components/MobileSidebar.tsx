// 🎯 모바일 사이드바 컴포넌트 - 현재 구조 100% 보존
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { MobileSidebarProps } from '../types';

/**
 * MobileSidebar 컴포넌트
 * 
 * 현재 layout.tsx의 모바일 사이드바를 100% 동일하게 복사:
 * - 오버레이와 사이드바 구조
 * - 메뉴 아이템 렌더링
 * - 관리자 메뉴 조건부 표시
 * - 모든 CSS 클래스와 애니메이션
 */
export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  open,
  onClose,
  menuItems,
  isLoggedIn,
  drawerRef
}) => {
  const router = useRouter();

  const handleItemClick = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleLogin = () => {
    router.push("/login");
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    
    // 메뉴 새로고침 이벤트 발생
    window.dispatchEvent(new CustomEvent('menuUpdated'));
    
    router.push("/");
    onClose();
  };

  return (
    <>
      {/* 오버레이 (현재 layout.tsx와 100% 동일) */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 z-[999998] ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 사이드바 (현재 layout.tsx와 100% 동일) */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[999999] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* 헤더 영역 (현재 layout.tsx와 100% 동일) */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 id="mobile-menu-title" className="text-xl font-bold text-gray-900">
            메뉴
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="메뉴 닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 메뉴 리스트 (현재 layout.tsx와 100% 동일) */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-6 space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleItemClick(item.href)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
                >
                  <span className="text-lg">📄</span>
                  <span>{item.label}</span>
                </button>
                
                {/* 서브메뉴 (현재 layout.tsx와 100% 동일) */}
                {item.subMenus && item.subMenus.length > 0 && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.subMenus.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleItemClick(subItem.href)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors"
                      >
                        {subItem.icon && <span className="text-base">{subItem.icon}</span>}
                        <span>{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* 관리자 메뉴 (현재 layout.tsx와 100% 동일) */}
            {isLoggedIn && typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true" && (
              <button
                onClick={() => handleItemClick("/admin/dashboard")}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
              >
                <span className="text-lg">⚙️</span>
                <span>관리자</span>
              </button>
            )}
          </div>
        </nav>

        {/* 하단 인증 버튼 영역 (현재 layout.tsx와 100% 동일) */}
        <div className="border-t bg-gray-50 p-6">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              로그아웃
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              로그인
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileSidebar; 