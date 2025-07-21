import prisma from './prisma';

interface GoogleAnalyticsData {
  date: string;
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  source: string;
  medium: string;
  campaign: string;
}

interface TrafficSourceData {
  source: string;
  medium: string;
  sessions: number;
  users: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface PagePerformanceData {
  pagePath: string;
  pageTitle: string;
  pageViews: number;
  uniquePageViews: number;
  avgTimeOnPage: number;
  bounceRate: number;
  exitRate: number;
}

// Google Analytics 설정 가져오기
async function getGoogleAnalyticsConfig() {
  const config = await prisma.googleAnalyticsConfig.findFirst({
    where: { isActive: true }
  });
  
  if (!config) {
    throw new Error('Google Analytics가 설정되지 않았습니다.');
  }
  
  return config;
}

// Access Token 갱신
async function refreshAccessToken(refreshToken: string, clientId: string, clientSecret: string) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Access token 갱신 실패');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Access token 갱신 오류:', error);
    throw error;
  }
}

// Google Analytics API 호출
async function callGoogleAnalyticsAPI(endpoint: string, accessToken: string, propertyId: string) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Google Analytics API 오류: ${response.status}`);
  }

  return response.json();
}

// 트래픽 데이터 수집
export async function getTrafficData(startDate: string, endDate: string): Promise<GoogleAnalyticsData[]> {
  try {
    const config = await getGoogleAnalyticsConfig();
    const accessToken = await refreshAccessToken(
      config.refreshToken,
      config.clientId,
      config.clientSecret
    );

    const requestBody = {
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        { name: 'date' },
        { name: 'source' },
        { name: 'medium' },
        { name: 'campaign' },
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'users' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    };

    const response = await callGoogleAnalyticsAPI('runReport', accessToken, config.propertyId);
    
    return response.rows?.map((row: {
      dimensionValues: { value: string }[];
      metricValues: { value: string }[];
    }) => ({
      date: row.dimensionValues[0].value,
      source: row.dimensionValues[1].value,
      medium: row.dimensionValues[2].value,
      campaign: row.dimensionValues[3].value,
      sessions: parseInt(row.metricValues[0].value),
      users: parseInt(row.metricValues[1].value),
      pageViews: parseInt(row.metricValues[2].value),
      bounceRate: parseFloat(row.metricValues[3].value),
      avgSessionDuration: parseFloat(row.metricValues[4].value),
    })) || [];

  } catch (error) {
    console.error('트래픽 데이터 수집 오류:', error);
    return [];
  }
}

// 유입 소스 데이터 수집
export async function getTrafficSources(startDate: string, endDate: string): Promise<TrafficSourceData[]> {
  try {
    const config = await getGoogleAnalyticsConfig();
    const accessToken = await refreshAccessToken(
      config.refreshToken,
      config.clientId,
      config.clientSecret
    );

    const requestBody = {
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        { name: 'source' },
        { name: 'medium' },
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'users' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    };

    const response = await callGoogleAnalyticsAPI('runReport', accessToken, config.propertyId);
    
    return response.rows?.map((row: {
      dimensionValues: { value: string }[];
      metricValues: { value: string }[];
    }) => ({
      source: row.dimensionValues[0].value,
      medium: row.dimensionValues[1].value,
      sessions: parseInt(row.metricValues[0].value),
      users: parseInt(row.metricValues[1].value),
      pageViews: parseInt(row.metricValues[2].value),
      bounceRate: parseFloat(row.metricValues[3].value),
      avgSessionDuration: parseFloat(row.metricValues[4].value),
    })) || [];

  } catch (error) {
    console.error('유입 소스 데이터 수집 오류:', error);
    return [];
  }
}

// 페이지 성과 데이터 수집
export async function getPagePerformance(startDate: string, endDate: string): Promise<PagePerformanceData[]> {
  try {
    const config = await getGoogleAnalyticsConfig();
    const accessToken = await refreshAccessToken(
      config.refreshToken,
      config.clientId,
      config.clientSecret
    );

    const requestBody = {
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'uniquePageViews' },
        { name: 'averageTimeOnPage' },
        { name: 'bounceRate' },
        { name: 'exitRate' },
      ],
    };

    const response = await callGoogleAnalyticsAPI('runReport', accessToken, config.propertyId);
    
    return response.rows?.map((row: {
      dimensionValues: { value: string }[];
      metricValues: { value: string }[];
    }) => ({
      pagePath: row.dimensionValues[0].value,
      pageTitle: row.dimensionValues[1].value,
      pageViews: parseInt(row.metricValues[0].value),
      uniquePageViews: parseInt(row.metricValues[1].value),
      avgTimeOnPage: parseFloat(row.metricValues[2].value),
      bounceRate: parseFloat(row.metricValues[3].value),
      exitRate: parseFloat(row.metricValues[4].value),
    })) || [];

  } catch (error) {
    console.error('페이지 성과 데이터 수집 오류:', error);
    return [];
  }
}

// 검색어 데이터 수집 (Search Console 연동 필요)
export async function getSearchKeywords(startDate: string, endDate: string) {
  // Search Console API 연동이 필요하므로 더미 데이터 반환
  return [
    {
      keyword: 'SEO 최적화',
      source: 'google',
      impressions: 1200,
      clicks: 89,
      ctr: 7.42,
      avgPosition: 3.2,
    },
    {
      keyword: '블로그 마케팅',
      source: 'naver',
      impressions: 980,
      clicks: 76,
      ctr: 7.76,
      avgPosition: 2.8,
    },
  ];
} 
 
 