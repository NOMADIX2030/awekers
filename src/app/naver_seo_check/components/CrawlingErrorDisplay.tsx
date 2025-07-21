'use client';

import { useState } from 'react';

interface CrawlingError {
  type: 'url_format' | 'network' | 'timeout' | 'blocked' | 'ssl' | 'redirect' | 'server_error' | 'content_type' | 'robots' | 'dns' | 'unknown';
  message: string;
  details?: string;
  url?: string;
}

interface CrawlingErrorDisplayProps {
  error: string | CrawlingError;
  url?: string;
  onRetry?: () => void;
  onReset?: () => void;
}

// URL 형식 검증 함수
const validateURL = (url: string): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // 기본 형식 체크
  if (!url || url.trim() === '') {
    issues.push('URL이 입력되지 않았습니다');
    return { isValid: false, issues };
  }
  
  const trimmedUrl = url.trim();
  
  // 프로토콜 체크
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    issues.push('프로토콜이 누락되었습니다 (http:// 또는 https:// 필요)');
  }
  
  // 도메인 체크
  try {
    const urlObj = new URL(trimmedUrl);
    
    if (!urlObj.hostname || urlObj.hostname === '') {
      issues.push('도메인이 누락되었습니다');
    }
    
    // 유효하지 않은 문자 체크
    if (urlObj.hostname.includes(' ')) {
      issues.push('도메인에 공백이 포함되어 있습니다');
    }
    
    // 한글 자음/모음 체크
    const koreanConsonants = /[ㄱ-ㅎ]/g;
    const koreanVowels = /[ㅏ-ㅣ]/g;
    if (koreanConsonants.test(urlObj.hostname) || koreanVowels.test(urlObj.hostname)) {
      issues.push('한글 자음/모음은 도메인에 사용할 수 없습니다');
    }
    
    // 완성된 한글 체크
    const koreanSyllables = /[가-힣]/g;
    if (koreanSyllables.test(urlObj.hostname)) {
      issues.push('한글 도메인은 퓨니코드(Punycode) 형식으로 변환해야 합니다');
    }
    
    // 도메인 형식 체크 (기본 ASCII + 하이픈)
    const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainPattern.test(urlObj.hostname) && !urlObj.hostname.includes('xn--')) {
      issues.push('도메인 형식이 올바르지 않습니다');
    }
    
  } catch (e) {
    issues.push('URL 형식이 올바르지 않습니다');
  }
  
  return { isValid: issues.length === 0, issues };
};

// 오류 타입별 상세 정보
const getErrorDetails = (error: string | CrawlingError, url?: string) => {
  let errorType: CrawlingError['type'] = 'unknown';
  let message = '';
  let details = '';
  
  if (typeof error === 'string') {
    // 문자열 오류를 분석하여 타입 결정
    const lowerError = error.toLowerCase();
    
    if (lowerError.includes('url') || lowerError.includes('형식') || lowerError.includes('format')) {
      errorType = 'url_format';
    } else if (lowerError.includes('timeout') || lowerError.includes('시간초과')) {
      errorType = 'timeout';
    } else if (lowerError.includes('network') || lowerError.includes('네트워크') || lowerError.includes('connection')) {
      errorType = 'network';
    } else if (lowerError.includes('blocked') || lowerError.includes('차단') || lowerError.includes('403')) {
      errorType = 'blocked';
    } else if (lowerError.includes('ssl') || lowerError.includes('certificate') || lowerError.includes('인증서')) {
      errorType = 'ssl';
    } else if (lowerError.includes('redirect') || lowerError.includes('리다이렉트') || lowerError.includes('301') || lowerError.includes('302')) {
      errorType = 'redirect';
    } else if (lowerError.includes('500') || lowerError.includes('502') || lowerError.includes('503') || lowerError.includes('504')) {
      errorType = 'server_error';
    } else if (lowerError.includes('dns') || lowerError.includes('domain') || lowerError.includes('도메인')) {
      errorType = 'dns';
    } else if (lowerError.includes('robots') || lowerError.includes('로봇')) {
      errorType = 'robots';
    }
    
    message = error;
  } else {
    errorType = error.type;
    message = error.message;
    details = error.details || '';
  }

  // URL 형식 오류인 경우 추가 검증
  if (errorType === 'url_format' && url) {
    const validation = validateURL(url);
    if (!validation.isValid) {
      details = validation.issues.join(', ');
    }
  }

  return { errorType, message, details };
};

// 오류 타입별 상세 정보와 해결 방법
const ERROR_SOLUTIONS = {
  url_format: {
    title: '🔗 URL 형식 오류',
    description: '입력하신 웹사이트 주소 형식이 올바르지 않습니다.',
    examples: [
      {
        wrong: 'naver.com',
        correct: 'https://naver.com',
        reason: '프로토콜(https://) 누락'
      },
      {
        wrong: 'https://my site.com',
        correct: 'https://mysite.com',
        reason: '도메인에 공백 포함'
      },
             {
         wrong: 'https://example',
         correct: 'https://example.com',
         reason: '도메인 확장자 누락'
       },
       {
         wrong: 'https://ㅈㄷㄹㅈ.naver.com',
         correct: 'https://test.naver.com',
         reason: '한글 자음 사용 불가'
       },
       {
         wrong: 'https://한글도메인.com',
         correct: 'https://xn--bj0bj06e77zmalb.com',
         reason: '한글 도메인은 퓨니코드 변환 필요'
       }
    ],
    solutions: [
             '✅ https:// 또는 http://로 시작해야 합니다',
       '✅ 도메인에 공백이 없어야 합니다',
       '✅ .com, .co.kr 등의 확장자가 필요합니다',
       '✅ 한글은 영문으로 변경하거나 퓨니코드로 변환하세요',
       '✅ 한글 자음/모음(ㄱㄴㄷ, ㅏㅑㅓ)은 사용할 수 없습니다',
       '✅ 특수문자는 인코딩되어야 합니다'
    ]
  },
  network: {
    title: '🌐 네트워크 연결 오류',
    description: '웹사이트에 연결할 수 없습니다.',
    examples: [
      { case: '인터넷 연결 불안정', solution: '네트워크 연결 상태를 확인하세요' },
      { case: '방화벽 차단', solution: '방화벽 설정을 확인하세요' },
      { case: '프록시 문제', solution: '프록시 설정을 확인하세요' }
    ],
    solutions: [
      '🔄 잠시 후 다시 시도해보세요',
      '📶 인터넷 연결 상태를 확인하세요',
      '🔥 방화벽이나 보안 프로그램을 확인하세요',
      '🌍 다른 브라우저에서 해당 사이트에 접속해보세요'
    ]
  },
  timeout: {
    title: '⏰ 응답 시간 초과',
    description: '웹사이트 응답이 너무 느려서 분석을 완료할 수 없습니다.',
    examples: [
      { case: '서버 과부하', solution: '서버가 바쁜 상태일 수 있습니다' },
      { case: '느린 웹사이트', solution: '사이트 자체의 로딩이 느릴 수 있습니다' },
      { case: '대용량 페이지', solution: '페이지 크기가 클 수 있습니다' }
    ],
    solutions: [
      '⏳ 5-10분 후 다시 시도해보세요',
      '🚀 웹사이트 속도 최적화가 필요할 수 있습니다',
      '📱 모바일에서도 동일한지 확인해보세요',
      '🔄 새로고침 후 재시도해보세요'
    ]
  },
  blocked: {
    title: '🚫 접근 차단됨',
    description: '웹사이트에서 크롤링을 차단하고 있습니다.',
    examples: [
      { case: 'Cloudflare 보호', solution: 'DDoS 보호 서비스가 활성화됨' },
      { case: '봇 차단 정책', solution: '자동화된 접근을 차단함' },
      { case: 'IP 차단', solution: '특정 IP 대역을 차단함' }
    ],
    solutions: [
      '🤖 사이트의 robots.txt를 확인해보세요',
      '🛡️ 보안 설정으로 인한 차단일 수 있습니다',
      '👨‍💻 사이트 관리자에게 문의하세요',
      '🌐 VPN을 사용해서 다시 시도해보세요'
    ]
  },
  ssl: {
    title: '🔒 SSL 인증서 오류',
    description: 'HTTPS 보안 인증서에 문제가 있습니다.',
    examples: [
      { case: '만료된 인증서', solution: 'SSL 인증서 갱신 필요' },
      { case: '잘못된 도메인', solution: '인증서와 도메인 불일치' },
      { case: '신뢰할 수 없는 CA', solution: '인증 기관 문제' }
    ],
    solutions: [
      '🔒 SSL 인증서를 갱신하세요',
      '🌐 HTTP 버전으로 시도해보세요 (보안 주의)',
      '🔧 웹사이트 관리자에게 SSL 설정을 확인 요청하세요',
      '⚠️ 브라우저에서 직접 접속하여 인증서 상태를 확인하세요'
    ]
  },
  dns: {
    title: '🌍 DNS 조회 실패',
    description: '도메인 이름을 찾을 수 없습니다.',
    examples: [
      { case: '존재하지 않는 도메인', solution: '도메인이 등록되지 않았거나 만료됨' },
      { case: 'DNS 서버 문제', solution: 'DNS 서버가 응답하지 않음' },
      { case: '오타', solution: '도메인 이름을 잘못 입력함' }
    ],
    solutions: [
      '✏️ 도메인 이름의 철자를 다시 확인하세요',
      '🔍 도메인이 실제로 존재하는지 확인하세요',
      '🌐 다른 DNS 서버(8.8.8.8)를 사용해보세요',
      '⏰ 잠시 후 다시 시도해보세요'
    ]
  },
  server_error: {
    title: '🖥️ 서버 오류',
    description: '웹사이트 서버에서 오류가 발생했습니다.',
    examples: [
      { case: '500 Internal Server Error', solution: '서버 내부 오류' },
      { case: '502 Bad Gateway', solution: '게이트웨이 오류' },
      { case: '503 Service Unavailable', solution: '서비스 일시 중단' }
    ],
    solutions: [
      '🔄 몇 분 후 다시 시도해보세요',
      '📧 웹사이트 관리자에게 문의하세요',
      '📱 모바일에서 접속해보세요',
      '🌐 웹사이트 상태를 확인하는 서비스를 이용하세요'
    ]
  },
     robots: {
     title: '🤖 Robots.txt 차단',
     description: 'robots.txt 파일에서 크롤링을 금지하고 있습니다.',
     examples: [
       { case: 'User-agent: * Disallow: /', solution: '모든 크롤러 차단' },
       { case: 'Crawl-delay: 86400', solution: '크롤링 지연 설정' }
     ],
     solutions: [
       '📋 사이트의 robots.txt를 확인하세요',
       '👨‍💻 사이트 관리자에게 SEO 분석 허용을 요청하세요',
       '🔍 수동으로 페이지를 확인하세요',
       '⚙️ robots.txt 설정을 수정하세요'
     ]
   },
   redirect: {
     title: '🔄 리다이렉트 오류',
     description: '페이지가 너무 많이 리다이렉트되거나 잘못된 리다이렉트가 설정되어 있습니다.',
     examples: [
       { case: '무한 리다이렉트 루프', solution: '리다이렉트 설정을 확인하세요' },
       { case: '잘못된 301/302 설정', solution: '리다이렉트 규칙을 점검하세요' }
     ],
     solutions: [
       '🔄 리다이렉트 체인을 확인하세요',
       '⚙️ .htaccess 파일을 점검하세요',
       '🔧 서버 설정을 확인하세요',
       '🌐 브라우저에서 직접 접속해보세요'
     ]
   },
   content_type: {
     title: '📄 콘텐츠 타입 오류',
     description: '페이지의 콘텐츠 타입이 HTML이 아니거나 인식할 수 없습니다.',
     examples: [
       { case: 'PDF 파일 링크', solution: 'HTML 페이지가 아닌 파일을 분석하려고 함' },
       { case: '잘못된 MIME 타입', solution: '서버에서 잘못된 Content-Type 헤더 전송' }
     ],
     solutions: [
       '📄 HTML 페이지 URL인지 확인하세요',
       '🔧 서버의 MIME 타입 설정을 확인하세요',
       '🌐 브라우저에서 페이지가 정상 표시되는지 확인하세요',
       '📝 웹페이지 URL을 다시 확인하세요'
     ]
   },
   unknown: {
     title: '❓ 알 수 없는 오류',
     description: '예상하지 못한 오류가 발생했습니다.',
     examples: [
       { case: '일시적인 서버 문제', solution: '잠시 후 다시 시도해보세요' },
       { case: '네트워크 불안정', solution: '인터넷 연결을 확인하세요' }
     ],
     solutions: [
       '🔄 페이지를 새로고침하고 다시 시도하세요',
       '⏰ 몇 분 후 다시 시도해보세요',
       '🌐 다른 브라우저에서 시도해보세요',
       '📞 기술 지원팀에 문의하세요'
     ]
   }
};

export function CrawlingErrorDisplay({ error, url, onRetry, onReset }: CrawlingErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(true);
  const { errorType, message, details } = getErrorDetails(error, url);
  const errorInfo = ERROR_SOLUTIONS[errorType] || ERROR_SOLUTIONS.unknown;

  return (
    <div className="max-w-4xl mx-auto">
      {/* 오류 헤더 */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            웹사이트 분석을 완료할 수 없습니다
          </h2>
          <p className="text-red-600">
            {url && `${url} 에서 `}문제가 발생했습니다
          </p>
        </div>
        
        {/* 오류 메시지 */}
        <div className="bg-white rounded-lg p-4 border border-red-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">!</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-red-800 mb-1">오류 메시지</h4>
              <p className="text-red-600 text-sm">{message}</p>
              {details && (
                <p className="text-red-500 text-xs mt-1">세부사항: {details}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 상세 오류 정보 */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              {errorInfo.title}
            </h3>
            <svg
              className={`w-5 h-5 text-gray-500 transform transition-transform ${showDetails ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {showDetails && (
          <div className="p-6">
            <p className="text-gray-600 mb-6">{errorInfo.description}</p>

            {/* 예시 섹션 */}
            {errorInfo.examples && (
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📝</span>
                  자주 발생하는 사례
                </h4>
                                 <div className="space-y-4">
                   {errorInfo.examples.map((example: any, index: number) => (
                     <div key={index} className="bg-gray-50 rounded-lg p-4">
                       {'wrong' in example ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-red-600 mb-1">❌ 잘못된 예시</p>
                              <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                                {example.wrong}
                              </code>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-600 mb-1">✅ 올바른 예시</p>
                              <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                {example.correct}
                              </code>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">💡 {example.reason}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-gray-800 mb-1">🔍 {example.case}</p>
                          <p className="text-sm text-gray-600">{example.solution}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 해결 방법 */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">💡</span>
                해결 방법
              </h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {errorInfo.solutions.map((solution: string, index: number) => (
                   <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-600 text-sm mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-blue-800">{solution}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* URL 형식 오류인 경우 실시간 검증 */}
            {errorType === 'url_format' && url && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-medium text-yellow-800 mb-2">🔍 입력하신 URL 분석 결과</h5>
                <div className="text-sm">
                  <p className="text-yellow-700 mb-2">입력된 URL: <code className="bg-yellow-100 px-1 rounded">{url}</code></p>
                  {(() => {
                    const validation = validateURL(url);
                    return (
                      <div>
                        {validation.issues.map((issue, index) => (
                          <p key={index} className="text-red-600 flex items-center">
                            <span className="mr-2">❌</span>
                            {issue}
                          </p>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* 추가 도움말 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h5 className="font-medium text-gray-800 mb-2">🆘 추가 도움이 필요하신가요?</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• 웹사이트가 정상 작동하는지 브라우저에서 직접 확인해보세요</p>
                <p>• 다른 SEO 분석 도구에서도 동일한 문제가 발생하는지 확인해보세요</p>
                <p>• 웹사이트 관리자에게 기술적 지원을 요청하세요</p>
                <p>• 문제가 지속되면 고객 지원팀에 문의하세요</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 bg-naver-green text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            다시 시도
          </button>
        )}
        {onReset && (
          <button
            onClick={onReset}
            className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            새로운 분석
          </button>
        )}
      </div>
    </div>
  );
} 