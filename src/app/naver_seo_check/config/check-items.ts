import { SEOCheckItem } from '../types';

export const checkItems: SEOCheckItem[] = [
  {
    id: "title_tag_exists",
    categoryId: "basic_meta",
    name: "<title> 태그 존재 여부",
    description: "검색결과 제목으로 사용됨. 필수 요소.",
    weight: 5,
    checkFunction: "checkTitleTag",
    solution: "HTML <head> 섹션에 <title>페이지 제목</title> 태그를 추가하세요."
  },
  {
    id: "meta_description_exists",
    categoryId: "basic_meta",
    name: "<meta name=\"description\"> 태그 존재 여부",
    description: "검색 요약문. 클릭률에 직접 영향.",
    weight: 4,
    checkFunction: "checkMetaDescription",
    solution: "<meta name=\"description\" content=\"페이지 설명\"> 태그를 추가하세요."
  },
  {
    id: "charset_meta",
    categoryId: "basic_meta",
    name: "HTML 헤더 내 <meta charset=\"UTF-8\">",
    description: "문자 인코딩 명확화",
    weight: 2,
    checkFunction: "checkCharsetMeta",
    solution: "<meta charset=\"UTF-8\"> 태그를 <head> 최상단에 추가하세요."
  },
  {
    id: "h1_tag_exists",
    categoryId: "basic_meta",
    name: "<h1> 태그의 존재 및 적절성",
    description: "콘텐츠 주제 명확화",
    weight: 3,
    checkFunction: "checkH1Tag",
    solution: "페이지 주제를 나타내는 <h1> 태그를 하나만 사용하세요."
  },
  {
    id: "lang_attribute",
    categoryId: "basic_meta",
    name: "언어 명시 태그 (<html lang=\"ko\">) 사용 여부",
    description: "다국어 페이지 대응",
    weight: 2,
    checkFunction: "checkLangAttribute",
    solution: "<html> 태그에 lang=\"ko\" 속성을 추가하세요."
  },
  {
    id: "sns_meta_tags",
    categoryId: "basic_meta",
    name: "SNS 메타 태그 설정 여부 (og:title 등)",
    description: "공유 최적화",
    weight: 3,
    checkFunction: "checkSnsMetaTags",
    solution: "Open Graph 메타태그(og:title, og:description, og:image)를 추가하세요."
  },
  {
    id: "title_length_optimization",
    categoryId: "basic_meta",
    name: "제목 길이 최적화 (30-60자)",
    description: "검색결과 노출 최적화",
    weight: 2,
    checkFunction: "checkTitleLength",
    solution: "제목을 30-60자 사이로 작성하세요."
  },
  {
    id: "meta_description_length",
    categoryId: "basic_meta",
    name: "메타 설명 길이 최적화 (120-160자)",
    description: "검색 스니펫 최적화",
    weight: 2,
    checkFunction: "checkMetaDescriptionLength",
    solution: "메타 설명을 120-160자 사이로 작성하세요."
  },
  {
    id: "viewport_meta",
    categoryId: "basic_meta",
    name: "viewport 메타태그 존재 여부",
    description: "모바일 최적화 기본 설정",
    weight: 2,
    checkFunction: "checkViewportMeta",
    solution: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"> 태그를 추가하세요."
  },

  {
    id: "robots_txt_allows",
    categoryId: "search_engine_collection",
    name: "robots.txt 수집 허용 여부",
    description: "검색로봇 접근 허용 필수",
    weight: 5,
    checkFunction: "checkRobotsTxt",
    solution: "robots.txt 파일에서 해당 페이지의 수집을 허용하도록 설정하세요."
  },
  {
    id: "sitemap_xml_exists",
    categoryId: "search_engine_collection",
    name: "sitemap.xml 제출 여부",
    description: "전체 URL 수집 가이드라인 제공",
    weight: 4,
    checkFunction: "checkSitemapXml",
    solution: "사이트맵을 생성하여 robots.txt에 등록하고 네이버 웹마스터도구에 제출하세요."
  },
  {
    id: "canonical_tag",
    categoryId: "search_engine_collection",
    name: "canonical 태그 설정 여부",
    description: "중복 콘텐츠 방지",
    weight: 4,
    checkFunction: "checkCanonicalTag",
    solution: "<link rel=\"canonical\" href=\"정규 URL\"> 태그를 추가하세요."
  },
  {
    id: "indexnow_setup",
    categoryId: "search_engine_collection",
    name: "IndexNow 설정 여부",
    description: "빠른 색인 반영 가능",
    weight: 2,
    checkFunction: "checkIndexNow",
    solution: "IndexNow API를 설정하여 콘텐츠 업데이트를 즉시 알리세요."
  },
  {
    id: "noindex_meta_check",
    categoryId: "search_engine_collection",
    name: "noindex 메타태그 사용 여부",
    description: "검색 제외 페이지 지정 가능",
    weight: 3,
    checkFunction: "checkNoindexMeta",
    solution: "검색에서 제외하려면 <meta name=\"robots\" content=\"noindex\">를 추가하세요."
  },
  {
    id: "robots_meta_duplicate",
    categoryId: "search_engine_collection",
    name: "robots 메타태그 중복 설정 여부",
    description: "비정상 처리 방지",
    weight: 2,
    checkFunction: "checkRobotsMetaDuplicate",
    solution: "중복된 robots 메타태그를 제거하고 하나만 유지하세요."
  },
  {
    id: "robots_txt_site_block",
    categoryId: "search_engine_collection",
    name: "robots.txt 내 사이트 전체 차단 여부 확인",
    description: "최악의 사례 방지",
    weight: 5,
    checkFunction: "checkRobotsTxtSiteBlock",
    solution: "robots.txt에서 'Disallow: /' 설정을 제거하세요."
  },

  {
    id: "structured_data_exists",
    categoryId: "structured_data",
    name: "구조화 데이터 사용 여부 (FAQ, 리뷰 등)",
    description: "SERP 카드 노출 유도",
    weight: 4,
    checkFunction: "checkStructuredData",
    solution: "JSON-LD 형식으로 구조화 데이터를 추가하세요."
  },
  {
    id: "json_ld_format",
    categoryId: "structured_data",
    name: "JSON-LD 형식 구조화 여부",
    description: "검색엔진 추천 마크업 형식",
    weight: 3,
    checkFunction: "checkJsonLdFormat",
    solution: "JSON-LD 스크립트 태그로 구조화 데이터를 마크업하세요."
  },
  {
    id: "schema_org_accuracy",
    categoryId: "structured_data",
    name: "schema.org 스키마 정확도",
    description: "구조화 필드의 일치 여부",
    weight: 3,
    checkFunction: "checkSchemaOrgAccuracy",
    solution: "schema.org 표준에 맞는 정확한 스키마를 사용하세요."
  },
  {
    id: "markup_structure_errors",
    categoryId: "structured_data",
    name: "마크업 구조 오류 여부",
    description: "HTML 문법 에러 방지",
    weight: 2,
    checkFunction: "checkMarkupStructureErrors",
    solution: "HTML 유효성 검사기로 마크업 오류를 수정하세요."
  },
  {
    id: "breadcrumb_markup",
    categoryId: "structured_data",
    name: "빵부스러기 네비게이션 마크업",
    description: "사이트 구조 명시",
    weight: 3,
    checkFunction: "checkBreadcrumbMarkup",
    solution: "BreadcrumbList 스키마로 탐색 경로를 마크업하세요."
  },

  {
    id: "content_quality_uniqueness",
    categoryId: "content_quality",
    name: "콘텐츠 품질 (복사/중복 여부)",
    description: "고유 콘텐츠 우선 수집",
    weight: 5,
    checkFunction: "checkContentUniqueness",
    solution: "고유하고 가치 있는 콘텐츠를 작성하세요."
  },
  {
    id: "alt_tag_usage",
    categoryId: "content_quality",
    name: "alt 태그 사용 여부",
    description: "이미지 콘텐츠 해석 도움",
    weight: 3,
    checkFunction: "checkAltTagUsage",
    solution: "모든 이미지에 의미 있는 alt 속성을 추가하세요."
  },
  {
    id: "keyword_relevance",
    categoryId: "content_quality",
    name: "페이지 내 주요 키워드 포함 여부",
    description: "검색 적합성",
    weight: 4,
    checkFunction: "checkKeywordRelevance",
    solution: "타겟 키워드를 자연스럽게 콘텐츠에 포함하세요."
  },
  {
    id: "content_length",
    categoryId: "content_quality",
    name: "콘텐츠 분량 적절성",
    description: "충분한 정보 제공",
    weight: 3,
    checkFunction: "checkContentLength",
    solution: "주제에 대한 충분한 정보를 제공하세요 (최소 300단어)."
  },
  {
    id: "heading_structure",
    categoryId: "content_quality",
    name: "제목 태그 구조 (H1-H6)",
    description: "콘텐츠 계층구조 명확화",
    weight: 3,
    checkFunction: "checkHeadingStructure",
    solution: "H1부터 순차적으로 제목 태그를 사용하세요."
  },
  {
    id: "spam_keywords",
    categoryId: "content_quality",
    name: "스팸 키워드 과도 사용 여부",
    description: "패널티 가능성",
    weight: 4,
    checkFunction: "checkSpamKeywords",
    solution: "키워드 밀도를 2-3% 이하로 유지하세요."
  },
  {
    id: "user_intent_match",
    categoryId: "content_quality",
    name: "사용자 의도 기반 콘텐츠 구성",
    description: "검색 목적 충족도",
    weight: 4,
    checkFunction: "checkUserIntentMatch",
    solution: "검색 의도에 맞는 콘텐츠 구조로 작성하세요."
  },
  {
    id: "duplicate_content_pattern",
    categoryId: "content_quality",
    name: "반복 콘텐츠 패턴 존재 여부",
    description: "자동 생성 페이지 방지",
    weight: 3,
    checkFunction: "checkDuplicateContentPattern",
    solution: "템플릿 기반 콘텐츠에 고유한 정보를 추가하세요."
  },
  {
    id: "content_freshness",
    categoryId: "content_quality",
    name: "콘텐츠 업데이트 빈도",
    description: "활발한 사이트 평가",
    weight: 2,
    checkFunction: "checkContentFreshness",
    solution: "정기적으로 콘텐츠를 업데이트하고 최신 정보를 유지하세요."
  },

  {
    id: "https_ssl",
    categoryId: "technical_optimization",
    name: "사이트 내 SSL(HTTPS) 보안 적용",
    description: "검색 랭킹에 긍정적 영향",
    weight: 4,
    checkFunction: "checkHttpsSsl",
    solution: "SSL 인증서를 설치하고 HTTPS로 리디렉션하세요."
  },
  {
    id: "http_response_codes",
    categoryId: "technical_optimization",
    name: "HTTP 응답 코드 정합성 (404, 503 등)",
    description: "로봇 수집 오류 방지",
    weight: 3,
    checkFunction: "checkHttpResponseCodes",
    solution: "적절한 HTTP 상태 코드를 반환하도록 설정하세요."
  },
  {
    id: "site_redirection",
    categoryId: "technical_optimization",
    name: "사이트 리디렉션 방식 (301/302)",
    description: "페이지 이전 시 권장 방식",
    weight: 3,
    checkFunction: "checkSiteRedirection",
    solution: "영구 이전 시 301 리디렉션을 사용하세요."
  },
  {
    id: "internal_link_structure",
    categoryId: "technical_optimization",
    name: "내부 링크 구조",
    description: "크롤러의 효율적 탐색 가능",
    weight: 3,
    checkFunction: "checkInternalLinkStructure",
    solution: "관련 페이지 간 내부 링크를 적절히 연결하세요."
  },
  {
    id: "external_link_quality",
    categoryId: "technical_optimization",
    name: "외부 링크 품질",
    description: "신뢰도 평가 요소",
    weight: 2,
    checkFunction: "checkExternalLinkQuality",
    solution: "신뢰할 수 있는 사이트로만 외부 링크를 설정하세요."
  },
  {
    id: "url_structure",
    categoryId: "technical_optimization",
    name: "의미 있는 정적 URL 사용 여부",
    description: "파라미터 없는 구조 권장",
    weight: 3,
    checkFunction: "checkUrlStructure",
    solution: "의미 있고 읽기 쉬운 URL 구조를 사용하세요."
  },
  {
    id: "site_structure_simplicity",
    categoryId: "technical_optimization",
    name: "사이트 구조 단순성",
    description: "검색로봇 탐색 효율",
    weight: 2,
    checkFunction: "checkSiteStructureSimplicity",
    solution: "사이트 깊이를 3단계 이하로 유지하세요."
  },
  {
    id: "page_depth",
    categoryId: "technical_optimization",
    name: "페이지 Depth 과도 여부",
    description: "구조 단순화 필요",
    weight: 2,
    checkFunction: "checkPageDepth",
    solution: "홈페이지에서 3클릭 이내로 모든 페이지에 접근 가능하도록 하세요."
  },
  {
    id: "broken_links",
    categoryId: "technical_optimization",
    name: "링크 오류 여부 (404 링크 등)",
    description: "사용자/로봇 신뢰도 하락",
    weight: 3,
    checkFunction: "checkBrokenLinks",
    solution: "깨진 링크를 정기적으로 점검하고 수정하세요."
  },

  {
    id: "mobile_optimization",
    categoryId: "mobile_performance",
    name: "모바일 최적화 여부",
    description: "네이버 모바일 검색 반영",
    weight: 4,
    checkFunction: "checkMobileOptimization",
    solution: "반응형 웹 디자인을 적용하세요."
  },
  {
    id: "page_loading_speed",
    categoryId: "mobile_performance",
    name: "페이지 로딩 속도",
    description: "사용자 경험 및 순위 반영",
    weight: 4,
    checkFunction: "checkPageLoadingSpeed",
    solution: "이미지 최적화, 캐싱, CDN 등으로 로딩 속도를 개선하세요."
  },
  {
    id: "amp_implementation",
    categoryId: "mobile_performance",
    name: "AMP 적용 여부",
    description: "빠른 로딩과 모바일 친화성",
    weight: 2,
    checkFunction: "checkAmpImplementation",
    solution: "AMP 페이지를 구현하여 모바일 성능을 향상시키세요."
  },
  {
    id: "image_optimization",
    categoryId: "mobile_performance",
    name: "이미지 최적화 상태",
    description: "로딩 성능 향상",
    weight: 3,
    checkFunction: "checkImageOptimization",
    solution: "이미지를 WebP 형식으로 변환하고 적절한 크기로 최적화하세요."
  },
  {
    id: "core_web_vitals",
    categoryId: "mobile_performance",
    name: "Core Web Vitals 점수",
    description: "구글/네이버 성능 지표",
    weight: 4,
    checkFunction: "checkCoreWebVitals",
    solution: "LCP, FID, CLS 지표를 개선하세요."
  },
  {
    id: "compression_enabled",
    categoryId: "mobile_performance",
    name: "압축 설정 여부 (Gzip/Brotli)",
    description: "전송 데이터 최적화",
    weight: 2,
    checkFunction: "checkCompressionEnabled",
    solution: "서버에서 Gzip 또는 Brotli 압축을 활성화하세요."
  },
  {
    id: "caching_policy",
    categoryId: "mobile_performance",
    name: "캐싱 정책 설정",
    description: "재방문 성능 향상",
    weight: 2,
    checkFunction: "checkCachingPolicy",
    solution: "적절한 Cache-Control 헤더를 설정하세요."
  },
  {
    id: "ssr_javascript",
    categoryId: "mobile_performance",
    name: "자바스크립트 SSR 처리 여부",
    description: "JS 기반 페이지 수집 가능성 확보",
    weight: 3,
    checkFunction: "checkSsrJavascript",
    solution: "서버사이드 렌더링 또는 프리렌더링을 구현하세요."
  }
]; 