import { NextRequest, NextResponse } from "next/server";
import { SEOAnalysisData, ImprovementTip } from "@/app/seo-checker/types";

// HTML 파싱을 위한 고도화된 함수들
function extractMetaContent(html: string, name: string): string | null {
  const regex = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

// 콘텐츠 품질 분석 함수들
function analyzeContentQuality(html: string): any {
  // 텍스트 콘텐츠 추출 (HTML 태그 제거)
  const textContent = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(/\s+/).length;
  
  // 가독성 분석 (간단한 버전)
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, sentence) => 
    sum + sentence.split(/\s+/).length, 0) / sentences.length;
  
  let readabilityLevel = "보통";
  let readabilityScore = 70;
  
  if (avgSentenceLength < 15) {
    readabilityLevel = "쉬움";
    readabilityScore = 90;
  } else if (avgSentenceLength > 25) {
    readabilityLevel = "어려움";
    readabilityScore = 50;
  }
  
  // 키워드 밀도 분석
  const words = textContent.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    if (word.length > 2) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  const mainKeywords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
  
  // 콘텐츠 구조 분석
  const paragraphs = html.match(/<p[^>]*>.*?<\/p>/gi) || [];
  const hasIntroduction = /(소개|개요|서론|intro|introduction)/i.test(textContent.substring(0, 500));
  const hasConclusion = /(결론|마무리|요약|conclusion|summary)/i.test(textContent.substring(textContent.length - 500));
  
  // 멀티미디어 분석
  const images = (html.match(/<img[^>]*>/gi) || []).length;
  const videos = (html.match(/<video[^>]*>/gi) || []).length;
  const iframes = (html.match(/<iframe[^>]*>/gi) || []).length;
  
  return {
    wordCount,
    readability: {
      score: readabilityScore,
      level: readabilityLevel,
      details: `평균 문장 길이: ${avgSentenceLength.toFixed(1)}단어`
    },
    keywordDensity: {
      score: mainKeywords.length > 0 ? 80 : 40,
      mainKeywords,
      density: wordFreq
    },
    contentStructure: {
      score: (hasIntroduction ? 30 : 0) + (hasConclusion ? 30 : 0) + (paragraphs.length > 5 ? 40 : 20),
      hasIntroduction,
      hasConclusion,
      paragraphCount: paragraphs.length,
      averageParagraphLength: paragraphs.length > 0 ? wordCount / paragraphs.length : 0
    },
    multimedia: {
      score: Math.min(100, (images * 10) + (videos * 20) + (iframes * 15)),
      images,
      videos,
      infographics: iframes
    },
    freshness: {
      score: 80, // 기본 점수
      isRecent: true
    }
  };
}

// 네이버 최적화 분석
function analyzeNaverOptimization(html: string, url: string): any {
  const naverBlog = /blog\.naver\.com/i.test(html) || /blog\.naver\.com/i.test(url);
  const naverCafe = /cafe\.naver\.com/i.test(html) || /cafe\.naver\.com/i.test(url);
  const naverKnowledge = /kin\.naver\.com/i.test(html) || /kin\.naver\.com/i.test(url);
  const naverNews = /news\.naver\.com/i.test(html) || /news\.naver\.com/i.test(url);
  
  return {
    naverBlog: {
      exists: naverBlog,
      score: naverBlog ? 100 : 0
    },
    naverCafe: {
      exists: naverCafe,
      score: naverCafe ? 100 : 0
    },
    naverKnowledge: {
      exists: naverKnowledge,
      score: naverKnowledge ? 100 : 0
    },
    naverNews: {
      exists: naverNews,
      score: naverNews ? 100 : 0
    }
  };
}

// 구조화된 데이터 분석
function analyzeStructuredData(html: string): any {
  const schemaTypes: string[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  const detailedSchemas: any[] = [];
  
  // JSON-LD 스키마 검출 및 분석
  const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gi);
  if (jsonLdMatches) {
    jsonLdMatches.forEach((match, index) => {
      try {
        const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
        const schema = JSON.parse(jsonContent);
        
        if (schema['@type']) {
          const schemaType = schema['@type'];
          schemaTypes.push(schemaType);
          
          // 상세 스키마 분석
          const schemaAnalysis = analyzeSchemaType(schema, schemaType);
          detailedSchemas.push({
            type: schemaType,
            analysis: schemaAnalysis
          });
          
          // 오류 및 경고 추가
          if (schemaAnalysis.errors.length > 0) {
            errors.push(...schemaAnalysis.errors.map(e => `${schemaType}: ${e}`));
          }
          if (schemaAnalysis.warnings.length > 0) {
            warnings.push(...schemaAnalysis.warnings.map(w => `${schemaType}: ${w}`));
          }
        }
      } catch (e) {
        errors.push(`JSON-LD 파싱 오류 (스크립트 ${index + 1})`);
      }
    });
  }
  
  // 마이크로데이터 검출 및 분석
  const microdataMatches = html.match(/itemtype=["']([^"']*)["']/gi);
  if (microdataMatches) {
    microdataMatches.forEach(match => {
      const type = match.replace(/itemtype=["']/, '').replace(/["']/, '');
      schemaTypes.push(type);
      
      // 마이크로데이터 기본 분석
      const schemaAnalysis = analyzeMicrodataType(type);
      detailedSchemas.push({
        type: type,
        analysis: schemaAnalysis
      });
    });
  }
  
  // RDFa 검출
  const rdfaMatches = html.match(/vocab=["']([^"']*)["']/gi);
  if (rdfaMatches) {
    rdfaMatches.forEach(match => {
      const vocab = match.replace(/vocab=["']/, '').replace(/["']/, '');
      schemaTypes.push(`RDFa: ${vocab}`);
    });
  }
  
  // 점수 계산
  let score = 0;
  if (schemaTypes.length > 0) {
    score += 30; // 기본 점수
    if (detailedSchemas.length > 0) score += 20; // 상세 분석 점수
    if (errors.length === 0) score += 30; // 오류 없음
    if (warnings.length === 0) score += 20; // 경고 없음
  } else {
    // 구조화된 데이터가 없으면 0점
    score = 0;
  }
  
  return {
    exists: schemaTypes.length > 0,
    score: Math.min(100, score),
    types: schemaTypes,
    errors: schemaTypes.length === 0 ? ['구조화된 데이터가 발견되지 않았습니다'] : errors,
    warnings,
    detailedSchemas,
    // 새로운 분석 결과
    quality: {
      score: schemaTypes.length > 0 ? calculateSchemaQuality(detailedSchemas) : 0,
      completeness: schemaTypes.length > 0 ? calculateCompleteness(detailedSchemas) : 0,
      validity: schemaTypes.length > 0 ? calculateValidity(errors, warnings) : 0
    },
    // 검색엔진 최적화
    seoOptimization: {
      richSnippets: checkRichSnippets(detailedSchemas),
      socialMedia: checkSocialMediaIntegration(detailedSchemas),
      localBusiness: checkLocalBusinessSchema(detailedSchemas)
    }
  };
}

// 스키마 타입별 상세 분석
function analyzeSchemaType(schema: any, type: string): any {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 필수 속성 검사
  const requiredProps = getRequiredProperties(type);
  requiredProps.forEach(prop => {
    if (!schema[prop]) {
      errors.push(`필수 속성 누락: ${prop}`);
    }
  });
  
  // 데이터 타입 검증
  Object.keys(schema).forEach(key => {
    const expectedType = getExpectedDataType(type, key);
    if (expectedType && typeof schema[key] !== expectedType) {
      warnings.push(`데이터 타입 불일치: ${key} (예상: ${expectedType})`);
    }
  });
  
  return { errors, warnings };
}

// 마이크로데이터 타입 분석
function analyzeMicrodataType(type: string): any {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 마이크로데이터 기본 검증
  if (!type.includes('schema.org')) {
    warnings.push('표준 스키마.org가 아닌 타입 사용');
  }
  
  return { errors, warnings };
}

// 스키마 품질 계산
function calculateSchemaQuality(schemas: any[]): number {
  if (schemas.length === 0) return 0;
  
  let totalScore = 0;
  schemas.forEach(schema => {
    const errorCount = schema.analysis.errors.length;
    const warningCount = schema.analysis.warnings.length;
    
    let schemaScore = 100;
    schemaScore -= errorCount * 20;
    schemaScore -= warningCount * 5;
    
    totalScore += Math.max(0, schemaScore);
  });
  
  return Math.round(totalScore / schemas.length);
}

// 완성도 계산
function calculateCompleteness(schemas: any[]): number {
  if (schemas.length === 0) return 0;
  
  let totalCompleteness = 0;
  schemas.forEach(schema => {
    // 스키마 타입별 완성도 기준
    const completeness = getSchemaCompleteness(schema.type);
    totalCompleteness += completeness;
  });
  
  return Math.round(totalCompleteness / schemas.length);
}

// 유효성 계산
function calculateValidity(errors: string[], warnings: string[]): number {
  let score = 100;
  score -= errors.length * 15;
  score -= warnings.length * 5;
  return Math.max(0, score);
}

// 리치 스니펫 지원 확인
function checkRichSnippets(schemas: any[]): any {
  const richSnippetTypes = ['Product', 'Review', 'Recipe', 'Event', 'Organization'];
  const supportedTypes = schemas.filter(s => richSnippetTypes.includes(s.type));
  
  return {
    supported: supportedTypes.length > 0,
    types: supportedTypes.map(s => s.type),
    score: supportedTypes.length * 20
  };
}

// 소셜 미디어 연동 확인
function checkSocialMediaIntegration(schemas: any[]): any {
  const socialTypes = ['Organization', 'Person', 'Article', 'WebPage'];
  const socialSchemas = schemas.filter(s => socialTypes.includes(s.type));
  
  return {
    integrated: socialSchemas.length > 0,
    types: socialSchemas.map(s => s.type),
    score: socialSchemas.length * 15
  };
}

// 로컬 비즈니스 스키마 확인
function checkLocalBusinessSchema(schemas: any[]): any {
  const localBusinessTypes = ['LocalBusiness', 'Restaurant', 'Store', 'Service'];
  const localSchemas = schemas.filter(s => localBusinessTypes.includes(s.type));
  
  return {
    exists: localSchemas.length > 0,
    types: localSchemas.map(s => s.type),
    score: localSchemas.length * 25
  };
}

// 필수 속성 가져오기
function getRequiredProperties(type: string): string[] {
  const requiredProps: Record<string, string[]> = {
    'Organization': ['name'],
    'WebSite': ['name', 'url'],
    'WebPage': ['name'],
    'Article': ['headline', 'author'],
    'Product': ['name'],
    'Review': ['reviewBody', 'author'],
    'LocalBusiness': ['name', 'address']
  };
  
  return requiredProps[type] || [];
}

// 예상 데이터 타입 가져오기
function getExpectedDataType(type: string, property: string): string | null {
  const dataTypes: Record<string, Record<string, string>> = {
    'Organization': {
      'name': 'string',
      'url': 'string',
      'logo': 'string'
    },
    'Product': {
      'name': 'string',
      'price': 'number',
      'description': 'string'
    }
  };
  
  return dataTypes[type]?.[property] || null;
}

// 스키마 완성도 가져오기
function getSchemaCompleteness(type: string): number {
  const completeness: Record<string, number> = {
    'Organization': 80,
    'WebSite': 70,
    'WebPage': 60,
    'Article': 75,
    'Product': 85,
    'Review': 70,
    'LocalBusiness': 90
  };
  
  return completeness[type] || 50;
}

// 보안 분석
function analyzeSecurity(html: string, url: string, headers: Headers): any {
  const https = url.startsWith('https://');
  
  // 보안 헤더 분석 (실제로는 response headers에서 확인해야 함)
  const securityHeaders = {
    'X-Frame-Options': headers.get('X-Frame-Options'),
    'X-Content-Type-Options': headers.get('X-Content-Type-Options'),
    'X-XSS-Protection': headers.get('X-XSS-Protection'),
    'Strict-Transport-Security': headers.get('Strict-Transport-Security')
  };
  
  const hasSecurityHeaders = Object.values(securityHeaders).some(header => header !== null);
  
  // 개인정보처리방침, 이용약관 링크 검출
  const privacyPolicy = /(개인정보처리방침|privacy|개인정보)/i.test(html);
  const termsOfService = /(이용약관|terms|약관)/i.test(html);
  
  return {
    score: (https ? 40 : 0) + (hasSecurityHeaders ? 30 : 0) + (privacyPolicy ? 15 : 0) + (termsOfService ? 15 : 0),
    https,
    securityHeaders: {
      exists: hasSecurityHeaders,
      score: hasSecurityHeaders ? 100 : 0,
      headers: securityHeaders
    },
    privacyPolicy: {
      exists: privacyPolicy,
      score: privacyPolicy ? 100 : 0
    },
    termsOfService: {
      exists: termsOfService,
      score: termsOfService ? 100 : 0
    }
  };
}

// 접근성 분석
function analyzeAccessibility(html: string): any {
  const ariaLabels = (html.match(/aria-label=["'][^"']*["']/gi) || []).length;
  const ariaDescribedby = (html.match(/aria-describedby=["'][^"']*["']/gi) || []).length;
  const ariaLabelledby = (html.match(/aria-labelledby=["'][^"']*["']/gi) || []).length;
  const totalAria = ariaLabels + ariaDescribedby + ariaLabelledby;
  
  // 색상 대비는 실제 CSS 분석이 필요하므로 기본 점수
  const colorContrastScore = 70;
  
  // 키보드 네비게이션 (tabindex 검출)
  const tabindex = (html.match(/tabindex=["'][^"']*["']/gi) || []).length;
  const keyboardScore = tabindex > 0 ? 80 : 60;
  
  // 스크린 리더 (alt 태그, aria 속성)
  const altTags = (html.match(/alt=["'][^"']*["']/gi) || []).length;
  const screenReaderScore = (altTags + totalAria) > 5 ? 90 : 60;
  
  return {
    score: Math.round((totalAria > 0 ? 80 : 40) + colorContrastScore + keyboardScore + screenReaderScore) / 4,
    ariaLabels: {
      exists: totalAria > 0,
      score: totalAria > 0 ? 100 : 0,
      count: totalAria
    },
    colorContrast: {
      score: colorContrastScore
    },
    keyboardNavigation: {
      score: keyboardScore
    },
    screenReader: {
      score: screenReaderScore
    }
  };
}

function extractPropertyContent(html: string, property: string): string | null {
  const regex = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractTitle(html: string): string | null {
  const regex = /<title[^>]*>([^<]*)<\/title>/i;
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

function extractHeadings(html: string, level: number): string[] {
  const regex = new RegExp(`<h${level}[^>]*>([^<]*)<\/h${level}>`, 'gi');
  const matches = html.match(regex);
  if (!matches) return [];
  
  return matches.map(match => {
    const contentMatch = match.match(new RegExp(`<h${level}[^>]*>([^<]*)<\/h${level}>`, 'i'));
    return contentMatch ? contentMatch[1].trim() : '';
  }).filter(content => content.length > 0);
}

function extractImages(html: string): { total: number; withAlt: number; withoutAlt: number } {
  const imgRegex = /<img[^>]*>/gi;
  const matches = html.match(imgRegex);
  if (!matches) return { total: 0, withAlt: 0, withoutAlt: 0 };
  
  let withAlt = 0;
  let withoutAlt = 0;
  
  matches.forEach(img => {
    const hasAlt = /alt=["'][^"']*["']/i.test(img);
    if (hasAlt) {
      withAlt++;
    } else {
      withoutAlt++;
    }
  });
  
  return { total: matches.length, withAlt, withoutAlt };
}

function extractCanonicalUrl(html: string): string | null {
  const regex = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i;
  const match = html.match(regex);
  return match ? match[1] : null;
}

function checkHtml5Doctype(html: string): boolean {
  return /<!DOCTYPE html>/i.test(html);
}

function findHtml5UnsupportedTags(html: string): string[] {
  const deprecatedTags = [
    'applet', 'basefont', 'center', 'dir', 'font', 'isindex', 'menu', 's', 'strike', 'u',
    'big', 'tt', 'frame', 'frameset', 'noframes', 'acronym', 'bgsound', 'link', 'listing',
    'nextid', 'spacer', 'xmp'
  ];
  
  const foundTags: string[] = [];
  deprecatedTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>`, 'gi');
    if (regex.test(html)) {
      foundTags.push(tag);
    }
  });
  
  return foundTags;
}

function extractFacebookOgTags(html: string): { exists: boolean; tags: any } {
  const ogTags = {
    title: extractPropertyContent(html, 'og:title'),
    description: extractPropertyContent(html, 'og:description'),
    image: extractPropertyContent(html, 'og:image'),
    url: extractPropertyContent(html, 'og:url')
  };
  
  const exists = Object.values(ogTags).some(value => value !== null);
  return { exists, tags: ogTags };
}

function extractTwitterCardTags(html: string): { exists: boolean; tags: any } {
  const twitterTags = {
    card: extractPropertyContent(html, 'twitter:card'),
    title: extractPropertyContent(html, 'twitter:title'),
    description: extractPropertyContent(html, 'twitter:description'),
    image: extractPropertyContent(html, 'twitter:image')
  };
  
  const exists = Object.values(twitterTags).some(value => value !== null);
  return { exists, tags: twitterTags };
}

function findSocialLinks(html: string): string[] {
  const socialPlatforms = [
    'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 
    'youtube.com', 'tiktok.com', 'pinterest.com', 'snapchat.com'
  ];
  
  const foundPlatforms: string[] = [];
  socialPlatforms.forEach(platform => {
    const regex = new RegExp(`https?://[^"']*${platform.replace('.', '\\.')}[^"']*`, 'gi');
    if (regex.test(html)) {
      foundPlatforms.push(platform);
    }
  });
  
  return foundPlatforms;
}

function detectGoogleAnalytics(html: string): { exists: boolean; version?: string } {
  // GA4
  if (/gtag\(['"]config['"]\s*,\s*['"][^'"]*['"]\)/i.test(html)) {
    return { exists: true, version: 'GA4' };
  }
  // Universal Analytics
  if (/ga\(['"]create['"]\s*,\s*['"][^'"]*['"]\)/i.test(html)) {
    return { exists: true, version: 'Universal Analytics' };
  }
  // Google Tag Manager
  if (/googletagmanager\.com\/gtm\.js/i.test(html)) {
    return { exists: true, version: 'Google Tag Manager' };
  }
  
  return { exists: false };
}

function detectNaverAnalytics(html: string): boolean {
  return /wcs\.naver\.net/i.test(html) || /naver\.com\/analytics/i.test(html);
}

// 점수 계산 함수들 (구글 요구사항에 맞춰 가중치 조정)
function calculateTitleScore(title: string | null): { exists: boolean; content?: string; length: number; score: number; maxLength: number } {
  const maxLength = 60;
  
  if (!title) {
    return { exists: false, length: 0, score: 0, maxLength };
  }
  
  const length = title.length;
  let score = 0;
  
  if (length > 0) score += 40; // 존재 (높은 가중치)
  if (length >= 30 && length <= 60) score += 50; // 적절한 길이 (높은 가중치)
  else if (length > 0 && length < 30) score += 25; // 짧음
  else if (length > 60) score += 10; // 길음
  
  if (title.includes('키워드') || title.includes('brand')) score += 10; // 키워드 포함
  
  return { exists: true, content: title, length, score: Math.min(score, 100), maxLength };
}

function calculateDescriptionScore(description: string | null): { exists: boolean; content?: string; length: number; score: number; maxLength: number } {
  const maxLength = 160;
  
  if (!description) {
    return { exists: false, length: 0, score: 0, maxLength };
  }
  
  const length = description.length;
  let score = 0;
  
  if (length > 0) score += 30; // 존재
  if (length >= 120 && length <= 160) score += 50; // 적절한 길이
  else if (length > 0 && length < 120) score += 25; // 짧음
  else if (length > 160) score += 10; // 길음
  
  if (description.includes('키워드') || description.includes('brand')) score += 20; // 키워드 포함
  
  return { exists: true, content: description, length, score: Math.min(score, 100), maxLength };
}

function calculateKeywordsScore(keywords: string | null): { exists: boolean; content?: string; score: number } {
  if (!keywords) {
    return { exists: false, score: 0 };
  }
  
  let score = 40; // 기본 점수
  const keywordCount = keywords.split(',').length;
  
  if (keywordCount >= 3 && keywordCount <= 10) score += 40; // 적절한 개수
  else if (keywordCount > 0) score += 20; // 존재
  
  return { exists: true, content: keywords, score: Math.min(score, 100) };
}

function calculateHeadingsScore(headings: string[], type: string): { count: number; score: number; content?: string[] } {
  const count = headings.length;
  let score = 0;
  
  if (type === 'h1') {
    if (count === 1) score = 100; // 정확히 1개 (매우 중요)
    else if (count === 0) score = 0; // 없음
    else score = 20; // 중복 (매우 낮은 점수)
  } else {
    if (count >= 2) score = 100; // 충분함
    else if (count === 1) score = 50; // 부족
    else score = 0; // 없음
  }
  
  return { count, score, content: headings };
}

function calculateImagesScore(images: { total: number; withAlt: number; withoutAlt: number }): { total: number; withAlt: number; withoutAlt: number; score: number } {
  if (images.total === 0) {
    return { ...images, score: 100 }; // 이미지가 없으면 완벽
  }
  
  const percentage = (images.withAlt / images.total) * 100;
  let score = 0;
  
  if (percentage >= 90) score = 100;
  else if (percentage >= 70) score = 70;
  else if (percentage >= 50) score = 50;
  else score = 20;
  
  return { ...images, score };
}

function calculateTechnicalScore(exists: boolean, content?: string): { exists: boolean; score: number; content?: string } {
  return { exists, score: exists ? 100 : 0, content };
}

function calculateSocialScore(og: any, twitter: any, socialLinks: string[]): { facebookOg: any; twitterCard: any; socialLinks: any } {
  return {
    facebookOg: { ...og, score: og.exists ? 100 : 0 },
    twitterCard: { ...twitter, score: twitter.exists ? 100 : 0 },
    socialLinks: { 
      exists: socialLinks.length > 0, 
      score: socialLinks.length > 0 ? 100 : 0, 
      platforms: socialLinks 
    }
  };
}

function calculateAnalyticsScore(ga: any, naver: any): { googleAnalytics: any; naverAnalytics: any } {
  return {
    googleAnalytics: { ...ga, score: ga.exists ? 100 : 0 },
    naverAnalytics: { exists: naver, score: naver ? 100 : 0 }
  };
}

// 고도화된 성능 분석
function analyzePerformance(html: string, loadTime: number, response: Response): any {
  // 기본 최적화 검사
  const minifiedCss = /\.min\.css/i.test(html);
  const minifiedJs = /\.min\.js/i.test(html);
  const compressedImages = /\.(jpg|jpeg|png|webp|avif)/i.test(html);
  const lazyLoading = /loading=["']lazy["']/i.test(html);
  
  // Core Web Vitals 시뮬레이션 (실제로는 브라우저에서 측정)
  const coreWebVitals = analyzeCoreWebVitals(html, loadTime);
  
  // 캐싱 분석
  const caching = analyzeCaching(response);
  
  // 압축 분석
  const compression = analyzeCompression(response);
  
  // 리소스 분석
  const resources = analyzeResources(html);
  
  // 서버 성능 분석
  const server = analyzeServerPerformance(loadTime, response);
  
  // 종합 점수 계산
  const overallScore = Math.round(
    (coreWebVitals.score + caching.score + compression.score + resources.score + server.score) / 5
  );
  
  return {
    loadTime,
    score: overallScore,
    optimization: {
      minifiedCss,
      minifiedJs,
      compressedImages,
      lazyLoading,
      score: (minifiedCss ? 25 : 0) + (minifiedJs ? 25 : 0) + (compressedImages ? 25 : 0) + (lazyLoading ? 25 : 0)
    },
    coreWebVitals,
    caching,
    compression,
    resources,
    server
  };
}

// Core Web Vitals 분석
function analyzeCoreWebVitals(html: string, loadTime: number): any {
  // LCP (Largest Contentful Paint) 시뮬레이션
  let lcp = loadTime * 0.8; // 일반적으로 로딩 시간의 80%
  if (lcp > 2500) lcp = 2500;
  
  // FID (First Input Delay) 시뮬레이션
  let fid = Math.random() * 100; // 0-100ms 랜덤
  if (fid > 100) fid = 100;
  
  // CLS (Cumulative Layout Shift) 시뮬레이션
  let cls = Math.random() * 0.1; // 0-0.1 랜덤
  if (cls > 0.1) cls = 0.1;
  
  // 점수 계산
  let score = 100;
  if (lcp > 2500) score -= 30;
  else if (lcp > 4000) score -= 50;
  
  if (fid > 100) score -= 20;
  else if (fid > 300) score -= 40;
  
  if (cls > 0.1) score -= 30;
  else if (cls > 0.25) score -= 50;
  
  return {
    lcp: Math.round(lcp),
    fid: Math.round(fid),
    cls: Math.round(cls * 1000) / 1000,
    score: Math.max(0, score)
  };
}

// 캐싱 분석
function analyzeCaching(response: Response): any {
  const headers = response.headers;
  
  // 브라우저 캐시
  const cacheControl = headers.get('Cache-Control');
  const expires = headers.get('Expires');
  const browserCache = !!(cacheControl || expires);
  
  // 서버 캐시
  const etag = headers.get('ETag');
  const lastModified = headers.get('Last-Modified');
  const serverCache = !!(etag || lastModified);
  
  // CDN 사용
  const cdnUsage = /cloudflare|akamai|fastly|aws|cdn/i.test(response.url);
  
  const score = (browserCache ? 33 : 0) + (serverCache ? 33 : 0) + (cdnUsage ? 34 : 0);
  
  return {
    browserCache,
    serverCache,
    cdnUsage,
    score
  };
}

// 압축 분석
function analyzeCompression(response: Response): any {
  const headers = response.headers;
  
  // Gzip 압축
  const contentEncoding = headers.get('Content-Encoding');
  const gzipEnabled = contentEncoding === 'gzip';
  
  // Brotli 압축
  const brotliEnabled = contentEncoding === 'br';
  
  const score = gzipEnabled ? 50 : (brotliEnabled ? 100 : 0);
  
  return {
    gzipEnabled,
    brotliEnabled,
    score
  };
}

// 리소스 분석
function analyzeResources(html: string): any {
  // 총 요청 수
  const cssRequests = (html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || []).length;
  const jsRequests = (html.match(/<script[^>]*src=["'][^"']*["'][^>]*>/gi) || []).length;
  const imageRequests = (html.match(/<img[^>]*src=["'][^"']*["'][^>]*>/gi) || []).length;
  const totalRequests = cssRequests + jsRequests + imageRequests;
  
  // 예상 총 크기 (KB)
  const totalSize = totalRequests * 50; // 평균 50KB per request
  
  // 중요 리소스 (CSS, JS)
  const criticalResources = cssRequests + jsRequests;
  
  // 점수 계산
  let score = 100;
  if (totalRequests > 20) score -= 20;
  if (totalRequests > 30) score -= 30;
  if (totalSize > 1000) score -= 20; // 1MB 이상
  if (criticalResources > 10) score -= 20;
  
  return {
    totalRequests,
    totalSize: Math.round(totalSize),
    criticalResources,
    score: Math.max(0, score)
  };
}

// 서버 성능 분석
function analyzeServerPerformance(loadTime: number, response: Response): any {
  // 응답 시간
  const responseTime = loadTime;
  
  // TTFB (Time to First Byte) 시뮬레이션
  const ttf = loadTime * 0.3; // 일반적으로 로딩 시간의 30%
  
  // 점수 계산
  let score = 100;
  if (responseTime > 2000) score -= 30;
  if (responseTime > 3000) score -= 50;
  if (ttf > 600) score -= 20;
  if (ttf > 1000) score -= 40;
  
  return {
    responseTime,
    ttf: Math.round(ttf),
    score: Math.max(0, score)
  };
}

// 고도화된 모바일 최적화 분석
function analyzeMobileOptimization(html: string, loadTime: number): any {
  // 기본 모바일 요소
  const responsive = /@media/i.test(html);
  const viewport = /viewport/i.test(html);
  const touchFriendly = /touch-action/i.test(html);
  
  // 성능 분석
  const mobilePerformance = analyzeMobilePerformance(html, loadTime);
  
  // 사용성 분석
  const usability = analyzeMobileUsability(html);
  
  // 콘텐츠 분석
  const content = analyzeMobileContent(html);
  
  // 기술적 요소 분석
  const technical = analyzeMobileTechnical(html);
  
  // 종합 점수 계산
  const overallScore = Math.round(
    (mobilePerformance.score + usability.score + content.score + technical.score) / 4
  );
  
  return {
    responsive,
    viewport,
    touchFriendly,
    score: overallScore,
    performance: mobilePerformance,
    usability,
    content,
    technical
  };
}

// 모바일 성능 분석
function analyzeMobilePerformance(html: string, loadTime: number): any {
  // 리소스 최적화 검사
  const minifiedCss = /\.min\.css/i.test(html);
  const minifiedJs = /\.min\.js/i.test(html);
  const compressedImages = /\.(jpg|jpeg|png|webp|avif)/i.test(html);
  const lazyLoading = /loading=["']lazy["']/i.test(html);
  
  // 로딩 시간 점수
  let loadTimeScore = 100;
  if (loadTime > 3000) loadTimeScore = 20;
  else if (loadTime > 2000) loadTimeScore = 40;
  else if (loadTime > 1000) loadTimeScore = 60;
  else if (loadTime > 500) loadTimeScore = 80;
  
  // 최적화 점수
  const optimizationScore = (minifiedCss ? 25 : 0) + 
                           (minifiedJs ? 25 : 0) + 
                           (compressedImages ? 25 : 0) + 
                           (lazyLoading ? 25 : 0);
  
  const performanceScore = Math.round((loadTimeScore + optimizationScore) / 2);
  
  return {
    loadTime,
    score: performanceScore,
    optimization: {
      minifiedCss,
      minifiedJs,
      compressedImages,
      lazyLoading,
      score: optimizationScore
    }
  };
}

// 모바일 사용성 분석
function analyzeMobileUsability(html: string): any {
  // 터치 타겟 분석
  const buttonSize = /min-width:\s*4[0-9]px|min-height:\s*4[0-9]px|width:\s*4[0-9]px|height:\s*4[0-9]px/i.test(html);
  const linkSpacing = /padding:\s*[0-9]+px|margin:\s*[0-9]+px/i.test(html);
  
  const touchTargetsScore = (buttonSize ? 50 : 0) + (linkSpacing ? 50 : 0);
  
  // 가독성 분석
  const fontSize = /font-size:\s*1[6-9]px|font-size:\s*[2-9][0-9]px/i.test(html);
  const lineHeight = /line-height:\s*1\.[2-9]|line-height:\s*[2-9][0-9]%/i.test(html);
  const colorContrast = /color:\s*#[0-9a-f]{6}|color:\s*rgb\(/i.test(html);
  
  const readabilityScore = (fontSize ? 33 : 0) + (lineHeight ? 33 : 0) + (colorContrast ? 34 : 0);
  
  // 네비게이션 분석
  const hamburgerMenu = /hamburger|menu-toggle|nav-toggle/i.test(html);
  const stickyHeader = /position:\s*sticky|position:\s*fixed/i.test(html);
  const breadcrumbs = /breadcrumb|bread-crumb/i.test(html);
  
  const navigationScore = (hamburgerMenu ? 33 : 0) + (stickyHeader ? 33 : 0) + (breadcrumbs ? 34 : 0);
  
  const usabilityScore = Math.round((touchTargetsScore + readabilityScore + navigationScore) / 3);
  
  return {
    score: usabilityScore,
    touchTargets: {
      score: touchTargetsScore,
      buttonSize,
      linkSpacing
    },
    readability: {
      score: readabilityScore,
      fontSize,
      lineHeight,
      colorContrast
    },
    navigation: {
      score: navigationScore,
      hamburgerMenu,
      stickyHeader,
      breadcrumbs
    }
  };
}

// 모바일 콘텐츠 분석
function analyzeMobileContent(html: string): any {
  // 텍스트 크기
  const textSize = /font-size:\s*1[6-9]px|font-size:\s*[2-9][0-9]px/i.test(html);
  
  // 이미지 스케일링
  const imageScaling = /max-width:\s*100%|width:\s*100%|object-fit/i.test(html);
  
  // 비디오 반응형
  const videoResponsive = /video.*responsive|video.*fluid/i.test(html);
  
  // 테이블 반응형
  const tableResponsive = /table.*responsive|overflow-x:\s*auto/i.test(html);
  
  const contentScore = (textSize ? 25 : 0) + 
                      (imageScaling ? 25 : 0) + 
                      (videoResponsive ? 25 : 0) + 
                      (tableResponsive ? 25 : 0);
  
  return {
    score: contentScore,
    textSize,
    imageScaling,
    videoResponsive,
    tableResponsive
  };
}

// 모바일 기술적 요소 분석
function analyzeMobileTechnical(html: string): any {
  // 인터스티셜 광고 없음
  const noInterstitials = !/popup|modal|overlay.*ad/i.test(html);
  
  // 가로 스크롤 없음
  const noHorizontalScroll = !/overflow-x:\s*scroll|overflow-x:\s*auto/i.test(html);
  
  // 적절한 메타 태그
  const properMetaTags = /viewport.*width.*device-width|viewport.*initial-scale/i.test(html);
  
  // AMP 지원
  const ampSupport = /amp-|⚡|amphtml/i.test(html);
  
  const technicalScore = (noInterstitials ? 25 : 0) + 
                        (noHorizontalScroll ? 25 : 0) + 
                        (properMetaTags ? 25 : 0) + 
                        (ampSupport ? 25 : 0);
  
  return {
    score: technicalScore,
    noInterstitials,
    noHorizontalScroll,
    properMetaTags,
    ampSupport
  };
}

// 개선 팁 생성 (고도화)
function generateImprovements(data: any): ImprovementTip[] {
  const improvements: ImprovementTip[] = [];
  
  // Title 개선 팁 (높은 우선순위)
  if (!data.metaData.title.exists) {
    improvements.push({
      category: 'meta',
      title: 'Title 태그 추가 (매우 중요)',
      description: '웹페이지에 title 태그가 없습니다. 검색 결과에서 표시될 제목을 추가하세요.',
      priority: 'high',
      impact: 5,
      difficulty: 'easy',
      code: '<title>페이지 제목 - 사이트명</title>'
    });
  } else if (data.metaData.title.length < 30) {
    improvements.push({
      category: 'meta',
      title: 'Title 태그 길이 개선',
      description: 'Title 태그가 너무 짧습니다. 30-60자 사이로 키워드를 포함하여 작성하세요.',
      priority: 'high',
      impact: 4,
      difficulty: 'easy'
    });
  }
  
  // Description 개선 팁
  if (!data.metaData.description.exists) {
    improvements.push({
      category: 'meta',
      title: 'Description 태그 추가',
      description: '웹페이지에 description 태그가 없습니다. 검색 결과에서 표시될 설명을 추가하세요.',
      priority: 'high',
      impact: 4,
      difficulty: 'easy',
      code: '<meta name="description" content="페이지에 대한 간단한 설명을 120-160자로 작성하세요.">'
    });
  }
  
  // H1 태그 개선 팁 (매우 중요)
  if (data.headings.h1.count === 0) {
    improvements.push({
      category: 'headings',
      title: 'H1 태그 추가 (매우 중요)',
      description: '페이지에 H1 태그가 없습니다. 페이지의 주요 제목을 H1 태그로 감싸세요.',
      priority: 'high',
      impact: 5,
      difficulty: 'easy',
      code: '<h1>페이지 주요 제목</h1>'
    });
  } else if (data.headings.h1.count > 1) {
    improvements.push({
      category: 'headings',
      title: 'H1 태그 중복 제거 (매우 중요)',
      description: '페이지에 H1 태그가 여러 개 있습니다. 하나의 H1 태그만 사용하세요.',
      priority: 'high',
      impact: 5,
      difficulty: 'medium'
    });
  }
  
  // 이미지 Alt 태그 개선 팁
  if (data.images.total > 0 && data.images.withoutAlt > 0) {
    improvements.push({
      category: 'images',
      title: '이미지 Alt 태그 추가',
      description: `${data.images.withoutAlt}개의 이미지에 Alt 태그가 없습니다. 모든 이미지에 설명적인 Alt 태그를 추가하세요.`,
      priority: 'medium',
      impact: 3,
      difficulty: 'easy',
      code: '<img src="image.jpg" alt="이미지에 대한 설명">'
    });
  }
  
  // Canonical URL 개선 팁
  if (!data.technical.canonicalUrl.exists) {
    improvements.push({
      category: 'technical',
      title: 'Canonical URL 추가',
      description: 'canonical URL이 없습니다. 중복 콘텐츠 문제를 방지하기 위해 canonical URL을 추가하세요.',
      priority: 'medium',
      impact: 4,
      difficulty: 'easy',
      code: '<link rel="canonical" href="https://example.com/page" />'
    });
  }
  
  // Facebook OG 태그 개선 팁
  if (!data.social.facebookOg.exists) {
    improvements.push({
      category: 'social',
      title: 'Facebook OG 태그 추가',
      description: 'Facebook 공유 시 최적화된 미리보기를 위해 OG 태그를 추가하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy',
      code: `<meta property="og:title" content="페이지 제목" />
<meta property="og:description" content="페이지 설명" />
<meta property="og:image" content="https://example.com/image.jpg" />
<meta property="og:url" content="https://example.com/page" />`
    });
  }
  
  // SSL 지원 개선 팁
  if (!data.technical.sslSupport.exists) {
    improvements.push({
      category: 'technical',
      title: 'SSL 인증서 설치 (매우 중요)',
      description: 'HTTPS가 지원되지 않습니다. 보안과 SEO를 위해 SSL 인증서를 설치하세요.',
      priority: 'high',
      impact: 5,
      difficulty: 'medium'
    });
  }

  // 콘텐츠 품질 개선 팁
  if (data.contentQuality.wordCount < 300) {
    improvements.push({
      category: 'content',
      title: '콘텐츠 양 증가',
      description: '콘텐츠가 너무 짧습니다. 최소 300단어 이상으로 확장하세요.',
      priority: 'high',
      impact: 4,
      difficulty: 'medium'
    });
  }

  if (data.contentQuality.readability.score < 60) {
    improvements.push({
      category: 'content',
      title: '가독성 개선',
      description: '문장이 너무 복잡합니다. 더 간단하고 이해하기 쉽게 작성하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy'
    });
  }

  if (!data.contentQuality.contentStructure.hasIntroduction) {
    improvements.push({
      category: 'content',
      title: '서론/소개 추가',
      description: '콘텐츠에 서론이나 소개 부분을 추가하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy'
    });
  }

  if (!data.contentQuality.contentStructure.hasConclusion) {
    improvements.push({
      category: 'content',
      title: '결론/마무리 추가',
      description: '콘텐츠에 결론이나 마무리 부분을 추가하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy'
    });
  }

  // 네이버 최적화 개선 팁
  if (!data.naverOptimization.naverBlog.exists) {
    improvements.push({
      category: 'naver',
      title: '네이버 블로그 연동',
      description: '네이버 블로그를 개설하여 콘텐츠를 공유하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy'
    });
  }

  if (!data.naverOptimization.naverCafe.exists) {
    improvements.push({
      category: 'naver',
      title: '네이버 카페 연동',
      description: '관련 네이버 카페에 콘텐츠를 공유하세요.',
      priority: 'low',
      impact: 2,
      difficulty: 'easy'
    });
  }

  // 구조화된 데이터 개선 팁
  if (!data.structuredData.exists) {
    improvements.push({
      category: 'technical',
      title: '구조화된 데이터 추가',
      description: 'JSON-LD 스키마를 추가하여 검색 결과를 향상시키세요.',
      priority: 'medium',
      impact: 4,
      difficulty: 'medium',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "페이지 제목",
  "description": "페이지 설명",
  "author": {
    "@type": "Person",
    "name": "작성자명"
  }
}
</script>`
    });
  }

  // 보안 개선 팁
  if (data.security.score < 60) {
    improvements.push({
      category: 'security',
      title: '보안 강화',
      description: '보안 헤더를 추가하고 개인정보처리방침을 제공하세요.',
      priority: 'high',
      impact: 4,
      difficulty: 'medium'
    });
  }

  // 접근성 개선 팁
  if (data.accessibility.score < 60) {
    improvements.push({
      category: 'accessibility',
      title: '접근성 개선',
      description: 'ARIA 라벨을 추가하고 색상 대비를 개선하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'medium'
    });
  }
  
  // 모바일 최적화 개선 팁
  if (!data.mobile.responsive) {
    improvements.push({
      category: 'mobile',
      title: '반응형 디자인 적용',
      description: '모바일 최적화가 되어있지 않습니다. 반응형 디자인을 적용하세요.',
      priority: 'high',
      impact: 4,
      difficulty: 'hard'
    });
  }
  
  if (!data.mobile.viewport) {
    improvements.push({
      category: 'mobile',
      title: 'Viewport 메타 태그 추가',
      description: 'viewport 메타 태그가 없습니다. 모바일 최적화를 위해 추가하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy',
      code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    });
  }

  if (data.mobile.performance && data.mobile.performance.loadTime > 2000) {
    improvements.push({
      category: 'mobile',
      title: '모바일 로딩 속도 개선',
      description: '모바일에서 페이지 로딩 시간을 2초 이하로 개선하세요.',
      priority: 'high',
      impact: 5,
      difficulty: 'medium'
    });
  }

  if (data.mobile.performance && !data.mobile.performance.optimization.lazyLoading) {
    improvements.push({
      category: 'mobile',
      title: '이미지 지연 로딩 적용',
      description: '모바일 성능 향상을 위해 이미지 지연 로딩을 적용하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy',
      code: '<img src="image.jpg" loading="lazy" alt="설명">'
    });
  }

  if (data.mobile.usability && !data.mobile.usability.touchTargets.buttonSize) {
    improvements.push({
      category: 'mobile',
      title: '터치 타겟 크기 개선',
      description: '모바일에서 터치하기 쉬운 버튼 크기(48px+)를 적용하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy',
      code: '.button { min-width: 48px; min-height: 48px; }'
    });
  }

  if (data.mobile.usability && !data.mobile.usability.readability.fontSize) {
    improvements.push({
      category: 'mobile',
      title: '모바일 폰트 크기 개선',
      description: '모바일에서 읽기 쉬운 폰트 크기(16px+)를 사용하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy',
      code: 'body { font-size: 16px; }'
    });
  }

  if (data.mobile.content && !data.mobile.content.imageScaling) {
    improvements.push({
      category: 'mobile',
      title: '이미지 반응형 처리',
      description: '이미지가 모바일 화면에 맞게 스케일링되도록 설정하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy',
      code: 'img { max-width: 100%; height: auto; }'
    });
  }

  if (data.mobile.technical && !data.mobile.technical.noInterstitials) {
    improvements.push({
      category: 'mobile',
      title: '인터스티셜 제거',
      description: '모바일 사용자 경험을 방해하는 팝업을 제거하세요.',
      priority: 'high',
      impact: 4,
      difficulty: 'medium'
    });
  }

  // 성능 최적화 개선 팁
  if (data.performance && data.performance.loadTime && data.performance.loadTime > 2000) {
    improvements.push({
      category: 'performance',
      title: '페이지 로딩 속도 개선',
      description: '페이지 로딩 시간이 2초를 초과합니다. 성능을 개선하세요.',
      priority: 'high',
      impact: 4,
      difficulty: 'medium'
    });
  }

  if (data.performance && data.performance.coreWebVitals && data.performance.coreWebVitals.lcp > 2500) {
    improvements.push({
      category: 'performance',
      title: 'LCP (Largest Contentful Paint) 개선',
      description: 'LCP가 2.5초를 초과합니다. 주요 콘텐츠 로딩 속도를 개선하세요.',
      priority: 'high',
      impact: 5,
      difficulty: 'medium'
    });
  }

  if (data.performance && data.performance.coreWebVitals && data.performance.coreWebVitals.fid > 100) {
    improvements.push({
      category: 'performance',
      title: 'FID (First Input Delay) 개선',
      description: 'FID가 100ms를 초과합니다. 사용자 상호작용 응답성을 개선하세요.',
      priority: 'medium',
      impact: 4,
      difficulty: 'hard'
    });
  }

  if (data.performance && data.performance.coreWebVitals && data.performance.coreWebVitals.cls > 0.1) {
    improvements.push({
      category: 'performance',
      title: 'CLS (Cumulative Layout Shift) 개선',
      description: 'CLS가 0.1을 초과합니다. 레이아웃 안정성을 개선하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'medium'
    });
  }

  if (data.performance && data.performance.optimization && !data.performance.optimization.minifiedCss) {
    improvements.push({
      category: 'performance',
      title: 'CSS 파일 압축',
      description: 'CSS 파일을 압축하여 파일 크기를 줄이세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy',
      code: '/* 빌드 시 CSS 압축 설정 */\noptimization: {\n  minimize: true\n}'
    });
  }

  if (data.performance && data.performance.optimization && !data.performance.optimization.minifiedJs) {
    improvements.push({
      category: 'performance',
      title: 'JavaScript 파일 압축',
      description: 'JavaScript 파일을 압축하여 파일 크기를 줄이세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy',
      code: '/* 빌드 시 JS 압축 설정 */\noptimization: {\n  minimize: true\n}'
    });
  }

  if (data.performance && data.performance.optimization && !data.performance.optimization.lazyLoading) {
    improvements.push({
      category: 'performance',
      title: '이미지 지연 로딩 적용',
      description: '이미지 지연 로딩을 적용하여 초기 로딩 속도를 개선하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy',
      code: '<img src="image.jpg" loading="lazy" alt="설명">'
    });
  }

  if (data.performance && data.performance.caching && !data.performance.caching.browserCache) {
    improvements.push({
      category: 'performance',
      title: '브라우저 캐시 설정',
      description: '브라우저 캐시를 설정하여 반복 방문 시 성능을 개선하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'medium',
      code: 'Cache-Control: public, max-age=31536000'
    });
  }

  if (data.performance && data.performance.compression && !data.performance.compression.gzipEnabled) {
    improvements.push({
      category: 'performance',
      title: 'Gzip 압축 활성화',
      description: 'Gzip 압축을 활성화하여 전송 크기를 줄이세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'medium',
      code: '// 서버 설정에서 Gzip 활성화\ncompress: true'
    });
  }

  if (data.performance && data.performance.resources && data.performance.resources.totalRequests > 20) {
    improvements.push({
      category: 'performance',
      title: 'HTTP 요청 수 줄이기',
      description: 'HTTP 요청 수를 줄여 페이지 로딩 속도를 개선하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'medium'
    });
  }

  if (data.performance && data.performance.server && data.performance.server.ttf > 600) {
    improvements.push({
      category: 'performance',
      title: 'TTFB (Time to First Byte) 개선',
      description: 'TTFB가 600ms를 초과합니다. 서버 응답 시간을 개선하세요.',
      priority: 'high',
      impact: 4,
      difficulty: 'hard'
    });
  }

  // 구조화된 데이터 개선 팁
  if (!data.structuredData || !data.structuredData.exists) {
    improvements.push({
      category: 'structuredData',
      title: '구조화된 데이터 추가',
      description: '구조화된 데이터가 없습니다. 검색 결과에서 리치 스니펫을 표시하기 위해 JSON-LD를 추가하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'medium',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "회사명",
  "url": "https://example.com"
}
</script>`
    });
  }

  if (data.structuredData && data.structuredData.errors && data.structuredData.errors.length > 0) {
    improvements.push({
      category: 'structuredData',
      title: '구조화된 데이터 오류 수정',
      description: '구조화된 데이터에 오류가 있습니다. JSON-LD 구문을 확인하고 수정하세요.',
      priority: 'high',
      impact: 4,
      difficulty: 'medium'
    });
  }

  if (data.structuredData && data.structuredData.quality && data.structuredData.quality.score < 70) {
    improvements.push({
      category: 'structuredData',
      title: '구조화된 데이터 품질 개선',
      description: '구조화된 데이터의 품질이 낮습니다. 필수 속성을 추가하고 데이터 타입을 확인하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'medium'
    });
  }

  if (data.structuredData && data.structuredData.seoOptimization && !data.structuredData.seoOptimization.richSnippets.supported) {
    improvements.push({
      category: 'structuredData',
      title: '리치 스니펫 지원 스키마 추가',
      description: '리치 스니펫을 지원하는 스키마가 없습니다. Product, Review, Recipe 등의 스키마를 추가하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'medium',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "제품명",
  "description": "제품 설명",
  "brand": {
    "@type": "Brand",
    "name": "브랜드명"
  }
}
</script>`
    });
  }

  if (data.structuredData && data.structuredData.seoOptimization && !data.structuredData.seoOptimization.socialMedia.integrated) {
    improvements.push({
      category: 'structuredData',
      title: '소셜 미디어 연동 스키마 추가',
      description: '소셜 미디어와 연동되는 스키마가 없습니다. Organization, Person 등의 스키마를 추가하세요.',
      priority: 'low',
      impact: 2,
      difficulty: 'easy',
      code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "조직명",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://facebook.com/example",
    "https://twitter.com/example"
  ]
}
</script>`
    });
  }
  
  // Robots.txt 개선 팁
  if (!data.technical.robotsTxt.exists) {
    improvements.push({
      category: 'technical',
      title: 'Robots.txt 파일 생성',
      description: 'robots.txt 파일이 없습니다. 검색엔진 크롤링을 최적화하기 위해 robots.txt 파일을 생성하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'easy',
      code: 'User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml'
    });
  }
  
  // Sitemap.xml 개선 팁
  if (!data.technical.sitemapXml.exists) {
    improvements.push({
      category: 'technical',
      title: 'Sitemap.xml 파일 생성',
      description: 'sitemap.xml 파일이 없습니다. 검색엔진이 모든 페이지를 발견할 수 있도록 sitemap.xml을 생성하세요.',
      priority: 'medium',
      impact: 3,
      difficulty: 'medium'
    });
  }
  
  return improvements;
}

// Google SEO 기준 통일된 점수 체계 (총 100점)
function calculateOverallScore(data: any): number {
  // Google의 실제 SEO 중요도 기준 가중치 (총합 100%)
  const weights = {
    // 1. 콘텐츠 품질 (가장 중요) - 30%
    contentQuality: 0.30,
    
    // 2. 기술적 SEO (매우 중요) - 25%
    technical: 0.25,
    
    // 3. 사용자 경험 (Core Web Vitals 포함) - 20%
    userExperience: 0.20,
    
    // 4. 메타데이터 및 구조 - 15%
    metaAndStructure: 0.15,
    
    // 5. 소셜 및 기타 - 10%
    socialAndOthers: 0.10
  };

  // 1. 콘텐츠 품질 점수 (30점 만점)
  const contentQualityScore = Math.round(
    (data.contentQuality.readability.score + 
     data.contentQuality.keywordDensity.score + 
     data.contentQuality.contentStructure.score + 
     data.contentQuality.multimedia.score + 
     data.contentQuality.freshness.score) / 5
  );

  // 2. 기술적 SEO 점수 (25점 만점)
  const technicalScore = Math.round(
    (data.technical.sslSupport.score * 0.4 +        // SSL 최우선
     data.technical.robotsTxt.score * 0.25 +        // robots.txt
     data.technical.sitemapXml.score * 0.25 +       // sitemap
     data.technical.canonicalUrl.score * 0.1) * 1.0  // canonical
  );

  // 3. 사용자 경험 점수 (20점 만점)
  const userExperienceScore = Math.round(
    (data.performance.score * 0.6 +                 // Core Web Vitals 중심
     data.mobile.score * 0.4) * 1.0                 // 모바일 최적화
  );

  // 4. 메타데이터 및 구조 점수 (15점 만점)
  const metaStructureScore = Math.round(
    (data.metaData.title.score * 0.4 +              // Title 태그 최우선
     data.metaData.description.score * 0.3 +        // Description
     data.headings.h1.score * 0.2 +                 // H1 태그
     data.images.score * 0.1) * 1.0                 // 이미지 alt
  );

  // 5. 소셜 및 기타 점수 (10점 만점)
  const socialOthersScore = Math.round(
    (data.social.facebookOg.score * 0.3 +           // Open Graph
     data.social.twitterCard.score * 0.2 +          // Twitter Card
     data.structuredData.score * 0.3 +              // 구조화된 데이터
     data.security.score * 0.1 +                    // 보안
     data.accessibility.score * 0.1) * 1.0          // 접근성
  );

  // 최종 점수 계산 (100점 만점)
  const overallScore = 
    (contentQualityScore * weights.contentQuality) +
    (technicalScore * weights.technical) +
    (userExperienceScore * weights.userExperience) +
    (metaStructureScore * weights.metaAndStructure) +
    (socialOthersScore * weights.socialAndOthers);

  return Math.round(Math.min(100, Math.max(0, overallScore)));
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: "URL이 필요합니다." }, { status: 400 });
    }
    
    // URL 유효성 검사
    let targetUrl: string;
    try {
      targetUrl = new URL(url).toString();
    } catch {
      return NextResponse.json({ error: "올바른 URL 형식이 아닙니다." }, { status: 400 });
    }
    
    // 웹페이지 가져오기 (성능 측정 포함)
    const startTime = Date.now();
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Checker/1.0)'
      }
    });
    const loadTime = Date.now() - startTime;
    
    if (!response.ok) {
      return NextResponse.json({ error: "웹페이지를 가져올 수 없습니다." }, { status: 400 });
    }
    
    const html = await response.text();
    
    // 메타데이터 추출
    const title = extractTitle(html);
    const description = extractMetaContent(html, 'description');
    const keywords = extractMetaContent(html, 'keywords');
    
    // 헤딩 추출
    const h1Headings = extractHeadings(html, 1);
    const h2Headings = extractHeadings(html, 2);
    const h3Headings = extractHeadings(html, 3);
    
    // 이미지 분석
    const images = extractImages(html);
    
    // 기술적 요소 확인
    const canonicalUrl = extractCanonicalUrl(html);
    const html5Doctype = checkHtml5Doctype(html);
    const html5UnsupportedTags = findHtml5UnsupportedTags(html);
    const robotsTxtExists = await checkFileExists(new URL('/robots.txt', targetUrl));
    const sitemapXmlExists = await checkFileExists(new URL('/sitemap.xml', targetUrl));
    const sslSupport = targetUrl.startsWith('https://');
    
    // 소셜 미디어 태그
    const facebookOg = extractFacebookOgTags(html);
    const twitterCard = extractTwitterCardTags(html);
    const socialLinks = findSocialLinks(html);
    
    // 분석 도구
    const googleAnalytics = detectGoogleAnalytics(html);
    const naverAnalytics = detectNaverAnalytics(html);
    
         // 성능 및 모바일
     const performance = analyzePerformance(html, loadTime, response);
     const mobile = analyzeMobileOptimization(html, loadTime);
    
    // 점수 계산
    const titleData = calculateTitleScore(title);
    const descriptionData = calculateDescriptionScore(description);
    const keywordsData = calculateKeywordsScore(keywords);
    const h1Data = calculateHeadingsScore(h1Headings, 'h1');
    const h2Data = calculateHeadingsScore(h2Headings, 'h2');
    const h3Data = calculateHeadingsScore(h3Headings, 'h3');
    const imagesData = calculateImagesScore(images);
    const canonicalData = calculateTechnicalScore(!!canonicalUrl, canonicalUrl || undefined);
    const html5DoctypeData = calculateTechnicalScore(html5Doctype);
    const html5UnsupportedData = { 
      count: html5UnsupportedTags.length, 
      score: html5UnsupportedTags.length === 0 ? 100 : Math.max(0, 100 - html5UnsupportedTags.length * 20),
      tags: html5UnsupportedTags
    };
    const robotsTxtData = calculateTechnicalScore(robotsTxtExists);
    const sitemapXmlData = calculateTechnicalScore(sitemapXmlExists);
    const sslData = calculateTechnicalScore(sslSupport);
    
    const socialData = calculateSocialScore(facebookOg, twitterCard, socialLinks);
    const analyticsData = calculateAnalyticsScore(googleAnalytics, naverAnalytics);
    
    // 새로운 분석 실행
    const contentQuality = analyzeContentQuality(html);
    const naverOptimization = analyzeNaverOptimization(html, targetUrl);
    const structuredData = analyzeStructuredData(html);
    const security = analyzeSecurity(html, targetUrl, response.headers);
    const accessibility = analyzeAccessibility(html);

    // 분석 결과 구성
    const analysisData: SEOAnalysisData = {
      url: targetUrl,
      timestamp: new Date().toISOString(),
      overallScore: 0, // 임시 값, 아래에서 계산
      metaData: {
        title: titleData,
        description: descriptionData,
        keywords: keywordsData
      },
      headings: {
        h1: h1Data,
        h2: h2Data,
        h3: h3Data
      },
      images: imagesData,
      technical: {
        robotsTxt: robotsTxtData,
        sitemapXml: sitemapXmlData,
        canonicalUrl: canonicalData,
        html5Doctype: html5DoctypeData,
        html5UnsupportedTags: html5UnsupportedData,
        sslSupport: sslData
      },
      social: socialData,
      analytics: analyticsData,
      performance: {
        ...performance,
        optimization: {
          minifiedCss: /\.min\.css/i.test(html),
          minifiedJs: /\.min\.js/i.test(html),
          compressedImages: /\.(jpg|jpeg|png|webp|avif)/i.test(html),
          score: 80 // 기본 점수
        }
      },
      mobile: mobile,
      contentQuality: contentQuality,
      naverOptimization: naverOptimization,
      structuredData: structuredData,
      security: security,
      accessibility: accessibility,
      improvements: generateImprovements({
        metaData: { title: titleData, description: descriptionData, keywords: keywordsData },
        headings: { h1: h1Data, h2: h2Data, h3: h3Data },
        images: imagesData,
        technical: { 
          canonicalUrl: canonicalData, 
          robotsTxt: robotsTxtData, 
          sitemapXml: sitemapXmlData,
          sslSupport: sslData
        },
        social: socialData,
        mobile: mobile,
        contentQuality: contentQuality,
        naverOptimization: naverOptimization,
        structuredData: structuredData,
        security: security,
        accessibility: accessibility
      })
    };
    
    // 종합 점수 계산
    analysisData.overallScore = calculateOverallScore(analysisData);
    
    return NextResponse.json(analysisData);
    
  } catch (error) {
    console.error('SEO 분석 오류:', error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 파일 존재 여부 확인
async function checkFileExists(url: URL): Promise<boolean> {
  try {
    const response = await fetch(url.toString(), { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
} 