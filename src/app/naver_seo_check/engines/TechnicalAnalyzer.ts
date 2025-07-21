import { CrawledPageData, SEOCheckResult } from '../types';

export class TechnicalAnalyzer {
  async analyze(data: CrawledPageData): Promise<SEOCheckResult[]> {
    const results: SEOCheckResult[] = [];

    // 기술적 최적화 검사 항목들
    results.push(this.checkHttpsSsl(data));
    results.push(this.checkHttpResponseCodes(data));
    results.push(this.checkSiteRedirection(data));
    results.push(this.checkInternalLinkStructure(data.html));
    results.push(this.checkExternalLinkQuality(data.html));
    results.push(this.checkUrlStructure(data.url));
    results.push(this.checkSiteStructureSimplicity(data.url));
    results.push(this.checkPageDepth(data.url));
    results.push(this.checkBrokenLinks(data.html));
    results.push(this.checkRobotsTxt(data));
    results.push(this.checkSitemapXml(data));
    results.push(this.checkCanonicalTag(data.html));

    return results;
  }

  private checkHttpsSsl(data: CrawledPageData): SEOCheckResult {
    const isHttps = data.url.startsWith('https://');
    
    return {
      id: 'https_ssl',
      name: '사이트 내 SSL(HTTPS) 보안 적용',
      status: isHttps ? 'pass' : 'fail',
      score: isHttps ? 4 : 0,
      maxScore: 4,
      message: isHttps ? 'HTTPS가 적용되어 있습니다' : 'HTTP 연결입니다. HTTPS 적용이 필요합니다',
      solution: 'SSL 인증서를 설치하고 HTTPS로 리디렉션하세요.',
      priority: 'high'
    };
  }

  private checkHttpResponseCodes(data: CrawledPageData): SEOCheckResult {
    const statusCode = data.statusCode;
    const isSuccess = statusCode >= 200 && statusCode < 300;
    const isRedirect = statusCode >= 300 && statusCode < 400;
    
    return {
      id: 'http_response_codes',
      name: 'HTTP 응답 코드 정합성 (404, 503 등)',
      status: isSuccess ? 'pass' : isRedirect ? 'warning' : 'fail',
      score: isSuccess ? 3 : isRedirect ? 1 : 0,
      maxScore: 3,
      message: `HTTP 응답 코드: ${statusCode}`,
      details: this.getStatusCodeDescription(statusCode),
      solution: '적절한 HTTP 상태 코드를 반환하도록 설정하세요.',
      priority: isSuccess ? 'low' : 'high'
    };
  }

  private checkSiteRedirection(data: CrawledPageData): SEOCheckResult {
    const statusCode = data.statusCode;
    const is301 = statusCode === 301;
    const is302 = statusCode === 302;
    const isRedirect = is301 || is302;
    
    return {
      id: 'site_redirection',
      name: '사이트 리디렉션 방식 (301/302)',
      status: !isRedirect ? 'pass' : is301 ? 'pass' : 'warning',
      score: !isRedirect ? 3 : is301 ? 3 : 1,
      maxScore: 3,
      message: isRedirect 
        ? `${is301 ? '영구' : '임시'} 리디렉션 (${statusCode})`
        : '리디렉션 없음',
      solution: '영구 이전 시 301 리디렉션을 사용하세요.',
      priority: isRedirect && !is301 ? 'medium' : 'low'
    };
  }

  private checkInternalLinkStructure(html: string): SEOCheckResult {
    const internalLinks = html.match(/<a[^>]*href=['"]\s*\/[^'"]*['"]/gi) || [];
    const relativeLinks = html.match(/<a[^>]*href=['"]\s*[^http][^'"]*['"]/gi) || [];
    const totalInternalLinks = internalLinks.length + relativeLinks.length;
    
    return {
      id: 'internal_link_structure',
      name: '내부 링크 구조',
      status: totalInternalLinks >= 5 ? 'pass' : totalInternalLinks >= 2 ? 'warning' : 'fail',
      score: totalInternalLinks >= 5 ? 3 : totalInternalLinks >= 2 ? 2 : 0,
      maxScore: 3,
      message: `내부 링크 ${totalInternalLinks}개 발견`,
      solution: '관련 페이지 간 내부 링크를 적절히 연결하세요.',
      priority: 'medium'
    };
  }

  private checkExternalLinkQuality(html: string): SEOCheckResult {
    const externalLinks = html.match(/<a[^>]*href=['"]\s*https?:\/\/[^'"]*['"]/gi) || [];
    const nofollowLinks = html.match(/<a[^>]*rel=['"]*[^'"]*nofollow[^'"]*['"]/gi) || [];
    const hasExternalLinks = externalLinks.length > 0;
    const hasNofollow = nofollowLinks.length > 0;
    
    return {
      id: 'external_link_quality',
      name: '외부 링크 품질',
      status: !hasExternalLinks ? 'pass' : hasNofollow ? 'pass' : 'warning',
      score: !hasExternalLinks ? 2 : hasNofollow ? 2 : 1,
      maxScore: 2,
      message: hasExternalLinks 
        ? `외부 링크 ${externalLinks.length}개 (nofollow: ${nofollowLinks.length}개)`
        : '외부 링크 없음',
      solution: '신뢰할 수 있는 사이트로만 외부 링크를 설정하세요.',
      priority: 'low'
    };
  }

  private checkUrlStructure(url: string): SEOCheckResult {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const hasParameters = urlObj.search.length > 0;
    const hasCleanPath = /^\/[a-zA-Z0-9\-_\/]*$/.test(path);
    const isShort = path.length <= 100;
    
    return {
      id: 'url_structure',
      name: '의미 있는 정적 URL 사용 여부',
      status: hasCleanPath && isShort && !hasParameters ? 'pass' : 'warning',
      score: hasCleanPath && isShort && !hasParameters ? 3 : 1,
      maxScore: 3,
      message: `URL 구조: ${hasCleanPath ? '깔끔함' : '복잡함'}, 길이: ${path.length}자`,
      details: hasParameters ? '쿼리 파라미터 있음' : '정적 URL',
      solution: '의미 있고 읽기 쉬운 URL 구조를 사용하세요.',
      priority: 'medium'
    };
  }

  private checkSiteStructureSimplicity(url: string): SEOCheckResult {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(segment => segment.length > 0);
    const depth = pathSegments.length;
    
    return {
      id: 'site_structure_simplicity',
      name: '사이트 구조 단순성',
      status: depth <= 3 ? 'pass' : depth <= 5 ? 'warning' : 'fail',
      score: depth <= 3 ? 2 : depth <= 5 ? 1 : 0,
      maxScore: 2,
      message: `페이지 깊이: ${depth}단계`,
      solution: '사이트 깊이를 3단계 이하로 유지하세요.',
      priority: 'medium'
    };
  }

  private checkPageDepth(url: string): SEOCheckResult {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(segment => segment.length > 0);
    const depth = pathSegments.length;
    
    return {
      id: 'page_depth',
      name: '페이지 Depth 과도 여부',
      status: depth <= 3 ? 'pass' : depth <= 4 ? 'warning' : 'fail',
      score: depth <= 3 ? 2 : depth <= 4 ? 1 : 0,
      maxScore: 2,
      message: `현재 깊이: ${depth}단계 (${pathSegments.join(' > ')})`,
      solution: '홈페이지에서 3클릭 이내로 모든 페이지에 접근 가능하도록 하세요.',
      priority: 'low'
    };
  }

  private checkBrokenLinks(html: string): SEOCheckResult {
    // 간단한 링크 검사 (실제로는 각 링크를 확인해야 함)
    const allLinks = html.match(/<a[^>]*href=['"]\s*[^'"]*['"]/gi) || [];
    const suspiciousLinks = allLinks.filter(link => 
      link.includes('href=""') || 
      link.includes('href="#"') ||
      link.includes('href="javascript:')
    );
    
    const brokenLinkRatio = allLinks.length > 0 ? suspiciousLinks.length / allLinks.length : 0;
    
    return {
      id: 'broken_links',
      name: '링크 오류 여부 (404 링크 등)',
      status: brokenLinkRatio === 0 ? 'pass' : brokenLinkRatio < 0.1 ? 'warning' : 'fail',
      score: brokenLinkRatio === 0 ? 3 : brokenLinkRatio < 0.1 ? 2 : 0,
      maxScore: 3,
      message: `전체 링크 ${allLinks.length}개 중 의심스러운 링크 ${suspiciousLinks.length}개`,
      solution: '깨진 링크를 정기적으로 점검하고 수정하세요.',
      priority: 'medium'
    };
  }

  private checkRobotsTxt(data: CrawledPageData): SEOCheckResult {
    const hasRobotsTxt = !!data.robotsTxt;
    const isBlocked = hasRobotsTxt && data.robotsTxt!.includes('Disallow: /');
    
    return {
      id: 'robots_txt_allows',
      name: 'robots.txt 수집 허용 여부',
      status: hasRobotsTxt && !isBlocked ? 'pass' : isBlocked ? 'fail' : 'warning',
      score: hasRobotsTxt && !isBlocked ? 5 : isBlocked ? 0 : 2,
      maxScore: 5,
      message: hasRobotsTxt 
        ? isBlocked 
          ? 'robots.txt에서 사이트 전체를 차단하고 있습니다'
          : 'robots.txt가 적절히 설정되어 있습니다'
        : 'robots.txt 파일이 없습니다',
      solution: 'robots.txt 파일에서 해당 페이지의 수집을 허용하도록 설정하세요.',
      priority: isBlocked ? 'high' : 'medium'
    };
  }

  private checkSitemapXml(data: CrawledPageData): SEOCheckResult {
    const hasSitemap = !!data.sitemapXml;
    const isValidXml = hasSitemap && data.sitemapXml!.includes('<urlset');
    
    return {
      id: 'sitemap_xml_exists',
      name: 'sitemap.xml 제출 여부',
      status: isValidXml ? 'pass' : hasSitemap ? 'warning' : 'fail',
      score: isValidXml ? 4 : hasSitemap ? 2 : 0,
      maxScore: 4,
      message: isValidXml 
        ? 'sitemap.xml이 올바르게 설정되어 있습니다'
        : hasSitemap 
          ? 'sitemap.xml 파일이 있지만 형식이 올바르지 않을 수 있습니다'
          : 'sitemap.xml 파일이 없습니다',
      solution: '사이트맵을 생성하여 robots.txt에 등록하고 네이버 웹마스터도구에 제출하세요.',
      priority: 'high'
    };
  }

  private checkCanonicalTag(html: string): SEOCheckResult {
    const canonicalMatch = html.match(/<link[^>]*rel=['"]*canonical['"]*[^>]*href=['"]*([^'"]*)['"]/i);
    const hasCanonical = !!canonicalMatch;
    
    return {
      id: 'canonical_tag',
      name: 'canonical 태그 설정 여부',
      status: hasCanonical ? 'pass' : 'warning',
      score: hasCanonical ? 4 : 2,
      maxScore: 4,
      message: hasCanonical 
        ? `Canonical URL이 설정되어 있습니다: ${canonicalMatch![1]}`
        : 'Canonical 태그가 없습니다',
      solution: '<link rel="canonical" href="정규 URL"> 태그를 추가하세요.',
      priority: 'medium'
    };
  }

  private getStatusCodeDescription(code: number): string {
    const descriptions: { [key: number]: string } = {
      200: '정상 응답',
      301: '영구 이동',
      302: '임시 이동',
      404: '페이지를 찾을 수 없음',
      500: '서버 내부 오류',
      503: '서비스 이용 불가'
    };
    return descriptions[code] || '알 수 없는 상태 코드';
  }
} 