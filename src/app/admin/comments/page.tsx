"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "../components/AdminLayout";
import AdminCard from "../components/AdminCard";
import AdminGrid from "../components/AdminGrid";

interface Comment {
  id: number;
  content: string;
  author: string;
  blogTitle: string;
  date: string;
  isHidden?: boolean;
}

const CommentManagement: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number|null>(null);
  const [editContent, setEditContent] = useState<string>('');

  // 댓글 목록 새로고침
  const refresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/comments', {
        headers: { 'Authorization': 'Bearer admin-token' }
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || data || []);
      }
    } catch (error) {
      console.error('댓글 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // 댓글 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('정말 이 댓글을 삭제하시겠습니까?')) return;
    
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer admin-token' }
      });
      if (response.ok) {
        setComments(comments.filter(c => c.id !== id));
        alert('댓글이 삭제되었습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 오류:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 댓글 숨김/표시 토글
  const handleToggleHide = async (id: number, isHidden: boolean) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({ isHidden: !isHidden })
      });
      if (response.ok) {
        setComments(comments.map(c => c.id === id ? { ...c, isHidden: !isHidden } : c));
        alert(isHidden ? '댓글이 표시되었습니다.' : '댓글이 숨겨졌습니다.');
      }
    } catch (error) {
      console.error('댓글 상태 변경 오류:', error);
      alert('댓글 상태 변경에 실패했습니다.');
    }
  };

  // 댓글 수정 시작
  const handleEdit = (id: number, content: string) => {
    setEditId(id);
    setEditContent(content);
  };

  // 댓글 수정 저장
  const handleEditSave = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        },
        body: JSON.stringify({ content: editContent })
      });
      if (response.ok) {
        setComments(comments.map(c => c.id === id ? { ...c, content: editContent } : c));
        setEditId(null);
        setEditContent('');
        alert('댓글이 수정되었습니다.');
      }
    } catch (error) {
      console.error('댓글 수정 오류:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditId(null);
    setEditContent('');
  };

  if (loading) {
    return (
      <AdminLayout 
        title="댓글 관리" 
        description="등록된 모든 댓글을 확인하고 관리할 수 있습니다."
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">댓글 목록을 불러오는 중...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="댓글 관리" 
      description="등록된 모든 댓글을 확인하고 관리할 수 있습니다."
    >
      {/* 통계 카드 */}
      <AdminGrid cols={4} className="mb-6 sm:mb-8">
        <AdminCard className="text-center">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">총 댓글 수</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{comments.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="text-center">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">표시된 댓글</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{comments.filter(c => !c.isHidden).length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="text-center">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">숨겨진 댓글</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{comments.filter(c => c.isHidden).length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="text-center">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">댓글 작성자 수</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">{new Set(comments.map(c => c.author)).size}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </AdminCard>
      </AdminGrid>

      {/* 메인 콘텐츠 */}
      <AdminCard 
        title="댓글 목록" 
        description="등록된 모든 댓글을 확인하고 관리할 수 있습니다."
      >
        {/* 댓글 목록 */}
        <div className="divide-y divide-gray-100">
          {comments.length === 0 ? (
            <div className="py-8 sm:py-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">등록된 댓글이 없습니다</h3>
              <p className="text-sm text-gray-600">새 댓글이 등록되면 여기에 표시됩니다.</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="py-4 sm:py-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-3">
                      {/* 작성자 아바타 */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs sm:text-sm">
                          {comment.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      {/* 작성자 정보 */}
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                        <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {new Date(comment.date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        {comment.isHidden && (
                          <span className="inline-flex px-2 sm:px-3 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full w-fit">
                            숨김
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 수정 모드 */}
                    {editId === comment.id ? (
                      <div className="space-y-3">
                        <textarea
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-sm"
                          rows={3}
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          placeholder="댓글 내용을 입력하세요..."
                        />
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                          <button 
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            onClick={() => handleEditSave(comment.id)}
                          >
                            저장
                          </button>
                          <button 
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            onClick={handleEditCancel}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{comment.content}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          게시글: <span className="font-medium text-gray-900">{comment.blogTitle}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:ml-6">
                    <button 
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleEdit(comment.id, comment.content)}
                      disabled={editId !== null}
                    >
                      수정
                    </button>
                    <button 
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleToggleHide(comment.id, !!comment.isHidden)}
                      disabled={editId !== null}
                    >
                      {comment.isHidden ? '표시' : '숨김'}
                    </button>
                    <button 
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDelete(comment.id)}
                      disabled={editId !== null}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </AdminCard>
    </AdminLayout>
  );
};

export default CommentManagement; 
 
 