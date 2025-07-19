"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "../components/AdminCard";

const MODEL_OPTIONS = [
  { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
  { value: "gpt-4", label: "gpt-4" },
  { value: "gpt-4o", label: "gpt-4o (최신)" },
];
const TOKEN_OPTIONS = [512, 800, 1200, 2000, 4000, 6000];
const STYLE_OPTIONS = [
  "트렌디", "전문가", "친근함", "유머", "포멀", "간결함"
];

const AdminAISettingsPage: React.FC = () => {
  const router = useRouter();
  
  // 권한 체크: 관리자가 아니면 접근 불가
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("isAdmin") !== "true") {
        alert("관리자만 접근 가능합니다.");
        router.replace("/login");
      }
    }
  }, [router]);

  // 상태
  const [prompt, setPrompt] = useState("너는 최신 트렌드에 민감하고 독자들이 흥미를 느낄 수 있는 블로그 글을 작성하는 전문가입니다. 각 글은 독창적이고 유용한 정보를 제공하며, SEO 최적화를 고려하여 작성됩니다.");
  const [model, setModel] = useState(MODEL_OPTIONS[0].value);
  const [maxTokens, setMaxTokens] = useState(6000);
  const [style, setStyle] = useState(STYLE_OPTIONS[0]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // 설정 불러오기
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/ai-settings");
        if (res.ok) {
          const data = await res.json();
          setPrompt(data.systemPrompt || "");
          setModel(data.model || MODEL_OPTIONS[0].value);
          setMaxTokens(data.maxTokens || 6000);
          setStyle(data.style || STYLE_OPTIONS[0]);
        }
      } catch (error) {
        console.error("설정 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  // 저장 핸들러
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/ai-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, maxTokens, style, systemPrompt: prompt }),
      });
      if (!res.ok) throw new Error("저장에 실패했습니다.");
      const data = await res.json();
      setMsg(data.message || "설정이 저장되었습니다.");
    } catch (error) {
      setMsg("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI 설정을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          AI 블로그 설정
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          AI가 블로그 글을 생성할 때 사용할 모델과 설정을 관리합니다.
        </p>
      </div>

      {/* 메인 콘텐츠 */}
      <AdminCard>
        <form className="space-y-6 sm:space-y-8" onSubmit={handleSave}>
          {/* 시스템 프롬프트 섹션 */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">시스템 프롬프트</h2>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                AI 블로그 작가 지시사항
              </label>
              <textarea 
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-sm"
                rows={4}
                value={prompt} 
                onChange={e => setPrompt(e.target.value)}
                placeholder="AI에게 블로그 스타일/톤/포맷을 지시하는 텍스트를 입력하세요..."
              />
              <p className="text-xs sm:text-sm text-gray-500">
                AI가 블로그 글을 작성할 때 참고할 스타일, 톤, 포맷 등을 정의합니다.
              </p>
            </div>
          </div>

          {/* AI 모델 설정 섹션 */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">AI 모델 설정</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* 모델 선택 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  AI 모델
                </label>
                <select 
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  value={model} 
                  onChange={e => setModel(e.target.value)}
                >
                  {MODEL_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <p className="text-xs sm:text-sm text-gray-500">
                  최신 모델일수록 품질이 높지만 비용이 증가합니다.
                </p>
              </div>

              {/* 토큰 수 설정 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  최대 토큰 수
                </label>
                <select 
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  value={maxTokens} 
                  onChange={e => setMaxTokens(Number(e.target.value))}
                >
                  {TOKEN_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt.toLocaleString()}</option>
                  ))}
                </select>
                <p className="text-xs sm:text-sm text-gray-500">
                  생성될 글의 최대 길이를 지정합니다.
                </p>
              </div>

              {/* 스타일 설정 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  글 스타일
                </label>
                <select 
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  value={style} 
                  onChange={e => setStyle(e.target.value)}
                >
                  {STYLE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <p className="text-xs sm:text-sm text-gray-500">
                  블로그 글의 톤앤매너를 선택합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            <button 
              type="submit" 
              disabled={saving}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {saving ? '저장 중...' : '설정 저장'}
            </button>
            {msg && (
              <p className={`mt-3 text-sm ${msg.includes('실패') ? 'text-red-600' : 'text-green-600'}`}>
                {msg}
              </p>
            )}
          </div>
        </form>
      </AdminCard>
    </>
  );
};

export default AdminAISettingsPage; 