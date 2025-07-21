// 🚀 AWEKERS 보안 강화된 로그 시스템 (프로덕션 최적화)
// 보안: 민감 데이터 마스킹, 성능: 프로덕션 로그 최소화

// 🎯 환경별 최적화된 설정
const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

// 🔒 민감한 데이터 필드 목록 (보안)
const SENSITIVE_FIELDS = [
  'password', 'token', 'apiKey', 'secret', 'authorization', 
  'cookie', 'session', 'jwt', 'key', 'auth', 'credential',
  'email', 'phone', 'ip', 'userAgent', 'fingerprint'
];

// 🛡️ 데이터 마스킹 함수 (보안 강화)
const maskSensitiveData = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  
  const masked = { ...data };
  
  // 민감한 필드 마스킹
  SENSITIVE_FIELDS.forEach(field => {
    if (masked[field]) {
      masked[field] = '[REDACTED]';
    }
  });
  
  // 중첩된 객체 처리
  Object.keys(masked).forEach(key => {
    if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = maskSensitiveData(masked[key]);
    }
  });
  
  return masked;
};

// 🌈 개발환경용 컬러 로그 함수들
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

// 🕐 타임스탬프 생성 함수
const getTimestamp = (): string => {
  const now = new Date();
  return isDevelopment 
    ? now.toLocaleTimeString('ko-KR', { hour12: false })
    : now.toISOString();
};

// 🎯 프로덕션 로그 레벨 제한 (성능 최적화)
const shouldLog = (level: string): boolean => {
  if (isDevelopment) return true;
  
  // 프로덕션에서는 WARN, ERROR, FATAL만 로깅
  return ['warn', 'error', 'fatal'].includes(level.toLowerCase());
};

// 📝 로그 레벨별 출력 함수 (보안 및 성능 최적화)
const logLevel = {
  trace: (msg: string, metadata?: any) => {
    if (!shouldLog('trace')) return;
    
    const timestamp = getTimestamp();
    const safeMetadata = maskSensitiveData(metadata);
    
    if (isDevelopment) {
      console.log(`${colors.gray}[${timestamp}] TRACE${colors.reset} ${msg}`, safeMetadata || '');
    } else {
      console.log(JSON.stringify({ level: 'trace', timestamp, msg, ...safeMetadata }));
    }
  },
  
  debug: (msg: string, metadata?: any) => {
    if (!shouldLog('debug')) return;
    
    const timestamp = getTimestamp();
    const safeMetadata = maskSensitiveData(metadata);
    
    if (isDevelopment) {
      console.log(`${colors.cyan}[${timestamp}] DEBUG${colors.reset} ${msg}`, safeMetadata || '');
    } else {
      console.log(JSON.stringify({ level: 'debug', timestamp, msg, ...safeMetadata }));
    }
  },
  
  info: (msg: string, metadata?: any) => {
    if (!shouldLog('info')) return;
    
    const timestamp = getTimestamp();
    const safeMetadata = maskSensitiveData(metadata);
    
    if (isDevelopment) {
      console.log(`${colors.blue}[${timestamp}] INFO${colors.reset}  ${msg}`, safeMetadata || '');
    } else {
      // 프로덕션에서는 INFO 로그 제한적으로만 출력
      if (msg.includes('ERROR') || msg.includes('FATAL') || msg.includes('시스템')) {
        console.log(JSON.stringify({ level: 'info', timestamp, msg: '[INFO] 시스템 작동 중' }));
      }
    }
  },
  
  warn: (msg: string, metadata?: any) => {
    const timestamp = getTimestamp();
    const safeMetadata = maskSensitiveData(metadata);
    
    if (isDevelopment) {
      console.warn(`${colors.yellow}[${timestamp}] WARN${colors.reset}  ${msg}`, safeMetadata || '');
    } else {
      console.warn(JSON.stringify({ level: 'warn', timestamp, msg, ...safeMetadata }));
    }
  },
  
  error: (msg: string, metadata?: any) => {
    const timestamp = getTimestamp();
    const safeMetadata = maskSensitiveData(metadata);
    
    if (isDevelopment) {
      console.error(`${colors.red}[${timestamp}] ERROR${colors.reset} ${msg}`, safeMetadata || '');
    } else {
      console.error(JSON.stringify({ level: 'error', timestamp, msg, ...safeMetadata }));
    }
  },
  
  fatal: (msg: string, metadata?: any) => {
    const timestamp = getTimestamp();
    const safeMetadata = maskSensitiveData(metadata);
    
    if (isDevelopment) {
      console.error(`${colors.bright}${colors.red}[${timestamp}] FATAL${colors.reset} ${msg}`, safeMetadata || '');
    } else {
      console.error(JSON.stringify({ level: 'fatal', timestamp, msg, ...safeMetadata }));
    }
  }
};

// 🎯 AWEKERS 보안 강화된 로거 메소드들
export const awekers = {
  // 성능 모니터링 (보안 및 성능 최적화)
  performance: {
    start: (operation: string) => {
      const start = process.hrtime.bigint();
      return {
        end: (metadata?: any) => {
          const duration = Number(process.hrtime.bigint() - start) / 1000000; // ms
          
          // 프로덕션에서는 성능 정보 제한적 로깅
          if (isDevelopment) {
            logLevel.info(`⚡ 성능: ${operation}`, { 
              operation, 
              duration: `${duration.toFixed(2)}ms`,
              ...metadata 
            });
          } else if (duration > 1000) { // 1초 이상만 로깅
            logLevel.warn('성능 경고: 느린 작업 감지', { operation, duration: `${duration.toFixed(2)}ms` });
          }
        }
      };
    }
  },

  // SEO 관련 로깅 (프로덕션에서 제한)
  seo: {
    pageView: (url: string, metadata?: any) => {
      if (isDevelopment) {
        logLevel.info('🔍 SEO: 페이지 조회', { url, type: 'pageview', ...metadata });
      }
      // 프로덕션에서는 SEO 로그 비활성화 (전략 보호)
    },
    
    searchQuery: (query: string, results: number) => {
      if (isDevelopment) {
        logLevel.info('🔎 SEO: 검색 쿼리', { query, results, type: 'search' });
      }
      // 프로덕션에서는 검색 로그 비활성화 (보안)
    },
    
    metadataGeneration: (page: string, metadata?: any) => {
      if (isDevelopment) {
        logLevel.info('📄 SEO: 메타데이터 생성', { page, ...metadata, type: 'metadata' });
      }
      // 프로덕션에서는 메타데이터 로그 비활성화
    },
  },

  // 블로그 관련 로깅 (프로덕션에서 제한)
  blog: {
    view: (blogId: number, metadata?: any) => {
      if (isDevelopment) {
        logLevel.info('📝 블로그: 조회', { blogId, type: 'blog_view', ...metadata });
      }
      // 프로덕션에서는 블로그 조회 로그 비활성화
    },
    
    comment: (blogId: number, action: string, metadata?: any) => {
      if (isDevelopment) {
        logLevel.info(`💬 댓글: ${action}`, { blogId, action, type: 'comment', ...metadata });
      }
      // 프로덕션에서는 댓글 로그 비활성화
    },
  },

  // 데이터베이스 성능 모니터링 (보안 강화)
  db: {
    slowQuery: (query: string, duration: number) => {
      // 쿼리 내용 마스킹 (보안)
      const maskedQuery = query.replace(/('[^']*'|"[^"]*")/g, "'[REDACTED]'");
      logLevel.warn('🐌 DB: 느린 쿼리', { query: maskedQuery, duration, type: 'slow_query' });
    },
    
    error: (error: Error, query?: string) => {
      // 쿼리 내용 마스킹 (보안)
      const maskedQuery = query ? query.replace(/('[^']*'|"[^"]*")/g, "'[REDACTED]'") : undefined;
      logLevel.error('❌ DB: 오류', { error: error.message, query: maskedQuery, stack: isDevelopment ? error.stack : undefined });
    },
  },

  // 보안 강화된 일반 로깅 메소드
  trace: (msg: string, metadata?: any) => logLevel.trace(msg, metadata),
  debug: (msg: string, metadata?: any) => logLevel.debug(msg, metadata),
  info: (msg: string, metadata?: any) => logLevel.info(msg, metadata),
  warn: (msg: string, metadata?: any) => logLevel.warn(msg, metadata),
  error: (msg: string, error?: Error | any, metadata?: any) => {
    const errorData = error ? {
      error: error.message || error,
      stack: isDevelopment ? error.stack : undefined, // 프로덕션에서 스택 트레이스 숨김
      ...metadata
    } : metadata;
    logLevel.error(msg, errorData);
  },
  fatal: (msg: string, error?: Error | any, metadata?: any) => {
    const errorData = error ? {
      error: error.message || error,
      stack: isDevelopment ? error.stack : undefined, // 프로덕션에서 스택 트레이스 숨김
      ...metadata
    } : metadata;
    logLevel.fatal(msg, errorData);
  },
};

// 🚀 시스템 시작 로그 (보안 고려)
if (isDevelopment) {
  awekers.info('🚀 AWEKERS 보안 강화된 로그 시스템 초기화 완료', {
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    security: '민감 데이터 마스킹 ✅',
    performance: '프로덕션 최적화 ✅'
  });
} else {
  console.log(JSON.stringify({ 
    level: 'info', 
    timestamp: getTimestamp(), 
    msg: 'AWEKERS 시스템 시작',
    environment: 'production'
  }));
}

export default awekers; 