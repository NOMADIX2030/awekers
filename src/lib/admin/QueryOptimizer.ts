// ⚡ 쿼리 최적화 유틸리티 (싱글톤 + Request Deduplication)
export class QueryOptimizer {
  private static instance: QueryOptimizer;
  
  // 🚀 Request Deduplication을 위한 캐시
  private queryCache = new Map<string, Promise<any>>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_TTL = 3000; // 3초 TTL (중복 요청 방지 강화)

  private constructor() {}

  static getInstance(): QueryOptimizer {
    if (!QueryOptimizer.instance) {
      QueryOptimizer.instance = new QueryOptimizer();
    }
    return QueryOptimizer.instance;
  }

  // 🔄 중복 요청 제거 헬퍼
  private generateCacheKey(operation: string, params: any): string {
    return `${operation}:${JSON.stringify(params)}`;
  }

  private isExpired(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return !expiry || Date.now() > expiry;
  }

  private setCacheEntry(key: string, promise: Promise<any>): Promise<any> {
    this.queryCache.set(key, promise);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
    
    // 완료 후 캐시 정리
    promise.finally(() => {
      setTimeout(() => {
        if (this.isExpired(key)) {
          this.queryCache.delete(key);
          this.cacheExpiry.delete(key);
        }
      }, this.CACHE_TTL);
    });
    
    return promise;
  }

  // 🚀 중복 제거가 적용된 병렬 쿼리 실행
  async executeParallel<T extends Record<string, () => Promise<any>>>(
    queries: T
  ): Promise<{ [K in keyof T]: Awaited<ReturnType<T[K]>> }> {
    const startTime = performance.now();
    const queryNames = Object.keys(queries);
    
    try {
      console.log(`🔄 중복 제거 적용: ${queryNames.length}개 쿼리 확인`);
      
      // 각 쿼리에 대해 중복 제거 적용
      const deduplicatedQueries = Object.entries(queries).map(([name, queryFn]) => {
        const cacheKey = this.generateCacheKey(`parallel_${name}`, {});
        
        if (!this.isExpired(cacheKey) && this.queryCache.has(cacheKey)) {
          console.log(`✅ 중복 쿼리 감지 및 차단: ${name}`);
          return this.queryCache.get(cacheKey)!;
        }
        
        console.log(`🎯 새로운 쿼리 실행: ${name}`);
        return this.setCacheEntry(cacheKey, queryFn());
      });

      const results = await Promise.all(deduplicatedQueries);

      // 결과를 키-값 쌍으로 매핑
      const mappedResults = {} as any;
      queryNames.forEach((name, index) => {
        mappedResults[name] = results[index];
      });

      const endTime = performance.now();
      console.log(
        `⚡ 중복 제거 병렬 쿼리 완료: ${queryNames.length}개 쿼리, ${(endTime - startTime).toFixed(2)}ms`
      );

      return mappedResults;
    } catch (error) {
      const endTime = performance.now();
      console.error(
        `❌ 중복 제거 병렬 쿼리 실패: ${queryNames.length}개 쿼리, ${(endTime - startTime).toFixed(2)}ms`,
        error
      );
      throw error;
    }
  }

  // 🚀 중복 제거가 적용된 Application-level JOIN 최적화 메서드
  async executeWithApplicationJoin(
    mainQuery: () => Promise<any[]>,
    relationConfig: Record<string, {
      foreignKey: string;
      joinQuery: (ids: string[]) => Promise<any[]>;
      mapTo: string;
    }>
  ): Promise<any[]> {
    const startTime = performance.now();
    
    try {
      // 🎯 1단계: 메인 데이터 조회 (중복 제거 적용)
      const mainQueryKey = this.generateCacheKey('mainQuery', {});
      let mainData: any[];
      
      if (!this.isExpired(mainQueryKey) && this.queryCache.has(mainQueryKey)) {
        console.log('✅ 메인 쿼리 중복 감지 및 차단');
        mainData = await this.queryCache.get(mainQueryKey)!;
      } else {
        console.log('🎯 새로운 메인 쿼리 실행');
        mainData = await this.setCacheEntry(mainQueryKey, mainQuery());
      }
      
      console.log(`🎯 메인 쿼리 완료: ${mainData.length}개 레코드`);
      
      if (mainData.length === 0) {
        return mainData;
      }

      // 🔄 2단계: 관련 데이터들 중복 제거 병렬 조회
      const joinPromises = Object.entries(relationConfig).map(async ([field, config]) => {
        if (!config) return { field, data: [] };
        
        // 중복 제거된 외래키 추출
        const foreignKeys = [...new Set(
          mainData
            .map(item => item[config.foreignKey])
            .filter(id => id != null)
        )];
        
        if (foreignKeys.length === 0) {
          return { field, data: [] };
        }

        // 관련 데이터 조회 (중복 제거 적용)
        const joinQueryKey = this.generateCacheKey(`join_${field}`, foreignKeys);
        let relatedData: any[];
        
        if (!this.isExpired(joinQueryKey) && this.queryCache.has(joinQueryKey)) {
          console.log(`✅ ${field} 조인 쿼리 중복 감지 및 차단`);
          relatedData = await this.queryCache.get(joinQueryKey)!;
        } else {
          console.log(`🎯 새로운 ${field} 조인 쿼리 실행`);
          relatedData = await this.setCacheEntry(joinQueryKey, config.joinQuery(foreignKeys));
        }
        
        console.log(`🔗 ${field} 조인 완료: ${relatedData.length}개 레코드`);
        
        return { field, data: relatedData, config };
      });

      // 🚀 3단계: 모든 관련 데이터를 병렬로 조회 (중복 제거 적용됨)
      const joinResults = await Promise.all(joinPromises);
      
      // 📊 4단계: 애플리케이션 레벨에서 데이터 조인
      const enrichedData = mainData.map(mainItem => {
        const enriched = { ...mainItem };
        
        joinResults.forEach(({ field, data, config }) => {
          if (!config) return;
          
          const relatedItem = data.find(
            item => item.id === mainItem[config.foreignKey]
          );
          
          if (relatedItem) {
            enriched[config.mapTo] = relatedItem;
          }
        });
        
        return enriched;
      });

      const endTime = performance.now();
      console.log(
        `✅ 중복 제거 Application-level JOIN 완료: ${(endTime - startTime).toFixed(2)}ms (중복 쿼리 차단으로 대폭 최적화)`
      );

      return enrichedData;
    } catch (error) {
      const endTime = performance.now();
      console.error(
        `❌ 중복 제거 Application-level JOIN 실패: ${(endTime - startTime).toFixed(2)}ms`,
        error
      );
      throw error;
    }
  }

  // 🎯 조건부 쿼리 실행 (일부 쿼리가 조건에 따라 실행되지 않을 수 있음)
  async executeConditional<T extends Record<string, () => Promise<any>>>(
    queries: T,
    conditions: { [K in keyof T]?: boolean }
  ): Promise<Partial<{ [K in keyof T]: Awaited<ReturnType<T[K]>> }>> {
    const startTime = performance.now();
    
    // 조건이 true인 쿼리만 필터링
    const activeQueries = Object.entries(queries).filter(
      ([key]) => conditions[key] !== false
    );

    if (activeQueries.length === 0) {
      return {} as any;
    }

    try {
      const results = await Promise.all(
        activeQueries.map(([, query]) => query())
      );

      const mappedResults = {} as any;
      activeQueries.forEach(([name], index) => {
        mappedResults[name] = results[index];
      });

      const endTime = performance.now();
      console.log(
        `⚡ 조건부 쿼리 완료: ${activeQueries.length}개 쿼리, ${(endTime - startTime).toFixed(2)}ms`
      );

      return mappedResults;
    } catch (error) {
      const endTime = performance.now();
      console.error(
        `❌ 조건부 쿼리 실패: ${activeQueries.length}개 쿼리, ${(endTime - startTime).toFixed(2)}ms`,
        error
      );
      throw error;
    }
  }

  // 🚀 배치 쿼리 실행 (대량 데이터 처리)
  async executeBatch<T>(
    items: T[],
    batchSize: number = 10,
    processor: (batch: T[]) => Promise<any>
  ): Promise<any[]> {
    const startTime = performance.now();
    const results: any[] = [];
    
    try {
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResult = await processor(batch);
        results.push(batchResult);
      }

      const endTime = performance.now();
      console.log(
        `🚀 배치 처리 완료: ${items.length}개 아이템, ${Math.ceil(items.length / batchSize)}개 배치, ${(endTime - startTime).toFixed(2)}ms`
      );

      return results;
    } catch (error) {
      const endTime = performance.now();
      console.error(
        `❌ 배치 처리 실패: ${items.length}개 아이템, ${(endTime - startTime).toFixed(2)}ms`,
        error
      );
      throw error;
    }
  }

  // 🎯 쿼리 성능 분석
  async analyzeQuery<T>(
    name: string,
    query: () => Promise<T>
  ): Promise<{ result: T; performance: { duration: number; memory?: number } }> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;
    
    try {
      const result = await query();
      const endTime = performance.now();
      const endMemory = process.memoryUsage().heapUsed;
      
      const duration = endTime - startTime;
      const memoryDelta = endMemory - startMemory;
      
      if (duration > 100) {
        console.warn(`🐌 느린 쿼리 감지: ${name} - ${duration.toFixed(2)}ms`);
      }

      return {
        result,
        performance: {
          duration,
          memory: memoryDelta
        }
      };
    } catch (error) {
      const endTime = performance.now();
      console.error(`❌ 쿼리 분석 실패: ${name} - ${(endTime - startTime).toFixed(2)}ms`, error);
      throw error;
    }
  }

  // 📊 쿼리 통계
  private queryStats = new Map<string, { count: number; totalTime: number; avgTime: number }>();

  trackQuery(name: string, duration: number) {
    const existing = this.queryStats.get(name) || { count: 0, totalTime: 0, avgTime: 0 };
    existing.count++;
    existing.totalTime += duration;
    existing.avgTime = existing.totalTime / existing.count;
    
    this.queryStats.set(name, existing);
  }

  getStats() {
    return Object.fromEntries(this.queryStats.entries());
  }
} 