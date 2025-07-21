import { CrawledData } from '../types';

export class MetaAnalyzer {
  
  async checkTitleTag(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const titleMatch = data.html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const hasTitle = titleMatch && titleMatch[1]?.trim();
    
    return {
      passed: !!hasTitle,
      message: hasTitle ? `제목 태그가 존재합니다: "${titleMatch![1].trim()}"` : '제목 태그가 없습니다.',
      details: { title: hasTitle ? titleMatch![1].trim() : null }
    };
  }

  async checkMetaDescription(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const descMatch = data.html.match(/<meta[^>]*name=['"]*description['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
    const hasDescription = descMatch && descMatch[1]?.trim();
    
    return {
      passed: !!hasDescription,
      message: hasDescription ? `메타 설명이 존재합니다: "${descMatch![1].trim()}"` : '메타 설명이 없습니다.',
      details: { description: hasDescription ? descMatch![1].trim() : null }
    };
  }

  async checkCharsetMeta(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const charsetMatch = data.html.match(/<meta[^>]*charset=['"]*([^'"]*)['"]*[^>]*>/i);
    const hasCharset = charsetMatch && charsetMatch[1]?.trim();
    
    return {
      passed: !!hasCharset,
      message: hasCharset ? `문자 인코딩이 설정되어 있습니다: ${charsetMatch![1].trim()}` : '문자 인코딩 설정이 없습니다.',
      details: { charset: hasCharset ? charsetMatch![1].trim() : null }
    };
  }

  async checkH1Tag(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const h1Matches = data.html.match(/<h1[^>]*>([^<]*)<\/h1>/gi);
    const h1Count = h1Matches ? h1Matches.length : 0;
    const isValid = h1Count === 1;
    
    let message = '';
    if (h1Count === 0) {
      message = 'H1 태그가 없습니다.';
    } else if (h1Count === 1) {
      const h1Text = h1Matches![0].replace(/<[^>]*>/g, '').trim();
      message = `H1 태그가 적절히 설정되어 있습니다: "${h1Text}"`;
    } else {
      message = `H1 태그가 ${h1Count}개 있습니다. 하나만 사용해야 합니다.`;
    }
    
    return {
      passed: isValid,
      message,
      details: { h1Count, h1Tags: h1Matches }
    };
  }

  async checkLangAttribute(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const langMatch = data.html.match(/<html[^>]*lang=['"]*([^'"]*)['"]*[^>]*>/i);
    const hasLang = langMatch && langMatch[1]?.trim();
    
    return {
      passed: !!hasLang,
      message: hasLang ? `언어 속성이 설정되어 있습니다: ${langMatch![1].trim()}` : 'HTML 언어 속성이 없습니다.',
      details: { lang: hasLang ? langMatch![1].trim() : null }
    };
  }

  async checkSnsMetaTags(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const ogTitleMatch = data.html.match(/<meta[^>]*property=['"]*og:title['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
    const ogDescMatch = data.html.match(/<meta[^>]*property=['"]*og:description['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
    const ogImageMatch = data.html.match(/<meta[^>]*property=['"]*og:image['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
    
    const ogTags = [ogTitleMatch, ogDescMatch, ogImageMatch].filter(Boolean);
    const hasBasicOgTags = ogTags.length >= 2;
    
    return {
      passed: hasBasicOgTags,
      message: hasBasicOgTags ? `SNS 메타태그가 설정되어 있습니다 (${ogTags.length}/3개)` : 'SNS 메타태그(Open Graph)가 부족합니다.',
      details: {
        ogTitle: ogTitleMatch?.[1],
        ogDescription: ogDescMatch?.[1],
        ogImage: ogImageMatch?.[1]
      }
    };
  }

  async checkTitleLength(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const titleMatch = data.html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (!titleMatch || !titleMatch[1]) {
      return {
        passed: false,
        message: '제목 태그가 없어 길이를 확인할 수 없습니다.',
        details: { length: 0 }
      };
    }
    
    const titleLength = titleMatch[1].trim().length;
    const isOptimal = titleLength >= 30 && titleLength <= 60;
    
    let message = '';
    if (titleLength < 30) {
      message = `제목이 너무 짧습니다 (${titleLength}자). 30-60자 권장.`;
    } else if (titleLength > 60) {
      message = `제목이 너무 깁니다 (${titleLength}자). 30-60자 권장.`;
    } else {
      message = `제목 길이가 적절합니다 (${titleLength}자).`;
    }
    
    return {
      passed: isOptimal,
      message,
      details: { length: titleLength, title: titleMatch[1].trim() }
    };
  }

  async checkMetaDescriptionLength(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const descMatch = data.html.match(/<meta[^>]*name=['"]*description['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
    if (!descMatch || !descMatch[1]) {
      return {
        passed: false,
        message: '메타 설명이 없어 길이를 확인할 수 없습니다.',
        details: { length: 0 }
      };
    }
    
    const descLength = descMatch[1].trim().length;
    const isOptimal = descLength >= 120 && descLength <= 160;
    
    let message = '';
    if (descLength < 120) {
      message = `메타 설명이 너무 짧습니다 (${descLength}자). 120-160자 권장.`;
    } else if (descLength > 160) {
      message = `메타 설명이 너무 깁니다 (${descLength}자). 120-160자 권장.`;
    } else {
      message = `메타 설명 길이가 적절합니다 (${descLength}자).`;
    }
    
    return {
      passed: isOptimal,
      message,
      details: { length: descLength, description: descMatch[1].trim() }
    };
  }

  async checkViewportMeta(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const viewportMatch = data.html.match(/<meta[^>]*name=['"]*viewport['"]*[^>]*content=['"]*([^'"]*)['"]*[^>]*>/i);
    const hasViewport = viewportMatch && viewportMatch[1]?.trim();
    
    return {
      passed: !!hasViewport,
      message: hasViewport ? `뷰포트 메타태그가 설정되어 있습니다: ${viewportMatch![1].trim()}` : '뷰포트 메타태그가 없습니다.',
      details: { viewport: hasViewport ? viewportMatch![1].trim() : null }
    };
  }
} 