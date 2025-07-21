import { CrawledData } from '../types';

export class PerformanceAnalyzer {

  async checkMobileOptimization(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const viewportMatch = data.html.match(/<meta[^>]*name=['"]*viewport['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
    const hasViewport = !!viewportMatch;
    const hasDeviceWidth = hasViewport && viewportMatch[1].includes('width=device-width');
    
    // CSS 미디어 쿼리 확인
    const hasMediaQueries = data.html.includes('@media') || data.html.includes('max-width') || data.html.includes('min-width');
    
    // 반응형 클래스 확인
    const hasResponsiveClasses = /class=['"]*[^'"]*(?:responsive|mobile|tablet|desktop|sm-|md-|lg-|xl-)[^'"]*['"]*/.test(data.html);
    
    const mobileOptimizationScore = (hasDeviceWidth ? 1 : 0) + (hasMediaQueries ? 1 : 0) + (hasResponsiveClasses ? 1 : 0);
    const isMobileOptimized = mobileOptimizationScore >= 2;
    
    return {
      passed: isMobileOptimized,
      message: isMobileOptimized ? '모바일 최적화가 적용되어 있습니다.' : '모바일 최적화가 부족합니다.',
      details: { 
        hasViewport, 
        hasDeviceWidth, 
        hasMediaQueries, 
        hasResponsiveClasses,
        mobileOptimizationScore 
      }
    };
  }

  async checkPageLoadingSpeed(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const loadTime = data.loadTime;
    const pageSize = data.size;
    
    // 로딩 속도 기준 (밀리초)
    const isGoodSpeed = loadTime < 3000; // 3초 이하
    const isAcceptableSpeed = loadTime < 5000; // 5초 이하
    
    // 페이지 크기 기준 (바이트)
    const isGoodSize = pageSize < 1024 * 1024; // 1MB 이하
    const isAcceptableSize = pageSize < 3 * 1024 * 1024; // 3MB 이하
    
    const speedGrade = isGoodSpeed ? 'Good' : isAcceptableSpeed ? 'Needs Improvement' : 'Poor';
    const sizeGrade = isGoodSize ? 'Good' : isAcceptableSize ? 'Needs Improvement' : 'Poor';
    
    const overallGood = isGoodSpeed && isGoodSize;
    
    return {
      passed: overallGood,
      message: `로딩 시간: ${loadTime}ms (${speedGrade}), 페이지 크기: ${Math.round(pageSize / 1024)}KB (${sizeGrade})`,
      details: { 
        loadTime, 
        pageSize, 
        speedGrade, 
        sizeGrade,
        isGoodSpeed,
        isGoodSize 
      }
    };
  }

  async checkAmpImplementation(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const hasAmpHtml = data.html.includes('⚡') || data.html.includes('amp') || data.html.includes('AMP');
    const hasAmpScript = data.html.includes('https://cdn.ampproject.org') || data.html.includes('amp-script');
    const hasAmpBoilerplate = data.html.includes('amp-boilerplate') || data.html.includes('amp-custom');
    
    const ampScore = (hasAmpHtml ? 1 : 0) + (hasAmpScript ? 1 : 0) + (hasAmpBoilerplate ? 1 : 0);
    const hasAmp = ampScore >= 2;
    
    return {
      passed: hasAmp,
      message: hasAmp ? 'AMP가 구현되어 있습니다.' : 'AMP가 구현되지 않았습니다.',
      details: { hasAmpHtml, hasAmpScript, hasAmpBoilerplate, ampScore }
    };
  }

  async checkImageOptimization(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const imgTags = data.html.match(/<img[^>]*>/gi) || [];
    const totalImages = imgTags.length;
    
    if (totalImages === 0) {
      return {
        passed: true,
        message: '이미지가 없습니다.',
        details: { totalImages: 0 }
      };
    }
    
    // WebP 이미지 확인
    const webpImages = imgTags.filter(img => img.includes('.webp')).length;
    
    // 이미지 크기 속성 확인
    const imagesWithSize = imgTags.filter(img => img.includes('width=') && img.includes('height=')).length;
    
    // 지연 로딩 확인
    const lazyImages = imgTags.filter(img => img.includes('loading="lazy"') || img.includes('data-src')).length;
    
    // 최적화 점수 계산
    const webpRatio = webpImages / totalImages;
    const sizeRatio = imagesWithSize / totalImages;
    const lazyRatio = lazyImages / totalImages;
    
    const optimizationScore = (webpRatio * 0.4) + (sizeRatio * 0.3) + (lazyRatio * 0.3);
    const isOptimized = optimizationScore > 0.6;
    
    return {
      passed: isOptimized,
      message: `이미지 최적화: ${Math.round(optimizationScore * 100)}% (WebP: ${webpImages}/${totalImages}, 크기 속성: ${imagesWithSize}/${totalImages}, 지연 로딩: ${lazyImages}/${totalImages})`,
      details: { 
        totalImages, 
        webpImages, 
        imagesWithSize, 
        lazyImages, 
        optimizationScore 
      }
    };
  }

  async checkCoreWebVitals(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    // 실제 Core Web Vitals는 브라우저에서 측정해야 하므로 여기서는 추정치 사용
    const loadTime = data.loadTime;
    const pageSize = data.size;
    
    // LCP (Largest Contentful Paint) 추정
    const estimatedLCP = Math.max(loadTime * 0.7, 1500);
    const lcpGood = estimatedLCP < 2500;
    const lcpNeedsImprovement = estimatedLCP < 4000;
    
    // FID (First Input Delay) 추정 - 페이지 복잡도 기반
    const jsScripts = (data.html.match(/<script[^>]*>/gi) || []).length;
    const estimatedFID = Math.min(jsScripts * 10, 300);
    const fidGood = estimatedFID < 100;
    
    // CLS (Cumulative Layout Shift) 추정 - 이미지와 광고 기반
    const imgTags = (data.html.match(/<img[^>]*>/gi) || []).length;
    const imagesWithoutSize = imgTags - (data.html.match(/<img[^>]*width=[^>]*height=[^>]*>/gi) || []).length;
    const estimatedCLS = Math.min(imagesWithoutSize * 0.05, 0.25);
    const clsGood = estimatedCLS < 0.1;
    
    const allVitalsGood = lcpGood && fidGood && clsGood;
    const vitalsScore = (lcpGood ? 1 : 0) + (fidGood ? 1 : 0) + (clsGood ? 1 : 0);
    
    return {
      passed: allVitalsGood,
      message: `Core Web Vitals 추정 점수: ${vitalsScore}/3 (LCP: ${Math.round(estimatedLCP)}ms, FID: ${Math.round(estimatedFID)}ms, CLS: ${estimatedCLS.toFixed(2)})`,
      details: { 
        estimatedLCP, 
        estimatedFID, 
        estimatedCLS, 
        lcpGood, 
        fidGood, 
        clsGood,
        vitalsScore 
      }
    };
  }

  async checkCompressionEnabled(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const headers = data.headers;
    const contentEncoding = headers['content-encoding'] || headers['Content-Encoding'] || '';
    
    const hasGzip = contentEncoding.includes('gzip');
    const hasBrotli = contentEncoding.includes('br');
    const hasCompression = hasGzip || hasBrotli;
    
    const compressionType = hasBrotli ? 'Brotli' : hasGzip ? 'Gzip' : 'None';
    
    return {
      passed: hasCompression,
      message: hasCompression ? `압축이 활성화되어 있습니다 (${compressionType})` : '압축이 활성화되지 않았습니다.',
      details: { hasGzip, hasBrotli, compressionType, contentEncoding }
    };
  }

  async checkCachingPolicy(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const headers = data.headers;
    const cacheControl = headers['cache-control'] || headers['Cache-Control'] || '';
    const expires = headers['expires'] || headers['Expires'] || '';
    const etag = headers['etag'] || headers['ETag'] || '';
    const lastModified = headers['last-modified'] || headers['Last-Modified'] || '';
    
    const hasCacheControl = cacheControl.length > 0;
    const hasExpires = expires.length > 0;
    const hasETag = etag.length > 0;
    const hasLastModified = lastModified.length > 0;
    
    const cachingScore = (hasCacheControl ? 2 : 0) + (hasExpires ? 1 : 0) + (hasETag ? 1 : 0) + (hasLastModified ? 1 : 0);
    const hasGoodCaching = cachingScore >= 3;
    
    return {
      passed: hasGoodCaching,
      message: hasGoodCaching ? '캐싱 정책이 잘 설정되어 있습니다.' : '캐싱 정책을 개선할 수 있습니다.',
      details: { 
        hasCacheControl, 
        hasExpires, 
        hasETag, 
        hasLastModified, 
        cachingScore,
        cacheControl: cacheControl.substring(0, 100)
      }
    };
  }

  async checkSsrJavascript(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const html = data.html;
    
    // JavaScript 프레임워크 감지
    const hasReact = html.includes('react') || html.includes('React');
    const hasVue = html.includes('vue') || html.includes('Vue');
    const hasAngular = html.includes('angular') || html.includes('Angular');
    const hasNext = html.includes('__NEXT_DATA__') || html.includes('_next');
    const hasNuxt = html.includes('__NUXT__') || html.includes('nuxt');
    
    // SSR 여부 판단
    const hasPrerenderedContent = html.includes('<div id="root">') && html.match(/<div id="root">[^<]/);
    const hasServerSideData = html.includes('window.__INITIAL_STATE__') || html.includes('__NEXT_DATA__') || html.includes('__NUXT__');
    
    // JavaScript 없이도 콘텐츠가 있는지 확인
    const textContent = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]*>/g, ' ').trim();
    const hasContentWithoutJS = textContent.length > 500;
    
    const ssrScore = (hasPrerenderedContent ? 1 : 0) + (hasServerSideData ? 1 : 0) + (hasContentWithoutJS ? 1 : 0);
    const hasSsr = ssrScore >= 2;
    
    return {
      passed: hasSsr,
      message: hasSsr ? 'JavaScript SSR 처리가 적절합니다.' : 'JavaScript SSR 처리를 개선할 수 있습니다.',
      details: { 
        hasReact, 
        hasVue, 
        hasAngular, 
        hasNext, 
        hasNuxt,
        hasPrerenderedContent,
        hasServerSideData,
        hasContentWithoutJS,
        ssrScore,
        contentLength: textContent.length
      }
    };
  }
} 