# 🏗️ 베타 단계 헤더 시스템 구조적 개선 계획

## 📋 개요
현재 베타 개발 단계에서 **재사용 가능하고 구조적으로 안정적인 헤더 시스템**을 구축하기 위한 종합적 개선 방안

## 🎯 개선 목표
- **단일 진실 소스 (Single Source of Truth)** 구축
- **환경별 설정 완전 분리** (개발/스테이징/프로덕션)
- **타입 안전성 100% 보장**
- **성능 최적화 및 캐싱**
- **완벽한 에러 처리**
- **프로젝트 간 재사용성**

---

## 🏗️ 1. 메뉴 시스템 리팩토링

### 1.1 새로운 메뉴 서비스 아키텍처
```typescript
// src/services/MenuService.ts
export class MenuService {
  private static instance: MenuService;
  private cache: Map<string, MenuItem[]> = new Map();
  private config: MenuConfig;

  constructor(config: MenuConfig) {
    this.config = config;
  }

  async getMenus(userRole: UserRole): Promise<MenuItem[]> {
    const cacheKey = `menu_${userRole}`;
    
    // 1. 캐시 확인
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // 2. 데이터베이스 조회 시도
    try {
      const menus = await this.fetchFromDatabase(userRole);
      this.cache.set(cacheKey, menus);
      return menus;
    } catch (error) {
      // 3. Fallback 메뉴 사용
      console.warn('DB 연결 실패, fallback 메뉴 사용:', error);
      return this.getFallbackMenus(userRole);
    }
  }

  private getFallbackMenus(userRole: UserRole): MenuItem[] {
    return this.config.fallbackMenus[userRole] || this.config.fallbackMenus.default;
  }
}
```

### 1.2 환경별 메뉴 설정 파일
```typescript
// src/config/menu.config.ts
export interface MenuConfig {
  fallbackMenus: {
    [key in UserRole]: MenuItem[];
  };
  cacheTimeout: number;
  enableDatabaseMenu: boolean;
  environment: 'development' | 'staging' | 'production';
}

export const menuConfig: MenuConfig = {
  fallbackMenus: {
    GUEST: [
      { id: 1, label: "검색엔진최적화", href: "/tag/SEO", order: 1 },
      { id: 2, label: "홈페이지 제작", href: "/tag/홈페이지제작", order: 2 },
      { id: 3, label: "AI답변 최적화", href: "/tag/AI답변최적화", order: 3 },
      { id: 4, label: "AI앱 개발", href: "/tag/AI앱개발", order: 4 },
      { id: 5, label: "서비스", href: "/services", order: 5 },
      { id: 6, label: "블로그", href: "/blog", order: 6 }
    ],
    USER: [
      // USER 전용 메뉴 추가
    ],
    ADMIN: [
      // ADMIN 전용 메뉴 추가
    ]
  },
  cacheTimeout: process.env.NODE_ENV === 'production' ? 300000 : 30000, // 5분 or 30초
  enableDatabaseMenu: process.env.ENABLE_DB_MENU === 'true',
  environment: process.env.NODE_ENV as any
};
```

---

## 🎨 2. 헤더 컴포넌트 구조 개선

### 2.1 컴포넌트 분리 및 타입 강화
```typescript
// src/components/header/Header.tsx
interface HeaderProps {
  config: HeaderConfig;
  className?: string;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ config, className, children }) => {
  const { menus, loading, error } = useMenus(config.menuConfig);
  const { user, isLoggedIn } = useAuth();

  if (error && !config.allowFallback) {
    return <HeaderError error={error} />;
  }

  return (
    <HeaderContainer className={className}>
      <HeaderBrand config={config.brand} />
      <HeaderNav menus={menus} userRole={user?.role} />
      <HeaderAuth user={user} isLoggedIn={isLoggedIn} />
      <HeaderMobile menus={menus} />
      {children}
    </HeaderContainer>
  );
};
```

### 2.2 사용자 정의 훅 (Custom Hooks)
```typescript
// src/hooks/useMenus.ts
export function useMenus(config: MenuConfig) {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const menuService = useMemo(() => new MenuService(config), [config]);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);
        const userRole = getUserRole(); // 현재 사용자 권한
        const menuData = await menuService.getMenus(userRole);
        setMenus(menuData);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadMenus();

    // 메뉴 변경 이벤트 리스너
    const handleMenuUpdate = () => loadMenus();
    window.addEventListener('menuUpdated', handleMenuUpdate);

    return () => {
      window.removeEventListener('menuUpdated', handleMenuUpdate);
    };
  }, [menuService]);

  return { menus, loading, error, refetch: () => loadMenus() };
}
```

---

## 🗄️ 3. 데이터베이스 스키마 최적화

### 3.1 메뉴 테이블 구조 개선
```sql
-- Menu 테이블 최적화
CREATE TABLE Menu (
  id INT PRIMARY KEY AUTO_INCREMENT,
  label VARCHAR(100) NOT NULL,
  href VARCHAR(255) NOT NULL,
  icon VARCHAR(50),
  order_index INT DEFAULT 0,
  visibility_level ENUM('GUEST', 'USER', 'ADMIN') DEFAULT 'GUEST',
  is_active BOOLEAN DEFAULT true,
  environment ENUM('development', 'staging', 'production', 'all') DEFAULT 'all',
  parent_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_visibility_active (visibility_level, is_active),
  INDEX idx_environment (environment),
  INDEX idx_order (order_index),
  FOREIGN KEY (parent_id) REFERENCES Menu(id) ON DELETE SET NULL
);
```

### 3.2 환경별 메뉴 관리
```typescript
// src/lib/menu-database.ts
export class MenuDatabase {
  static async getMenusByEnvironment(
    environment: string,
    userRole: UserRole
  ): Promise<MenuItem[]> {
    return await prisma.menu.findMany({
      where: {
        AND: [
          { isActive: true },
          { visibilityLevel: userRole },
          {
            OR: [
              { environment: environment },
              { environment: 'all' }
            ]
          }
        ]
      },
      include: {
        subMenus: {
          where: {
            isActive: true,
            visibilityLevel: userRole
          },
          orderBy: { orderIndex: 'asc' }
        }
      },
      orderBy: { orderIndex: 'asc' }
    });
  }
}
```

---

## ⚡ 4. 성능 최적화 및 캐싱

### 4.1 메뉴 캐싱 전략
```typescript
// src/lib/menu-cache.ts
export class MenuCache {
  private static cache = new Map<string, CacheItem>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5분

  static set(key: string, data: MenuItem[], ttl = this.DEFAULT_TTL) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  static get(key: string): MenuItem[] | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  static invalidate(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}
```

### 4.2 React Query 통합
```typescript
// src/hooks/useMenusQuery.ts
export function useMenusQuery(userRole: UserRole) {
  return useQuery({
    queryKey: ['menus', userRole, process.env.NODE_ENV],
    queryFn: () => MenuService.getInstance().getMenus(userRole),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    retry: (failureCount, error) => {
      // 네트워크 오류만 재시도
      return failureCount < 2 && error.message.includes('network');
    },
    fallback: () => menuConfig.fallbackMenus[userRole]
  });
}
```

---

## 🛡️ 5. 에러 처리 및 안정성

### 5.1 에러 바운더리
```typescript
// src/components/header/HeaderErrorBoundary.tsx
export class HeaderErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Header Error:', error, errorInfo);
    
    // 에러 리포팅 서비스로 전송
    if (typeof window !== 'undefined') {
      window.reportError?.(error, { context: 'header', ...errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || HeaderFallback;
      return <FallbackComponent />;
    }

    return this.props.children;
  }
}
```

### 5.2 그레이스풀 데그라데이션
```typescript
// src/components/header/HeaderFallback.tsx
const HeaderFallback: React.FC = () => (
  <header className="w-full bg-white border-b">
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AWEKERS
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/blog">블로그</Link>
          <Link href="/services">서비스</Link>
          <Link href="/contact">문의</Link>
        </nav>
        <Link href="/login" className="btn-primary">
          로그인
        </Link>
      </div>
    </div>
  </header>
);
```

---

## 🧪 6. 테스트 친화적 구조

### 6.1 환경별 데이터 분리
```typescript
// src/config/environment.ts
export const environments = {
  development: {
    databaseUrl: process.env.DEV_DATABASE_URL,
    enableTestData: true,
    logLevel: 'debug'
  },
  staging: {
    databaseUrl: process.env.STAGING_DATABASE_URL,
    enableTestData: true,
    logLevel: 'info'
  },
  production: {
    databaseUrl: process.env.DATABASE_URL,
    enableTestData: false,
    logLevel: 'error'
  },
  test: {
    databaseUrl: process.env.TEST_DATABASE_URL,
    enableTestData: true,
    logLevel: 'silent'
  }
};
```

### 6.2 테스트 유틸리티
```typescript
// src/utils/test-helpers.ts
export const createMockMenuService = (menus: MenuItem[]) => ({
  getMenus: jest.fn().mockResolvedValue(menus),
  invalidateCache: jest.fn(),
  updateMenu: jest.fn()
});

export const renderHeaderWithMocks = (props: Partial<HeaderProps> = {}) => {
  const defaultProps = {
    config: {
      menuConfig: mockMenuConfig,
      brand: { name: 'Test App', href: '/' }
    }
  };

  return render(
    <QueryClient>
      <HeaderErrorBoundary>
        <Header {...defaultProps} {...props} />
      </HeaderErrorBoundary>
    </QueryClient>
  );
};
```

---

## 🔧 7. 구현 단계별 계획

### Phase 1: 기반 구조 (1주)
1. **타입 정의 완성** - MenuItem, MenuConfig, HeaderConfig
2. **MenuService 클래스 구현** - 캐싱, 에러 처리
3. **환경별 설정 파일 작성** - development, staging, production

### Phase 2: 컴포넌트 리팩토링 (1주)
1. **Header 컴포넌트 분리** - 작은 컴포넌트들로 분해
2. **Custom Hook 구현** - useMenus, useAuth
3. **에러 바운더리 추가** - 안정성 확보

### Phase 3: 성능 최적화 (3일)
1. **React Query 통합** - 캐싱 및 상태 관리
2. **메뉴 캐싱 구현** - 메모리 캐싱
3. **레이지 로딩** - 하위 메뉴 동적 로딩

### Phase 4: 테스트 및 검증 (2일)
1. **단위 테스트 작성** - 모든 주요 기능
2. **통합 테스트** - 환경별 동작 확인
3. **성능 테스트** - 로딩 시간, 메모리 사용량

---

## 📁 8. 파일 구조

```
src/
├── components/
│   └── header/
│       ├── Header.tsx              # 메인 헤더 컴포넌트
│       ├── HeaderBrand.tsx         # 브랜드 로고 영역
│       ├── HeaderNav.tsx           # 네비게이션 메뉴
│       ├── HeaderAuth.tsx          # 인증 관련 UI
│       ├── HeaderMobile.tsx        # 모바일 메뉴
│       ├── HeaderErrorBoundary.tsx # 에러 처리
│       └── HeaderFallback.tsx      # 에러 시 대체 UI
├── hooks/
│   ├── useMenus.ts                 # 메뉴 데이터 관리
│   ├── useAuth.ts                  # 인증 상태 관리
│   └── useMenusQuery.ts            # React Query 통합
├── services/
│   ├── MenuService.ts              # 메뉴 비즈니스 로직
│   └── MenuDatabase.ts             # 데이터베이스 액세스
├── config/
│   ├── menu.config.ts              # 메뉴 설정
│   ├── header.config.ts            # 헤더 설정
│   └── environment.ts              # 환경별 설정
├── lib/
│   ├── menu-cache.ts               # 캐싱 로직
│   └── menu-types.ts               # 타입 정의
└── utils/
    └── test-helpers.ts             # 테스트 유틸리티
```

---

## 🎯 기대 효과

### 즉시 효과
- **일관성 보장**: 모든 환경에서 동일한 메뉴 표시
- **안정성 향상**: 에러 상황에서도 기본 메뉴 제공
- **성능 개선**: 캐싱으로 로딩 시간 단축

### 장기 효과  
- **재사용성**: 다른 프로젝트에 쉽게 적용 가능
- **유지보수성**: 구조화된 코드로 수정 용이
- **확장성**: 새로운 기능 추가 시 기존 구조 활용

이 구조로 구현하면 **베타 단계에서 완성도 높은 헤더 시스템**을 구축하고, **향후 프로젝트에서도 재사용**할 수 있는 견고한 기반이 됩니다. 