"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminCard from '../components/AdminCard';

interface Inquiry {
  id: number;
  serviceType: string;
  name: string;
  phone: string;
  email: string;
  company: string | null;
  industry: string;
  category: string;
  subcategory: string | null;
  budget: string | null;
  message: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  adminResponse: string | null;
  ipAddress: string;
  userAgent: string;
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

interface InquiryStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
};

const STATUS_LABELS = {
  PENDING: '대기중',
  PROCESSING: '처리중',
  COMPLETED: '완료',
  CANCELLED: '취소'
};

const RESPONSE_TYPE_LABELS = {
  RESPONSE: '고객 답변',
  STATUS_CHANGE: '상태 변경',
  INTERNAL_MEMO: '내부 메모'
};

const RESPONSE_TYPE_COLORS = {
  RESPONSE: 'bg-blue-50 border-blue-200 text-blue-800',
  STATUS_CHANGE: 'bg-green-50 border-green-200 text-green-800', 
  INTERNAL_MEMO: 'bg-gray-50 border-gray-200 text-gray-800'
};

const RESPONSE_TYPE_ICONS = {
  RESPONSE: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  ),
  STATUS_CHANGE: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
  ),
  INTERNAL_MEMO: (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
    </svg>
  )
};

export default function InquiriesManagementPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<InquiryStats>({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터링 상태
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 모달 상태
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // 새 대응 추가 상태
  const [newResponseContent, setNewResponseContent] = useState('');
  const [newResponseType, setNewResponseType] = useState<'RESPONSE' | 'STATUS_CHANGE' | 'INTERNAL_MEMO'>('RESPONSE');
  const [showSuccessMessage, setShowSuccessMessage] = useState('');
  const [isVisibleToCustomer, setIsVisibleToCustomer] = useState(true);
  const [isAddingResponse, setIsAddingResponse] = useState(false);
  
  // 담당자 정보 (실제로는 로그인 정보에서 가져와야 함)
  const currentAdmin = {
    id: 'admin001', // 실제로는 로그인 세션에서 가져옴
    name: '관리자' // 실제로는 로그인 세션에서 가져옴
  };

  // 문의 목록 및 통계 로드
  const fetchInquiries = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (statusFilter) params.append('status', statusFilter);
      if (serviceTypeFilter) params.append('serviceType', serviceTypeFilter);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const response = await fetch(`/api/admin/inquiries?${params}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'admin-key'}`
        }
      });

      if (!response.ok) {
        throw new Error('문의 목록을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      
      if (data.success) {
        setInquiries(data.data);
        setCurrentPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
        
        // 통계 계산
        const newStats = data.data.reduce((acc: InquiryStats, inquiry: Inquiry) => {
          acc.total++;
          acc[inquiry.status.toLowerCase() as keyof InquiryStats]++;
          return acc;
        }, { total: 0, pending: 0, processing: 0, completed: 0, cancelled: 0 });
        
        setStats(newStats);
      } else {
        throw new Error(data.error || '데이터 로드 실패');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 문의 상태 변경
  const updateInquiryStatus = async (inquiryId: number, newStatus: string, response?: string) => {
    try {
      setIsUpdatingStatus(true);
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'admin-key'}`
        },
        body: JSON.stringify({
          status: newStatus,
          adminResponse: response || undefined
        })
      });

      const data = await res.json();
      
      if (data.success) {
        // 목록 새로고침
        await fetchInquiries(currentPage);
        
        // 선택된 문의 업데이트
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry({
            ...selectedInquiry,
            status: newStatus as any,
            adminResponse: response || selectedInquiry.adminResponse
          });
        }
        
        alert('문의 상태가 성공적으로 업데이트되었습니다.');
      } else {
        throw new Error(data.error || '상태 업데이트 실패');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '상태 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // 문의 삭제 함수
  const deleteInquiry = async (inquiryId: number, inquiryName: string) => {
    if (!confirm(`정말로 "${inquiryName}"님의 문의를 삭제하시겠습니까?\n\n삭제된 문의와 모든 대응 히스토리는 복구할 수 없습니다.`)) {
      return;
    }

    try {
      setIsUpdatingStatus(true);
      const response = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'admin-key'}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        // 모달 닫기
        if (selectedInquiry?.id === inquiryId) {
          closeDetailModal();
        }
        
        // 목록 새로고침
        await fetchInquiries(currentPage);
        
        alert(result.message || '문의가 성공적으로 삭제되었습니다.');
      } else {
        throw new Error(result.error || '문의 삭제 실패');
      }
    } catch (error) {
      console.error('문의 삭제 중 오류:', error);
      alert(error instanceof Error ? error.message : '문의 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // 검색 및 필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
    fetchInquiries(1);
  }, [statusFilter, serviceTypeFilter, searchTerm]);

  // 페이지 변경 시 데이터 로드
  useEffect(() => {
    if (currentPage > 1) {
      fetchInquiries(currentPage);
    }
  }, [currentPage]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchInquiries(1);
  }, []);

  // 문의 상세보기 모달 열기
  const openDetailModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setAdminResponse(inquiry.adminResponse || '');
    setIsDetailModalOpen(true);
  };

  // 모달 닫기
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedInquiry(null);
    setAdminResponse('');
  };

  // 새 대응 추가 함수 (실시간 반영)
  const addNewResponse = async () => {
    if (!selectedInquiry || !newResponseContent.trim()) {
      alert('대응 내용을 입력해주세요.');
      return;
    }

    setIsAddingResponse(true);

    try {
      const response = await fetch(`/api/admin/inquiries/${selectedInquiry.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'admin-key'}`
        },
        body: JSON.stringify({
          adminId: currentAdmin.id,
          adminName: currentAdmin.name,
          responseType: newResponseType,
          content: newResponseContent.trim(),
          isVisibleToCustomer: isVisibleToCustomer
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // 실시간으로 새 대응을 히스토리에 추가
        const newResponse: InquiryResponse = {
          id: result.data.id,
          adminId: result.data.adminId,
          adminName: result.data.adminName,
          responseType: result.data.responseType,
          content: result.data.content,
          isVisibleToCustomer: result.data.isVisibleToCustomer,
          createdAt: result.data.createdAt
        };

        // selectedInquiry 실시간 업데이트
        const updatedInquiry = {
          ...selectedInquiry,
          responses: [...(selectedInquiry.responses || []), newResponse],
          updatedAt: new Date().toISOString()
        };
        setSelectedInquiry(updatedInquiry);

        // 목록에서도 해당 문의 업데이트
        setInquiries(prevInquiries => 
          prevInquiries.map(inquiry => 
            inquiry.id === selectedInquiry.id 
              ? { ...inquiry, responses: updatedInquiry.responses, updatedAt: updatedInquiry.updatedAt }
              : inquiry
          )
        );
        
        // 입력 폼 초기화
        setNewResponseContent('');
        setNewResponseType('RESPONSE');
        setIsVisibleToCustomer(true);
        
        // 성공 알림
        setShowSuccessMessage('새 대응이 성공적으로 추가되었습니다! 🎉');
        setTimeout(() => setShowSuccessMessage(''), 3000);
      } else {
        throw new Error(result.error || '대응 추가 실패');
      }
    } catch (error) {
      console.error('대응 추가 중 오류:', error);
      alert(error instanceof Error ? error.message : '대응 추가 중 오류가 발생했습니다.');
    } finally {
      setIsAddingResponse(false);
    }
  };

  if (loading && inquiries.length === 0) {
    return (
      <AdminLayout title="문의 관리">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">문의 목록을 불러오는 중...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="문의 관리">
        <AdminCard title="오류 발생">
          <div className="text-center py-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">데이터 로드 실패</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => fetchInquiries(currentPage)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </AdminCard>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="문의 관리">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">문의 관리</h1>
        <p className="text-gray-600">고객 문의를 확인하고 관리합니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <AdminCard title="전체 문의" className="text-center">
          <div className="text-3xl font-bold text-blue-600">{totalCount.toLocaleString()}</div>
        </AdminCard>
        <AdminCard title="대기중" className="text-center">
          <div className="text-3xl font-bold text-yellow-600">{stats.pending.toLocaleString()}</div>
        </AdminCard>
        <AdminCard title="처리중" className="text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.processing.toLocaleString()}</div>
        </AdminCard>
        <AdminCard title="완료" className="text-center">
          <div className="text-3xl font-bold text-green-600">{stats.completed.toLocaleString()}</div>
        </AdminCard>
        <AdminCard title="취소" className="text-center">
          <div className="text-3xl font-bold text-red-600">{stats.cancelled.toLocaleString()}</div>
        </AdminCard>
      </div>

      {/* 필터 및 검색 */}
      <AdminCard title="필터 및 검색" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 상태 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">전체 상태</option>
              <option value="PENDING">대기중</option>
              <option value="PROCESSING">처리중</option>
              <option value="COMPLETED">완료</option>
              <option value="CANCELLED">취소</option>
            </select>
          </div>

          {/* 서비스 타입 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">서비스</label>
            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">전체 서비스</option>
              <option value="SEO 캠페인">SEO 캠페인</option>
              <option value="AI 블로그">AI 블로그</option>
              <option value="AI 챗봇">AI 챗봇</option>
              <option value="홈페이지 제작">홈페이지 제작</option>
              <option value="AI 자동화">AI 자동화</option>
              <option value="AI 데이터베이스">AI 데이터베이스</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 검색 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이름, 이메일, 회사명으로 검색..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </AdminCard>

      {/* 문의 목록 */}
      <AdminCard title={`문의 목록 (${totalCount.toLocaleString()}건)`}>
        {inquiries.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📞</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">문의가 없습니다</h3>
            <p className="text-gray-600">검색 조건을 변경하거나 새로운 문의를 기다려보세요.</p>
          </div>
        ) : (
          <>
            {/* 테이블 */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-900">문의정보</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">서비스</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">상태</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">등록일</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-900">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium text-gray-900">{inquiry.name}</div>
                          <div className="text-gray-600 text-xs">{inquiry.email}</div>
                          {inquiry.company && (
                            <div className="text-gray-500 text-xs">{inquiry.company}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {inquiry.serviceType}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[inquiry.status]}`}>
                          {STATUS_LABELS[inquiry.status]}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {new Date(inquiry.createdAt).toLocaleString('ko-KR')}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1 flex-wrap">
                          <button
                            onClick={() => openDetailModal(inquiry)}
                            className="text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded"
                          >
                            상세보기
                          </button>
                          {inquiry.status === 'PENDING' && (
                            <button
                              onClick={() => updateInquiryStatus(inquiry.id, 'PROCESSING')}
                              disabled={isUpdatingStatus}
                              className="text-orange-600 hover:text-orange-800 text-xs bg-orange-50 px-2 py-1 rounded disabled:opacity-50"
                            >
                              처리시작
                            </button>
                          )}
                          {inquiry.status === 'PROCESSING' && (
                            <button
                              onClick={() => updateInquiryStatus(inquiry.id, 'COMPLETED')}
                              disabled={isUpdatingStatus}
                              className="text-green-600 hover:text-green-800 text-xs bg-green-50 px-2 py-1 rounded disabled:opacity-50"
                            >
                              완료
                            </button>
                          )}
                          <button
                            onClick={() => deleteInquiry(inquiry.id, inquiry.name)}
                            disabled={isUpdatingStatus}
                            className="text-red-600 hover:text-red-800 text-xs bg-red-50 px-2 py-1 rounded disabled:opacity-50"
                            title="문의 삭제"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  이전
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded text-sm ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </AdminCard>

      {/* 문의 상세보기 모달 */}
      {isDetailModalOpen && selectedInquiry && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                문의 상세보기 #{selectedInquiry.id}
              </h3>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">고객 정보</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">이름</dt>
                      <dd className="text-sm text-gray-900">{selectedInquiry.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">연락처</dt>
                      <dd className="text-sm text-gray-900">{selectedInquiry.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">이메일</dt>
                      <dd className="text-sm text-gray-900">{selectedInquiry.email}</dd>
                    </div>
                    {selectedInquiry.company && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">회사명</dt>
                        <dd className="text-sm text-gray-900">{selectedInquiry.company}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-gray-500">업종</dt>
                      <dd className="text-sm text-gray-900">{selectedInquiry.industry}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">문의 정보</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">서비스</dt>
                      <dd className="text-sm text-gray-900">{selectedInquiry.serviceType}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">카테고리</dt>
                      <dd className="text-sm text-gray-900">{selectedInquiry.category}</dd>
                    </div>
                    {selectedInquiry.subcategory && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">세부 항목</dt>
                        <dd className="text-sm text-gray-900">{selectedInquiry.subcategory}</dd>
                      </div>
                    )}
                    {selectedInquiry.budget && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">예산</dt>
                        <dd className="text-sm text-gray-900">{selectedInquiry.budget}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-gray-500">상태</dt>
                      <dd className="text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${STATUS_COLORS[selectedInquiry.status]}`}>
                          {STATUS_LABELS[selectedInquiry.status]}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">등록일</dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(selectedInquiry.createdAt).toLocaleString('ko-KR')}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* 문의 내용 */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">문의 내용</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </div>

              {/* 고객 대응 히스토리 */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-medium text-gray-900">고객 대응 히스토리</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedInquiry.responses && selectedInquiry.responses.length > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      <svg className={`w-3 h-3 mr-1 ${
                        selectedInquiry.responses && selectedInquiry.responses.length > 0 ? '' : 'animate-pulse'
                      }`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {selectedInquiry.responses && selectedInquiry.responses.length > 0 
                        ? `${selectedInquiry.responses.length}건 대응완료`
                        : '대응 대기'
                      }
                    </span>
                  </div>
                </div>

                {/* 대응 히스토리 타임라인 */}
                <div className="mb-6">
                  {selectedInquiry.responses && selectedInquiry.responses.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {selectedInquiry.responses.map((response, index) => (
                        <div key={response.id} className="relative">
                          {/* 타임라인 선 */}
                          {index < selectedInquiry.responses!.length - 1 && (
                            <div className="absolute left-5 top-8 w-0.5 h-full bg-gray-200"></div>
                          )}
                          
                          {/* 대응 카드 */}
                          <div className="flex gap-4">
                            {/* 아이콘 */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${RESPONSE_TYPE_COLORS[response.responseType]} border-opacity-20`}>
                              {RESPONSE_TYPE_ICONS[response.responseType]}
                            </div>
                            
                            {/* 내용 */}
                            <div className="flex-1 min-w-0">
                              <div className={`p-4 rounded-lg border ${RESPONSE_TYPE_COLORS[response.responseType]}`}>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">
                                      {RESPONSE_TYPE_LABELS[response.responseType]}
                                    </span>
                                    {!response.isVisibleToCustomer && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                        비공개
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    <span className="font-medium">{response.adminName}</span>
                                    <span className="mx-1">•</span>
                                    <time dateTime={response.createdAt}>
                                      {new Date(response.createdAt).toLocaleString('ko-KR')}
                                    </time>
                                  </div>
                                </div>
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                  {response.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <div className="text-gray-400 text-4xl mb-2">💬</div>
                      <p className="text-gray-500 text-sm">아직 대응 내역이 없습니다.</p>
                      <p className="text-gray-400 text-xs mt-1">아래에서 첫 번째 대응을 시작하세요.</p>
                    </div>
                  )}
                </div>

                {/* 새 대응 추가 */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-900">새 대응 추가</h5>
                    <div className="flex items-center gap-4 text-sm">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isVisibleToCustomer}
                          onChange={(e) => setIsVisibleToCustomer(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        고객에게 공개
                      </label>
                    </div>
                  </div>
                  
                  {/* 대응 유형 선택 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">대응 유형</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {Object.entries(RESPONSE_TYPE_LABELS).map(([type, label]) => (
                        <label
                          key={type}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                            newResponseType === type
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="responseType"
                            value={type}
                            checked={newResponseType === type}
                            onChange={(e) => setNewResponseType(e.target.value as any)}
                            className="sr-only"
                          />
                          <div className="flex items-center gap-2">
                            {RESPONSE_TYPE_ICONS[type as keyof typeof RESPONSE_TYPE_ICONS]}
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 대응 내용 작성 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      대응 내용
                    </label>
                    <textarea
                      value={newResponseContent}
                      onChange={(e) => setNewResponseContent(e.target.value)}
                      rows={6}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="새로운 대응 내용을 입력하세요..."
                    />
                  </div>
                </div>
              </div>

              {/* 대응 추가 및 상태 변경 버튼 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={addNewResponse}
                  disabled={isAddingResponse || !newResponseContent.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isAddingResponse ? '추가 중...' : '대응 내용 추가'}
                </button>
                
                <div className="flex gap-2">
                  {selectedInquiry.status === 'PENDING' && (
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'PROCESSING')}
                      disabled={isUpdatingStatus}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 font-medium"
                    >
                      처리 시작
                    </button>
                  )}
                  
                  {selectedInquiry.status === 'PROCESSING' && (
                    <button
                      onClick={() => updateInquiryStatus(selectedInquiry.id, 'COMPLETED')}
                      disabled={isUpdatingStatus}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium"
                    >
                      처리 완료
                    </button>
                  )}
                  
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'CANCELLED')}
                    disabled={isUpdatingStatus}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 font-medium"
                  >
                    취소
                  </button>
                  
                  <button
                    onClick={() => deleteInquiry(selectedInquiry.id, selectedInquiry.name)}
                    disabled={isUpdatingStatus}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                    title="문의 영구 삭제"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* 모달 하단 닫기 버튼 */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    문의 ID: {selectedInquiry.id} • 등록일: {new Date(selectedInquiry.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                  <button
                    onClick={closeDetailModal}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 성공 알림 토스트 */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {showSuccessMessage}
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 