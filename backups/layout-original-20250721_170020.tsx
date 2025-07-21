"use client";

import "./globals.css";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { Analytics } from '@vercel/analytics/react';
import { getClientUserRole, UserRole } from '@/lib/auth';

// 메뉴 인터페이스 정의
interface MenuItem {
  id: number;
  label: string;
  href: string;
  order: number;
  subMenus?: SubMenuItem[];
}

interface SubMenuItem {
  id: number;
  label: string;
  href: string;
  icon?: string;
  order: number;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // PC 사이드바 상태 - 하위메뉴 관련 제거
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // 동적 메뉴 상태
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  
  // Refs and router
  const drawerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 메뉴 데이터 로딩
  const fetchMenuItems = async () => {
    try {
      setMenuLoading(true);
      const response = await fetch('/api/menu', {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setMenuItems(data.data);
        setUserRole(data.userRole || UserRole.GUEST);
        console.log('메뉴 로딩 완료:', { 
          menuCount: data.data.length, 
          userRole: data.userRole,
          accessibleLevels: data.accessibleLevels 
        });
      } else {
        console.error('메뉴 로딩 실패:', data.error);
        // 기본 메뉴 사용
        setMenuItems([
          { id: 1, label: "검색엔진최적화", href: "/tag/SEO", order: 1 },
          { id: 2, label: "홈페이지 제작", href: "/tag/홈페이지제작", order: 2 },
          { id: 3, label: "AI답변 최적화", href: "/tag/AI답변최적화", order: 3 },
          { id: 4, label: "AI앱 개발", href: "/tag/AI앱개발", order: 4 },
          { id: 5, label: "서비스", href: "/services", order: 5 },
          { id: 6, label: "블로그", href: "/blog", order: 6 }
        ]);
        setUserRole(UserRole.GUEST);
      }
    } catch (error) {
      console.error('메뉴 로딩 오류:', error);
      // 기본 메뉴 사용
      setMenuItems([
        { id: 1, label: "검색엔진최적화", href: "/tag/SEO", order: 1 },
        { id: 2, label: "홈페이지 제작", href: "/tag/홈페이지제작", order: 2 },
        { id: 3, label: "AI답변 최적화", href: "/tag/AI답변최적화", order: 3 },
        { id: 4, label: "AI앱 개발", href: "/tag/AI앱개발", order: 4 },
        { id: 5, label: "서비스", href: "/services", order: 5 },
        { id: 6, label: "블로그", href: "/blog", order: 6 }
      ]);
      setUserRole(UserRole.GUEST);
    } finally {
      setMenuLoading(false);
    }
  };
  
  // 동적 위치 계산을 위한 ref
  const menuItemsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // 컴포넌트 마운트 시 메뉴 로딩
  useEffect(() => {
    fetchMenuItems();

    // 메뉴 변경 이벤트 리스너 추가
    const handleMenuUpdate = () => {
      fetchMenuItems();
    };

    window.addEventListener('menuUpdated', handleMenuUpdate);

    return () => {
      window.removeEventListener('menuUpdated', handleMenuUpdate);
    };
  }, []);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 클라이언트에서 localStorage로 로그인 상태 감지
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    }
  }, []);

  // 로그인/로그아웃 시 상태 동기화
  useEffect(() => {
    const onStorage = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    
    // 메뉴 새로고침 (권한 변경으로 인한)
    fetchMenuItems();
    
    router.push("/");
    setOpen(false);
  };

  // ESC 키, 포커스 트랩, body 스크롤 제어
  useEffect(() => {
    if (!open) return;
    
    // body 스크롤 막기
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('sidebar-open');
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    setTimeout(() => {
      if (drawerRef.current) {
        const first = drawerRef.current.querySelector<HTMLElement>('a, button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        first?.focus();
      }
    }, 50);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalStyle;
      document.body.classList.remove('sidebar-open');
    };
  }, [open]);

  // 로그인 버튼 클릭 시 /login 이동
  const handleLogin = () => {
    router.push("/login");
    setOpen(false);
  };

  // 드롭다운 관련 함수들 - 하위메뉴 제거로 단순화
  const handleMouseEnter = (label: string) => {
    // 하위메뉴 제거로 빈 함수
  };

  const handleMouseLeave = () => {
    // 하위메뉴 제거로 빈 함수
  };

  const handleDropdownMouseEnter = (label: string) => {
    // 하위메뉴 제거로 빈 함수
  };

  const handleDropdownMouseLeave = () => {
    // 하위메뉴 제거로 빈 함수
  };

  // 현재 페이지인지 확인하는 함수
  const isCurrentPage = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };




  return (
    <html lang="ko" className="font-sans">
      <body className="bg-white text-black min-h-screen flex flex-col">
        {/* 헤더 */}
        <header className={`w-full fixed top-0 z-30 transition-all duration-300 h-16 lg:h-[74px] ${
          isScrolled 
            ? 'bg-white/60 backdrop-blur-[15px]' 
            : 'lg:bg-transparent bg-white/95 backdrop-blur-[10px]'
        } ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="w-full flex items-center justify-between px-4 lg:px-6 py-4 h-16 lg:h-[74px] lg:max-w-[91%] lg:mx-auto">
            {/* 로고 */}
            <Link href="/" className="font-bold text-lg md:text-xl lg:text-3xl tracking-tight flex items-center transition-colors duration-300">
              <span className="text-black">
                AWEKERS
              </span>
            </Link>
            
            {/* PC 네비게이션 - 하위메뉴 포함 */}
            <nav className="hidden xl:flex items-center gap-8">
              {menuItems.map((item) => (
                <div key={item.id} className="relative group">
                  <button 
                    onClick={() => router.push(item.href)}
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
                    onClick={() => router.push("/admin/dashboard")}
                    className="flex items-center gap-1 py-2 transition-all duration-300 text-black/70 text-lg font-semibold hover:text-black hover:text-xl hover:font-bold"
                  >
                    관리자
                  </button>
                </div>
              )}
            </nav>
            
            {/* 우측 버튼 그룹 */}
            <div className="flex items-center gap-3">
              {/* 로그인/로그아웃 버튼 */}
              <div className="flex items-center">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="auth-button flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                    aria-label="로그아웃"
                    title="로그아웃"
                  >
                    <svg 
                      className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="auth-button flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                    aria-label="로그인"
                    title="로그인"
                  >
                    <svg 
                      className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                      />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* 햄버거 메뉴 버튼 */}
              <button
                className="hamburger-button flex items-center justify-center w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-sm"
                aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
                onClick={() => setOpen(!open)}
              >
                <div className="relative w-6 h-5 flex items-center justify-center">
                  {/* 햄버거 라인들 - 2개 라인으로 변경 */}
                  <span 
                    className={`hamburger-line absolute w-6 h-0.5 bg-black ${
                      open 
                        ? 'rotate-45 translate-y-0' 
                        : '-translate-y-1'
                    }`}
                  ></span>
                  <span 
                    className={`hamburger-line absolute w-6 h-0.5 bg-black ${
                      open 
                        ? '-rotate-45 translate-y-0' 
                        : 'translate-y-1'
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </header>
        
        {/* 모바일 사이드 메뉴 오버레이 */}
          {open && (
          <div 
            className="mobile-sidebar-overlay xl:hidden"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 999999,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              touchAction: 'none'
            }}
            onClick={() => setOpen(false)}
          >
              <nav
                ref={drawerRef}
              className="mobile-sidebar-content"
              style={{
                position: 'relative',
                width: '80%',
                height: '100%',
                backgroundColor: 'white',
                zIndex: 999999,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
                onClick={e => e.stopPropagation()}
                aria-label="모바일 내비게이션"
                tabIndex={-1}
              >
              {/* 통합된 모바일 헤더 */}
              <div className="mobile-sidebar-header bg-white border-b border-gray-100">
                <div className="flex items-center justify-between px-6 py-4">
                  {/* 로고/브랜드 */}
                  <div className="flex items-center">
                    <span className="font-bold text-xl text-gray-900">AWEKERS</span>
                  </div>
                  
                  {/* 햄버거 버튼 (X로 변환된 상태) */}
                  <button
                    className="hamburger-button flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                    aria-label="메뉴 닫기"
                    onClick={() => setOpen(false)}
                    autoFocus
                  >
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      {/* X자 라인들 */}
                      <span 
                        className="hamburger-line absolute w-5 h-0.5 bg-gray-700 rotate-45 transition-all duration-300 ease-in-out"
                      ></span>
                      <span 
                        className="hamburger-line absolute w-5 h-0.5 bg-gray-700 -rotate-45 transition-all duration-300 ease-in-out"
                      ></span>
                    </div>
                  </button>
                </div>
              </div>
              
                {/* 모바일 메뉴 리스트 - 하위메뉴 포함 */}
                <div className="mobile-menu-items px-6 py-8 space-y-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="mobile-menu-item">
                      <a 
                        href={item.href}
                        className="block text-lg font-semibold text-black hover:text-gray-600 transition-all duration-300 py-2"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </a>
                        
                        {/* 모바일 하위메뉴 */}
                        {item.subMenus && item.subMenus.length > 0 && (
                          <div className="ml-4 mt-2 space-y-2">
                            {item.subMenus.map((subItem) => (
                              <a 
                                key={subItem.id}
                                href={subItem.href}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                                onClick={() => setOpen(false)}
                              >
                                {subItem.icon && <span className="text-base">{subItem.icon}</span>}
                                <span>{subItem.label}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* 관리자 메뉴 - 관리자로 로그인된 경우에만 표시 */}
                    {isLoggedIn && typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true" && (
                      <div className="mobile-menu-item">
                        <a 
                          href="/admin/dashboard"
                          className="block text-lg font-semibold text-black hover:text-gray-600 transition-all duration-300 py-2"
                          onClick={() => setOpen(false)}
                        >
                          관리자
                        </a>
                      </div>
                    )}
                    
                    {/* 문의하기 */}
                    <div className="mobile-menu-item mt-6">
                      <a 
                        href="/contact"
                        className="block text-lg font-semibold text-green-500 hover:text-green-600 transition-all duration-300 py-2"
                        onClick={() => setOpen(false)}
                      >
                        문의하기 →
                      </a>
                    </div>
                  </div>
              
                {/* CTA 버튼 */}
              <div className="mobile-sidebar-footer px-6 py-4 border-t border-gray-100">
                <button className="w-full px-6 py-4 bg-black text-white font-semibold text-lg rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm">
                  문의하기
                  </button>
              </div>
            </nav>
          </div>
        )}
        
        {/* PC 전체 화면 사이드 메뉴 오버레이 */}
        {open && (
          <div 
            className="pc-sidebar-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'white',
              zIndex: 999999,
              display: 'flex',
              overflow: 'hidden'
            }}
            onClick={() => setOpen(false)}
          >
            <div 
              className="pc-sidebar-content"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                overflow: 'hidden'
              }}
              onClick={e => e.stopPropagation()}
              aria-label="PC 전체 화면 네비게이션"
              tabIndex={-1}
            >
              {/* 왼쪽 메인 콘텐츠 영역 */}
              <div className="pc-sidebar-main flex-1 flex flex-col justify-center items-center px-8 lg:px-16 xl:px-24 2xl:px-32">
                {/* 브랜드 로고 - 레퍼런스에 맞게 NXT로 변경 */}
                <div className="absolute top-8 left-8 lg:top-12 lg:left-12">
                  <span className="font-bold text-2xl lg:text-3xl xl:text-4xl text-black tracking-tight">NXT</span>
                </div>
                
                {/* 메뉴 레이아웃 - 1차메뉴만 사용 */}
                <div className="w-full max-w-6xl flex justify-center mt-16 lg:mt-20">
                  {/* 1차 메뉴만 - 중앙 정렬 */}
                  <div className="flex flex-col space-y-6 lg:space-y-8 xl:space-y-10 justify-center h-full">
                    {menuItems.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="relative group menu-item w-full flex items-center justify-center"
                        style={{ minHeight: '80px' }}
                      >
                        <a 
                          href={item.href} 
                          className="flex items-center text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold transition-all duration-500 cursor-pointer leading-tight py-3 lg:py-4 xl:py-5 text-black hover:text-gray-800 hover:scale-105 hover:translate-x-3"
                          onClick={() => setOpen(false)}
                          tabIndex={0}
                        >
                          <span className="flex items-center whitespace-nowrap">
                            {item.label}
                          </span>
                        </a>
                      </div>
                    ))}
                    
                    {/* 관리자 메뉴 - 관리자로 로그인된 경우에만 표시 */}
                    {isLoggedIn && typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true" && (
                      <div 
                        className="relative group menu-item w-full flex items-center justify-center"
                        style={{ minHeight: '80px' }}
                      >
                        <a 
                          href="/admin/dashboard" 
                          className="flex items-center text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold transition-all duration-500 cursor-pointer leading-tight py-3 lg:py-4 xl:py-5 text-black hover:text-gray-800 hover:scale-105 hover:translate-x-3"
                          onClick={() => setOpen(false)}
                          tabIndex={0}
                        >
                          <span className="flex items-center whitespace-nowrap">
                            관리자
                          </span>
                        </a>
                      </div>
                    )}
                    
                    {/* 문의하기 - 초록색 강조 */}
                    <div className="mt-2 lg:mt-4 w-full flex items-center justify-center" style={{ minHeight: '80px' }}>
                      <a 
                        href="/contact"
                        className="flex items-center text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-green-500 hover:text-green-600 transition-all duration-500 cursor-pointer leading-tight group py-3 lg:py-4 xl:py-5 hover:scale-105 hover:translate-x-3"
                        onClick={() => setOpen(false)}
                      >
                        <span className="flex items-center whitespace-nowrap">
                          문의하기
                          <span className="ml-4 lg:ml-6 text-green-500 group-hover:translate-x-2 transition-transform duration-300">→</span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 오른쪽 부가 정보 영역 - 레퍼런스에 맞게 수정 */}
              <div className="pc-sidebar-info fixed bottom-0 right-0 w-full lg:w-1/3 xl:w-1/4 2xl:w-1/5 h-auto p-8 lg:p-10 xl:p-12 border-l border-gray-100 bg-white" style={{ bottom: '77px' }}>
                {/* 닫기 버튼 */}
                <div className="flex justify-end mb-6 lg:mb-8">
                  <button
                    className="pc-close-button flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-lg hover:bg-gray-100 transition-all duration-300"
                    aria-label="메뉴 닫기"
                    onClick={() => {
                      setOpen(false);
                    }}
                    autoFocus
                  >
                    <span className="text-xl lg:text-2xl font-bold text-black">×</span>
                  </button>
                </div>
                
                {/* 부가 정보 - 레퍼런스에 맞게 더 넓은 간격 */}
                <div className="space-y-6 lg:space-y-8 xl:space-y-10">
                  {/* 회사 정보 */}
                  <div className="space-y-3 lg:space-y-4 xl:space-y-5">
                    <a href="/about" className="block text-base lg:text-lg xl:text-xl font-medium text-black hover:text-gray-600 transition-all duration-300 hover:translate-x-1">
                      넥스트리 소개
                    </a>
                    <a href="/uiux" className="block text-base lg:text-lg xl:text-xl font-medium text-black hover:text-gray-600 transition-all duration-300 hover:translate-x-1">
                      UI/UX 소개
                    </a>
                    <a href="/seo-guide" className="block text-base lg:text-lg xl:text-xl font-medium text-black hover:text-gray-600 transition-all duration-300 hover:translate-x-1">
                      SEO 소개서
                    </a>
                  </div>
                  
                  {/* 주소 정보 */}
                  <div className="space-y-2 lg:space-y-3 text-gray-500">
                    <div className="text-sm lg:text-base font-medium text-black">Address</div>
                    <p className="text-sm lg:text-base leading-relaxed">
                      경기도 하남시 미사강변한강로 135 스카이폴리스 나동 930
                    </p>
                  </div>
                  
                  {/* 연락처 정보 */}
                  <div className="space-y-2 lg:space-y-3 text-gray-500">
                    <div className="text-sm lg:text-base font-medium text-black">Tel</div>
                    <p className="text-sm lg:text-base">02-6925-2203</p>
                  </div>
                  
                  {/* 소셜 미디어 */}
                  <div className="flex flex-wrap gap-4 lg:gap-6 xl:gap-8">
                    <a href="#" className="text-sm lg:text-base font-medium text-black hover:text-gray-600 transition-all duration-300 hover:translate-x-1">Instagram</a>
                    <a href="#" className="text-sm lg:text-base font-medium text-black hover:text-gray-600 transition-all duration-300 hover:translate-x-1">Blog</a>
                    <a href="#" className="text-sm lg:text-base font-medium text-black hover:text-gray-600 transition-all duration-300 hover:translate-x-1">Facebook</a>
                    <a href="#" className="text-sm lg:text-base font-medium text-black hover:text-gray-600 transition-all duration-300 hover:translate-x-1">Twitter</a>
                    <a href="#" className="text-sm lg:text-base font-medium text-black hover:text-gray-600 transition-all duration-300 hover:translate-x-1">YouTube</a>
                  </div>
                  
                  {/* 사용자 권한 정보 - 개발자 모드용 */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="space-y-2 lg:space-y-3 text-gray-500 border-t border-gray-200 pt-4">
                      <div className="text-sm lg:text-base font-medium text-black">User Status</div>
                      <div className="text-xs lg:text-sm space-y-1">
                        <p>권한: {userRole === UserRole.ADMIN ? '관리자' : userRole === UserRole.USER ? '일반회원' : '일반방문자'}</p>
                        <p>로그인: {isLoggedIn ? '예' : '아니오'}</p>
                        <p>메뉴 수: {menuItems.length}개</p>
                      </div>
                    </div>
                  )}
                  
                  {/* 저작권 */}
                  <div className="text-gray-400 text-xs lg:text-sm">
                    © 2015 NXT. All rights reserved.
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}
        
        {/* 메인 컨텐츠 */}
        <main 
          className="flex-1 flex flex-col items-center justify-center px-4 pt-16" 
          style={{ 
            zIndex: 0,
            position: 'relative'
          }}
        >
          {children}
        </main>
        
        {/* 접속자 추적 */}
        <AnalyticsTracker />
        <Analytics />
        
        {/* 푸터 */}
        <footer className="w-full border-t border-black/10 bg-white py-6 text-center text-xs text-black/60 mt-auto">
          © {new Date().getFullYear()} AWEKERS. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
