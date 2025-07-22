import { CrawledPageData } from '../types';

export class WebCrawler {
  private timeout: number = 10000; // 10초 타임아웃
  private userAgent: string = 'Mozilla/5.0 (compatible; NaverSEOChecker/1.0; +https://example.com/bot)';

  async crawl(url: string): Promise<CrawledPageData> {
    const startTime = Date.now();

    try {
      // fetch로 페이지 크롤링
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      const loadTime = Date.now() - startTime;
      const size = new Blob([html]).size;

      // 응답 헤더 수집
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      // robots.txt와 sitemap.xml 확인
      const robotsTxt = await this.fetchRobotsTxt(url);
      const sitemapXml = await this.fetchSitemapXml(url);

      return {
        url,
        html,
        statusCode: response.status,
        headers,
        loadTime,
        size,
        robotsTxt,
        sitemapXml,
        crawledAt: new Date()
      };

    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new Error(`페이지 로딩 시간 초과 (${this.timeout}ms)`);
      }
      
      throw new Error(`크롤링 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  private async fetchRobotsTxt(url: string): Promise<string | undefined> {
    try {
      const robotsUrl = new URL('/robots.txt', url).toString();
      const response = await fetch(robotsUrl, {
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      // robots.txt 없음은 정상적인 경우
      console.log('robots.txt not found or accessible');
    }
    
    return undefined;
  }

  private async fetchSitemapXml(url: string): Promise<string | undefined> {
    try {
      const sitemapUrl = new URL('/sitemap.xml', url).toString();
      const response = await fetch(sitemapUrl, {
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      // sitemap.xml 없음은 정상적인 경우
      console.log('sitemap.xml not found or accessible');
    }
    
    return undefined;
  }

  // 추가 유틸리티 메서드들
  async checkUrl(url: string): Promise<{ accessible: boolean; statusCode?: number; error?: string }> {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: { 'User-Agent': this.userAgent },
        signal: AbortSignal.timeout(5000)
      });

      return {
        accessible: response.ok,
        statusCode: response.status
      };
    } catch (error) {
      return {
        accessible: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      };
    }
  }

  async fetchMultipleUrls(urls: string[]): Promise<{ url: string; data?: CrawledPageData; error?: string }[]> {
    const promises = urls.map(async (url) => {
      try {
        const data = await this.crawl(url);
        return { url, data };
      } catch (error) {
        return { 
          url, 
          error: error instanceof Error ? error.message : '알 수 없는 오류' 
        };
      }
    });

    return await Promise.allSettled(promises).then(results => 
      results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return { 
            url: urls[index], 
            error: result.reason?.message || '크롤링 실패' 
          };
        }
      })
    );
  }
} 