// SEO 카테고리 정의
export interface SEOCategory {
  id: string;
  name: string;
  description: string;
  weight: number;
  color: string;
}

// SEO 검사 항목 정의
export interface SEOCheckItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  weight: number;
  checkFunction: string;
  solution: string;
}

// 크롤링된 데이터
export interface CrawledData {
  url: string;
  html: string;
  headers: Record<string, string>;
  statusCode: number;
  loadTime: number;
  size: number;
  robotsTxt?: string;
  sitemapXml?: string;
  crawledAt: Date;
}

// 개별 검사 결과
export interface CheckResult {
  checkItemId: string;
  passed: boolean;
  score: number;
  maxScore: number;
  message: string;
  details?: any;
}

// 카테고리 결과
export interface CategoryResult {
  categoryId: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  checkResults: CheckResult[];
}

// SEO 개선사항
export interface SEOImprovement {
  categoryId: string;
  categoryName: string;
  checkItemId: string;
  title: string;
  description: string;
  solution: string;
  priority: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
}

// 전체 분석 결과
export interface SEOAnalysisResult {
  url: string;
  totalScore: number;
  grade: string;
  categoryResults: CategoryResult[];
  improvements: SEOImprovement[];
  crawledData: CrawledData;
  analyzedAt: Date;
}

// 분석 진행 상태
export interface AnalysisProgress {
  currentStep: string;
  progress: number;
  message: string;
}

// 기존 타입들 (호환성을 위해 유지)
export interface SEOAnalysisData {
  url: string;
  analyzedAt: string;
  overallScore: number;
  maxScore: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  categories: CategoryResult[];
  summary: {
    totalItems: number;
    passedItems: number;
    failedItems: number;
    warningItems: number;
    criticalIssues: number;
  };
  improvements: ImprovementSuggestion[];
  technicalDetails: TechnicalDetails;
}

export interface AnalysisRequest {
  url: string;
  options?: {
    includePerformance?: boolean;
    mobileAnalysis?: boolean;
    deepCrawl?: boolean;
  };
}

export interface CrawledPageData {
  url: string;
  html: string;
  headers: Record<string, string>;
  statusCode: number;
  loadTime: number;
  size: number;
  robotsTxt?: string;
  sitemapXml?: string;
  crawledAt: Date;
}

export interface SEOCheckResult {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  maxScore: number;
  message: string;
  priority: 'high' | 'medium' | 'low';
  solution?: string;
  details?: any;
}

export interface ImprovementSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  impact: string;
  effort: 'easy' | 'medium' | 'hard';
  steps: string[];
}

export interface TechnicalDetails {
  pageSize: number;
  loadTime: number;
  mobileOptimized: boolean;
  httpsEnabled: boolean;
  compressionEnabled: boolean;
  metaTags: {
    title?: string;
    description?: string;
    keywords?: string;
    charset?: string;
    viewport?: string;
    robots?: string;
  };
  structuredData: {
    hasJsonLd: boolean;
    schemas: string[];
  };
  performance: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
  };
} 