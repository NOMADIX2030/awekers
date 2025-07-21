import { CrawledData } from '../types';

export class ContentAnalyzer {

  // 구조화 데이터 검사
  async checkStructuredData(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const jsonLdMatches = data.html.match(/<script[^>]*type=['"]*application\/ld\+json['"]*[^>]*>(.*?)<\/script>/gi);
    const hasStructuredData = !!(jsonLdMatches && jsonLdMatches.length > 0);
    
    const schemas: string[] = [];
    if (hasStructuredData) {
      jsonLdMatches.forEach(match => {
        try {
          const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          const data = JSON.parse(jsonContent);
          if (data['@type']) {
            schemas.push(data['@type']);
          }
        } catch (e) {
          // JSON 파싱 실패 무시
        }
      });
    }
    
    return {
      passed: hasStructuredData,
      message: hasStructuredData ? `구조화 데이터가 ${schemas.length}개 발견되었습니다: ${schemas.join(', ')}` : '구조화 데이터가 없습니다.',
      details: { schemas, count: jsonLdMatches?.length || 0 }
    };
  }

  async checkJsonLdFormat(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const jsonLdMatches = data.html.match(/<script[^>]*type=['"]*application\/ld\+json['"]*[^>]*>(.*?)<\/script>/gi);
    let validJsonLd = 0;
    let totalJsonLd = 0;
    
    if (jsonLdMatches) {
      totalJsonLd = jsonLdMatches.length;
      jsonLdMatches.forEach(match => {
        try {
          const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          JSON.parse(jsonContent);
          validJsonLd++;
        } catch (e) {
          // JSON 파싱 실패
        }
      });
    }
    
    const hasValidJsonLd = validJsonLd > 0;
    
    return {
      passed: hasValidJsonLd,
      message: hasValidJsonLd ? `${validJsonLd}/${totalJsonLd}개의 유효한 JSON-LD가 발견되었습니다.` : 'JSON-LD 형식의 구조화 데이터가 없습니다.',
      details: { validCount: validJsonLd, totalCount: totalJsonLd }
    };
  }

  async checkSchemaOrgAccuracy(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const jsonLdMatches = data.html.match(/<script[^>]*type=['"]*application\/ld\+json['"]*[^>]*>(.*?)<\/script>/gi);
    let hasSchemaOrg = false;
    const schemaTypes: string[] = [];
    
    if (jsonLdMatches) {
      jsonLdMatches.forEach(match => {
        try {
          const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          const data = JSON.parse(jsonContent);
          if (data['@context'] && data['@context'].includes('schema.org')) {
            hasSchemaOrg = true;
            if (data['@type']) {
              schemaTypes.push(data['@type']);
            }
          }
        } catch (e) {
          // JSON 파싱 실패
        }
      });
    }
    
    return {
      passed: hasSchemaOrg,
      message: hasSchemaOrg ? `Schema.org 스키마가 발견되었습니다: ${schemaTypes.join(', ')}` : 'Schema.org 표준 스키마가 없습니다.',
      details: { schemaTypes }
    };
  }

  async checkMarkupStructureErrors(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const html = data.html;
    const errors: string[] = [];
    
    // 기본적인 HTML 구조 검사
    if (!html.includes('<!DOCTYPE')) {
      errors.push('DOCTYPE 선언이 없습니다');
    }
    
    if (!html.match(/<html[^>]*>/i)) {
      errors.push('HTML 태그가 없습니다');
    }
    
    if (!html.match(/<head[^>]*>/i)) {
      errors.push('HEAD 태그가 없습니다');
    }
    
    if (!html.match(/<body[^>]*>/i)) {
      errors.push('BODY 태그가 없습니다');
    }
    
    // 닫히지 않은 태그 검사 (간단한 버전)
    const openTags = html.match(/<(?!\/)[^>]+>/g) || [];
    const closeTags = html.match(/<\/[^>]+>/g) || [];
    
    const hasStructureErrors = errors.length > 0;
    
    return {
      passed: !hasStructureErrors,
      message: hasStructureErrors ? `${errors.length}개의 구조 오류가 발견되었습니다` : 'HTML 구조가 올바릅니다.',
      details: { errors, openTagCount: openTags.length, closeTagCount: closeTags.length }
    };
  }

  async checkBreadcrumbMarkup(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const jsonLdMatches = data.html.match(/<script[^>]*type=['"]*application\/ld\+json['"]*[^>]*>(.*?)<\/script>/gi);
    let hasBreadcrumb = false;
    
    if (jsonLdMatches) {
      jsonLdMatches.forEach(match => {
        try {
          const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          const data = JSON.parse(jsonContent);
          if (data['@type'] === 'BreadcrumbList') {
            hasBreadcrumb = true;
          }
        } catch (e) {
          // JSON 파싱 실패
        }
      });
    }
    
    // HTML 빵부스러기도 체크
    const htmlBreadcrumb = data.html.match(/class=['"]*[^'"]*breadcrumb[^'"]*['"]*/) || 
                          data.html.match(/id=['"]*[^'"]*breadcrumb[^'"]*['"]*/) ||
                          data.html.match(/<nav[^>]*aria-label=['"]*[^'"]*breadcrumb[^'"]*['"]*[^>]*>/);
    
    const hasBreadcrumbMarkup = hasBreadcrumb || !!htmlBreadcrumb;
    
    return {
      passed: hasBreadcrumbMarkup,
      message: hasBreadcrumbMarkup ? '빵부스러기 네비게이션 마크업이 발견되었습니다.' : '빵부스러기 네비게이션 마크업이 없습니다.',
      details: { hasJsonLd: hasBreadcrumb, hasHtml: !!htmlBreadcrumb }
    };
  }

  // 콘텐츠 품질 검사
  async checkContentUniqueness(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const textContent = data.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textContent.split(' ').filter(word => word.length > 2);
    
    // 간단한 중복 패턴 검사
    const duplicatePatterns = [];
    const wordCounts: Record<string, number> = {};
    
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    const highFrequencyWords = Object.entries(wordCounts)
      .filter(([word, count]) => count > Math.max(5, words.length * 0.05))
      .map(([word, count]) => ({ word, count }));
    
    const hasExcessiveRepetition = highFrequencyWords.length > 3;
    
    return {
      passed: !hasExcessiveRepetition,
      message: hasExcessiveRepetition ? '과도한 키워드 반복이 감지되었습니다.' : '콘텐츠 고유성이 양호합니다.',
      details: { wordCount: words.length, highFrequencyWords }
    };
  }

  async checkAltTagUsage(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const imgTags = data.html.match(/<img[^>]*>/gi) || [];
    const imagesWithAlt = imgTags.filter(img => img.includes('alt='));
    
    const totalImages = imgTags.length;
    const imagesWithAltCount = imagesWithAlt.length;
    const altUsageRate = totalImages > 0 ? (imagesWithAltCount / totalImages) * 100 : 100;
    
    const hasGoodAltUsage = altUsageRate >= 80;
    
    return {
      passed: hasGoodAltUsage,
      message: totalImages === 0 ? '이미지가 없습니다.' : `${imagesWithAltCount}/${totalImages}개 이미지에 alt 속성이 있습니다 (${Math.round(altUsageRate)}%)`,
      details: { totalImages, imagesWithAlt: imagesWithAltCount, altUsageRate }
    };
  }

  async checkKeywordRelevance(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const titleMatch = data.html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch?.[1]?.trim() || '';
    
    const textContent = data.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (!title) {
      return {
        passed: false,
        message: '제목이 없어 키워드 관련성을 확인할 수 없습니다.',
        details: { titleKeywords: [], contentLength: textContent.length }
      };
    }
    
    const titleWords = title.split(' ').filter(word => word.length > 2);
    const contentWords = textContent.toLowerCase().split(' ');
    
    let keywordMatches = 0;
    titleWords.forEach(titleWord => {
      if (contentWords.includes(titleWord.toLowerCase())) {
        keywordMatches++;
      }
    });
    
    const relevanceRate = titleWords.length > 0 ? (keywordMatches / titleWords.length) * 100 : 0;
    const hasGoodRelevance = relevanceRate >= 60;
    
    return {
      passed: hasGoodRelevance,
      message: `제목 키워드의 ${Math.round(relevanceRate)}%가 본문에서 발견되었습니다.`,
      details: { titleKeywords: titleWords, keywordMatches, relevanceRate }
    };
  }

  async checkContentLength(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const textContent = data.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textContent.split(' ').filter(word => word.length > 0);
    const wordCount = words.length;
    
    const hasAdequateLength = wordCount >= 300;
    
    return {
      passed: hasAdequateLength,
      message: `콘텐츠 길이: ${wordCount}단어 ${hasAdequateLength ? '(충분함)' : '(부족함, 최소 300단어 권장)'}`,
      details: { wordCount, characterCount: textContent.length }
    };
  }

  async checkHeadingStructure(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const headings = {
      h1: (data.html.match(/<h1[^>]*>/gi) || []).length,
      h2: (data.html.match(/<h2[^>]*>/gi) || []).length,
      h3: (data.html.match(/<h3[^>]*>/gi) || []).length,
      h4: (data.html.match(/<h4[^>]*>/gi) || []).length,
      h5: (data.html.match(/<h5[^>]*>/gi) || []).length,
      h6: (data.html.match(/<h6[^>]*>/gi) || []).length
    };
    
    const hasH1 = headings.h1 === 1;
    const hasLogicalStructure = headings.h1 > 0 && (headings.h2 > 0 || Object.values(headings).every(count => count <= 1));
    
    const isGoodStructure = hasH1 && hasLogicalStructure;
    
    return {
      passed: isGoodStructure,
      message: isGoodStructure ? '제목 구조가 논리적입니다.' : '제목 구조를 개선해야 합니다.',
      details: headings
    };
  }

  async checkSpamKeywords(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const textContent = data.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textContent.toLowerCase().split(' ').filter(word => word.length > 2);
    
    const wordCounts: Record<string, number> = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    const totalWords = words.length;
    const spamKeywords = Object.entries(wordCounts)
      .filter(([word, count]) => count / totalWords > 0.03) // 3% 이상 반복
      .map(([word, count]) => ({ word, count, density: (count / totalWords) * 100 }));
    
    const hasSpamKeywords = spamKeywords.length > 0;
    
    return {
      passed: !hasSpamKeywords,
      message: hasSpamKeywords ? `과도한 키워드 반복이 감지되었습니다 (${spamKeywords.length}개)` : '키워드 밀도가 적절합니다.',
      details: { spamKeywords, totalWords }
    };
  }

  async checkUserIntentMatch(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const titleMatch = data.html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch?.[1]?.trim() || '';
    
    const headings = data.html.match(/<h[1-6][^>]*>([^<]*)<\/h[1-6]>/gi) || [];
    const headingTexts = headings.map(h => h.replace(/<[^>]*>/g, '').trim());
    
    // 간단한 의도 매칭 (제목과 헤딩의 일관성)
    const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 2);
    let intentMatches = 0;
    
    headingTexts.forEach(heading => {
      const headingWords = heading.toLowerCase().split(' ');
      titleWords.forEach(titleWord => {
        if (headingWords.some(hw => hw.includes(titleWord))) {
          intentMatches++;
        }
      });
    });
    
    const hasGoodIntentMatch = intentMatches > 0 || headingTexts.length === 0;
    
    return {
      passed: hasGoodIntentMatch,
      message: hasGoodIntentMatch ? '사용자 의도와 콘텐츠가 일치합니다.' : '제목과 콘텐츠 구조의 일관성을 확인해주세요.',
      details: { titleWords, headingCount: headingTexts.length, intentMatches }
    };
  }

  async checkDuplicateContentPattern(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    const textContent = data.html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // 반복되는 문장 패턴 검사
    const sentences = textContent.split(/[.!?]/).filter(s => s.trim().length > 10);
    const sentenceCounts: Record<string, number> = {};
    
    sentences.forEach(sentence => {
      const normalized = sentence.trim().toLowerCase();
      sentenceCounts[normalized] = (sentenceCounts[normalized] || 0) + 1;
    });
    
    const duplicateSentences = Object.entries(sentenceCounts)
      .filter(([sentence, count]) => count > 1)
      .map(([sentence, count]) => ({ sentence: sentence.substring(0, 50), count }));
    
    const hasDuplicatePattern = duplicateSentences.length > 2;
    
    return {
      passed: !hasDuplicatePattern,
      message: hasDuplicatePattern ? `${duplicateSentences.length}개의 중복 문장 패턴이 발견되었습니다.` : '중복 콘텐츠 패턴이 없습니다.',
      details: { totalSentences: sentences.length, duplicateSentences }
    };
  }

  async checkContentFreshness(data: CrawledData): Promise<{ passed: boolean; message: string; details?: any }> {
    // HTML에서 날짜 정보 찾기
    const datePatterns = [
      /\d{4}-\d{2}-\d{2}/g, // YYYY-MM-DD
      /\d{2}\/\d{2}\/\d{4}/g, // MM/DD/YYYY
      /\d{4}\.\d{2}\.\d{2}/g // YYYY.MM.DD
    ];
    
    let foundDates: string[] = [];
    datePatterns.forEach(pattern => {
      const matches = data.html.match(pattern);
      if (matches) {
        foundDates = foundDates.concat(matches);
      }
    });
    
    const hasDateInfo = foundDates.length > 0;
    
    // 최신성 판단 (간단한 버전)
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
    
    let hasRecentDate = false;
    foundDates.forEach(dateStr => {
      try {
        const date = new Date(dateStr);
        if (date > oneYearAgo) {
          hasRecentDate = true;
        }
      } catch (e) {
        // 날짜 파싱 실패
      }
    });
    
    return {
      passed: hasRecentDate || !hasDateInfo,
      message: hasDateInfo ? (hasRecentDate ? '최신 날짜 정보가 있습니다.' : '콘텐츠 업데이트가 필요할 수 있습니다.') : '날짜 정보를 확인할 수 없습니다.',
      details: { foundDates, hasRecentDate }
    };
  }
} 