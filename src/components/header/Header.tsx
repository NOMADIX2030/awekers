// 🎯 새로운 독립적 헤더 - 성능 최적화 버전
"use client";

import React, { memo } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderBrand, HeaderAuth, HeaderMobile, HeaderNav, MobileSidebar } from './components';
import { useMenus, useAuth, useSidebar, useScroll } from './hooks';

/**
 * 🚀 성능 최적화된 독립적 헤더 컴포넌트
 * 
 * 최적화 기법:
 * - React.memo로 불필요한 리렌더링 방지
 * - 스켈레톤 로더로 로딩 UX 개선
 * - 메모이제이션된 훅들 사용
 * - 조건부 렌더링으로 성능 향상
 * - React Hooks 규칙 준수 (조건부 렌더링을 훅 호출 이후로)
 */

// 🎯 확장된 HeaderProps 타입
interface ExtendedHeaderProps {
  className?: string;
  showLogo?: boolean;
  showAuth?: boolean;
  showMobileMenu?: boolean;
}

// 🎯 스켈레톤 로더 컴포넌트
const HeaderSkeleton = memo(() => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* 브랜드 스켈레톤 */}
        <div className="flex-shrink-0">
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* 네비게이션 스켈레톤 (데스크톱) */}
        <nav className="hidden md:flex space-x-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </nav>

        {/* 인증 버튼 스켈레톤 */}
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse md:hidden"></div>
        </div>
      </div>
    </div>
  </header>
));

HeaderSkeleton.displayName = 'HeaderSkeleton';

// 🚀 메인 헤더 컴포넌트
const Header: React.FC<ExtendedHeaderProps> = memo(({ 
  className,
  showLogo = true,
  showAuth = true,
  showMobileMenu = true 
}) => {
  const router = useRouter();
  
  // 🎯 모든 훅을 먼저 호출 (React Hooks 규칙 준수)
  const { menuItems, menuLoading, userRole, error } = useMenus();
  const { isLoggedIn, handleLogin, handleLogout } = useAuth();
  const { open, toggleSidebar, drawerRef } = useSidebar();
  const { isScrolled } = useScroll();

  // 🎯 메모이제이션된 이벤트 핸들러 (조건부 렌더링 이전에)
  const handleLoginClick = React.useCallback(() => {
    router.push('/login');
  }, [router]);

  const handleItemClick = React.useCallback((href: string) => {
    router.push(href);
  }, [router]);

  // 🎯 헤더 스타일 계산 (메모이제이션)
  const headerClass = React.useMemo(() => {
    const baseClass = "fixed top-0 left-0 right-0 z-50 transition-all duration-300";
    const scrollClass = isScrolled 
      ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200" 
      : "bg-white/80 backdrop-blur-sm";
    
    return `${baseClass} ${scrollClass} ${className || ''}`.trim();
  }, [isScrolled, className]);

  // 🚀 조건부 렌더링을 모든 훅 호출 이후로 이동 (최적화)
  if (menuLoading) {
    return <HeaderSkeleton />;
  }

  return (
    <>
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 🎯 브랜드 로고 */}
            {showLogo && (
              <div className="flex-shrink-0">
                <HeaderBrand />
              </div>
            )}

            {/* 🎯 데스크톱 네비게이션 */}
            <nav className="hidden md:flex space-x-8">
              <HeaderNav 
                menuItems={menuItems}
                isLoggedIn={isLoggedIn}
                onItemClick={handleItemClick}
              />
            </nav>

            {/* 🎯 우측 버튼들 */}
            <div className="flex items-center space-x-4">
              {/* 인증 버튼 */}
              {showAuth && (
                <HeaderAuth 
                  isLoggedIn={isLoggedIn}
                  onLogin={handleLoginClick}
                  onLogout={handleLogout}
                />
              )}

              {/* 모바일 메뉴 버튼 */}
              {showMobileMenu && (
                <div className="md:hidden">
                  <HeaderMobile 
                    onClick={toggleSidebar}
                    isOpen={open}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🚀 에러 상태 표시 (개발환경에서만) */}
        {error && process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
            <p className="text-yellow-800 text-sm">
              ⚠️ 메뉴 로딩 오류: {error.message} (폴백 메뉴 사용 중)
            </p>
          </div>
        )}
      </header>

      {/* 🎯 모바일 사이드바 */}
      <MobileSidebar
        open={open}
        onClose={toggleSidebar}
        menuItems={menuItems}
        isLoggedIn={isLoggedIn}
        drawerRef={drawerRef}
      />
    </>
  );
});

Header.displayName = 'Header';

export default Header; 