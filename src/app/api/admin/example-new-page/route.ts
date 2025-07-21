import { NextRequest } from 'next/server';
import { AdminBaseService } from '@/lib/admin/AdminBaseService';
import prisma from '@/lib/prisma';

// 🎉 새로운 관리자 페이지 - 단 몇 줄로 완성!
export async function GET(request: NextRequest) {
  return AdminBaseService.handleRequest(request, {
    // ⚡ 쿼리 정의 (자동으로 병렬 실행됨)
    queries: {
      // 사용자 목록
      users: () => prisma.user.findMany({
        select: { id: true, email: true, isAdmin: true, createdAt: true },
        take: 20
      }),
      
      // 사용자 통계
      userStats: () => prisma.user.groupBy({
        by: ['isAdmin'],
        _count: { id: true }
      }),
      
      // 최근 가입자
      recentUsers: () => prisma.user.findMany({
        select: { id: true, email: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      
      // 전체 사용자 수
      totalCount: () => prisma.user.count()
    },

    // 🚀 캐시 설정 (자동 관리)
    cacheKey: 'example_users',
    cacheTTL: 300, // 5분

    // 🔐 권한 설정
    adminOnly: true,

    // 📄 페이지네이션 자동 처리
    pagination: {
      page: 1,
      limit: 20
    },

    // 🎯 데이터 변환 (선택적)
    transform: (data) => ({
      users: data.users,
      statistics: {
        total: data.totalCount,
        admins: data.userStats.find((s: any) => s.isAdmin)?._count.id || 0,
        regular: data.userStats.find((s: any) => !s.isAdmin)?._count.id || 0
      },
      recent: data.recentUsers
    }),

    // 📦 응답 래핑 (선택적)
    wrapper: (transformedData) => ({
      success: true,
      data: transformedData,
      message: `${transformedData.users.length}명의 사용자를 조회했습니다.`
    })
  });
}

// 🎯 사용자 삭제 (변경 작업 예제)
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('id');

  if (!userId) {
    return AdminBaseService.handleMutation(request, {
      mutation: () => Promise.reject(new Error('사용자 ID가 필요합니다.')),
      cacheInvalidation: [],
      successMessage: ''
    });
  }

  return AdminBaseService.handleMutation(request, {
    // 🎯 변경 작업 정의
    mutation: async () => {
      // 트랜잭션으로 안전한 삭제
      return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: parseInt(userId) },
          select: { id: true, email: true }
        });

        if (!user) {
          throw new Error('사용자를 찾을 수 없습니다.');
        }

        await tx.user.delete({
          where: { id: parseInt(userId) }
        });

        return user;
      });
    },

    // 🚀 관련 캐시 자동 무효화
    cacheInvalidation: ['example_users', 'dashboard', 'users'],

    // 📝 성공 메시지
    successMessage: '사용자가 성공적으로 삭제되었습니다.',

    // 🎯 응답 변환
    transform: (deletedUser) => ({
      deletedUser: deletedUser.email,
      deletedAt: new Date().toISOString()
    })
  });
} 