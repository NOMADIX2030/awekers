"use client";
import React, { useState, useEffect } from 'react';
import HelpTooltip from '../../components/HelpTooltip';
import { SERPHelpContent } from '../data/helpContent';

interface GoogleAnalyticsConfigProps {
  onConfigChange: () => void;
}

const GoogleAnalyticsConfig: React.FC<GoogleAnalyticsConfigProps> = ({ onConfigChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<{
    isConfigured: boolean;
    propertyId: string;
    lastUpdated: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    propertyId: '',
    clientId: '',
    clientSecret: '',
    refreshToken: ''
  });

  // 설정 조회
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/google-analytics-config', {
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('설정 조회 오류:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/google-analytics-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setIsOpen(false);
        fetchConfig();
        onConfigChange();
      } else {
        const error = await response.json();
        alert(error.error || '설정 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('설정 저장 오류:', error);
      alert('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Google Analytics 설정을 비활성화하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/google-analytics-config', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        fetchConfig();
        onConfigChange();
      } else {
        const error = await response.json();
        alert(error.error || '설정 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('설정 삭제 오류:', error);
      alert('설정 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="mb-6">
      {/* 설정 상태 표시 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="text-xl sm:text-2xl">📊</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Google Analytics 설정
                </h3>
                <HelpTooltip 
                  title={SERPHelpContent.googleAnalytics.title}
                  content={SERPHelpContent.googleAnalytics.content}
                  position="bottom"
                  size="lg"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                실제 트래픽 데이터를 수집하기 위한 설정
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            {config?.isConfigured && (
              <span className="inline-flex items-center justify-center px-3 py-2 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                ✅ 연결됨
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isOpen ? '닫기' : '설정'}
            </button>
          </div>
        </div>

        {config?.isConfigured && (
          <div className="bg-gray-50 rounded-lg p-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 text-xs sm:text-sm">Property ID:</span>
                <div className="font-medium text-sm sm:text-base">{config.propertyId}</div>
              </div>
              <div>
                <span className="text-gray-600 text-xs sm:text-sm">상태:</span>
                <div className="font-medium text-green-600 text-sm sm:text-base">활성</div>
              </div>
              <div>
                <span className="text-gray-600 text-xs sm:text-sm">마지막 업데이트:</span>
                <div className="font-medium text-sm sm:text-base">
                  {new Date(config.lastUpdated).toLocaleDateString('ko-KR')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 설정 폼 */}
        {isOpen && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GA4 Property ID *
                </label>
                <input
                  type="text"
                  value={formData.propertyId}
                  onChange={(e) => setFormData({...formData, propertyId: e.target.value})}
                  placeholder="예: 123456789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Google Analytics 4의 속성 ID를 입력하세요
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OAuth Client ID *
                </label>
                <input
                  type="text"
                  value={formData.clientId}
                  onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                  placeholder="예: 123456789-abcdefghijklmnop.apps.googleusercontent.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Google Cloud Console에서 생성한 OAuth 클라이언트 ID
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OAuth Client Secret *
                </label>
                <input
                  type="password"
                  value={formData.clientSecret}
                  onChange={(e) => setFormData({...formData, clientSecret: e.target.value})}
                  placeholder="클라이언트 시크릿을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  OAuth 클라이언트와 함께 제공되는 시크릿 키
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refresh Token *
                </label>
                <textarea
                  value={formData.refreshToken}
                  onChange={(e) => setFormData({...formData, refreshToken: e.target.value})}
                  placeholder="리프레시 토큰을 입력하세요"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Google OAuth 인증 후 받은 리프레시 토큰
                </p>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? '저장 중...' : '설정 저장'}
                </button>
                
                {config?.isConfigured && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    설정 삭제
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAnalyticsConfig; 
 
 