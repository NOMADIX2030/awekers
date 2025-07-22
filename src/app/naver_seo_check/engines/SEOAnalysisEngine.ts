import { CrawledData, SEOAnalysisResult, CategoryResult, SEOImprovement, CheckResult } from '../types';
import { WebCrawler } from '../utils/WebCrawler';
import { MetaAnalyzer } from './MetaAnalyzer';
import { ContentAnalyzer } from './ContentAnalyzer';
import { TechnicalAnalyzer } from './TechnicalAnalyzer';
import { PerformanceAnalyzer } from './PerformanceAnalyzer';
import { SEOConfig } from '../config/SEOConfig';
import { SEOCheckResult } from '../types';

export class SEOAnalysisEngine {
  private config: SEOConfig;
  private webCrawler: WebCrawler;
  private metaAnalyzer: MetaAnalyzer;
  private contentAnalyzer: ContentAnalyzer;
  private technicalAnalyzer: TechnicalAnalyzer;
  private performanceAnalyzer: PerformanceAnalyzer;

  constructor() {
    this.config = new SEOConfig();
    this.webCrawler = new WebCrawler();
    this.metaAnalyzer = new MetaAnalyzer();
    this.contentAnalyzer = new ContentAnalyzer();
    this.technicalAnalyzer = new TechnicalAnalyzer();
    this.performanceAnalyzer = new PerformanceAnalyzer();
  }

  async analyze(url: string): Promise<SEOAnalysisResult> {
    try {
      // 1. 웹페이지 크롤링
      const crawledData = await this.webCrawler.crawl(url);
      
      // 2. 각 카테고리별 분석 실행
      const categoryResults = await this.analyzeCategoriesInParallel(crawledData);
      
      // 3. 점수 계산 및 등급 부여
      const { totalScore, grade } = this.calculateTotalScore(categoryResults);
      
      // 4. 개선사항 생성
      const improvements = this.generateImprovements(categoryResults);
      
      // 5. 결과 반환
      return {
        url,
        totalScore,
        grade,
        categoryResults,
        improvements,
        crawledData,
        analyzedAt: new Date()
      };
    } catch (error) {
      throw new Error(`SEO 분석 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  private async analyzeCategoriesInParallel(crawledData: CrawledData): Promise<CategoryResult[]> {
    const categories = this.config.getCategories();
    const analysisPromises = categories.map(category => this.analyzeCategory(category.id, crawledData));
    
    return Promise.all(analysisPromises);
  }

  private async analyzeCategory(categoryId: string, crawledData: CrawledData): Promise<CategoryResult> {
    const category = this.config.getCategoryById(categoryId);
    if (!category) {
      throw new Error(`카테고리를 찾을 수 없습니다: ${categoryId}`);
    }

    const checkItems = this.config.getCheckItemsByCategory(categoryId);
    const checkResults: CheckResult[] = [];

    // 각 검사 항목 실행
    for (const item of checkItems) {
      try {
        const result = await this.executeCheck(item.checkFunction, crawledData, item);
        checkResults.push({
          checkItemId: item.id,
          status: result.passed ? 'pass' : 'fail',
          score: result.passed ? item.weight : 0,
          maxScore: item.weight,
          message: result.message,
          priority: 'medium',
          solution: item.solution,
          details: result.details
        });
      } catch (error) {
        checkResults.push({
          checkItemId: item.id,
          status: 'fail',
          score: 0,
          maxScore: item.weight,
          message: `검사 실행 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
          priority: 'high',
          solution: item.solution,
          details: undefined
        });
      }
    }

    // 카테고리 점수 계산
    const totalScore = checkResults.reduce((sum, result) => sum + result.score, 0);
    const maxScore = checkResults.reduce((sum, result) => sum + result.maxScore, 0);
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const grade = this.calculateGrade(percentage);

    return {
      categoryId,
      score: totalScore,
      maxScore,
      percentage,
      grade,
      checkResults
    };
  }

  private async executeCheck(checkFunction: string, crawledData: CrawledData, checkItem: any): Promise<{ passed: boolean; message: string; details?: any }> {
    // 검사 함수 실행 로직
    switch (checkFunction) {
      // 기본 메타 정보 검사
      case 'checkTitleTag':
        return this.metaAnalyzer.checkTitleTag(crawledData) as any;
      case 'checkMetaDescription':
        return this.metaAnalyzer.checkMetaDescription(crawledData) as any;
      case 'checkCharsetMeta':
        return this.metaAnalyzer.checkCharsetMeta(crawledData) as any;
      case 'checkH1Tag':
        return this.metaAnalyzer.checkH1Tag(crawledData) as any;
      case 'checkLangAttribute':
        return this.metaAnalyzer.checkLangAttribute(crawledData) as any;
      case 'checkSnsMetaTags':
        return this.metaAnalyzer.checkSnsMetaTags(crawledData) as any;
      case 'checkTitleLength':
        return this.metaAnalyzer.checkTitleLength(crawledData) as any;
      case 'checkMetaDescriptionLength':
        return this.metaAnalyzer.checkMetaDescriptionLength(crawledData) as any;
      case 'checkViewportMeta':
        return this.metaAnalyzer.checkViewportMeta(crawledData) as any;

      // 검색엔진 수집 검사
      case 'checkRobotsTxt':
        // return this.technicalAnalyzer.checkRobotsTxt(crawledData) as any;
        return { passed: false, message: 'robots.txt 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkSitemapXml':
        // return this.technicalAnalyzer.checkSitemapXml(crawledData) as any;
        return { passed: false, message: 'sitemap.xml 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkCanonicalTag':
        // return this.technicalAnalyzer.checkCanonicalTag(crawledData) as any;
        return { passed: false, message: 'canonical 태그 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkIndexNow':
        // return this.technicalAnalyzer.checkIndexNow(crawledData) as any;
        return { passed: false, message: 'IndexNow 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkNoindexMeta':
        // return this.technicalAnalyzer.checkNoindexMeta(crawledData) as any;
        return { passed: false, message: 'noindex 메타 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkRobotsMetaDuplicate':
        // return this.technicalAnalyzer.checkRobotsMetaDuplicate(crawledData) as any;
        return { passed: false, message: 'robots 메타 중복 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkRobotsTxtSiteBlock':
        // return this.technicalAnalyzer.checkRobotsTxtSiteBlock(crawledData) as any;
        return { passed: false, message: 'robots.txt 사이트 차단 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };

      // 구조화 데이터 검사
      case 'checkStructuredData':
        return this.contentAnalyzer.checkStructuredData(crawledData) as any;
      case 'checkJsonLdFormat':
        return this.contentAnalyzer.checkJsonLdFormat(crawledData) as any;
      case 'checkSchemaOrgAccuracy':
        return this.contentAnalyzer.checkSchemaOrgAccuracy(crawledData) as any;
      case 'checkMarkupStructureErrors':
        return this.contentAnalyzer.checkMarkupStructureErrors(crawledData) as any;
      case 'checkBreadcrumbMarkup':
        return this.contentAnalyzer.checkBreadcrumbMarkup(crawledData) as any;

      // 콘텐츠 품질 검사
      case 'checkContentUniqueness':
        return this.contentAnalyzer.checkContentUniqueness(crawledData) as any;
      case 'checkAltTagUsage':
        return this.contentAnalyzer.checkAltTagUsage(crawledData) as any;
      case 'checkKeywordRelevance':
        return this.contentAnalyzer.checkKeywordRelevance(crawledData) as any;
      case 'checkContentLength':
        return this.contentAnalyzer.checkContentLength(crawledData) as any;
      case 'checkHeadingStructure':
        return this.contentAnalyzer.checkHeadingStructure(crawledData) as any;
      case 'checkSpamKeywords':
        return this.contentAnalyzer.checkSpamKeywords(crawledData) as any;
      case 'checkUserIntentMatch':
        return this.contentAnalyzer.checkUserIntentMatch(crawledData) as any;
      case 'checkDuplicateContentPattern':
        return this.contentAnalyzer.checkDuplicateContentPattern(crawledData) as any;
      case 'checkContentFreshness':
        return this.contentAnalyzer.checkContentFreshness(crawledData) as any;

      // 기술적 최적화 검사
      case 'checkHttpsSsl':
        // return this.technicalAnalyzer.checkHttpsSsl(crawledData) as any;
        return { passed: false, message: 'HTTPS/SSL 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkHttpResponseCodes':
        // return this.technicalAnalyzer.checkHttpResponseCodes(crawledData) as any;
        return { passed: false, message: 'HTTP 응답 코드 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkSiteRedirection':
        // return this.technicalAnalyzer.checkSiteRedirection(crawledData) as any;
        return { passed: false, message: '사이트 리다이렉션 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkInternalLinkStructure':
        // return this.technicalAnalyzer.checkInternalLinkStructure(crawledData) as any;
        return { passed: false, message: '내부 링크 구조 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkExternalLinkQuality':
        // return this.technicalAnalyzer.checkExternalLinkQuality(crawledData) as any;
        return { passed: false, message: '외부 링크 품질 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkUrlStructure':
        // return this.technicalAnalyzer.checkUrlStructure(crawledData) as any;
        return { passed: false, message: 'URL 구조 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkSiteStructureSimplicity':
        // return this.technicalAnalyzer.checkSiteStructureSimplicity(crawledData) as any;
        return { passed: false, message: '사이트 구조 단순성 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkPageDepth':
        // return this.technicalAnalyzer.checkPageDepth(crawledData) as any;
        return { passed: false, message: '페이지 깊이 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };
      case 'checkBrokenLinks':
        // return this.technicalAnalyzer.checkBrokenLinks(crawledData) as any;
        return { passed: false, message: '깨진 링크 검사 기능이 일시적으로 비활성화되었습니다.', details: undefined };

      // 모바일 & 성능 검사
      case 'checkMobileOptimization':
        return this.performanceAnalyzer.checkMobileOptimization(crawledData) as any;
      case 'checkPageLoadingSpeed':
        return this.performanceAnalyzer.checkPageLoadingSpeed(crawledData) as any;
      case 'checkAmpImplementation':
        return this.performanceAnalyzer.checkAmpImplementation(crawledData) as any;
      case 'checkImageOptimization':
        return this.performanceAnalyzer.checkImageOptimization(crawledData) as any;
      case 'checkCoreWebVitals':
        return this.performanceAnalyzer.checkCoreWebVitals(crawledData) as any;
      case 'checkCompressionEnabled':
        return this.performanceAnalyzer.checkCompressionEnabled(crawledData) as any;
      case 'checkCachingPolicy':
        return this.performanceAnalyzer.checkCachingPolicy(crawledData) as any;
      case 'checkSsrJavascript':
        return this.performanceAnalyzer.checkSsrJavascript(crawledData) as any;

      default:
        return {
          passed: false,
          message: `알 수 없는 검사 함수: ${checkFunction}`,
          details: undefined
        };
    }
  }

  private calculateTotalScore(categoryResults: CategoryResult[]): { totalScore: number; grade: string } {
    const categories = this.config.getCategories();
    let weightedScore = 0;
    let totalWeight = 0;

    categoryResults.forEach(result => {
      const category = categories.find(cat => cat.id === result.categoryId);
      if (category) {
        weightedScore += (result.percentage / 100) * category.weight;
        totalWeight += category.weight;
      }
    });

    const totalScore = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) : 0;
    const grade = this.calculateGrade(totalScore);

    return { totalScore, grade };
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 95) return 'A+';
    if (percentage >= 90) return 'A';
    if (percentage >= 85) return 'A-';
    if (percentage >= 80) return 'B+';
    if (percentage >= 75) return 'B';
    if (percentage >= 70) return 'B-';
    if (percentage >= 65) return 'C+';
    if (percentage >= 60) return 'C';
    if (percentage >= 55) return 'C-';
    if (percentage >= 50) return 'D+';
    if (percentage >= 45) return 'D';
    if (percentage >= 40) return 'D-';
    return 'F';
  }

  private generateImprovements(categoryResults: CategoryResult[]): SEOImprovement[] {
    const improvements: SEOImprovement[] = [];
    const categories = this.config.getCategories();

    categoryResults.forEach(categoryResult => {
      const category = categories.find(cat => cat.id === categoryResult.categoryId);
      if (!category) return;

      // 실패한 검사 항목들에 대한 개선사항 생성
      const failedChecks = categoryResult.checkResults.filter(result => result.status === 'fail');
      
      if (failedChecks.length > 0) {
        failedChecks.forEach(failedCheck => {
          const checkItem = this.config.getCheckItemById(failedCheck.checkItemId);
          if (checkItem) {
            improvements.push({
              categoryId: categoryResult.categoryId,
              categoryName: category.name,
              checkItemId: failedCheck.checkItemId,
              title: checkItem.name,
              description: checkItem.description,
              solution: checkItem.solution,
              priority: this.calculatePriority(checkItem.weight, categoryResult.percentage),
              impact: checkItem.weight >= 4 ? 'high' : checkItem.weight >= 2 ? 'medium' : 'low'
            });
          }
        });
      }
    });

    // 우선순위 순으로 정렬
    return improvements.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private calculatePriority(weight: number, categoryPercentage: number): 'high' | 'medium' | 'low' {
    // 가중치가 높고 카테고리 점수가 낮을수록 우선순위 높음
    if (weight >= 4 && categoryPercentage < 70) return 'high';
    if (weight >= 3 && categoryPercentage < 80) return 'high';
    if (weight >= 2 && categoryPercentage < 60) return 'medium';
    return 'low';
  }
} 