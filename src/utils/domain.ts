/**
 * 🎯 사이트 URL 동적 감지 함수
 * 다양한 배포 환경에서 자동으로 올바른 URL을 감지합니다.
 * 
 * @returns {string} 현재 환경에 맞는 사이트 URL
 * 
 * @example
 * ```typescript
 * const siteUrl = getSiteUrl();
 * // 개발환경: "http://localhost:3000"
 * // 프로덕션: "https://awekers.vercel.app"
 * // Vercel: "https://awekers-git-main.vercel.app"
 * ```
 */
export function getSiteUrl(): string {
  // 1순위: 환경변수 설정값 (가장 우선순위)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // 2순위: Vercel 자동 제공 환경변수
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // 3순위: 환경에 따른 기본값 (선택적)
  if (process.env.NODE_ENV === 'production') {
    // 프로덕션 기본값이 설정되어 있으면 사용
    if (process.env.NEXT_PUBLIC_DEFAULT_SITE_URL) {
      return process.env.NEXT_PUBLIC_DEFAULT_SITE_URL;
    }
    
    // 프로덕션에서는 환경변수 설정을 강제
    throw new Error(
      '프로덕션 환경에서 NEXT_PUBLIC_SITE_URL 또는 NEXT_PUBLIC_DEFAULT_SITE_URL 환경변수를 설정해주세요.'
    );
  }
  
  // 4순위: 개발환경 기본값
  return 'http://localhost:3000';
}

/**
 * 🎯 도메인만 추출하는 함수
 * 
 * @returns {string} 도메인 부분만 추출된 문자열
 * 
 * @example
 * ```typescript
 * const domain = getDomain();
 * // "awekers.vercel.app"
 * ```
 */
export function getDomain(): string {
  const url = getSiteUrl();
  try {
    return new URL(url).hostname;
  } catch {
    // URL 파싱 실패시 기본값 반환
    return 'localhost';
  }
}

/**
 * 🎯 기존 함수명 호환성을 위한 별칭
 * @deprecated getCurrentDomain 대신 getSiteUrl 사용 권장
 * @see getSiteUrl
 */
export const getCurrentDomain = getSiteUrl; 