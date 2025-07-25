"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "../components/AdminLayout";
import AdminCard, { StatCard } from "../components/AdminCard";
import AdminGrid, { AdminSection } from "../components/AdminGrid";

// 최근 게시글/댓글 아이템 컴포넌트
const RecentItem: React.FC<{
  title: string;
  date: string;
  author?: string;
  views?: number;
  rank?: number;
  showRank?: boolean;
  link?: string;
}> = ({ title, date, author, views, rank, showRank = false, link }) => {
  const content = (
    <div className="px-4 sm:px-6 lg:px-8 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-3">
        {showRank && rank && (
          <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{rank}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
            {title}
          </h4>
          <div className="flex items-center text-xs text-gray-500 space-x-2">
            {author && <span>작성자: {author}</span>}
            <span>{date}</span>
            {views !== undefined && <span>조회수: {views.toLocaleString()}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }
  return content;
};

const AdminDashboardPage: React.FC = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<{
    stats?: {
      totalPosts: number;
      totalComments: number;
      totalViews: number;
      totalUsers: number;
      totalInquiries?: number;
      pendingInquiries?: number;
      processingInquiries?: number;
      completedInquiries?: number;
    };
    recentPosts?: Array<{
      id: number;
      title: string;
      views: number;
      date: string;
    }>;
    recentComments?: Array<{
      id: number;
      content: string;
      date: string;
      user?: { email: string };
    }>;
    recentInquiries?: Array<{
      id: number;
      name: string;
      serviceType: string;
      date: string;
      status: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  // 권한 체크: 관리자가 아니면 접근 불가
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("isAdmin") !== "true") {
        alert("관리자만 접근 가능합니다.");
        router.replace("/login");
      }
    }
  }, [router]);

  // 대시보드 데이터 fetch
  useEffect(() => {
    const fetchDashboardData = async () => {
      const startTime = performance.now();
      console.log('🎯 프론트엔드: 대시보드 로딩 시작');
      
      try {
        const res = await fetch("/api/admin/dashboard", {
          headers: {
            'Authorization': 'Bearer admin-token'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
          const endTime = performance.now();
          console.log(`✅ 프론트엔드: 대시보드 로딩 완료 - ${(endTime - startTime).toFixed(2)}ms`);
        } else {
          console.error("대시보드 API 응답 오류:", res.status);
        }
      } catch (error) {
        console.error("대시보드 데이터 로딩 오류:", error);
      } finally {
        const endTime = performance.now();
        console.log(`🏁 프론트엔드: 로딩 상태 해제 - 총 ${(endTime - startTime).toFixed(2)}ms`);
        setLoading(false);
      }
    };

    fetchDashboardData();
    setLastUpdate(new Date().toLocaleString('ko-KR'));
  }, []);

  if (loading) {
    return (
      <AdminLayout 
        title="관리자 대시보드" 
        description="사이트 현황과 주요 통계를 한눈에 확인하세요."
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!dashboardData) {
    return (
      <AdminLayout 
        title="관리자 대시보드" 
        description="사이트 현황과 주요 통계를 한눈에 확인하세요."
      >
        <div className="text-center py-8 text-gray-500">
          데이터를 불러올 수 없습니다.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="관리자 대시보드" 
      description="사이트 현황과 주요 통계를 한눈에 확인하세요."
      breadcrumbs={[
        { label: "관리자 홈", href: "/admin/dashboard", current: true }
      ]}
      showBackButton={false}
    >
      {/* 마지막 업데이트 시간 */}
      <div className="text-right text-sm text-gray-500 mb-4">
        마지막 업데이트: {lastUpdate}
      </div>

      {/* 통계 카드 */}
      <AdminSection title="주요 통계">
        <AdminGrid cols={4}>
          <StatCard
            title="Total Posts"
            value={dashboardData.stats?.totalPosts || 0}
            icon="📄"
          />
          <StatCard
            title="Total Comments"
            value={dashboardData.stats?.totalComments || 0}
            icon="💬"
          />
          <StatCard
            title="Total Views"
            value={dashboardData.stats?.totalViews || 0}
            icon="👁️"
          />
          <StatCard
            title="Registered Users"
            value={dashboardData.stats?.totalUsers || 0}
            icon="👥"
          />
        </AdminGrid>
      </AdminSection>

      {/* 문의 통계 카드 */}
      <AdminSection title="문의 현황">
        <AdminGrid cols={4}>
          <StatCard
            title="전체 문의"
            value={dashboardData.stats?.totalInquiries || 0}
            icon="📞"
          />
          <StatCard
            title="대기 중"
            value={dashboardData.stats?.pendingInquiries || 0}
            icon="⏳"
          />
          <StatCard
            title="처리 중"
            value={dashboardData.stats?.processingInquiries || 0}
            icon="🔄"
          />
          <StatCard
            title="완료"
            value={dashboardData.stats?.completedInquiries || 0}
            icon="✅"
          />
        </AdminGrid>
      </AdminSection>

      {/* 관리 기능 */}
      <AdminSection 
        title="관리 기능" 
        description="각 관리 기능에 빠르게 접근할 수 있습니다."
      >
        <AdminGrid cols={3}>
          <AdminCard 
            title="게시글 관리" 
            description="블로그 게시글을 관리합니다"
            className="hover:border-gray-300 transition-colors cursor-pointer"
            onClick={() => router.push('/admin/blog')}
          >
            <div className="text-center py-4">
              <div className="text-3xl mb-2">📄</div>
              <p className="text-sm text-gray-600">게시글 작성, 수정, 삭제</p>
            </div>
          </AdminCard>
          
          <AdminCard 
            title="사용자 관리" 
            description="사용자 계정을 관리합니다"
            className="hover:border-gray-300 transition-colors cursor-pointer"
            onClick={() => router.push('/admin/users')}
          >
            <div className="text-center py-4">
              <div className="text-3xl mb-2">👥</div>
              <p className="text-sm text-gray-600">사용자 권한 및 계정 관리</p>
            </div>
          </AdminCard>
          
          <AdminCard 
            title="사이트 설정" 
            description="사이트 기본 설정을 관리합니다"
            className="hover:border-gray-300 transition-colors cursor-pointer"
            onClick={() => router.push('/admin/site-settings')}
          >
            <div className="text-center py-4">
              <div className="text-3xl mb-2">⚙️</div>
              <p className="text-sm text-gray-600">SEO, 메타데이터 설정</p>
            </div>
          </AdminCard>
          
          <AdminCard 
            title="AI 설정" 
            description="AI 기능 설정을 관리합니다"
            className="hover:border-gray-300 transition-colors cursor-pointer"
            onClick={() => router.push('/admin/ai-settings')}
          >
            <div className="text-center py-4">
              <div className="text-3xl mb-2">🤖</div>
              <p className="text-sm text-gray-600">AI 모델 및 프롬프트 설정</p>
            </div>
          </AdminCard>
          
          <AdminCard 
            title="SERP 분석" 
            description="검색엔진 성과를 분석합니다"
            className="hover:border-gray-300 transition-colors cursor-pointer"
            onClick={() => router.push('/admin/serp-analysis')}
          >
            <div className="text-center py-4">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-sm text-gray-600">트래픽 및 키워드 분석</p>
            </div>
          </AdminCard>
          
          <AdminCard 
            title="댓글 관리" 
            description="새로운 댓글 시스템"
            className="hover:border-gray-300 transition-colors cursor-pointer"
            onClick={() => router.push('/admin/comments')}
          >
            <div className="text-center py-4">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-sm text-gray-600">댓글 모더레이션 및 관리</p>
            </div>
          </AdminCard>

          <AdminCard 
            title="문의 관리" 
            description="고객 문의를 관리합니다"
            className="hover:border-gray-300 transition-colors cursor-pointer"
            onClick={() => router.push('/admin/inquiries')}
          >
            <div className="text-center py-4">
              <div className="text-3xl mb-2">📞</div>
              <p className="text-sm text-gray-600">문의 상태 관리 및 답변</p>
            </div>
          </AdminCard>
        </AdminGrid>
      </AdminSection>

      {/* 최근 활동 */}
      <AdminSection title="최근 활동">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 인기 게시글 */}
          <AdminCard 
            title="인기 게시글 TOP5" 
            description="(조회수 순)"
          >
            <div className="space-y-2">
              {dashboardData.recentPosts?.slice(0, 5).map((post: { id: number; title: string; date: string; views: number }, index: number) => (
                <RecentItem
                  key={post.id}
                  title={post.title}
                  date={post.date}
                  author="작성자: 관리자"
                  views={post.views}
                  rank={index + 1}
                  showRank={true}
                  link={`/blog/${post.id}`}
                />
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Link 
                  href="/admin/blog" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  모든 게시글 보기 →
                </Link>
              </div>
            </div>
          </AdminCard>

          {/* 최근 댓글 */}
          <AdminCard 
            title="최근 댓글" 
            description="(최신순)"
          >
            <div className="space-y-2">
              {dashboardData.recentComments?.slice(0, 5).map((comment: { id: number; content: string; date: string; user?: { email: string } }) => (
                <RecentItem
                  key={comment.id}
                  title={comment.content}
                  date={comment.date}
                  author={`작성자: ${comment.user?.email || '알 수 없음'}`}
                  link={`/blog/1#comment-${comment.id}`}
                />
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Link 
                  href="/admin/comments" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  댓글 관리 페이지 →
                </Link>
              </div>
            </div>
          </AdminCard>

          {/* 최근 문의 */}
          <AdminCard 
            title="최근 문의" 
            description="(최신순)"
          >
            <div className="space-y-2">
              {dashboardData.recentInquiries?.slice(0, 5).map((inquiry) => (
                <RecentItem
                  key={inquiry.id}
                  title={`${inquiry.name} - ${inquiry.serviceType}`}
                  date={inquiry.date}
                  author={`상태: ${
                    inquiry.status === 'PENDING' ? '대기중' :
                    inquiry.status === 'PROCESSING' ? '처리중' :
                    inquiry.status === 'COMPLETED' ? '완료' : '취소'
                  }`}
                  link={`/admin/inquiries`}
                />
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Link 
                  href="/admin/inquiries" 
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  모든 문의 보기 →
                </Link>
              </div>
            </div>
          </AdminCard>
        </div>
      </AdminSection>

    </AdminLayout>
  );
};

export default AdminDashboardPage; 