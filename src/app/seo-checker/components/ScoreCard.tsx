"use client";

import React from "react";
import './styles.css';

interface ScoreCardProps {
  title: string;
  score: number;
  description: string;
  children: React.ReactNode;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  description,
  children,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-500";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-green-600";
    if (score >= 60) return "from-amber-500 to-orange-600";
    return "from-red-500 to-rose-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "from-emerald-50 to-green-50";
    if (score >= 60) return "from-amber-50 to-orange-50";
    return "from-red-50 to-rose-50";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return "🏆";
    if (score >= 60) return "⚡";
    return "🔧";
  };

  const getScoreBorder = (score: number) => {
    if (score >= 80) return "border-emerald-200";
    if (score >= 60) return "border-amber-200";
    return "border-red-200";
  };

  return (
    <div className={`group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${getScoreBorder(score)} overflow-hidden`}>
      {/* 배경 그라데이션 오버레이 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getScoreBg(score)} opacity-30 group-hover:opacity-40 transition-opacity duration-300`}></div>
      
      {/* 장식적 요소 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative p-6 md:p-8">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                {title}
              </h3>
            </div>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
          
          {/* 점수 표시 */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* 배경 원 */}
              <div className="absolute inset-0 bg-white rounded-2xl shadow-lg"></div>
              <div className={`relative bg-gradient-to-r ${getScoreGradient(score)} rounded-2xl p-4 md:p-5 text-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <span className="text-lg">{getScoreIcon(score)}</span>
                  <div className="text-2xl md:text-3xl font-black text-white">
                    {score}
                  </div>
                </div>
                <div className="text-xs md:text-sm font-bold text-white/90">점</div>
              </div>
            </div>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">완성도</span>
            <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getScoreGradient(score)} rounded-full score-progress shadow-sm`}
              style={{ width: `${Math.min(100, score)}%` }}
            ></div>
          </div>
        </div>

        {/* 컨텐츠 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
          {children}
        </div>
      </div>
      
      {/* 호버 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ScoreCard; 