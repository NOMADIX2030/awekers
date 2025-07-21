import { PrismaClient, Prisma } from '@prisma/client';

declare global {
  var __prisma__: PrismaClient;
}

let prisma: PrismaClient;

// 🎯 환경별 최적화된 Prisma 로그 설정
const getLogConfig = (): Prisma.LogLevel[] => {
  if (process.env.NODE_ENV === 'production') {
    // 프로덕션: 에러와 경고만 로깅 (성능 최적화)
    return ['error', 'warn'];
  } else {
    // 개발: 쿼리는 디버그 레벨로만 (필요시 활성화)
    return process.env.DEBUG_QUERIES ? ['query', 'info', 'warn', 'error'] : ['info', 'warn', 'error'];
  }
};

// 🚀 안정적인 Prisma 설정 (P1017 에러 해결)
const getPrismaConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isServerless = !!process.env.VERCEL || !!process.env.LAMBDA_TASK_ROOT || !!process.env.NETLIFY;
  
  // 🎯 극도로 보수적인 연결 풀 설정 (성능 최적화 우선)
  const connectionLimit = isServerless ? 1 : 2; // 더욱 제한적으로 설정
  const poolTimeout = 5; // 더 짧은 타임아웃 (5초)
  
  // 🚀 MySQL 성능 최우선 파라미터
  const mysqlOptimizations = [
    `connection_limit=${connectionLimit}`,
    `pool_timeout=${poolTimeout}`,
    `connect_timeout=15`, // 연결 타임아웃 단축
    `socket_timeout=15`, // 소켓 타임아웃 단축  
    `pool_timeout=5`, // 풀 타임아웃 단축
    `statement_cache_size=100`, // Prepared Statement 캐시 활성화
    `sslaccept=strict` // SSL 최적화
  ].join('&');
  
  console.log(`🎯 고성능 Prisma 설정: 연결풀 ${connectionLimit}개, 타임아웃 ${poolTimeout}s`);
  
  return {
    log: getLogConfig(),
    // 🚀 고성능 연결 설정
    datasources: {
      db: {
        url: process.env.DATABASE_URL?.includes('?') ? 
          `${process.env.DATABASE_URL}&${mysqlOptimizations}` :
          `${process.env.DATABASE_URL}?${mysqlOptimizations}`
      }
    },
    // 🎯 성능 모니터링
    ...(process.env.NODE_ENV === 'development' && {
      errorFormat: 'pretty' as const,
    })
  };
};

// 🎯 개발환경에서 전역 인스턴스 사용 (HMR 대응)
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(getPrismaConfig());
} else {
  if (!global.__prisma__) {
    global.__prisma__ = new PrismaClient(getPrismaConfig());
    console.log('🎯 개발환경 Prisma 클라이언트 초기화 완료');
  }
  prisma = global.__prisma__;
}

// 🚀 연결 상태 모니터링 및 성능 추적
if (process.env.NODE_ENV === 'development') {
  // 연결 재시도 로직 추가
  const connectWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        await prisma.$connect();
        console.log('🎯 Prisma 데이터베이스 연결 성공');
        break;
      } catch (error) {
        console.error(`❌ Prisma 연결 시도 ${i + 1}/${retries} 실패:`, error);
        if (i === retries - 1) {
          console.error('🚨 모든 연결 시도 실패. 데이터베이스 상태를 확인하세요.');
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
        }
      }
    }
  };
  
  connectWithRetry();

  // 🎯 쿼리 성능 모니터링 (개발환경) - 중복 쿼리 감지 강화
  const queryCache = new Map();
  let totalQueryCount = 0;
  
  prisma.$use(async (params, next) => {
    const start = Date.now();
    const queryKey = `${params.model}.${params.action}`;
    totalQueryCount++;
    
    // 🚨 모든 쿼리 실행 로그 (중복 패턴 분석용)
    console.log(`🔍 쿼리 #${totalQueryCount}: ${queryKey} 실행`);
    
    // 중복 쿼리 감지 (더 민감하게)
    const recentQueries = queryCache.get(queryKey) || [];
    const now = Date.now();
    const recent5s = recentQueries.filter((time: number) => now - time < 5000).length; // 5초 내 중복
    const recent1s = recentQueries.filter((time: number) => now - time < 1000).length; // 1초 내 중복
    
    if (recent1s > 2) {
      console.warn(`🚨 즉시 중복 감지: ${queryKey} - 1초 내 ${recent1s}번`);
    }
    
    if (recent5s > 10) {
      console.warn(`⚠️ 빈번한 중복 감지: ${queryKey} - 5초 내 ${recent5s}번`);
    }
    
    // 쿼리 실행 시간 기록
    recentQueries.push(now);
    queryCache.set(queryKey, recentQueries.slice(-20)); // 최근 20개로 확장
    
    const result = await next(params);
    const duration = Date.now() - start;
    
    // 느린 쿼리만 로깅 (100ms 이상으로 임계값 상향)
    if (duration > 100) {
      console.warn(`🐌 느린 쿼리 감지: ${params.model}.${params.action} - ${duration}ms`);
    }
    
    return result;
  });
}

// 🚀 프로덕션 환경 성능 최적화
if (process.env.NODE_ENV === 'production') {
  // 연결 풀 상태 모니터링 (메트릭이 지원되는 경우에만)
  setInterval(() => {
    try {
      // @ts-ignore
      if (prisma.$metrics) {
        // @ts-ignore
        const metrics = (prisma as any).$metrics.json();
        const activeConnections = metrics?.counters?.find((c: any) => c.key === 'prisma_pool_connections_open')?.value || 0;
        
        if (activeConnections > 15) {
          console.warn(`⚠️ 높은 연결 수: ${activeConnections}개`);
        }
      }
    } catch (error) {
      // 메트릭 조회 실패는 무시
    }
  }, 30000); // 30초마다 확인
}

export default prisma; 