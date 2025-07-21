'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../components/AdminLayout';
import AdminCard from '../components/AdminCard';
import AdminGrid from '../components/AdminGrid';

interface AdminComment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  blogId: number;
  isHidden: boolean;
  user: {
    id: number;
    email: string;
    isAdmin: boolean;
  };
  blog: {
    id: number;
    title: string;
  };
  _count: {
    likes: number;
    reports: number;
  };
}

interface CommentStatistics {
  total: number;
  visible: number;
  hidden: number;
  reported: number;
}

const AdminCommentManagementPage: React.FC = () => {
  const router = useRouter();

  // 인증 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('isAdmin') !== 'true') {
        alert('관리자만 접근 가능합니다.');
        router.replace('/login');
      }
    }
  }, [router]);

  // 상태 관리
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [statistics, setStatistics] = useState<CommentStatistics>({
    total: 0,
    visible: 0,
    hidden: 0,
    reported: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 필터링 및 검색
  const [statusFilter, setStatusFilter] = useState<'all' | 'visible' | 'hidden' | 'reported'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 대량 선택
  const [selectedComments, setSelectedComments] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // 댓글 목록 로드
  const loadComments = async (currentPage: number = 1, status: string = statusFilter, search: string = searchTerm) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (status && status !== 'all') {
        params.append('status', status);
      }

      if (search.trim()) {
        params.append('search', search.trim());
      }

      const response = await fetch(`/api/admin/comments?${params}`);
      const data = await response.json();

      if (data.success) {
        setComments(data.data.comments);
        setStatistics(data.data.statistics);
        setPage(data.data.pagination.page);
        setTotalPages(data.data.pagination.pages);
      } else {
        setMessage(`오류: ${data.message}`);
      }
    } catch (error) {
      setMessage('댓글을 불러오는데 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadComments();
  }, []);

  // 필터/검색 변경 시 로드
  const handleFilterSearch = () => {
    setPage(1);
    setSelectedComments(new Set());
    setSelectAll(false);
    loadComments(1, statusFilter, searchTerm);
  };

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadComments(newPage, statusFilter, searchTerm);
    }
  };

  // 개별 선택
  const handleSelectComment = (commentId: number) => {
    const newSelected = new Set(selectedComments);
    if (newSelected.has(commentId)) {
      newSelected.delete(commentId);
    } else {
      newSelected.add(commentId);
    }
    setSelectedComments(newSelected);
    setSelectAll(newSelected.size === comments.length);
  };

  // 전체 선택
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedComments(new Set());
    } else {
      setSelectedComments(new Set(comments.map(c => c.id)));
    }
    setSelectAll(!selectAll);
  };

  // 대량 작업
  const handleBulkAction = async (action: 'hide' | 'show' | 'delete') => {
    if (selectedComments.size === 0) {
      setMessage('처리할 댓글을 선택해주세요.');
      return;
    }

    const actionText = action === 'hide' ? '숨김' : action === 'show' ? '표시' : '삭제';
    
    if (!confirm(`선택한 ${selectedComments.size}개의 댓글을 ${actionText} 처리하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentIds: Array.from(selectedComments),
          action
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setSelectedComments(new Set());
        setSelectAll(false);
        loadComments(page, statusFilter, searchTerm);
      } else {
        setMessage(`오류: ${data.message}`);
      }
    } catch (error) {
      setMessage('작업 처리 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout title="댓글 관리">
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">댓글 관리</h1>
            <p className="text-gray-600 mt-1">댓글 모더레이션 및 관리</p>
          </div>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-800">{message}</div>
            <button
              onClick={() => setMessage('')}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              닫기
            </button>
          </div>
        )}

        {/* 통계 카드 */}
        <AdminGrid cols={4}>
          <AdminCard title="전체 댓글" className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{statistics.total}</div>
            <div className="text-sm text-gray-600">총 댓글 수</div>
          </AdminCard>

          <AdminCard title="표시 중" className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{statistics.visible}</div>
            <div className="text-sm text-gray-600">공개 댓글</div>
          </AdminCard>

          <AdminCard title="숨김 처리" className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{statistics.hidden}</div>
            <div className="text-sm text-gray-600">숨긴 댓글</div>
          </AdminCard>

          <AdminCard title="신고된 댓글" className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{statistics.reported}</div>
            <div className="text-sm text-gray-600">신고 접수</div>
          </AdminCard>
        </AdminGrid>

        {/* 필터 및 검색 */}
        <AdminCard title="필터 및 검색">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태 필터
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">전체</option>
                <option value="visible">표시 중</option>
                <option value="hidden">숨김</option>
                <option value="reported">신고됨</option>
              </select>
            </div>

            <div className="flex-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용 검색
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="댓글 내용 검색..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleFilterSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  검색
                </button>
              </div>
            </div>
          </div>
        </AdminCard>

        {/* 대량 작업 */}
        {selectedComments.size > 0 && (
          <AdminCard>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600">{selectedComments.size}개</span> 댓글이 선택됨
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('show')}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                >
                  표시
                </button>
                <button
                  onClick={() => handleBulkAction('hide')}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                >
                  숨김
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
          </AdminCard>
        )}

        {/* 댓글 목록 */}
        <AdminCard title="댓글 목록">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                댓글을 불러오는 중...
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              댓글이 없습니다.
            </div>
          ) : (
            <>
              {/* 테이블 헤더 */}
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">전체 선택</span>
                </label>
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      selectedComments.has(comment.id)
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${comment.isHidden ? 'opacity-75 bg-yellow-50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {/* 선택 체크박스 */}
                      <input
                        type="checkbox"
                        checked={selectedComments.has(comment.id)}
                        onChange={() => handleSelectComment(comment.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 mt-1"
                      />

                      {/* 댓글 내용 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {comment.user.email}
                              </span>
                              {comment.user.isAdmin && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                  관리자
                                </span>
                              )}
                              {comment.isHidden && (
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                  숨김
                                </span>
                              )}
                              {(comment._count?.reports || 0) > 0 && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                  신고 {comment._count?.reports || 0}회
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {comment.blog.title} • {formatDate(comment.createdAt)}
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            #{comment.id}
                          </div>
                        </div>

                        <div className="text-gray-800 mb-3 whitespace-pre-line">
                          {comment.content}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span>👍 {comment._count?.likes || 0}</span>
                            <span>🚨 {comment._count?.reports || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = Math.max(1, page - 2) + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg ${
                            pageNum === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </AdminCard>
      </div>
    </AdminLayout>
  );
};

export default AdminCommentManagementPage; 