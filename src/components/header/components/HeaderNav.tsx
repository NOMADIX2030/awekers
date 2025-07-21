// 🎯 PC 네비게이션 컴포넌트 - 현재 구조 100% 보존
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { HeaderNavProps } from '../types';

/**
 * HeaderNav 컴포넌트
 * 
 * 현재 layout.tsx의 PC 네비게이션을 100% 동일하게 복사:
 * - 동적 메뉴 렌더링
 * - 서브메뉴 hover 효과
 * - 관리자 메뉴 조건부 표시
 * - 모든 CSS 클래스와 애니메이션
 */
export const HeaderNav: React.FC<HeaderNavProps> = ({
  menuItems,
  isLoggedIn,
  onItemClick,
  className
}) => {
  const router = useRouter();

  const handleItemClick = (href: string) => {
    router.push(href);
    onItemClick?.(href);
  };

  return (
    <nav className={`hidden md:flex items-center gap-8 ${className || ''}`}>
      {menuItems.map((item) => (
        <div key={item.id} className="relative group">
          <button
            onClick={() => handleItemClick(item.href)}
            className="flex items-center gap-1 py-2 transition-all duration-300 text-black/70 text-lg font-semibold hover:text-black hover:text-xl hover:font-bold"
          >
            {item.label}
            {item.subMenus && item.subMenus.length > 0 && (
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          
          {/* 드롭다운 메뉴 */}
          {item.subMenus && item.subMenus.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="py-2">
                {item.subMenus.map((subItem) => (
                  <a
                    key={subItem.id}
                    href={subItem.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors duration-200"
                  >
                    {subItem.icon && <span className="text-lg">{subItem.icon}</span>}
                    <span>{subItem.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* 관리자 메뉴 - 관리자로 로그인된 경우에만 표시 */}
      {isLoggedIn && typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true" && (
        <div className="relative group">
          <button
            onClick={() => handleItemClick("/admin/dashboard")}
            className="flex items-center gap-1 py-2 transition-all duration-300 text-black/70 text-lg font-semibold hover:text-black hover:text-xl hover:font-bold"
          >
            관리자
          </button>
        </div>
      )}
    </nav>
  );
};

export default HeaderNav; 