'use client';

import React, { useState } from 'react';
import { CommentFormData, CommentCreateResponse } from '@/types/comment';

interface CommentFormProps {
  blogId: number;
  isLoggedIn: boolean;
  userId: number | null;
  userEmail: string | null;
  onCommentAdded: (comment: any) => void;
  onMessage: (message: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  blogId,
  isLoggedIn,
  userId,
  userEmail,
  onCommentAdded,
  onMessage
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn || !userId) {
      onMessage('로그인이 필요합니다.');
      return;
    }
    
    if (!content.trim()) {
      onMessage('댓글 내용을 입력하세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/blog/${blogId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          userId
        })
      });

      const data: CommentCreateResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '댓글 등록에 실패했습니다.');
      }

      setContent('');
      onCommentAdded(data.comment);
      onMessage('댓글이 등록되었습니다! 🎉');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '댓글 등록에 실패했습니다.';
      onMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-black/5 rounded-2xl p-6 border border-black/5">
        <div className="text-center py-8">
          <div className="text-black/30 text-3xl mb-3">🔒</div>
          <div className="text-black font-medium mb-2">로그인이 필요합니다</div>
          <div className="text-black/50 text-sm mb-4">댓글을 작성하려면 로그인해주세요.</div>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-black/80 transition-colors"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-black/5 rounded-2xl p-6 border border-black/5">
      {/* 사용자 정보 표시 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-semibold text-sm">
          {userEmail?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-black text-sm">
            {userEmail?.split('@')[0]}
          </div>
          <div className="text-black/50 text-xs">댓글 작성 중...</div>
        </div>
      </div>

      {/* 댓글 입력 영역 */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요..."
          disabled={isSubmitting}
          rows={3}
          maxLength={500}
          className="w-full px-4 py-3 border border-black/10 rounded-xl resize-none focus:border-black focus:outline-none disabled:bg-black/5 disabled:cursor-not-allowed transition-colors"
        />
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-black/50">
            {content.length}/500
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-6 py-2 bg-black text-white rounded-full font-medium hover:bg-black/80 disabled:bg-black/30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                등록 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                댓글 등록
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm; 