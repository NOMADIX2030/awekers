import { SEOCategory } from '../types';

export const categories: SEOCategory[] = [
  {
    id: "basic_meta",
    name: "기본 메타 정보",
    description: "검색엔진이 페이지를 이해하는데 필요한 기본 메타태그와 정보",
    weight: 25,
    color: "#03C75A"
  },
  {
    id: "search_engine_collection",
    name: "검색엔진 수집",
    description: "검색로봇의 페이지 수집과 색인을 위한 설정",
    weight: 20,
    color: "#1EC800"
  },
  {
    id: "structured_data",
    name: "구조화 데이터",
    description: "검색결과 향상을 위한 구조화된 데이터 마크업",
    weight: 15,
    color: "#00D41A"
  },
  {
    id: "content_quality",
    name: "콘텐츠 품질",
    description: "콘텐츠의 품질과 최적화 상태",
    weight: 20,
    color: "#19E633"
  },
  {
    id: "technical_optimization",
    name: "기술적 최적화",
    description: "사이트의 기술적 SEO 최적화 상태",
    weight: 12,
    color: "#33F84D"
  },
  {
    id: "mobile_performance",
    name: "모바일 & 성능",
    description: "모바일 최적화와 페이지 성능",
    weight: 8,
    color: "#4DFF66"
  }
]; 