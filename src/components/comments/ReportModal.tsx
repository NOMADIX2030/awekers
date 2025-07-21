'use client';

import React, { useState, useEffect } from 'react';
import { ReportFormData, ReportResponse } from '@/types/comment';

interface ReportModalProps {
  isOpen: boolean;
  commentId: number | null;
  blogId: number;
  userId: number | null;
  onClose: () => void;
  onReportSuccess: (commentId: number) => void;
  onMessage: (message: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  commentId,
  blogId,
  userId,
  onClose,
  onReportSuccess,
  onMessage
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달이 열릴 때마다 폼 리셋
  useEffect(() => {
    if (isOpen) {
      setReason('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentId || !userId) {
      onMessage('신고 처리 중 오류가 발생했습니다.');
      return;
    }

    if (!reason.trim() || reason.trim().length < 5) {
      onMessage('신고 사유를 5자 이상 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/blog/${blogId}/comments/${commentId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          reason: reason.trim()
        })
      });

      const data: ReportResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '신고 처리에 실패했습니다.');
      }

      onReportSuccess(commentId);
      onClose();
      
      if (data.isHidden) {
        onMessage('댓글이 신고되었으며, 신고 누적으로 인해 숨김 처리되었습니다.');
      } else {
        onMessage('댓글이 신고되었습니다.');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '신고 처리에 실패했습니다.';
      onMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-black">댓글 신고</h3>
          <button
            onClick={onClose}
            className="text-black/50 hover:text-black p-1 rounded-full hover:bg-black/5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 설명 */}
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-yellow-800 text-sm">
              <div className="font-medium mb-1">신고 시 유의사항</div>
              <div className="text-yellow-700">
                • 허위 신고는 제재 대상입니다<br/>
                • 구체적인 신고 사유를 작성해주세요<br/>
                • 3회 이상 신고시 댓글이 자동 숨김됩니다
              </div>
            </div>
          </div>
        </div>

        {/* 신고 사유 입력 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              신고 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="신고 사유를 구체적으로 작성해주세요 (최소 5자 이상)"
              disabled={isSubmitting}
              rows={4}
              maxLength={500}
              className="w-full border border-black/10 rounded-lg p-3 text-sm resize-none focus:border-black focus:ring-0 outline-none disabled:bg-black/5 disabled:cursor-not-allowed transition-colors"
            />
            <div className="flex items-center justify-between mt-2">
              <div className={`text-xs ${
                reason.trim().length < 5 
                  ? 'text-red-500' 
                  : reason.length > 450 
                    ? 'text-yellow-600' 
                    : 'text-black/50'
              }`}>
                {reason.length < 5 
                  ? `최소 5자 이상 입력해주세요 (${reason.length}/5)`
                  : `${reason.length}/500`
                }
              </div>
              {reason.trim().length >= 5 && (
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  입력 완료
                </div>
              )}
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-black/10 text-black rounded-lg font-medium hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || reason.trim().length < 5}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  신고 중...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  신고하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal; 