'use client';

import React, { useState } from 'react';
import { Comment } from '@/types/comment';

interface CommentItemProps {
  comment: Comment;
  blogId: number;
  currentUserId: number | null;
  isCurrentUserAdmin: boolean;
  onLike: (commentId: number) => void;
  onReport: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  likedComments: Set<number>;
  reportedComments: Set<number>;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  blogId,
  currentUserId,
  isCurrentUserAdmin,
  onLike,
  onReport,
  onDelete,
  likedComments,
  reportedComments
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = currentUserId && (comment.userId === currentUserId || isCurrentUserAdmin);
  const isLiked = likedComments.has(comment.id);
  const isReported = reportedComments.has(comment.id);
  const isHiddenByReports = comment._count.reports >= 3;

  return (
    <div className="group relative">
      <div className="flex gap-3">
        {/* 사용자 아바타 */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-semibold text-sm">
            {comment.user.email.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* 댓글 내용 */}
        <div className="flex-1 min-w-0">
          <div className="bg-black/5 rounded-2xl px-4 py-3 border border-black/5">
            {/* 댓글 헤더 */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-semibold text-black text-sm">
                {comment.user.email.split('@')[0]}
              </span>
              
              {comment.user.isAdmin && (
                <span className="bg-black text-white px-2 py-0.5 rounded-full text-xs font-medium">
                  관리자
                </span>
              )}
              
              <span className="text-black/30 text-xs">•</span>
              <span className="text-black/50 text-xs">
                {formatDate(comment.createdAt)}
              </span>
              
              {/* 신고 횟수 표시 */}
              {comment._count.reports > 0 && (
                <>
                  <span className="text-black/30 text-xs">•</span>
                  <span className={`text-xs font-medium flex items-center gap-1 ${
                    comment._count.reports >= 3 
                      ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200' 
                      : 'text-red-500'
                  }`}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    신고 {comment._count.reports}회
                    {comment._count.reports >= 3 && (
                      <span className="ml-1 text-xs">⚠️</span>
                    )}
                  </span>
                </>
              )}
            </div>

            {/* 댓글 본문 */}
            <div className="text-black/80 text-sm leading-relaxed whitespace-pre-line">
              {isHiddenByReports ? (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="font-medium">해당 댓글은 신고 누적으로 볼 수 없습니다.</span>
                </div>
              ) : (
                comment.content
              )}
            </div>
          </div>

          {/* 댓글 액션 버튼 (호버 시 표시) */}
          {currentUserId && !isHiddenByReports && (
            <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* 답글 버튼 (나중에 구현 예정) */}
              <button className="text-black/50 hover:text-black text-xs font-medium transition-colors">
                답글
              </button>

              {/* 좋아요 버튼 */}
              <button 
                onClick={() => onLike(comment.id)}
                className={`text-xs font-medium transition-colors flex items-center gap-1 ${
                  isLiked ? 'text-red-500' : 'text-black/50 hover:text-black'
                }`}
              >
                <svg className="w-3 h-3" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                좋아요 {comment._count.likes}
              </button>

              {/* 신고 버튼 (자신의 댓글이 아닌 경우만) */}
              {comment.userId !== currentUserId && (
                <button 
                  onClick={() => onReport(comment.id)}
                  className={`text-xs font-medium transition-colors ${
                    isReported ? 'text-red-500' : 'text-black/50 hover:text-black'
                  }`}
                >
                  {isReported ? '신고됨' : '신고'}
                </button>
              )}

              {/* 삭제 버튼 (자신의 댓글이거나 관리자인 경우만) */}
              {canDelete && (
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-600 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem; 