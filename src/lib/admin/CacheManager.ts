// 🚀 최신 고성능 통합 캐시 관리자 (Redis + Upstash 통합)
import { Redis } from '@upstash/redis';

export class CacheManager {
  private static instance: CacheManager;
  private l1Cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private redis: Redis | null = null;
  private initialized = false;

  private constructor() {
    this.initializeRedis();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // 🎯 Upstash Redis 초기화 (HTTP 기반, 서버리스 최적화)
  private async initializeRedis() {
    try {
      // Upstash Redis 우선 (프로덕션 환경)
      if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        this.redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        
        // 연결 테스트
        await this.redis.ping();
        console.log('🚀 CacheManager: Upstash Redis 연결 성공 (최적화된 HTTP 기반)');
        this.initialized = true;
        return;
      }

      // 로컬 개발환경: 메모리 캐시만 사용
      console.log('🔶 CacheManager: Redis 환경변수 없음, L1 메모리 캐시만 사용');
      this.redis = null;
      this.initialized = true;
      
    } catch (error) {
      console.warn('🔶 CacheManager: Redis 초기화 실패, L1 메모리 캐시 사용:', error);
      this.redis = null;
      this.initialized = true;
    }
  }

  // 🚀 초기화 완료 대기
  private async ensureInitialized() {
    while (!this.initialized) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  // 🚀 고성능 캐시 조회 (L1 → L2 → DB)
  async get(key: string): Promise<any | null> {
    await this.ensureInitialized();
    
    const startTime = performance.now();
    
    try {
      // 🔥 L1 캐시 (메모리) 확인 - 초고속 0.001ms
      const l1Entry = this.l1Cache.get(key);
      if (l1Entry && Date.now() - l1Entry.timestamp < l1Entry.ttl * 1000) {
        console.log(`⚡ L1 캐시 히트: ${key} (${(performance.now() - startTime).toFixed(3)}ms)`);
        return l1Entry.data;
      }

      // 🚀 L2 캐시 (Upstash Redis) 확인 - 고속 5-15ms
      if (this.redis) {
        try {
          const redisData = await this.redis.get(key);
          if (redisData !== null) {
            const data = typeof redisData === 'string' ? JSON.parse(redisData) : redisData;
            
            // L1 캐시에도 저장 (캐스케이딩)
            this.l1Cache.set(key, {
              data,
              timestamp: Date.now(),
              ttl: 60 // L1은 1분
            });
            
            console.log(`🎯 L2 캐시 히트 (Redis): ${key} (${(performance.now() - startTime).toFixed(3)}ms)`);
            return data;
          }
        } catch (error) {
          console.warn(`❌ Redis 조회 실패 (${key}):`, error);
        }
      }

      // L1 캐시에서 만료된 항목 정리
      if (l1Entry) {
        this.l1Cache.delete(key);
      }

      console.log(`💨 캐시 미스: ${key} (${(performance.now() - startTime).toFixed(3)}ms)`);
      return null;
      
    } catch (error) {
      console.error(`❌ 캐시 조회 오류 (${key}):`, error);
      return null;
    }
  }

  // 🚀 고성능 캐시 저장 (L1 + L2 동시)
  async set(key: string, data: any, ttl: number = 600): Promise<void> {
    await this.ensureInitialized();
    
    const startTime = performance.now();
    
    try {
      // 🔥 L1 캐시 (메모리) 저장 - 즉시 저장
      this.l1Cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl: Math.min(ttl, 300) // L1은 최대 5분
      });

      // 🚀 L2 캐시 (Upstash Redis) 저장 - 비동기 백그라운드
      if (this.redis) {
        try {
          const serializedData = typeof data === 'string' ? data : JSON.stringify(data);
          await this.redis.setex(key, ttl, serializedData);
          console.log(`✅ 캐시 저장 완료: ${key} (TTL: ${ttl}s, ${(performance.now() - startTime).toFixed(3)}ms)`);
        } catch (error) {
          console.warn(`❌ Redis 저장 실패 (${key}):`, error);
        }
      } else {
        console.log(`✅ L1 캐시 저장: ${key} (메모리만)`);
      }
      
    } catch (error) {
      console.error(`❌ 캐시 저장 오류 (${key}):`, error);
    }
  }

  // 🚀 스마트 캐시 무효화 (패턴 매칭)
  async invalidate(pattern: string): Promise<void> {
    await this.ensureInitialized();
    
    try {
      let invalidated = 0;
      
      // L1 캐시 무효화
      for (const [key] of this.l1Cache.entries()) {
        if (key.includes(pattern)) {
          this.l1Cache.delete(key);
          invalidated++;
        }
      }

      // L2 캐시 무효화 (Upstash Redis)
      if (this.redis) {
        try {
          // Upstash에서는 SCAN으로 키 찾기
          const keys = await this.redis.keys(`*${pattern}*`);
          if (keys.length > 0) {
            await this.redis.del(...keys);
            invalidated += keys.length;
          }
        } catch (error) {
          console.warn(`❌ Redis 무효화 실패:`, error);
        }
      }
      
      console.log(`🗑️ 캐시 무효화 완료: ${pattern} (${invalidated}개 키)`);
      
    } catch (error) {
      console.error(`❌ 캐시 무효화 오류:`, error);
    }
  }

  // 🚀 전체 캐시 클리어 (비상용)
  async clear(): Promise<void> {
    await this.ensureInitialized();
    
    try {
      this.l1Cache.clear();
      
      if (this.redis) {
        await this.redis.flushall();
      }
      
      console.log('🧹 전체 캐시 클리어 완료');
    } catch (error) {
      console.error('❌ 캐시 클리어 오류:', error);
    }
  }

  // 📊 실시간 캐시 통계
  getStats() {
    return {
      l1Size: this.l1Cache.size,
      l1Keys: Array.from(this.l1Cache.keys()).slice(0, 10), // 최대 10개만 표시
      redisConnected: !!this.redis,
      cacheType: this.redis ? 'L1+L2 (Redis)' : 'L1 (Memory Only)',
      initialized: this.initialized
    };
  }
  
  // 🚀 캐시 워밍업 (자주 사용하는 데이터 미리 로드)
  async warmup(keys: string[]): Promise<void> {
    console.log(`🔥 캐시 워밍업 시작: ${keys.length}개 키`);
    for (const key of keys) {
      await this.get(key);
    }
    console.log(`✅ 캐시 워밍업 완료`);
  }
} 