"use client";
// src/app/admin/components/HomepageInfo.tsx - 홈페이지 정보 컴포넌트
import React, { useState, useEffect } from "react";

interface HomepageData {
  siteName: string;
  description: string;
  version: string;
  lastUpdate: string;
  totalPosts: number;
  totalComments: number;
  totalTags: number;
  siteStatus: 'online' | 'maintenance' | 'offline';
  features: string[];
}

const HomepageInfo: React.FC = () => {
  const [homepageData, setHomepageData] = useState<HomepageData>({
    siteName: "Awekers Blog",
    description: "개발자들을 위한 기술 블로그",
    version: "1.0.0",
    lastUpdate: "",
    totalPosts: 0,
    totalComments: 0,
    totalTags: 0,
    siteStatus: 'online',
    features: []
  });

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': 'Bearer admin-token'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setHomepageData({
            siteName: "Awekers Blog",
            description: "개발자들을 위한 기술 블로그",
            version: "1.0.0",
            lastUpdate: new Date().toLocaleString('ko-KR'),
            totalPosts: data.stats.totalPosts || 0,
            totalComments: data.stats.totalComments || 0,
            totalTags: data.stats.totalTags || 0,
            siteStatus: 'online',
            features: [
              "AI 기반 블로그 생성",
              "실시간 댓글 시스템",
              "태그 기반 분류",
              "반응형 디자인",
              "관리자 대시보드",
              "SEO 최적화"
            ]
          });
        }
      } catch (error) {
        console.error('홈페이지 데이터 로드 오류:', error);
        // 에러 시 기본 데이터 사용
        setHomepageData({
          siteName: "Awekers Blog",
          description: "개발자들을 위한 기술 블로그",
          version: "1.0.0",
          lastUpdate: new Date().toLocaleString('ko-KR'),
          totalPosts: 156,
          totalComments: 892,
          totalTags: 24,
          siteStatus: 'online',
          features: [
            "AI 기반 블로그 생성",
            "실시간 댓글 시스템",
            "태그 기반 분류",
            "반응형 디자인",
            "관리자 대시보드",
            "SEO 최적화"
          ]
        });
      }
    };

    fetchHomepageData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online':
        return '정상 운영';
      case 'maintenance':
        return '점검 중';
      case 'offline':
        return '서비스 중단';
      default:
        return '알 수 없음';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">홈페이지 정보</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(homepageData.siteStatus)}`}>
            {getStatusText(homepageData.siteStatus)}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        {/* 기본 정보 */}
        <div className="space-y-4 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">사이트 정보</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">사이트명</span>
                <span className="text-sm font-medium text-gray-900">{homepageData.siteName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">설명</span>
                <span className="text-sm font-medium text-gray-900">{homepageData.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">버전</span>
                <span className="text-sm font-medium text-gray-900">{homepageData.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">마지막 업데이트</span>
                <span className="text-sm font-medium text-gray-900">{homepageData.lastUpdate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 정보 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">콘텐츠 통계</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{homepageData.totalPosts}</div>
              <div className="text-xs text-gray-600">게시글</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{homepageData.totalComments}</div>
              <div className="text-xs text-gray-600">댓글</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{homepageData.totalTags}</div>
              <div className="text-xs text-gray-600">태그</div>
            </div>
          </div>
        </div>

        {/* 주요 기능 */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">주요 기능</h4>
          <div className="grid grid-cols-2 gap-2">
            {homepageData.features.map((feature, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">빠른 액션</h4>
          <div className="flex space-x-2">
            <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              새 게시글 작성
            </button>
            <button className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors">
              사이트 설정
            </button>
            <button className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
              백업 생성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageInfo; 
 
 