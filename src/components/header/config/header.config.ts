// 🎯 헤더 기본 설정 - 현재 디자인 100% 보존
import { HeaderConfig, MenuItem } from '../types';

// 현재 layout.tsx에서 사용하는 fallback 메뉴 (100% 동일)
const fallbackMenus: MenuItem[] = [
  { id: 1, label: "검색엔진최적화", href: "/tag/SEO", order: 1 },
  { id: 2, label: "홈페이지 제작", href: "/tag/홈페이지제작", order: 2 },
  { id: 3, label: "AI답변 최적화", href: "/tag/AI답변최적화", order: 3 },
  { id: 4, label: "AI앱 개발", href: "/tag/AI앱개발", order: 4 },
  { id: 5, label: "서비스", href: "/services", order: 5 },
  { id: 6, label: "블로그", href: "/blog", order: 6 }
];

// 🎯 현재 디자인과 기능을 100% 보존하는 기본 설정
export const headerConfig: HeaderConfig = {
  // 🛡️ 디자인 보존 강제 (리터럴 타입)
  preserveCurrentDesign: true,
  
  // 현재 활성화된 기능들 유지
  enableDynamicMenus: true,
  enableAuthentication: true,
  enableMobileMenu: true,
  enablePCFullscreen: true,
  
  // 현재 스타일 설정 유지
  cssFramework: 'tailwind',
  responsiveBreakpoints: {
    mobile: '768px',    // xl:hidden
    desktop: '1024px',  // lg: breakpoint
    xl: '1280px'        // xl:flex
  },
  
  // 현재 브랜드 설정
  brand: {
    name: 'AWEKERS',
    href: '/',
    className: 'font-bold text-lg md:text-xl lg:text-3xl tracking-tight flex items-center transition-colors duration-300'
  },
  
  // 현재 메뉴 설정
  menu: {
    enableDatabase: true,
    fallbackMenus,
    cacheTimeout: 5 * 60 * 1000, // 5분 (현재 설정 없으므로 기본값)
    apiEndpoint: '/api/menu'
  },
  
  // 현재 인증 설정
  auth: {
    loginUrl: '/login',
    adminUrl: '/admin/dashboard'
  }
};

// 개발 환경용 설정 (디버깅용)
export const headerConfigDev: HeaderConfig = {
  ...headerConfig,
  menu: {
    ...headerConfig.menu,
    cacheTimeout: 30 * 1000 // 개발 시 30초로 단축
  }
};

// 프로덕션 환경용 설정
export const headerConfigProduction: HeaderConfig = {
  ...headerConfig,
  menu: {
    ...headerConfig.menu,
    cacheTimeout: 10 * 60 * 1000 // 프로덕션에서 10분
  }
};

// 환경별 설정 선택
export const getHeaderConfig = (): HeaderConfig => {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 기본 설정 사용
    return headerConfig;
  }
  
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? headerConfigDev : headerConfigProduction;
};

// 설정 검증 함수
export const validateHeaderConfig = (config: HeaderConfig): boolean => {
  // 필수 필드 검증
  if (!config.brand?.name || !config.brand?.href) {
    console.error('헤더 설정 오류: 브랜드 정보가 누락되었습니다');
    return false;
  }
  
  if (!config.menu?.apiEndpoint) {
    console.error('헤더 설정 오류: 메뉴 API 엔드포인트가 누락되었습니다');
    return false;
  }
  
  if (!config.auth?.loginUrl) {
    console.error('헤더 설정 오류: 로그인 URL이 누락되었습니다');
    return false;
  }
  
  // 디자인 보존 확인
  if (!config.preserveCurrentDesign) {
    console.warn('⚠️ 경고: 현재 디자인이 변경될 수 있습니다');
  }
  
  return true;
};

// 기본 내보내기
export default headerConfig; 