# 🗺️ **헤더 독립화 마이그레이션 계획서**

## 📊 **현재 상황 분석 (708줄 layout.tsx)**

### **🔍 코드 구조 분석**
```typescript
src/app/layout.tsx (708줄) = 현재 모든 헤더 기능이 하드코딩
├── 헤더 상태 관리 (50줄)      - useState 20개 이상
├── 메뉴 데이터 로딩 (80줄)     - fetchMenuItems, 이벤트 리스너
├── 인증 관리 (40줄)          - 로그인/로그아웃 처리
├── 스크롤 관리 (30줄)        - 스크롤 이벤트, 헤더 숨김/표시
├── 키보드/포커스 (60줄)       - ESC, Tab 처리, 접근성
├── PC 헤더 JSX (120줄)       - 로고, 네비, 인증 버튼
├── 모바일 사이드바 (140줄)    - 모바일 메뉴 전체
├── PC 전체화면 사이드바 (190줄) - PC 풀스크린 메뉴
└── 기타 헬퍼 함수들 (8줄)     - isCurrentPage 등
```

---

## 🎯 **독립화할 컴포넌트 설계**

### **1️⃣ Header 메인 컴포넌트**
```typescript
src/components/header/
├── Header.tsx              # 🎯 메인 헤더 컴포넌트 (50줄 이내)
├── components/
│   ├── HeaderBrand.tsx     # 로고 영역 (20줄)
│   ├── HeaderNav.tsx       # PC 네비게이션 (80줄)
│   ├── HeaderAuth.tsx      # 인증 버튼들 (60줄)
│   ├── HeaderMobile.tsx    # 햄버거 버튼 (30줄)
│   ├── MobileSidebar.tsx   # 모바일 사이드바 (150줄)
│   └── PCFullscreen.tsx    # PC 전체화면 메뉴 (200줄)
├── hooks/
│   ├── useMenus.ts         # 메뉴 데이터 관리 (60줄)
│   ├── useAuth.ts          # 인증 상태 관리 (40줄)
│   ├── useScroll.ts        # 스크롤 관리 (35줄)
│   └── useSidebar.ts       # 사이드바 상태 (30줄)
├── services/
│   ├── MenuService.ts      # 메뉴 비즈니스 로직 (80줄)
│   └── AuthService.ts      # 인증 비즈니스 로직 (50줄)
└── types/
    └── index.ts            # 모든 타입 정의 (100줄)
```

### **2️⃣ 디자인 보존 매핑**
| 현재 코드 | 독립 컴포넌트 | CSS 클래스 보존 |
|----------|-------------|---------------|
| `<Link href="/" className="font-bold...">AWEKERS</Link>` | `<HeaderBrand />` | ✅ 100% 동일 |
| `<nav className="hidden xl:flex...">` | `<HeaderNav />` | ✅ 100% 동일 |
| `<button className="auth-button...">` | `<HeaderAuth />` | ✅ 100% 동일 |
| `<button className="hamburger-button...">` | `<HeaderMobile />` | ✅ 100% 동일 |
| 모바일 사이드바 전체 JSX | `<MobileSidebar />` | ✅ 100% 동일 |
| PC 전체화면 사이드바 JSX | `<PCFullscreen />` | ✅ 100% 동일 |

---

## 📅 **단계별 마이그레이션 계획 (총 4단계)**

### **🔧 STEP 1: 기반 구조 생성 (2시간)**

#### **1-1. 폴더 구조 생성**
```bash
mkdir -p src/components/header/{components,hooks,services,types,config}
```

#### **1-2. 타입 정의 작성**
```typescript
// src/components/header/types/index.ts
export interface MenuItem {
  id: number;
  label: string;
  href: string;
  order: number;
  subMenus?: SubMenuItem[];
}

export interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export interface HeaderConfig {
  preserveCurrentDesign: true; // 🎯 강제 디자인 보존
  enableDynamicMenus: boolean;
  enableAuthentication: boolean;
}
```

#### **1-3. 안전장치 활성화**
```typescript
// 백업 생성
const backup = await HeaderSafetyManager.createFullBackup('STEP 1 시작 전');

// 버전 관리 시작
await HeaderVersionManager.upgradeToVersion('v1.1.0-safety');
```

---

### **🎨 STEP 2: 컴포넌트 추출 (3시간)**

#### **2-1. HeaderBrand 컴포넌트 생성**
```typescript
// src/components/header/components/HeaderBrand.tsx
export const HeaderBrand: React.FC = () => (
  <Link 
    href="/" 
    className="font-bold text-lg md:text-xl lg:text-3xl tracking-tight flex items-center transition-colors duration-300"
  >
    <span className="text-black">AWEKERS</span>
  </Link>
);
```
**🔍 검증 포인트**: 로고 클릭 시 홈으로 이동, 스타일 100% 동일

#### **2-2. HeaderNav 컴포넌트 생성**
```typescript
// src/components/header/components/HeaderNav.tsx
interface HeaderNavProps {
  menuItems: MenuItem[];
  onItemClick: (href: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ menuItems, onItemClick }) => (
  <nav className="hidden xl:flex items-center gap-8">
    {menuItems.map((item) => (
      <div key={item.id} className="relative group">
        {/* 기존 PC 네비게이션 JSX 100% 복사 */}
      </div>
    ))}
  </nav>
);
```
**🔍 검증 포인트**: PC에서 메뉴 표시, 드롭다운 동작, 호버 효과

#### **2-3. HeaderAuth 컴포넌트 생성**  
```typescript
// src/components/header/components/HeaderAuth.tsx
interface HeaderAuthProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const HeaderAuth: React.FC<HeaderAuthProps> = ({ isLoggedIn, onLogin, onLogout }) => (
  <div className="flex items-center">
    {isLoggedIn ? (
      <button onClick={onLogout} className="auth-button flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group">
        {/* 기존 로그아웃 버튼 JSX 100% 복사 */}
      </button>
    ) : (
      <button onClick={onLogin} className="auth-button flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group">
        {/* 기존 로그인 버튼 JSX 100% 복사 */}
      </button>
    )}
  </div>
);
```
**🔍 검증 포인트**: 로그인/로그아웃 버튼 클릭, 그라데이션 색상, 애니메이션

#### **2-4. 점진적 통합 테스트**
각 컴포넌트 완성 후 layout.tsx에서 임시 교체해서 동작 확인:
```typescript
// 임시 테스트용 - layout.tsx에서
import { HeaderBrand } from '@/components/header/components/HeaderBrand';

// 기존 로고 코드 주석 처리 후 임시 교체
// <Link href="/" className="...">AWEKERS</Link>
<HeaderBrand />
```

---

### **🔗 STEP 3: 훅과 서비스 분리 (2시간)**

#### **3-1. useMenus 훅 생성**
```typescript
// src/components/header/hooks/useMenus.ts
export function useMenus() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMenuItems = async () => {
    // 기존 fetchMenuItems 로직 100% 복사
  };

  useEffect(() => {
    fetchMenuItems();
    const handleMenuUpdate = () => fetchMenuItems();
    window.addEventListener('menuUpdated', handleMenuUpdate);
    return () => window.removeEventListener('menuUpdated', handleMenuUpdate);
  }, []);

  return { menuItems, loading, error, refetch: fetchMenuItems };
}
```

#### **3-2. useAuth 훅 생성**
```typescript
// src/components/header/hooks/useAuth.ts
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    // 기존 로그아웃 로직 100% 복사
  };

  // 기존 localStorage 감지 로직 100% 복사

  return { isLoggedIn, handleLogin, handleLogout };
}
```

#### **3-3. useSidebar 훅 생성**
```typescript
// src/components/header/hooks/useSidebar.ts
export function useSidebar() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // 기존 ESC 키, 포커스 트랩, body 스크롤 제어 로직 100% 복사

  return { open, setOpen, drawerRef };
}
```

---

### **🚀 STEP 4: 최종 통합 및 교체 (1시간)**

#### **4-1. Header 메인 컴포넌트 생성**
```typescript
// src/components/header/Header.tsx
interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { menuItems, loading } = useMenus();
  const { isLoggedIn, handleLogin, handleLogout } = useAuth();
  const { open, setOpen, drawerRef } = useSidebar();
  const { isScrolled, isHeaderVisible } = useScroll();

  if (loading) {
    return <HeaderSkeleton />; // 로딩 상태
  }

  return (
    <>
      {/* 메인 헤더 */}
      <header className={`w-full fixed top-0 z-30 transition-all duration-300 h-16 lg:h-[74px] ${
        isScrolled 
          ? 'bg-white/60 backdrop-blur-[15px]' 
          : 'lg:bg-transparent bg-white/95 backdrop-blur-[10px]'
      } ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      } ${className}`}>
        <div className="w-full flex items-center justify-between px-4 lg:px-6 py-4 h-16 lg:h-[74px] lg:max-w-[91%] lg:mx-auto">
          <HeaderBrand />
          <HeaderNav menuItems={menuItems} />
          <div className="flex items-center gap-3">
            <HeaderAuth 
              isLoggedIn={isLoggedIn}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
            <HeaderMobile onClick={() => setOpen(!open)} isOpen={open} />
          </div>
        </div>
      </header>

      {/* 사이드바들 */}
      <MobileSidebar 
        open={open}
        onClose={() => setOpen(false)}
        menuItems={menuItems}
        drawerRef={drawerRef}
      />
      <PCFullscreen 
        open={open}
        onClose={() => setOpen(false)}
        menuItems={menuItems}
      />
    </>
  );
};
```

#### **4-2. layout.tsx 교체**
```typescript
// src/app/layout.tsx (50줄 이내로 단순화)
import { Header } from '@/components/header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="font-sans">
      <body className="bg-white text-black min-h-screen flex flex-col">
        {/* 🎯 완전 독립적 헤더 */}
        <Header />
        
        {/* 메인 콘텐츠 */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-16">
          {children}
        </main>
        
        {/* 푸터 및 분석 도구 */}
        <AnalyticsTracker />
        <Analytics />
        <footer className="w-full border-t border-black/10 bg-white py-6 text-center text-xs text-black/60 mt-auto">
          © {new Date().getFullYear()} AWEKERS. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
```

---

## 🧪 **각 단계별 검증 체크리스트**

### **STEP 1 검증**
- [ ] 폴더 구조 생성 완료
- [ ] 타입 정의 컴파일 성공
- [ ] 백업 시스템 동작 확인
- [ ] 개발 서버 정상 실행

### **STEP 2 검증**  
- [ ] HeaderBrand: 로고 클릭 → 홈 이동
- [ ] HeaderNav: PC에서 메뉴 표시, 드롭다운 동작
- [ ] HeaderAuth: 로그인/로그아웃 버튼 동작
- [ ] 모든 스타일 100% 동일 확인

### **STEP 3 검증**
- [ ] useMenus: 메뉴 데이터 로딩 성공
- [ ] useAuth: 로그인 상태 변경 감지
- [ ] useSidebar: ESC 키, 포커스 트랩 동작
- [ ] 모든 기능 100% 동일 확인

### **STEP 4 검증**
- [ ] Header 컴포넌트 정상 렌더링
- [ ] 모바일에서 햄버거 메뉴 동작
- [ ] PC에서 전체화면 메뉴 동작
- [ ] 스크롤 시 헤더 숨김/표시
- [ ] 반응형 디자인 모든 해상도 확인

---

## 🛡️ **리스크 분석 및 대응 방안**

### **🚨 High Risk**
| 리스크 | 가능성 | 영향도 | 대응 방안 |
|--------|-------|-------|----------|
| 스타일 깨짐 | 낮음 | 높음 | CSS 클래스 100% 복사, 각 단계별 시각적 검증 |
| 메뉴 로딩 실패 | 보통 | 높음 | fallback 메뉴, 에러 바운더리, 로딩 상태 |
| 모바일 UX 손상 | 낮음 | 높음 | 터치 이벤트, 접근성 100% 복사 |

### **⚠️ Medium Risk**
| 리스크 | 가능성 | 영향도 | 대응 방안 |
|--------|-------|-------|----------|
| 성능 저하 | 낮음 | 보통 | React.memo, useMemo, 번들 사이즈 모니터링 |
| 상태 동기화 | 보통 | 보통 | 중앙 상태 관리, 이벤트 기반 통신 |

### **✅ Low Risk**
| 리스크 | 가능성 | 영향도 | 대응 방안 |
|--------|-------|-------|----------|
| 타입 오류 | 낮음 | 낮음 | TypeScript strict 모드, 점진적 타입 적용 |
| 테스트 실패 | 보통 | 낮음 | Jest, React Testing Library 활용 |

---

## 🔄 **롤백 시나리오**

### **자동 롤백 조건**
1. **빌드 실패**: 컴파일 에러 발생
2. **런타임 에러**: 헤더 로딩 실패
3. **기능 손실**: 주요 기능 동작하지 않음
4. **성능 저하**: 로딩 시간 2초 이상

### **롤백 절차**
```typescript
// 1단계: 즉시 롤백
await HeaderSafetyManager.restoreFromBackup('latest');

// 2단계: 안전한 버전으로 복구
await HeaderVersionManager.upgradeToVersion('v1.0.0-legacy');

// 3단계: 상태 확인
const status = HeaderVersionManager.getStatusReport();
console.log('롤백 완료:', status);
```

---

## 🎯 **최종 성공 기준**

### **✅ 기능적 요구사항**
- [ ] 모든 메뉴 동작 100% 동일
- [ ] 로그인/로그아웃 100% 동일  
- [ ] 모바일/PC 사이드바 100% 동일
- [ ] 반응형 동작 100% 동일

### **✅ 비기능적 요구사항**
- [ ] 현재 디자인 100% 보존
- [ ] 성능 저하 없음 (로딩 시간 동일)
- [ ] 접근성 수준 동일
- [ ] SEO 영향 없음

### **✅ 개발 요구사항**
- [ ] layout.tsx → 50줄 이내로 단순화
- [ ] 헤더 독립 폴더 구조 완성
- [ ] 재사용 가능한 컴포넌트 구조
- [ ] 완전한 타입 안전성

**이 계획대로 진행하면 현재 디자인을 100% 유지하면서 완전히 독립적이고 안전한 헤더 시스템을 구축할 수 있습니다!** 🚀 