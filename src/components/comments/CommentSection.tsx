'use client';

import React, { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import ReportModal from './ReportModal';
import { Comment, CommentAPIResponse, LikeResponse } from '@/types/comment';

interface CommentSectionProps {
  blogId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  // 상태 관리
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // 사용자 정보
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // 사용자 액션 상태
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [reportedComments, setReportedComments] = useState<Set<number>>(new Set());
  
  // 신고 모달
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

  // 사용자 정보 초기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const id = localStorage.getItem('userId');
      const email = localStorage.getItem('userEmail');
      const admin = localStorage.getItem('isAdmin') === 'true';
      
      setIsLoggedIn(loggedIn);
      setUserId(id ? parseInt(id) : null);
      setUserEmail(email);
      setIsAdmin(admin);
    }
  }, []);

  // 댓글 목록 로드
  const loadComments = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`/api/blog/${blogId}/comments`);
      const data: CommentAPIResponse = await response.json();
      
      if (!response.ok) {
        throw new Error('댓글을 불러오지 못했습니다.');
      }
      
      setComments(data.comments || []);
      
      // 사용자의 좋아요/신고 상태도 로드할 수 있지만, 
      // 현재는 간단히 하기 위해 빈 상태로 시작
      setLikedComments(new Set());
      setReportedComments(new Set());
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '댓글을 불러오는데 실패했습니다.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 댓글 로드
  useEffect(() => {
    loadComments();
  }, [blogId]);

  // 메시지 자동 숨김
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 댓글 추가 핸들러
  const handleCommentAdded = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev]);
  };

  // 좋아요 핸들러
  const handleLike = async (commentId: number) => {
    if (!isLoggedIn || !userId) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    const isLiked = likedComments.has(commentId);
    
    try {
      const response = await fetch(`/api/blog/${blogId}/comments/${commentId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data: LikeResponse = await response.json();

      if (response.ok) {
        // 좋아요 상태 토글
        setLikedComments(prev => {
          const newSet = new Set(prev);
          if (isLiked) {
            newSet.delete(commentId);
          } else {
            newSet.add(commentId);
          }
          return newSet;
        });

        // 댓글 목록의 좋아요 수 업데이트
        setComments(prev => prev.map(comment => 
          comment.id === commentId
            ? { ...comment, _count: { ...comment._count, likes: data.likesCount } }
            : comment
        ));

      } else {
        setMessage(data.message || '좋아요 처리에 실패했습니다.');
      }
    } catch (error) {
      setMessage('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  // 신고 모달 열기
  const handleReportClick = (commentId: number) => {
    if (!isLoggedIn || !userId) {
      setMessage('로그인이 필요합니다.');
      return;
    }
    setSelectedCommentId(commentId);
    setShowReportModal(true);
  };

  // 신고 성공 핸들러
  const handleReportSuccess = (commentId: number) => {
    setReportedComments(prev => new Set(prev).add(commentId));
    // 댓글 목록 새로고침 (신고 수 업데이트 및 숨김 처리 확인)
    loadComments();
  };

  // 댓글 삭제 핸들러
  const handleDelete = async (commentId: number) => {
    if (!isLoggedIn || !userId) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch(`/api/blog/${blogId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        // 댓글 목록에서 삭제
        setComments(prev => prev.filter(c => c.id !== commentId));
        setMessage('댓글이 삭제되었습니다.');
      } else {
        const data = await response.json();
        setMessage(data.message || '댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      setMessage('댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="mt-12">
      {/* 섹션 제목 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-black mb-2">
          댓글 {isLoading ? '로딩 중...' : `${comments.length}개`}
        </h2>
        <div className="h-px bg-black/10"></div>
      </div>

      {/* 메시지 표시 */}
      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
          {message}
        </div>
      )}

      {/* 댓글 작성 폼 */}
      <div className="mb-8">
        <CommentForm
          blogId={blogId}
          isLoggedIn={isLoggedIn}
          userId={userId}
          userEmail={userEmail}
          onCommentAdded={handleCommentAdded}
          onMessage={setMessage}
        />
      </div>

      {/* 댓글 목록 */}
      <div>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 text-black/50">
              <div className="w-4 h-4 border-2 border-black/20 border-t-black/50 rounded-full animate-spin"></div>
              댓글을 불러오는 중...
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12 border-2 border-dashed border-red-200 rounded-lg bg-red-50">
            <div className="text-red-500 mb-2">⚠️</div>
            <div className="text-red-700 font-medium">{error}</div>
            <button
              onClick={loadComments}
              className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
            >
              다시 시도
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-black/10 rounded-lg bg-black/2">
            <div className="text-black/30 text-4xl mb-3">💬</div>
            <div className="text-black font-medium mb-1">아직 댓글이 없습니다</div>
            <div className="text-black/50 text-sm">첫 번째 댓글을 남겨보세요!</div>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                blogId={blogId}
                currentUserId={userId}
                isCurrentUserAdmin={isAdmin}
                onLike={handleLike}
                onReport={handleReportClick}
                onDelete={handleDelete}
                likedComments={likedComments}
                reportedComments={reportedComments}
              />
            ))}
          </div>
        )}
      </div>

      {/* 신고 모달 */}
      <ReportModal
        isOpen={showReportModal}
        commentId={selectedCommentId}
        blogId={blogId}
        userId={userId}
        onClose={() => {
          setShowReportModal(false);
          setSelectedCommentId(null);
        }}
        onReportSuccess={handleReportSuccess}
        onMessage={setMessage}
      />
    </div>
  );
};

export default CommentSection; 