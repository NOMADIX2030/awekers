// 🎯 헤더 시스템 타입 정의 - 현재 디자인 100% 보존
import { ReactNode } from 'react';

// === 메뉴 관련 타입 ===
export interface MenuItem {
  id: number;
  label: string;
  href: string;
  order: number;
  subMenus?: SubMenuItem[];
}

export interface SubMenuItem {
  id: number;
  label: string;
  href: string;
  icon?: string;
  order: number;
}

// === 사용자 권한 타입 ===
export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER', 
  ADMIN = 'ADMIN'
}

// === 헤더 컴포넌트 Props ===
export interface HeaderProps {
  className?: string;
  children?: ReactNode;
}

export interface HeaderBrandProps {
  className?: string;
  href?: string;
  children?: ReactNode;
}

export interface HeaderNavProps {
  menuItems: MenuItem[];
  isLoggedIn: boolean;
  onItemClick?: (href: string) => void;
  className?: string;
}

export interface HeaderAuthProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  className?: string;
}

export interface HeaderMobileProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

// === 사이드바 Props ===
export interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  isLoggedIn: boolean;
  drawerRef: React.RefObject<HTMLDivElement | null>;
}

export interface PCFullscreenProps {
  open: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  userRole: UserRole;
  isLoggedIn: boolean;
}

// === 훅 관련 타입 ===
export interface UseMenusReturn {
  menuItems: MenuItem[];
  menuLoading: boolean;
  userRole: UserRole;
  refetch: () => void;
  error?: Error | null;
}

export interface UseAuthReturn {
  isLoggedIn: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
  userRole: UserRole;
}

export interface UseScrollReturn {
  isScrolled: boolean;
  isHeaderVisible: boolean;
  lastScrollY: number;
}

export interface UseSidebarReturn {
  open: boolean;
  setOpen: (open: boolean) => void;
  drawerRef: React.RefObject<HTMLDivElement | null>;
  toggleSidebar: () => void;
}

// === 설정 관련 타입 ===
export interface HeaderConfig {
  // 🎯 디자인 보존 강제 설정
  preserveCurrentDesign: true; // 리터럴 타입으로 강제
  
  // 기능 설정
  enableDynamicMenus: boolean;
  enableAuthentication: boolean;
  enableMobileMenu: boolean;
  enablePCFullscreen: boolean;
  
  // 스타일 설정 (기존 유지)
  cssFramework: 'tailwind';
  responsiveBreakpoints: {
    mobile: '768px';
    desktop: '1024px';
    xl: '1280px';
  };
  
  // 브랜드 설정
  brand: {
    name: string;
    href: string;
    className?: string;
  };
  
  // 메뉴 설정
  menu: {
    enableDatabase: boolean;
    fallbackMenus: MenuItem[];
    cacheTimeout: number;
    apiEndpoint: string;
  };
  
  // 인증 설정  
  auth: {
    loginUrl: string;
    logoutUrl?: string;
    adminUrl: string;
  };
}

// === 서비스 관련 타입 ===
export interface MenuServiceConfig {
  apiEndpoint: string;
  fallbackMenus: MenuItem[];
  cacheTimeout: number;
  enableDatabase: boolean;
}

export interface AuthServiceConfig {
  loginUrl: string;
  logoutUrl?: string;
  adminUrl: string;
}

// === API 응답 타입 ===
export interface MenuAPIResponse {
  success: boolean;
  data: MenuItem[];
  userRole: UserRole;
  accessibleLevels?: UserRole[];
  error?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userId?: string;
  userRole: UserRole;
}

// === 이벤트 타입 ===
export interface MenuUpdateEvent extends CustomEvent {
  detail: {
    type: 'refresh' | 'update' | 'delete';
    menuId?: number;
  };
}

// === 에러 타입 ===
export class HeaderError extends Error {
  constructor(
    message: string,
    public code: string,
    public component?: string
  ) {
    super(message);
    this.name = 'HeaderError';
  }
}

export interface HeaderErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// === 성능 모니터링 타입 ===
export interface HeaderPerformanceMetrics {
  renderTime: number;
  menuLoadTime: number;
  componentCount: number;
  memoryUsage?: number;
}

// === 테스트 관련 타입 ===
export interface HeaderTestProps {
  testId?: string;
  'data-testid'?: string;
}

// === 헤더 컨텍스트 타입 ===
export interface HeaderContextValue {
  config: HeaderConfig;
  menuItems: MenuItem[];
  isLoggedIn: boolean;
  userRole: UserRole;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// === 유틸리티 타입 ===
export type MenuItemWithoutId = Omit<MenuItem, 'id'>;
export type SubMenuItemWithoutId = Omit<SubMenuItem, 'id'>;
export type HeaderPropsOptional = Partial<HeaderProps>;

// === 상수 타입 ===
export const HEADER_CONSTANTS = {
  HEIGHT: {
    MOBILE: '16', // h-16 (64px)
    DESKTOP: '[74px]' // h-[74px]
  },
  Z_INDEX: {
    HEADER: 30,
    SIDEBAR: 999999
  },
  BREAKPOINTS: {
    MOBILE: 768,
    DESKTOP: 1024,
    XL: 1280
  },
  ANIMATION: {
    DURATION: 300,
    BLUR: {
      SCROLLED: '[15px]',
      DEFAULT: '[10px]'
    }
  }
} as const;

// === 디자인 토큰 타입 (현재 디자인 보존용) ===
export interface HeaderDesignTokens {
  // 기존 Tailwind 클래스 보존
  brand: {
    className: 'font-bold text-lg md:text-xl lg:text-3xl tracking-tight flex items-center transition-colors duration-300';
    textColor: 'text-black';
  };
  
  nav: {
    containerClass: 'hidden xl:flex items-center gap-8';
    itemClass: 'flex items-center gap-1 py-2 transition-all duration-300 text-black/70 text-lg font-semibold hover:text-black hover:text-xl hover:font-bold';
  };
  
  auth: {
    buttonBaseClass: 'auth-button flex items-center justify-center w-12 h-12 rounded-xl text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group';
    loginGradient: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700';
    logoutGradient: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600';
  };
  
  hamburger: {
    buttonClass: 'hamburger-button flex items-center justify-center w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-sm';
    lineClass: 'hamburger-line absolute w-6 h-0.5 bg-black';
  };
}

// === 기본 내보내기 ===
export default HeaderConfig; 