"use client";
import React, { useState, useEffect } from 'react';

interface ServerInfo {
  domain: {
    current: string;
    vercelUrl: string | null;
    protocol: string;
    host: string;
    ip: string;
    userAgent: string;
  };
  environment: {
    nodeEnv: string;
    vercelEnv: string;
    isProduction: boolean;
    isDevelopment: boolean;
    isPreview: boolean;
    timezone: string;
  };
  project: {
    name: string;
    version: string;
    framework: string;
    frameworkVersion: string;
    database: string;
    orm: string;
    deployment: string;
  };
  serverless: {
    platform: string;
    region: string;
    functionTimeout: string;
    coldStart: boolean;
    edgeRuntime: boolean;
    functionType: string;
    maxPayloadSize: string;
    concurrentExecutions: string;
  };
  performance: {
    functionMemory: string;
    executionTime: string;
    coldStartLatency: string;
    warmStartLatency: string;
    databaseLatency: string;
    networkLatency: string;
  };
  database: {
    status: string;
    responseTime: number;
    url: string;
    provider: string;
    connectionPool: string;
    maxConnections: string;
  };
  security: {
    https: boolean;
    cors: boolean;
    rateLimit: string;
    environmentVariables: {
      nodeEnv: string;
      vercelEnv: string;
      hasDatabaseUrl: boolean;
      hasVercelUrl: boolean;
    };
  };
  monitoring: {
    logs: string;
    metrics: string;
    errorTracking: string;
    performanceMonitoring: string;
    uptime: string;
  };
  timestamp: string;
  requestId: string;
}

const ServerInfo: React.FC = () => {
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServerInfo = async () => {
      try {
        const response = await fetch('/api/admin/server-info', {
          headers: {
            'Authorization': 'Bearer admin-token'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setServerInfo(data);
        } else {
          setError('서버 정보를 불러올 수 없습니다.');
        }
      } catch (error) {
        setError('서버 정보 조회 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchServerInfo();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !serverInfo) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">서버리스 환경 정보</h3>
        <div className="text-red-600">{error || '서버 정보를 불러올 수 없습니다.'}</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'disconnected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getEnvironmentColor = (isProduction: boolean, isPreview: boolean) => {
    if (isProduction) return 'text-red-600 bg-red-100';
    if (isPreview) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getSecurityColor = (isSecure: boolean) => {
    return isSecure ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">서버리스 환경 정보</h3>
      
      <div className="space-y-4">
        {/* 도메인 정보 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">도메인 정보</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">현재 도메인:</span>
              <span className="font-mono text-blue-600">{serverInfo.domain.current}</span>
            </div>
            {serverInfo.domain.vercelUrl && (
              <div className="flex justify-between">
                <span className="text-gray-600">Vercel URL:</span>
                <span className="font-mono text-blue-600">{serverInfo.domain.vercelUrl}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">클라이언트 IP:</span>
              <span className="font-mono">{serverInfo.domain.ip}</span>
            </div>
          </div>
        </div>

        {/* 환경 정보 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">환경 정보</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">배포 환경:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnvironmentColor(serverInfo.environment.isProduction, serverInfo.environment.isPreview)}`}>
                {serverInfo.project.deployment}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Node.js 환경:</span>
              <span className="font-mono">{serverInfo.environment.nodeEnv}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vercel 환경:</span>
              <span className="font-mono">{serverInfo.environment.vercelEnv}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">타임존:</span>
              <span className="font-mono">{serverInfo.environment.timezone}</span>
            </div>
          </div>
        </div>

        {/* 서버리스 정보 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">서버리스 정보</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">플랫폼:</span>
              <span className="font-mono">{serverInfo.serverless.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">리전:</span>
              <span className="font-mono">{serverInfo.serverless.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">함수 타입:</span>
              <span className="font-mono">{serverInfo.serverless.functionType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">타임아웃:</span>
              <span className="font-mono">{serverInfo.serverless.functionTimeout}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">최대 페이로드:</span>
              <span className="font-mono">{serverInfo.serverless.maxPayloadSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">동시 실행:</span>
              <span className="font-mono">{serverInfo.serverless.concurrentExecutions}</span>
            </div>
          </div>
        </div>

        {/* 성능 정보 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">성능 정보</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">함수 메모리:</span>
              <span className="font-mono">{serverInfo.performance.functionMemory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">실행 시간:</span>
              <span className="font-mono">{serverInfo.performance.executionTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">콜드 스타트:</span>
              <span className="font-mono">{serverInfo.performance.coldStartLatency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">웜 스타트:</span>
              <span className="font-mono">{serverInfo.performance.warmStartLatency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">DB 응답 시간:</span>
              <span className="font-mono">{serverInfo.performance.databaseLatency}</span>
            </div>
          </div>
        </div>

        {/* 데이터베이스 정보 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">데이터베이스 정보</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">연결 상태:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(serverInfo.database.status)}`}>
                {serverInfo.database.status === 'connected' ? '연결됨' : 
                 serverInfo.database.status === 'disconnected' ? '연결 끊김' : '알 수 없음'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">프로바이더:</span>
              <span className="font-mono">{serverInfo.database.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">연결 풀:</span>
              <span className="font-mono">{serverInfo.database.connectionPool}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">응답 시간:</span>
              <span className="font-mono">{serverInfo.database.responseTime}ms</span>
            </div>
          </div>
        </div>

        {/* 보안 정보 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">보안 정보</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">HTTPS:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSecurityColor(serverInfo.security.https)}`}>
                {serverInfo.security.https ? '활성화' : '비활성화'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CORS:</span>
              <span className="font-mono">{serverInfo.security.cors ? '활성화' : '비활성화'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">속도 제한:</span>
              <span className="font-mono">{serverInfo.security.rateLimit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">환경 변수:</span>
              <span className="font-mono">
                {Object.entries(serverInfo.security.environmentVariables)
                  .filter(([_, value]) => value)
                  .map(([key, _]) => key)
                  .join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* 모니터링 정보 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">모니터링 정보</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">로그:</span>
              <span className="font-mono">{serverInfo.monitoring.logs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">메트릭:</span>
              <span className="font-mono">{serverInfo.monitoring.metrics}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">에러 추적:</span>
              <span className="font-mono">{serverInfo.monitoring.errorTracking}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">성능 모니터링:</span>
              <span className="font-mono">{serverInfo.monitoring.performanceMonitoring}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">가동률:</span>
              <span className="font-mono text-green-600 font-medium">{serverInfo.monitoring.uptime}</span>
            </div>
          </div>
        </div>

        {/* 프로젝트 정보 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">프로젝트 정보</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">프로젝트명:</span>
              <span className="font-medium">{serverInfo.project.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">버전:</span>
              <span className="font-mono">{serverInfo.project.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">프레임워크:</span>
              <span className="font-mono">{serverInfo.project.framework} {serverInfo.project.frameworkVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">데이터베이스:</span>
              <span className="font-mono">{serverInfo.project.database}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ORM:</span>
              <span className="font-mono">{serverInfo.project.orm}</span>
            </div>
          </div>
        </div>

        {/* 요청 정보 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">요청 정보</h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">요청 ID:</span>
              <span className="font-mono text-blue-600">{serverInfo.requestId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">타임스탬프:</span>
              <span className="font-mono">{new Date(serverInfo.timestamp).toLocaleString('ko-KR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">User Agent:</span>
              <span className="font-mono text-xs">{serverInfo.domain.userAgent}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerInfo; 
 
 