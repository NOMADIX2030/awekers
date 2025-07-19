import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 현재 요청 정보
    const host = request.headers.get('host') || 'unknown';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // 환경 변수에서 정보 추출
    const nodeEnv = process.env.NODE_ENV || 'development';
    const vercelEnv = process.env.VERCEL_ENV || 'local';
    const vercelUrl = process.env.VERCEL_URL || null;
    const databaseUrl = process.env.DATABASE_URL ? 
      process.env.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 
      'not configured';

    // 데이터베이스 연결 상태 확인
    let dbStatus = 'unknown';
    let dbResponseTime = 0;
    try {
      const startTime = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbResponseTime = Date.now() - startTime;
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'disconnected';
    }

    // 프로젝트 정보
    const projectInfo = {
      name: 'awekers',
      version: '0.1.0',
      framework: 'Next.js',
      frameworkVersion: '15.4.1',
      database: 'MySQL (PlanetScale)',
      orm: 'Prisma',
      deployment: vercelEnv === 'production' ? 'Vercel Production' : 
                  vercelEnv === 'preview' ? 'Vercel Preview' : 'Local Development'
    };

    // 서버리스 환경 정보
    const serverlessInfo = {
      platform: 'Vercel',
      region: process.env.VERCEL_REGION || 'unknown',
      functionTimeout: '10s',
      coldStart: true,
      edgeRuntime: process.env.NEXT_RUNTIME === 'edge',
      functionType: 'Serverless Function',
      maxPayloadSize: '4.5MB',
      concurrentExecutions: 'Unlimited (within limits)'
    };

    // 성능 및 리소스 정보 (서버리스 환경에 맞게)
    const performanceInfo = {
      functionMemory: '1024MB (default)',
      executionTime: '0-10s',
      coldStartLatency: '100-500ms',
      warmStartLatency: '10-50ms',
      databaseLatency: `${dbResponseTime}ms`,
      networkLatency: 'Varies by region'
    };

    // 보안 및 환경 정보
    const securityInfo = {
      https: protocol === 'https',
      cors: true,
      rateLimit: 'Vercel default',
      environmentVariables: {
        nodeEnv,
        vercelEnv,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasVercelUrl: !!vercelUrl
      }
    };

    // 모니터링 및 로깅 정보
    const monitoringInfo = {
      logs: 'Vercel Function Logs',
      metrics: 'Vercel Analytics',
      errorTracking: 'Vercel Error Tracking',
      performanceMonitoring: 'Vercel Speed Insights',
      uptime: '99.9% (Vercel SLA)'
    };

    const serverInfo = {
      // 도메인 및 네트워크 정보
      domain: {
        current: `${protocol}://${host}`,
        vercelUrl: vercelUrl ? `https://${vercelUrl}` : null,
        protocol,
        host,
        ip,
        userAgent: userAgent.substring(0, 100) + (userAgent.length > 100 ? '...' : '')
      },

      // 환경 정보
      environment: {
        nodeEnv,
        vercelEnv,
        isProduction: nodeEnv === 'production',
        isDevelopment: nodeEnv === 'development',
        isPreview: vercelEnv === 'preview',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },

      // 프로젝트 정보
      project: projectInfo,

      // 서버리스 정보
      serverless: serverlessInfo,

      // 성능 정보
      performance: performanceInfo,

      // 데이터베이스 정보
      database: {
        status: dbStatus,
        responseTime: dbResponseTime,
        url: databaseUrl,
        provider: 'PlanetScale (MySQL)',
        connectionPool: 'Managed by Prisma',
        maxConnections: 'PlanetScale limits'
      },

      // 보안 정보
      security: securityInfo,

      // 모니터링 정보
      monitoring: monitoringInfo,

      // 타임스탬프
      timestamp: new Date().toISOString(),
      requestId: request.headers.get('x-vercel-id') || 'unknown'
    };

    return NextResponse.json(serverInfo);
  } catch (error) {
    console.error('서버 정보 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
 
 