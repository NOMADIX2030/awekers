"use client";

import { useState } from 'react';

interface InquiryResult {
  id: number;
  referenceNo: string;
  serviceType: string;
  name: string;
  email: string;
  company: string | null;
  category: string;
  subcategory: string | null;
  message: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  adminResponse: string | null;
  createdAt: string;
  updatedAt: string;
  responses?: InquiryResponse[];
}

interface InquiryResponse {
  id: number;
  adminId: string;
  adminName: string;
  responseType: 'RESPONSE' | 'STATUS_CHANGE' | 'INTERNAL_MEMO';
  content: string;
  isVisibleToCustomer: boolean;
  createdAt: string;
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200'
};

const STATUS_LABELS = {
  PENDING: '접수 완료',
  PROCESSING: '처리 중',
  COMPLETED: '대응 완료',
  CANCELLED: '취소됨'
};

const STATUS_DESCRIPTIONS = {
  PENDING: '문의가 접수되었습니다. 곧 담당자가 확인할 예정입니다.',
  PROCESSING: '담당자가 문의를 검토하고 있습니다.',
  COMPLETED: '문의에 대한 고객 대응이 완료되었습니다.',
  CANCELLED: '문의가 취소되었습니다.'
};

const RESPONSE_TYPE_LABELS = {
  RESPONSE: '담당자 답변',
  STATUS_CHANGE: '처리 상태 변경',
  INTERNAL_MEMO: '처리 진행사항'
};

const RESPONSE_TYPE_COLORS = {
  RESPONSE: 'bg-blue-50 border-blue-200',
  STATUS_CHANGE: 'bg-green-50 border-green-200', 
  INTERNAL_MEMO: 'bg-purple-50 border-purple-200'
};

const RESPONSE_TYPE_TEXT_COLORS = {
  RESPONSE: 'text-blue-900',
  STATUS_CHANGE: 'text-green-900',
  INTERNAL_MEMO: 'text-purple-900'
};

export default function InquiryCheckPage() {
  const [searchForm, setSearchForm] = useState({
    email: '',
    inquiryId: ''
  });
  const [inquiries, setInquiries] = useState<InquiryResult[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searchMethod, setSearchMethod] = useState<'email' | 'both'>('email');

  const handleInputChange = (field: keyof typeof searchForm, value: string) => {
    setSearchForm(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (notFound) setNotFound(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 이메일은 필수, 문의번호는 선택사항
    if (!searchForm.email.trim()) {
      setError('이메일 주소를 입력해주세요.');
      return;
    }

    // 문의번호가 있으면 정확한 검색, 없으면 이메일로 전체 검색
    if (searchMethod === 'both' && searchForm.inquiryId && !searchForm.inquiryId.trim()) {
      setError('문의번호를 입력하거나 이메일만으로 검색해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setNotFound(false);
    setInquiries([]);
    setSelectedInquiry(null);

    try {
      const response = await fetch(`/api/inquiry-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: searchForm.email.trim(),
          inquiryId: searchForm.inquiryId.trim() ? parseInt(searchForm.inquiryId) : null,
          searchMethod: searchMethod
        })
      });

      const result = await response.json();

      if (result.success) {
        if (Array.isArray(result.data)) {
          setInquiries(result.data);
          if (result.data.length === 1) {
            setSelectedInquiry(result.data[0]);
          }
        } else {
          setSelectedInquiry(result.data);
          setInquiries([result.data]);
        }
      } else {
        if (response.status === 404) {
          setNotFound(true);
        } else {
          setError(result.error || '조회 중 오류가 발생했습니다.');
        }
      }
    } catch (error) {
      console.error('문의 조회 오류:', error);
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">문의 조회</h1>
            <p className="text-gray-600">
              문의번호와 이메일로 문의 상태와 고객 대응 내용을 확인하실 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일 주소 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={searchForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="문의 시 사용한 이메일 주소를 입력하세요"
                required
              />
            </div>

            {/* 검색 방식 선택 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-start cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="searchMethod"
                    value="email"
                    checked={searchMethod === 'email'}
                    onChange={() => {
                      setSearchMethod('email');
                      setSearchForm(prev => ({ ...prev, inquiryId: '' }));
                    }}
                    className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="font-medium text-gray-900 flex items-center">
                      💌 이메일만으로 검색
                    </span>
                    <p className="text-sm text-gray-600 mt-1">해당 이메일로 등록된 모든 문의를 찾아드립니다</p>
                  </div>
                </label>
                <label className="flex items-start cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="searchMethod"
                    value="both"
                    checked={searchMethod === 'both'}
                    onChange={() => setSearchMethod('both')}
                    className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="font-medium text-gray-900 flex items-center">
                      🔍 정확한 문의 검색
                    </span>
                    <p className="text-sm text-gray-600 mt-1">문의번호로 특정 문의만 찾습니다</p>
                  </div>
                </label>
              </div>
            </div>

            {/* 문의번호 입력 (조건부 표시) */}
            {searchMethod === 'both' && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                <label htmlFor="inquiryId" className="block text-sm font-medium text-gray-700 mb-2">
                  문의번호/참조번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="inquiryId"
                    value={searchForm.inquiryId}
                    onChange={(e) => handleInputChange('inquiryId', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="예: 123 또는 AWE-2025-123456"
                    required={searchMethod === 'both'}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400 text-sm">#</span>
                  </div>
                </div>
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-700">
                    💡 <strong>참조번호를 모르시나요?</strong><br/>
                    문의 접수 시 발송된 이메일을 확인하거나, &quot;이메일만으로 검색&quot;을 선택해보세요.<br/>
                    <strong>참조번호 예시:</strong> AWE-2025-123456 또는 숫자 ID (123)
                  </p>
                </div>
              </div>
            )}



            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* 문의를 찾을 수 없음 */}
            {notFound && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-orange-700 font-medium">문의를 찾을 수 없습니다</p>
                    <p className="text-orange-600 text-sm mt-1">
                      이메일과 문의번호를 다시 확인해주세요. 문의번호는 문의 완료 후 이메일로 발송됩니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 조회 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  조회 중...
                </span>
              ) : (
                '문의 조회'
              )}
            </button>
          </form>
        </div>
      </div>

              {/* 조회 결과 목록 (여러 문의) */}
        {inquiries.length > 1 && !selectedInquiry && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">문의 내역</h2>
                <p className="text-gray-600 mt-2">총 {inquiries.length}건의 문의를 찾았습니다.</p>
              </div>
              <div className="divide-y divide-gray-200">
                {inquiries.map((inquiry) => (
                  <div 
                    key={inquiry.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {inquiry.referenceNo}
                          </h3>
                          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${STATUS_COLORS[inquiry.status]}`}>
                            {STATUS_LABELS[inquiry.status]}
                          </div>
                        </div>
                        <p className="text-gray-600 mt-1">{inquiry.serviceType} - {inquiry.category}</p>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{inquiry.message}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>등록일: {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}</span>
                          {inquiry.responses && inquiry.responses.length > 0 && (
                            <span className="text-green-600">• {inquiry.responses.length}건 답변</span>
                          )}
                        </div>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 조회 결과 상세 */}
        {selectedInquiry && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {/* 뒤로가기 버튼 (여러 문의가 있을 때만) */}
            {inquiries.length > 1 && (
              <button
                onClick={() => setSelectedInquiry(null)}
                className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                목록으로 돌아가기
              </button>
            )}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* 헤더 */}
            <div className="bg-gray-50 px-8 py-6 border-b">
                              <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedInquiry.referenceNo}
                    </h2>
                  <p className="text-gray-600 mt-1">
                    {new Date(selectedInquiry.createdAt).toLocaleString('ko-KR')}에 접수
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full border ${STATUS_COLORS[selectedInquiry.status]}`}>
                  <span className="font-medium text-sm">{STATUS_LABELS[selectedInquiry.status]}</span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* 진행 상태 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">처리 상태</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      selectedInquiry.status === 'COMPLETED' ? 'bg-green-500' :
                      selectedInquiry.status === 'PROCESSING' ? 'bg-blue-500 animate-pulse' :
                      selectedInquiry.status === 'CANCELLED' ? 'bg-red-500' :
                      'bg-yellow-500 animate-pulse'
                    }`}></div>
                    <span className="font-medium text-gray-900">{STATUS_LABELS[selectedInquiry.status]}</span>
                  </div>
                  <p className="text-gray-600 text-sm ml-6">
                    {STATUS_DESCRIPTIONS[selectedInquiry.status]}
                  </p>
                </div>
              </div>

              {/* 문의 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">문의 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">서비스</dt>
                      <dd className="text-gray-900 mt-1">{selectedInquiry.serviceType}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">카테고리</dt>
                      <dd className="text-gray-900 mt-1">{selectedInquiry.category}</dd>
                    </div>
                    {selectedInquiry.subcategory && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">세부 항목</dt>
                        <dd className="text-gray-900 mt-1">{selectedInquiry.subcategory}</dd>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">문의자</dt>
                      <dd className="text-gray-900 mt-1">{selectedInquiry.name}</dd>
                    </div>
                    {selectedInquiry.company && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">회사명</dt>
                        <dd className="text-gray-900 mt-1">{selectedInquiry.company}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-gray-500">최종 업데이트</dt>
                      <dd className="text-gray-900 mt-1">
                        {new Date(selectedInquiry.updatedAt).toLocaleString('ko-KR')}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>

              {/* 문의 내용 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">문의 내용</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>

              {/* 대응 히스토리 */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">담당자 대응 히스토리</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedInquiry.responses && selectedInquiry.responses.filter(r => r.isVisibleToCustomer).length > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      <svg className={`w-4 h-4 mr-1.5 ${
                        selectedInquiry.responses && selectedInquiry.responses.filter(r => r.isVisibleToCustomer).length > 0 
                          ? '' : 'animate-pulse'
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {selectedInquiry.responses && selectedInquiry.responses.filter(r => r.isVisibleToCustomer).length > 0 
                        ? `${selectedInquiry.responses.filter(r => r.isVisibleToCustomer).length}건 대응완료`
                        : '대응 진행 중'
                      }
                    </span>
                  </div>
                </div>

                {/* 대화형 히스토리 */}
                {selectedInquiry.responses && selectedInquiry.responses.filter(r => r.isVisibleToCustomer).length > 0 ? (
                  <div className="space-y-6">
                    {/* 초기 문의 */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{selectedInquiry.name}님의 문의</span>
                            <time className="text-xs text-gray-500">
                              {new Date(selectedInquiry.createdAt).toLocaleString('ko-KR')}
                            </time>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {selectedInquiry.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 담당자 대응 히스토리 */}
                    {selectedInquiry.responses
                      .filter(response => response.isVisibleToCustomer)
                      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                      .map((response, index) => (
                        <div key={response.id} className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`border rounded-lg p-4 ${RESPONSE_TYPE_COLORS[response.responseType]}`}>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium text-sm ${RESPONSE_TYPE_TEXT_COLORS[response.responseType]}`}>
                                    {RESPONSE_TYPE_LABELS[response.responseType]}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white bg-opacity-70">
                                    {response.adminName} 담당자
                                  </span>
                                </div>
                                <time className="text-xs text-gray-500">
                                  {new Date(response.createdAt).toLocaleString('ko-KR')}
                                </time>
                              </div>
                              <div className={`${RESPONSE_TYPE_TEXT_COLORS[response.responseType]} leading-relaxed whitespace-pre-wrap text-sm`}>
                                {response.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    
                    {/* 진행 상태 표시 */}
                    {selectedInquiry.status !== 'COMPLETED' && (
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <p className="text-orange-900 font-medium text-sm">추가 대응 준비 중...</p>
                            <p className="text-orange-700 text-xs mt-1">
                              담당자가 추가 검토를 진행하고 있습니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-gray-400 text-5xl mb-4">⏳</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">대응 준비 중입니다</h4>
                    <p className="text-gray-600 mb-1">
                      담당자가 문의를 검토하고 있습니다.
                    </p>
                    <p className="text-sm text-gray-500">
                      24시간 내에 첫 번째 대응을 시작하겠습니다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 도움말 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">도움말</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• 문의번호는 문의 완료 후 등록하신 이메일로 발송됩니다.</p>
            <p>• 문의 상태는 실시간으로 업데이트됩니다.</p>
            <p>• 추가 문의사항이 있으시면 02-1234-5678로 연락해주세요.</p>
          </div>
        </div>
      </div>
    </main>
  );
} 