"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "../components/AdminCard";

const AdminBlogWritePage: React.FC = () => {
  const router = useRouter();
  
  // 권한 체크: 관리자가 아니면 접근 불가
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("isAdmin") !== "true") {
        alert("관리자만 블로그를 작성할 수 있습니다.");
        router.replace("/login");
      }
    }
  }, [router]);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiSuccess, setAiSuccess] = useState("");
  const [aiMode, setAiMode] = useState<'step-by-step' | 'single'>('step-by-step');
  const [aiProgress, setAiProgress] = useState<string>("");
  const [tokenUsage, setTokenUsage] = useState<{
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCost: string;
  } | null>(null);
  
  // 🎯 단계별 진행상황 추적
  interface ProgressStep {
    id: string;
    title: string;
    status: 'pending' | 'in-progress' | 'completed' | 'error';
    message?: string;
  }
  
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([
    { id: 'outline', title: '블로그 아웃라인 생성', status: 'pending' },
    { id: 'section1', title: '섹션 1 생성', status: 'pending' },
    { id: 'section2', title: '섹션 2 생성', status: 'pending' },
    { id: 'section3', title: '섹션 3 생성', status: 'pending' },
    { id: 'section4', title: '섹션 4 생성', status: 'pending' },
    { id: 'section5', title: '섹션 5 생성', status: 'pending' },
    { id: 'combine', title: '전체 내용 조합', status: 'pending' }
  ]);

  // Unsplash 이미지 후보 상태
  const [unsplashImages, setUnsplashImages] = useState<string[]>([]);
  const [unsplashLoading, setUnsplashLoading] = useState(false);
  const [unsplashError, setUnsplashError] = useState("");

  // 이미지 URL 유효성 검사 (Unsplash, Google Images 허용)
  function isValidImageUrl(url: string) {
    return /^https:\/\/(images\.unsplash\.com|encrypted-tbn0\.gstatic\.com|lh3\.googleusercontent\.com)\//.test(url);
  }

  // Unsplash 이미지 검색 핸들러
  async function handleUnsplashSearch() {
    setUnsplashLoading(true);
    setUnsplashError("");
    try {
      const res = await fetch("/api/blog/unsplash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tag }),
      });
      if (!res.ok) throw new Error("이미지 검색에 실패했습니다.");
      const data = await res.json();
      setUnsplashImages(data.images || []);
    } catch (e) {
      setUnsplashError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setUnsplashLoading(false);
    }
  }

  // 이미지가 Google 이미지가 아니면 입력란을 비움
  useEffect(() => {
    if (image && !isValidImageUrl(image)) {
      setImage("");
    }
  }, [image]);

  // 실제 이미지 유효성 검사 (비동기, HEAD 요청)
  const [imageValid, setImageValid] = useState(true);
  useEffect(() => {
    let ignore = false;
    async function check() {
      if (!image) {
        setImageValid(false);
        return;
      }
      try {
        const res = await fetch(image, { method: 'HEAD' });
        const contentType = res.headers.get('Content-Type') || '';
        if (!ignore) setImageValid(res.ok && contentType.startsWith('image/'));
      } catch {
        if (!ignore) setImageValid(false);
      }
    }
    check();
    return () => { ignore = true; };
  }, [image]);

  // 이미지 유효성 검사 실패 시 입력란을 비움
  useEffect(() => {
    if (image && !imageValid) {
      setImage("");
    }
  }, [imageValid]);

  // 🎯 진행상황 업데이트 함수
  const updateProgress = (stepId: string, status: 'pending' | 'in-progress' | 'completed' | 'error', message?: string) => {
    setProgressSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, message }
        : step
    ));
  };

  // 🎯 진행상황 초기화 함수
  const resetProgress = () => {
    setProgressSteps(prev => prev.map(step => ({ ...step, status: 'pending', message: undefined })));
  };

  // 모든 필드가 채워져 있고 이미지가 유효한지 체크
  const isFormValid = title.trim() && summary.trim() && content.trim() && tag.trim() && image.trim() && isValidImageUrl(image) && imageValid;

  // 저장
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer admin-key"
        },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
          content: content.trim(),
          tag: tag.trim(),
          image: image.trim(),
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "블로그 저장에 실패했습니다.");
      }
      
      const data = await res.json();
      alert("블로그가 성공적으로 저장되었습니다!");
      router.push(`/blog/${data.data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // AI 블로그 자동 작성
  const handleAIGenerate = async () => {
    setAiLoading(true);
    setAiError("");
    setAiSuccess("");
    setAiProgress("");
    setTokenUsage(null); // 토큰 사용량 정보 초기화
    
    // 진행상황 초기화
    resetProgress();
    
    // SSE 연결 설정
    let eventSource: EventSource | null = null;
    
    if (aiMode === 'step-by-step') {
      try {
        eventSource = new EventSource('/api/ai-blog/progress');
        
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'progress') {
              // 개별 진행상황 업데이트
              updateProgress(data.data.stepId, data.data.status, data.data.message);
            } else if (data.type === 'reset') {
              // 진행상황 초기화
              resetProgress();
            } else if (data.type === 'init') {
              // 초기 진행상황 설정
              data.data.forEach((progress: any) => {
                updateProgress(progress.stepId, progress.status, progress.message);
              });
            }
          } catch (error) {
            console.error('SSE 데이터 파싱 오류:', error);
          }
        };
        
        eventSource.onerror = (error) => {
          console.error('SSE 연결 오류:', error);
        };
      } catch (error) {
        console.error('SSE 연결 실패:', error);
      }
    }
    
    try {
      // 단계별 생성 모드에 따른 진행 상황 표시
      if (aiMode === 'step-by-step') {
        setAiProgress("📋 1단계: 블로그 아웃라인 생성 중...");
        updateProgress('outline', 'in-progress', '아웃라인 생성 중...');
      }
      
      // 🎯 AI API 호출
      const aiPromise = fetch("/api/ai-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: aiPrompt,
          mode: aiMode 
        }),
      });
      
      // 🎯 AI API 응답 대기
      const startTime = Date.now();
      const res = await aiPromise;
      const totalTime = Date.now() - startTime;
      
      console.log(`⏱️ AI API 응답 완료: ${totalTime}ms`);
      
      const data = await res.json();
      
      if (!res.ok) {
        // 파싱 실패 시 fallback 데이터가 있는 경우 사용
        if (data.data) {
          setTitle(data.data.title || "");
          setSummary(data.data.summary || "");
          setContent(data.data.content || "");
          setTag(data.data.tag || "");
          setImage(data.data.image || "");
          setAiSuccess("AI 응답 파싱에 실패했지만 기본 구조로 생성했습니다. 내용을 확인하고 수정해주세요.");
          setAiError(""); // 성공 메시지가 있으면 에러 메시지 제거
        } else {
          throw new Error(data.error || "AI 블로그 생성에 실패했습니다.");
        }
      } else {
        // 정상 응답
        setTitle(data.title || "");
        setSummary(data.summary || "");
        setContent(data.content || "");
        setTag(data.tag || "");
        setImage(data.image || "");
        
        // 토큰 사용량 정보 저장
        if (data.tokenUsage) {
          setTokenUsage(data.tokenUsage);
        }
        
        const successMessage = aiMode === 'step-by-step' 
          ? "🚀 단계별 AI 블로그 생성이 완료되었습니다! 각 섹션이 상세하게 작성되었습니다."
          : "AI 블로그 생성이 완료되었습니다! 내용을 확인하고 필요시 수정해주세요.";
        
        setAiSuccess(successMessage);
        setAiError(""); // 성공 메시지가 있으면 에러 메시지 제거
      }
    } catch (e) {
      if (e instanceof Error) {
        setAiError(e.message);
      } else {
        setAiError("알 수 없는 오류가 발생했습니다.");
      }
      setAiSuccess(""); // 에러가 있으면 성공 메시지 제거
    } finally {
      setAiLoading(false);
      setAiProgress("");
      
      // SSE 연결 정리
      if (eventSource) {
        eventSource.close();
      }
    }
  };

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          블로그 작성
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          새로운 블로그 글을 작성하거나 AI를 활용하여 자동으로 생성할 수 있습니다.
        </p>
      </div>

      {/* AI 블로그 생성 섹션 */}
      <AdminCard>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">AI 블로그 생성</h2>
          </div>
          
          {/* AI 생성 모드 선택 */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            
            {/* 🎯 진행상황 표시 (단계별 모드일 때만) */}
            {aiMode === 'step-by-step' && aiLoading && (
              <div className="w-full mb-4">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                    <div className="w-3 h-3 bg-purple-600 rounded-full mr-3 animate-pulse"></div>
                    🤖 AI 블로그 생성 진행상황
                  </h3>
                  <div className="space-y-3">
                    {progressSteps.map((step, index) => (
                      <div key={step.id} className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                        step.status === 'completed' ? 'bg-green-50 border border-green-200' :
                        step.status === 'in-progress' ? 'bg-purple-50 border border-purple-200 shadow-sm' :
                        step.status === 'error' ? 'bg-red-50 border border-red-200' :
                        'bg-gray-50 border border-gray-200'
                      }`}>
                        {/* 상태 아이콘 */}
                        <div className="flex-shrink-0">
                          {step.status === 'pending' && (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                          )}
                          {step.status === 'in-progress' && (
                            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          )}
                          {step.status === 'completed' && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          {step.status === 'error' && (
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* 진행상황 텍스트 */}
                        <div className="flex-1">
                          <div className={`text-sm font-semibold ${
                            step.status === 'completed' ? 'text-green-700' :
                            step.status === 'in-progress' ? 'text-purple-700' :
                            step.status === 'error' ? 'text-red-700' :
                            'text-gray-500'
                          }`}>
                            {step.title}
                          </div>
                          {step.message && (
                            <div className="text-xs text-gray-600 mt-1 flex items-center">
                              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                              {step.message}
                            </div>
                          )}
                        </div>
                        
                        {/* 진행률 표시 */}
                        <div className="flex-shrink-0">
                          {step.status === 'in-progress' && (
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                            </div>
                          )}
                          {step.status === 'completed' && (
                            <div className="text-xs text-green-600 font-medium">완료</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 전체 진행률 */}
                  <div className="mt-6 pt-4 border-t border-purple-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-purple-800">전체 진행률</span>
                      <span className="text-sm font-bold text-purple-600">
                        {progressSteps.filter(s => s.status === 'completed').length}/{progressSteps.length}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 rounded-full transition-all duration-700 ease-out shadow-sm"
                        style={{ 
                          width: `${(progressSteps.filter(s => s.status === 'completed').length / progressSteps.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      {progressSteps.filter(s => s.status === 'completed').length === progressSteps.length 
                        ? '🎉 모든 단계가 완료되었습니다!' 
                        : 'AI가 열심히 블로그를 생성하고 있습니다...'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium text-purple-800 mb-2">
                생성 모드 선택
              </label>
              <div className="flex gap-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="aiMode"
                    value="step-by-step"
                    checked={aiMode === 'step-by-step'}
                    onChange={(e) => setAiMode(e.target.value as 'step-by-step' | 'single')}
                    className="mr-2 text-purple-600 focus:ring-purple-500"
                    disabled={aiLoading || saving}
                  />
                  <span className="text-sm text-purple-700">
                    🚀 단계별 생성 (권장)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="aiMode"
                    value="single"
                    checked={aiMode === 'single'}
                    onChange={(e) => setAiMode(e.target.value as 'step-by-step' | 'single')}
                    className="mr-2 text-purple-600 focus:ring-purple-500"
                    disabled={aiLoading || saving}
                  />
                  <span className="text-sm text-purple-700">
                    ⚡ 단일 생성
                  </span>
                </label>
              </div>
              <p className="text-xs text-purple-600 mt-1">
                {aiMode === 'step-by-step' 
                  ? "각 섹션을 독립적으로 생성하여 더 상세하고 구조화된 긴 글을 작성합니다."
                  : "한 번에 전체 내용을 생성합니다. (토큰 한계로 인해 짧을 수 있음)"
                }
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
              placeholder="AI에게 요청할 프롬프트(주제, 키워드 등)를 입력하세요"
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              disabled={aiLoading || saving}
            />
            <button
              type="button"
              className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAIGenerate}
              disabled={aiLoading || saving || !aiPrompt.trim()}
            >
              {aiLoading ? "AI 작성 중..." : "AI로 작성"}
            </button>
          </div>
          
          {/* AI 진행 상황 표시 */}
          {aiProgress && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">{aiProgress}</p>
            </div>
          )}
          
          {/* AI 성공 메시지 */}
          {aiSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">{aiSuccess}</p>
              
              {/* 토큰 사용량 정보 */}
              {tokenUsage && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-blue-700">💰 토큰 사용량 정보</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-blue-50 p-2 rounded border border-blue-200">
                      <div className="text-blue-600 font-medium">프롬프트 토큰</div>
                      <div className="text-blue-800 font-bold">{tokenUsage.promptTokens.toLocaleString()}</div>
                    </div>
                    <div className="bg-green-50 p-2 rounded border border-green-200">
                      <div className="text-green-600 font-medium">완성 토큰</div>
                      <div className="text-green-800 font-bold">{tokenUsage.completionTokens.toLocaleString()}</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded border border-purple-200">
                      <div className="text-purple-600 font-medium">총 토큰</div>
                      <div className="text-purple-800 font-bold">{tokenUsage.totalTokens.toLocaleString()}</div>
                    </div>
                    <div className="bg-orange-50 p-2 rounded border border-orange-200">
                      <div className="text-orange-600 font-medium">예상 비용</div>
                      <div className="text-orange-800 font-bold">{tokenUsage.estimatedCost}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    💡 토큰 사용량은 AI 모델의 처리 복잡도와 생성된 내용의 길이에 따라 달라집니다.
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* AI 에러 메시지 */}
          {aiError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">{aiError}</p>
            </div>
          )}
        </div>
      </AdminCard>

      {/* 블로그 작성 폼 */}
      <AdminCard>
        <form className="space-y-6" onSubmit={handleSave}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">블로그 내용 작성</h2>
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              제목 *
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="블로그 제목을 입력하세요"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          {/* 요약 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              요약 *
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="블로그 요약을 입력하세요"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          {/* 본문 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              본문 *
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="블로그 본문을 입력하세요 (AI 생성 시 매우 상세한 내용이 자동으로 입력됩니다)"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={15}
              required
              disabled={saving}
            />
            <p className="text-xs text-gray-500">
              현재 {content.length}자 입력됨 (최소 100자 권장)
            </p>
          </div>

          {/* 태그 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              태그 *
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="태그 (예: Next.js, AI, React)"
              value={tag}
              onChange={e => setTag(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          {/* 이미지 섹션 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <h3 className="text-md font-semibold text-gray-900">대표 이미지</h3>
            </div>

            {/* 이미지 URL 입력 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                이미지 URL
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="대표 이미지 URL (Unsplash 이미지 권장)"
                value={image}
                onChange={e => setImage(e.target.value)}
                disabled={saving}
              />
            </div>

            {/* Unsplash 이미지 검색 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                className="px-4 py-3 rounded-lg bg-green-100 border border-green-300 text-green-700 font-medium hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUnsplashSearch}
                disabled={unsplashLoading || saving}
              >
                {unsplashLoading ? "이미지 검색 중..." : "관련 이미지 검색 (Unsplash)"}
              </button>
              {unsplashError && (
                <span className="text-sm text-red-600 font-medium">{unsplashError}</span>
              )}
            </div>

            {/* 이미지 미리보기 */}
            {image && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  이미지 미리보기
                </label>
                <img
                  src={image}
                  alt="대표 이미지"
                  className="w-full max-h-60 object-contain rounded-lg border border-gray-300"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}

            {/* Unsplash 이미지 선택 */}
            {unsplashImages.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  추천 이미지 선택
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {unsplashImages.map((url, idx) => (
                    <img
                      key={url}
                      src={url}
                      alt="미리보기"
                      className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                        image === url ? 'border-green-500' : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => setImage(url)}
                      title="이미지 선택"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 이미지 유효성 경고 */}
            {image && !imageValid && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700 font-medium">
                  이미지 URL이 유효하지 않습니다. Unsplash에서 정상 이미지를 선택해 주세요.
                </p>
              </div>
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* 저장 버튼 */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving || !(title.trim() && summary.trim() && content.trim() && tag.trim())}
            >
              {saving ? "저장 중..." : "블로그 저장"}
            </button>
          </div>
        </form>
      </AdminCard>
    </>
  );
};

export default AdminBlogWritePage; 