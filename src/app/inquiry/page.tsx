"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';

// 클라이언트 사이드에서 동적으로 메타데이터 설정
const METADATA = {
  title: '문의하기 | AWEKERS - 전문 IT 솔루션 상담',
  description: 'AWEKERS의 전문 IT 서비스에 대해 문의하세요. SEO, AI 솔루션, 웹 개발까지 맞춤형 상담을 제공합니다.',
  keywords: '문의하기, IT 상담, SEO 문의, AI 솔루션, 웹 개발 상담, AWEKERS',
};

// 서비스 타입 옵션
const SERVICE_OPTIONS = [
  'SEO 캠페인',
  'AI 블로그',
  'AI 챗봇',
  '홈페이지 제작',
  'AI 자동화',
  'AI 데이터베이스',
  '기타'
];

// 업종 옵션
const INDUSTRY_OPTIONS = [
  '제조업',
  '유통/판매',
  '금융/보험',
  '부동산',
  '의료/헬스케어',
  '교육',
  'IT/소프트웨어',
  '광고/마케팅',
  '음식/외식업',
  '뷰티/패션',
  '건설/인테리어',
  '운송/물류',
  '법률/회계',
  '컨설팅',
  '기타'
];

// 문의 카테고리별 세부 옵션
const CATEGORY_OPTIONS = {
  '서비스 문의': [
    '기능 및 특징 안내',
    '가격 및 요금제 문의',
    '맞춤 솔루션 제안',
    '기존 시스템 연동',
    '도입 일정 상담'
  ],
  '기술 지원': [
    '구현 가능성 검토',
    '기술적 요구사항 분석',
    '성능 및 확장성 문의',
    'API 연동 문의',
    '보안 관련 문의'
  ],
  '계약 및 제휴': [
    '장기 계약 문의',
    '파트너십 제안',
    '리셀러 문의',
    '대량 할인 협의',
    '맞춤 개발 계약'
  ],
  '기타': [
    '일반적인 문의',
    '제안 및 피드백',
    '버그 신고',
    '교육 및 트레이닝',
    '기타 요청사항'
  ]
};

// 예산 옵션
const BUDGET_OPTIONS = [
  '100만원 미만',
  '100만원 ~ 500만원',
  '500만원 ~ 1,000만원',
  '1,000만원 ~ 3,000만원',
  '3,000만원 이상',
  '예산 협의'
];

interface FormData {
  serviceType: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  industry: string;
  category: string;
  subcategory: string;
  budget: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function InquiryPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    serviceType: '',
    name: '',
    phone: '',
    email: '',
    company: '',
    industry: '',
    category: '',
    subcategory: '',
    budget: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{id: number; referenceNo: string; message: string} | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // 입력 값 변경 핸들러
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // 카테고리 변경 시 세부 옵션 초기화
    if (field === 'category') {
      setFormData(prev => ({ ...prev, subcategory: '' }));
    }
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 필수 필드 검사 - 모든 필드를 필수로 처리 (회사명/도메인주소는 선택사항)
    if (!formData.serviceType) newErrors.serviceType = '필수입력 사항을 확인해주세요';
    if (!formData.name.trim()) newErrors.name = '필수입력 사항을 확인해주세요';
    if (!formData.phone.trim()) newErrors.phone = '필수입력 사항을 확인해주세요';
    if (!formData.email.trim()) newErrors.email = '필수입력 사항을 확인해주세요';
    // company는 선택사항으로 제외
    if (!formData.industry) newErrors.industry = '필수입력 사항을 확인해주세요';
    if (!formData.category) newErrors.category = '필수입력 사항을 확인해주세요';
    if (!formData.subcategory) newErrors.subcategory = '필수입력 사항을 확인해주세요';
    if (!formData.budget) newErrors.budget = '필수입력 사항을 확인해주세요';
    if (!formData.message.trim()) newErrors.message = '필수입력 사항을 확인해주세요';

    // 이메일 형식 검사
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 전화번호 형식 검사
    if (formData.phone && !/^[\d\-\s\+\(\)]{8,}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호를 입력해주세요.';
    }

    // 이름 길이 검사
    if (formData.name && formData.name.trim().length < 2) {
      newErrors.name = '이름은 2글자 이상 입력해주세요.';
    }

    // 문의 내용 길이 검사
    if (formData.message && formData.message.trim().length < 10) {
      newErrors.message = '문의 내용은 10글자 이상 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // 첫 번째 에러 필드로 스크롤
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setSubmissionResult(result.data); // 참조번호 포함
        setShowSuccess(true);
        
        // 폼 초기화
        setFormData({
          serviceType: '',
          name: '',
          phone: '',
          email: '',
          company: '',
          industry: '',
          category: '',
          subcategory: '',
          budget: '',
          message: ''
        });
      } else {
        alert(result.error || '문의 등록 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('문의 제출 중 오류:', error);
      alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 성공 메시지 표시
  if (showSuccess) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">
          <div className="bg-white border border-gray-100 rounded-3xl p-12 shadow-sm">
            {/* 성공 아이콘 */}
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            {/* 메인 제목 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6 font-['Pretendard'] tracking-tight">
              문의가 완료되었습니다
            </h1>
            
            {/* 부제목 */}
            <p className="text-lg text-gray-700 mb-8 leading-relaxed font-['Pretendard'] font-medium">
              소중한 문의를 보내주셔서 감사합니다.
            </p>
            
            {/* 참조번호 표시 */}
            {submissionResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                <div className="text-center">
                  <p className="text-blue-700 font-medium mb-2 font-['Pretendard']">문의 참조번호</p>
                  <div className="bg-white rounded-lg px-4 py-3 border border-blue-300">
                    <code className="text-xl font-bold text-blue-900 font-mono tracking-wider">
                      {submissionResult.referenceNo}
                    </code>
                  </div>
                  <p className="text-blue-600 text-sm mt-3 font-['Pretendard']">
                    위 번호로 문의 상태를 확인하실 수 있습니다
                  </p>
                </div>
              </div>
            )}

            {/* 상세 설명 */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <p className="text-gray-600 leading-relaxed font-['Pretendard']">
                <span className="font-semibold text-gray-800">담당자가 24시간 내에</span> 연락드리겠습니다.<br />
                문의하신 내용을 검토한 후 최적의 솔루션을 제안해드리겠습니다.
              </p>
            </div>
            
            {/* 추가 안내 */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-center text-sm text-gray-500 font-['Pretendard']">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                참조번호가 등록된 이메일로 발송됩니다
              </div>
              <div className="flex items-center justify-center text-sm text-gray-500 font-['Pretendard']">
                <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                추가 문의사항은 언제든지 연락해주세요
              </div>
            </div>
            
            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/inquiry-check')}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium font-['Pretendard']"
              >
                문의 상태 확인하기
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium font-['Pretendard']"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-sm font-medium text-blue-700 mb-6 sm:mb-8">
            <span className="relative mr-2">
              <span className="animate-pulse absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            전문 상담 서비스
          </div>
          
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            <span className="text-blue-600">AWEKERS</span>와 함께
            <br className="hidden sm:block" />
            <span className="block mt-2">비즈니스를 성장시키세요</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            SEO부터 AI 솔루션까지, 전문가와 함께하는<br className="sm:hidden" />
            맞춤형 디지털 혁신을 시작하세요
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">24H</div>
              <div className="text-xs sm:text-sm text-gray-600">빠른 응답</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">100+</div>
              <div className="text-xs sm:text-sm text-gray-600">성공 프로젝트</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">1:1</div>
              <div className="text-xs sm:text-sm text-gray-600">맞춤 상담</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">문의하기</h2>
              <p className="text-gray-600">
                아래 양식을 작성해주시면 전문 상담사가 24시간 내에 연락드립니다.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* 서비스 선택 */}
              <div id="serviceType">
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                  관심 서비스 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SERVICE_OPTIONS.map((service) => (
                    <label
                      key={service}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.serviceType === service
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : errors.serviceType
                          ? 'border-red-300'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="serviceType"
                        value={service}
                        checked={formData.serviceType === service}
                        onChange={(e) => handleInputChange('serviceType', e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{service}</span>
                    </label>
                  ))}
                </div>
                {errors.serviceType && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
                )}
              </div>

              {/* 기본 정보 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 이름 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="홍길동"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* 연락처 */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="010-1234-5678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* 이메일 */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="name@company.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* 회사명/도메인주소 */}
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    회사명/도메인주소
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="(주)회사명 또는 www.company.com"
                  />
                </div>
              </div>

              {/* 업종 선택 */}
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                  업종 <span className="text-red-500">*</span>
                </label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.industry ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">업종을 선택하세요</option>
                  {INDUSTRY_OPTIONS.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                )}
              </div>

              {/* 문의 유형 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 1차 카테고리 */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    문의 유형 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">문의 유형을 선택하세요</option>
                    {Object.keys(CATEGORY_OPTIONS).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* 세부 항목 */}
                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">
                    세부 항목 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    disabled={!formData.category}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-500 ${
                      errors.subcategory ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">세부 항목 선택</option>
                    {formData.category && CATEGORY_OPTIONS[formData.category as keyof typeof CATEGORY_OPTIONS]?.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                  {errors.subcategory && (
                    <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>
                  )}
                </div>
              </div>

              {/* 예산 */}
              <div id="budget">
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  예상 예산 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BUDGET_OPTIONS.map((budget) => (
                    <label
                      key={budget}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all text-center ${
                        formData.budget === budget
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : errors.budget
                          ? 'border-red-300'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="budget"
                        value={budget}
                        checked={formData.budget === budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium w-full">{budget}</span>
                    </label>
                  ))}
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              {/* 문의 내용 */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  상세 문의 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical ${
                    errors.message ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="프로젝트 상세 내용, 요구사항, 일정 등을 자세히 작성해주세요. (최소 10글자 이상)"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  {formData.message.length}/1000자
                </div>
              </div>

              {/* 개인정보 처리 동의 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 leading-relaxed">
                  <strong>개인정보 처리방침</strong><br />
                  • 수집목적: 서비스 문의 응답 및 상담<br />
                  • 수집항목: 이름, 연락처, 이메일, 회사명<br />
                  • 보유기간: 문의 처리 완료 후 1년<br />
                  • 귀하께서는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있으나, 동의를 거부할 경우 서비스 이용에 제한이 있을 수 있습니다.
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      문의 전송 중...
                    </span>
                  ) : (
                    '문의하기'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="sm:w-auto px-8 py-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300"
                >
                  취소
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 sm:py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-6">빠른 상담이 필요하신가요?</h3>
          <p className="text-blue-100 mb-8">
            전화나 이메일로 직접 연락하시면 더욱 빠른 상담이 가능합니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
            <a
              href="tel:02-1234-5678"
              className="flex items-center justify-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              📞 02-1234-5678
            </a>
            <a
              href="mailto:contact@awekers.com"
              className="flex items-center justify-center bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              ✉️ contact@awekers.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
} 