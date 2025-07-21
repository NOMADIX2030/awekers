// SEO 분석 결과 타입 정의
export interface SEOAnalysisData {
  url: string;
  timestamp: string;
  overallScore: number;
  metaData: {
    title: {
      exists: boolean;
      content?: string;
      length: number;
      score: number;
      maxLength: number;
    };
    description: {
      exists: boolean;
      content?: string;
      length: number;
      score: number;
      maxLength: number;
    };
    keywords: {
      exists: boolean;
      content?: string;
      score: number;
    };
  };
  headings: {
    h1: {
      count: number;
      score: number;
      content?: string[];
    };
    h2: {
      count: number;
      score: number;
      content?: string[];
    };
    h3: {
      count: number;
      score: number;
      content?: string[];
    };
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    score: number;
  };
  technical: {
    robotsTxt: {
      exists: boolean;
      score: number;
      content?: string;
    };
    sitemapXml: {
      exists: boolean;
      score: number;
      content?: string;
    };
    canonicalUrl: {
      exists: boolean;
      score: number;
      content?: string;
    };
    html5Doctype: {
      exists: boolean;
      score: number;
    };
    html5UnsupportedTags: {
      count: number;
      score: number;
      tags?: string[];
    };
    sslSupport: {
      exists: boolean;
      score: number;
      certificate?: string;
    };
  };
  social: {
    facebookOg: {
      exists: boolean;
      score: number;
      tags?: {
        title?: string;
        description?: string;
        image?: string;
        url?: string;
      };
    };
    twitterCard: {
      exists: boolean;
      score: number;
      tags?: {
        card?: string;
        title?: string;
        description?: string;
        image?: string;
      };
    };
    socialLinks: {
      exists: boolean;
      score: number;
      platforms?: string[];
    };
  };
  analytics: {
    googleAnalytics: {
      exists: boolean;
      score: number;
      version?: string;
    };
    naverAnalytics: {
      exists: boolean;
      score: number;
    };
  };
  performance: {
    loadTime: number;
    score: number;
    optimization: {
      minifiedCss: boolean;
      minifiedJs: boolean;
      compressedImages: boolean;
      lazyLoading: boolean;
      score: number;
    };
    // 새로운 성능 최적화 요소들
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay
      cls: number; // Cumulative Layout Shift
      score: number;
    };
    caching: {
      browserCache: boolean;
      serverCache: boolean;
      cdnUsage: boolean;
      score: number;
    };
    compression: {
      gzipEnabled: boolean;
      brotliEnabled: boolean;
      score: number;
    };
    resources: {
      totalRequests: number;
      totalSize: number;
      criticalResources: number;
      score: number;
    };
    server: {
      responseTime: number;
      ttf: number; // Time to First Byte
      score: number;
    };
  };
  mobile: {
    responsive: boolean;
    viewport: boolean;
    touchFriendly: boolean;
    score: number;
    // 새로운 모바일 최적화 요소들
    performance: {
      loadTime: number;
      score: number;
      optimization: {
        minifiedCss: boolean;
        minifiedJs: boolean;
        compressedImages: boolean;
        lazyLoading: boolean;
        score: number;
      };
    };
    usability: {
      touchTargets: {
        score: number;
        issues?: string[];
        buttonSize: boolean;
        linkSpacing: boolean;
      };
      readability: {
        score: number;
        fontSize: boolean;
        lineHeight: boolean;
        colorContrast: boolean;
      };
      navigation: {
        score: number;
        hamburgerMenu: boolean;
        stickyHeader: boolean;
        breadcrumbs: boolean;
      };
    };
    content: {
      score: number;
      textSize: boolean;
      imageScaling: boolean;
      videoResponsive: boolean;
      tableResponsive: boolean;
    };
    technical: {
      score: number;
      noInterstitials: boolean;
      noHorizontalScroll: boolean;
      properMetaTags: boolean;
      ampSupport: boolean;
    };
  };
  // 새로운 콘텐츠 품질 분석
  contentQuality: {
    wordCount: number;
    readability: {
      score: number;
      level: string;
      details?: string;
    };
    keywordDensity: {
      score: number;
      mainKeywords?: string[];
      density?: Record<string, number>;
    };
    contentStructure: {
      score: number;
      hasIntroduction: boolean;
      hasConclusion: boolean;
      paragraphCount: number;
      averageParagraphLength: number;
    };
    multimedia: {
      score: number;
      images: number;
      videos: number;
      infographics: number;
    };
    freshness: {
      score: number;
      lastUpdated?: string;
      isRecent: boolean;
    };
  };
  // 네이버 특화 분석
  naverOptimization: {
    naverBlog: {
      exists: boolean;
      score: number;
      url?: string;
    };
    naverCafe: {
      exists: boolean;
      score: number;
      url?: string;
    };
    naverKnowledge: {
      exists: boolean;
      score: number;
      url?: string;
    };
    naverNews: {
      exists: boolean;
      score: number;
      url?: string;
    };
  };
  // 구조화된 데이터
  structuredData: {
    exists: boolean;
    score: number;
    types?: string[];
    errors?: string[];
    warnings?: string[];
    detailedSchemas?: any[];
    // 새로운 분석 결과
    quality: {
      score: number;
      completeness: number;
      validity: number;
    };
    // 검색엔진 최적화
    seoOptimization: {
      richSnippets: {
        supported: boolean;
        types: string[];
        score: number;
      };
      socialMedia: {
        integrated: boolean;
        types: string[];
        score: number;
      };
      localBusiness: {
        exists: boolean;
        types: string[];
        score: number;
      };
    };
  };
  // 보안 및 신뢰성
  security: {
    score: number;
    https: boolean;
    securityHeaders: {
      exists: boolean;
      score: number;
      headers?: Record<string, string>;
    };
    privacyPolicy: {
      exists: boolean;
      score: number;
      url?: string;
    };
    termsOfService: {
      exists: boolean;
      score: number;
      url?: string;
    };
  };
  // 접근성
  accessibility: {
    score: number;
    ariaLabels: {
      exists: boolean;
      score: number;
      count: number;
    };
    colorContrast: {
      score: number;
      issues?: string[];
    };
    keyboardNavigation: {
      score: number;
      issues?: string[];
    };
    screenReader: {
      score: number;
      issues?: string[];
    };
  };
  webVitals?: {
    lcp: number;
    fid: number;
    cls: number;
    score: number;
  };
  improvements: ImprovementTip[];
}

// 개선 팁 타입
export interface ImprovementTip {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: number;
  difficulty: 'easy' | 'medium' | 'hard';
  code?: string;
}

// 분석 진행 상태 타입
export interface AnalysisProgress {
  step: string;
  progress: number;
  message: string;
}

// URL 유효성 검사 결과
export interface URLValidationResult {
  isValid: boolean;
  normalizedUrl: string;
  error?: string;
}

// 성능 측정 결과
export interface PerformanceMetrics {
  loadTime: number;
  pageSize: number;
  requests: number;
  score: number;
}

// 모바일 최적화 결과
export interface MobileOptimization {
  responsive: boolean;
  viewport: boolean;
  touchFriendly: boolean;
  fontSize: boolean;
  score: number;
}

// 콘텐츠 품질 분석 결과
export interface ContentQualityMetrics {
  wordCount: number;
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  structureScore: number;
  multimediaScore: number;
  freshnessScore: number;
}

// 네이버 최적화 결과
export interface NaverOptimizationMetrics {
  blogScore: number;
  cafeScore: number;
  knowledgeScore: number;
  newsScore: number;
  overallScore: number;
}

// 구조화된 데이터 결과
export interface StructuredDataMetrics {
  schemaTypes: string[];
  errorCount: number;
  warningCount: number;
  score: number;
}

// 보안 분석 결과
export interface SecurityMetrics {
  httpsScore: number;
  headersScore: number;
  privacyScore: number;
  overallScore: number;
}

// 접근성 분석 결과
export interface AccessibilityMetrics {
  ariaScore: number;
  contrastScore: number;
  keyboardScore: number;
  screenReaderScore: number;
  overallScore: number;
} 