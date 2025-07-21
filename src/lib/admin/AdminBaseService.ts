import { NextRequest, NextResponse } from 'next/server';
import { CacheManager } from './CacheManager';
import { QueryOptimizer } from './QueryOptimizer';
import { PerformanceTracker } from './PerformanceTracker';

// 🎯 관리자 API 요청 설정 타입
export interface AdminRequestConfig<T = any> {
  // 쿼리 정의 (자동 병렬 처리됨)
  queries: Record<string, () => Promise<any>>;
  
  // 캐시 설정
  cacheKey?: string;
  cacheTTL?: number;
  
  // 권한 설정
  requireAuth?: boolean;
  adminOnly?: boolean;
  
  // 페이지네이션
  pagination?: {
    page?: number;
    limit?: number;
  };
  
  // 데이터 변환
  transform?: (data: any) => T;
  
  // 응답 래핑
  wrapper?: (data: T) => any;
}

// 🚀 관리자 API 기본 서비스 클래스
export class AdminBaseService {
  private static cache = CacheManager.getInstance();
  private static performance = PerformanceTracker.getInstance();
  private static queryOptimizer = QueryOptimizer.getInstance();

  /**
   * 🎯 관리자 API 요청 통합 처리
   * 모든 최적화 로직이 자동으로 적용됩니다
   */
  static async handleRequest<T = any>(
    request: NextRequest,
    config: AdminRequestConfig<T>
  ): Promise<NextResponse> {
    const trackingId = this.performance.start(`admin_${config.cacheKey || 'request'}`);
    
    try {
      // 🔐 권한 검사
      if (config.requireAuth !== false) {
        const authResult = this.checkAuth(request, config.adminOnly);
        if (!authResult.success) {
          return NextResponse.json(authResult, { status: 401 });
        }
      }

      // 🚀 캐시 확인
      if (config.cacheKey) {
        const cacheKey = this.buildCacheKey(request, config);
        const cached = await this.cache.get(cacheKey);
        
        if (cached) {
          this.performance.end(trackingId, { cached: true });
          return NextResponse.json({
            ...cached,
            cached: true,
            responseTime: this.performance.getTime(trackingId)
          });
        }
      }

      // ⚡ 병렬 쿼리 실행
      const queryResults = await this.queryOptimizer.executeParallel(config.queries);

      // 🎯 데이터 변환
      let responseData = queryResults;
      if (config.transform) {
        responseData = config.transform(queryResults);
      }

      // 📦 응답 래핑
      if (config.wrapper) {
        responseData = config.wrapper(responseData);
      } else {
        responseData = {
          success: true,
          data: responseData,
          ...this.buildPagination(request, config)
        };
      }

      // 🚀 캐시 저장
      if (config.cacheKey) {
        const cacheKey = this.buildCacheKey(request, config);
        await this.cache.set(cacheKey, responseData, config.cacheTTL || 300);
      }

      this.performance.end(trackingId, { cached: false });

      return NextResponse.json({
        ...responseData,
        cached: false,
        responseTime: this.performance.getTime(trackingId)
      });

    } catch (error) {
      this.performance.end(trackingId, { error: true });
      console.error(`관리자 API 오류 [${config.cacheKey}]:`, error);
      
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.',
          responseTime: this.performance.getTime(trackingId)
        },
        { status: 500 }
      );
    }
  }

  /**
   * 🎯 관리자 데이터 변경 처리 (POST/PUT/DELETE)
   */
  static async handleMutation<T = any>(
    request: NextRequest,
    config: {
      mutation: () => Promise<T>;
      cacheInvalidation?: string | string[];
      transform?: (data: T) => any;
      successMessage?: string;
    }
  ): Promise<NextResponse> {
    const trackingId = this.performance.start('admin_mutation');
    
    try {
      // 🔐 권한 검사 (변경 작업은 항상 관리자 권한 필요)
      const authResult = this.checkAuth(request, true);
      if (!authResult.success) {
        return NextResponse.json(authResult, { status: 401 });
      }

      // 🎯 변경 작업 실행
      const result = await config.mutation();

      // 🚀 관련 캐시 무효화
      if (config.cacheInvalidation) {
        const patterns = Array.isArray(config.cacheInvalidation) 
          ? config.cacheInvalidation 
          : [config.cacheInvalidation];
        
        for (const pattern of patterns) {
          await this.cache.invalidate(pattern);
        }
      }

      // 🎯 데이터 변환
      let responseData = result;
      if (config.transform) {
        responseData = config.transform(result);
      }

      this.performance.end(trackingId, { mutation: true });

      return NextResponse.json({
        success: true,
        data: responseData,
        message: config.successMessage || '작업이 완료되었습니다.',
        responseTime: this.performance.getTime(trackingId)
      });

    } catch (error) {
      this.performance.end(trackingId, { error: true });
      console.error('관리자 변경 작업 오류:', error);
      
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : '작업 중 오류가 발생했습니다.',
          responseTime: this.performance.getTime(trackingId)
        },
        { status: 500 }
      );
    }
  }

  // 🔐 권한 검사
  private static checkAuth(request: NextRequest, adminOnly: boolean = false) {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return { success: false, error: '인증이 필요합니다.' };
    }

    if (adminOnly && !authHeader.startsWith('Bearer admin-key')) {
      return { success: false, error: '관리자 권한이 필요합니다.' };
    }

    return { success: true };
  }

  // 🚀 캐시 키 생성
  private static buildCacheKey(request: NextRequest, config: AdminRequestConfig) {
    const url = new URL(request.url);
    const params = Array.from(url.searchParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    return `${config.cacheKey}_${params}`.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  // 📄 페이지네이션 구성
  private static buildPagination(request: NextRequest, config: AdminRequestConfig) {
    if (!config.pagination) return {};

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    return {
      pagination: {
        page,
        limit,
        // totalCount와 totalPages는 쿼리 결과에서 계산
      }
    };
  }

  // 🚀 캐시 무효화 헬퍼
  static async invalidateCache(patterns: string | string[]) {
    const patternsArray = Array.isArray(patterns) ? patterns : [patterns];
    
    for (const pattern of patternsArray) {
      await this.cache.invalidate(pattern);
    }
  }

  // 📊 성능 통계 조회
  static getPerformanceStats() {
    return this.performance.getStats();
  }
} 