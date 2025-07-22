"use client";

import { useState, useEffect, useMemo } from 'react';

interface ContentSummaryProps {
  content: string;
  title: string;
  summaryData?: {
    summary: string[];
    readingTime: number;
    wordCount: number;
  };
}

export default function ContentSummary({ content, title, summaryData }: ContentSummaryProps) {
  // 서버에서 전달받은 데이터가 있으면 사용, 없으면 클라이언트에서 계산
  const { summary, readingTime } = useMemo(() => {
    if (summaryData) {
      return {
        summary: summaryData.summary,
        readingTime: summaryData.readingTime
      };
    }

    // 클라이언트 사이드 계산 (fallback)
    const wordCount = content.length;
    const estimatedTime = Math.ceil(wordCount / 300);

    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    const keyPoints: string[] = [];

    if (paragraphs[0]) {
      const firstPara = paragraphs[0].replace(/^#+\s*/, '').trim();
      if (firstPara.length > 20) {
        keyPoints.push(firstPara.substring(0, 150) + (firstPara.length > 150 ? '...' : ''));
      }
    }

    const lines = content.split('\n');
    let pointCount = 0;
    
    for (const line of lines) {
      if (pointCount >= 3) break;
      
      const trimmedLine = line.trim();
      
      if (trimmedLine.match(/^[-*+]\s+/)) {
        const point = trimmedLine.replace(/^[-*+]\s+/, '').trim();
        if (point.length > 10 && point.length < 100) {
          keyPoints.push(`• ${point}`);
          pointCount++;
        }
      }
      
      if (trimmedLine.includes('**') && trimmedLine.length > 10 && trimmedLine.length < 80) {
        const point = trimmedLine.replace(/\*\*/g, '').trim();
        if (!keyPoints.includes(point)) {
          keyPoints.push(`• ${point}`);
          pointCount++;
        }
      }
    }

    if (keyPoints.length < 3 && paragraphs.length > 1) {
      for (let i = 1; i < Math.min(paragraphs.length, 3); i++) {
        if (keyPoints.length >= 3) break;
        
        const para = paragraphs[i].replace(/^#+\s*/, '').trim();
        if (para.length > 30 && para.length < 120) {
          keyPoints.push(`• ${para.substring(0, 100)}${para.length > 100 ? '...' : ''}`);
        }
      }
    }

    return { summary: keyPoints, readingTime: estimatedTime };
  }, [content, summaryData]);

  if (summary.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">글 요약</h3>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          약 {readingTime}분 읽기
        </div>
      </div>
      
      <div className="space-y-3">
        {summary.map((point, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
            <p className="text-gray-700 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-green-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>주요 내용 {summary.length}개 포인트</span>
          <span>{content.length.toLocaleString()}자</span>
        </div>
      </div>
    </div>
  );
} 