import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { CacheManager } from '../../../../lib/admin/CacheManager';
import { QueryOptimizer } from '../../../../lib/admin/QueryOptimizer';

// 🎯 캐시 키 상수 정의 (Blog Management)
const CACHE_KEYS = {
  BLOG_LIST: (page: number, limit: number, sortBy: string, sortOrder: string, status?: string, search?: string) => 
    `blog:list:${page}:${limit}:${sortBy}:${sortOrder}:${status || 'all'}:${search || 'none'}`,
  BLOG_STATS: 'blog:stats:all',
  BLOG_TAGS: 'blog:tags:popular',
  BLOG_COUNT: (status?: string, search?: string) => `blog:count:${status || 'all'}:${search || 'none'}`
};

// 🚀 극대화된 캐시 TTL (3분 → 10분)
const CACHE_TTL = 600; // 10분

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  const cache = CacheManager.getInstance();
  
  try {
    // 관리자 권한 확인
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer admin-key')) {
      return NextResponse.json(
        { success: false, message: '관리자 권한이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // 🚀 Phase 1: 전체 캐시 확인 (최우선)
    const fullCacheKey = CACHE_KEYS.BLOG_LIST(page, limit, sortBy, sortOrder, status || undefined, search || undefined);
    const cachedResult = await cache.get(fullCacheKey);
    
    if (cachedResult) {
      const responseTime = (performance.now() - startTime).toFixed(2);
      console.log(`🚀 블로그 관리 전체 캐시 히트: ${responseTime}ms`);
      
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        responseTime: `${responseTime}ms`,
        cacheHit: 'FULL'
      });
    }

    // 🎯 Phase 2: 개별 캐시 확인 및 조합
    console.log('🔍 블로그 관리 개별 캐시 확인 시작');
    
    const [cachedStats, cachedTags] = await Promise.all([
      cache.get(CACHE_KEYS.BLOG_STATS),
      cache.get(CACHE_KEYS.BLOG_TAGS)
    ]);

    let partialCacheHits = 0;
    let dbQueries = [];

    // 통계 데이터
    let blogStats = cachedStats;
    if (!blogStats) {
      console.log('💾 블로그 통계 DB 조회 필요');
      dbQueries.push(
        prisma.blog.count(),
        prisma.blog.aggregate({ _sum: { view: true } })
      );
    } else {
      partialCacheHits++;
      console.log('⚡ 블로그 통계 캐시 히트');
    }

    // 인기 태그
    let popularTags = cachedTags;
    if (!popularTags) {
      console.log('💾 인기 태그 DB 조회 필요');
      dbQueries.push(
        prisma.blog.findMany({
          select: { tag: true },
          orderBy: { view: 'desc' },
          take: 100
        })
      );
    } else {
      partialCacheHits++;
      console.log('⚡ 인기 태그 캐시 히트');
    }

    // 🎯 검색 조건 구성
    const whereCondition: any = {};
    
    if (search) {
      whereCondition.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { tag: { contains: search } }
      ];
    }

    const skip = (page - 1) * limit;

    // 메인 블로그 목록 (항상 DB에서 조회 - 실시간 반영 필요)
    console.log('💾 블로그 목록 DB 조회 (실시간 데이터)');
    
    const orderBy: any = {};
    if (sortBy === 'view') orderBy.view = sortOrder;
    else if (sortBy === 'date') orderBy.date = sortOrder;
    else if (sortBy === 'title') orderBy.title = sortOrder;
    else orderBy.date = sortOrder;

    // 🚀 Phase 3: 필요한 DB 쿼리만 실행
    const allQueries = [
      // 블로그 목록 (항상 실행)
      prisma.blog.findMany({
        where: whereCondition,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          summary: true,
          date: true,
          view: true,
          tag: true,
          image: true
        }
      }),
      // 총 개수 (항상 실행)
      prisma.blog.count({ where: whereCondition }),

      // 조건부 쿼리들
      ...dbQueries
    ];

    console.log(`🔍 블로그 관리 API: ${allQueries.length}개 쿼리 병렬 실행`);
    
    const results = await Promise.all(allQueries);
    
    // 결과 할당
    const blogs = results[0] as any[];
    const totalCount = results[1] as number;
    let resultIndex = 2;

    // 조건부 결과 할당
    if (!blogStats) {
      const totalBlogs = results[resultIndex++] as number;
      const totalViews = results[resultIndex++] as { _sum: { view: number | null } };
      blogStats = { totalBlogs, totalViews: totalViews._sum?.view || 0 };
      await cache.set(CACHE_KEYS.BLOG_STATS, blogStats, CACHE_TTL);
    }

    if (!popularTags) {
      const rawTags = results[resultIndex++] as { tag: string }[];
      // Application-level tag aggregation
      const tagCounts: Record<string, number> = {};
      rawTags.forEach((blog: { tag: string }) => {
        const tags = blog.tag.split(',').map((t: string) => t.trim());
        tags.forEach((tag: string) => {
          if (tag) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      });
      
      popularTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([tag, count]) => ({ tag, count }));
        
      await cache.set(CACHE_KEYS.BLOG_TAGS, popularTags, CACHE_TTL);
    }

    // 🎯 Phase 4: 최종 데이터 조합
    const responseData = {
      success: true,
      data: {
        blogs: blogs.map(blog => ({
          ...blog,
          date: blog.date.toISOString().split('T')[0],
          tags: blog.tag.split(',').map((t: string) => t.trim()).filter(Boolean)
        })),
      pagination: {
          page: page,
          pages: Math.ceil(totalCount / limit),
          total: totalCount,
          hasNext: skip + limit < totalCount,
        hasPrev: page > 1
      },
        statistics: blogStats,
        popularTags: popularTags.slice(0, 10) // Top 10만 반환
      }
    };

    // 🚀 전체 결과 캐시 저장
    await cache.set(fullCacheKey, responseData, CACHE_TTL);

    const responseTime = (performance.now() - startTime).toFixed(2);
    console.log(`🎯 블로그 관리 로딩 완료: ${responseTime}ms (부분 히트: ${partialCacheHits})`);

    return NextResponse.json({
      ...responseData,
      cached: false,
      partialCacheHits,
      responseTime: `${responseTime}ms`
    });

  } catch (error) {
    console.error('❌ 블로그 관리 API 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 🚀 최적화된 블로그 삭제 API
export async function DELETE(request: NextRequest) {
  const startTime = performance.now();
  const cache = CacheManager.getInstance();
  
  try {
    // 관리자 권한 확인
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer admin-key')) {
      return NextResponse.json(
        { success: false, message: '관리자 권한이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('id');

    if (!blogId) {
      return NextResponse.json(
        { success: false, message: '블로그 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 🎯 트랜잭션으로 안전한 삭제
    const result = await prisma.$transaction(async (tx) => {
      // 블로그 존재 확인
      const existingBlog = await tx.blog.findUnique({
        where: { id: parseInt(blogId) },
        select: { id: true, title: true }
      });

      if (!existingBlog) {
        throw new Error('해당 블로그를 찾을 수 없습니다.');
      }

      // 관련 댓글 삭제 (cascade)
      const deletedComments = await tx.comment.deleteMany({
        where: { blogId: parseInt(blogId) }
      });

      // 블로그 삭제
      await tx.blog.delete({
        where: { id: parseInt(blogId) }
      });

      return {
        blogTitle: existingBlog.title,
        deletedComments: deletedComments.count
      };
    });

    // 🚀 관련 캐시 무효화
    await cache.invalidate('blog:');

    const endTime = performance.now();
    console.log(`🎯 블로그 삭제 완료: ${(endTime - startTime).toFixed(2)}ms`);

    return NextResponse.json({
      success: true,
      message: `블로그 "${result.blogTitle}"와 관련 댓글 ${result.deletedComments}개가 성공적으로 삭제되었습니다.`,
      responseTime: `${(endTime - startTime).toFixed(2)}ms`
    });

  } catch (error) {
    const endTime = performance.now();
    console.error('블로그 삭제 오류:', error);
    console.error(`⚠️ 블로그 삭제 실패: ${(endTime - startTime).toFixed(2)}ms`);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '블로그 삭제 중 오류가 발생했습니다.',
      },
      { status: error instanceof Error && error.message.includes('찾을 수 없습니다') ? 404 : 500 }
    );
  }
}

// 🚀 캐시 무효화 API (관리자용)
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer admin-key')) {
      return NextResponse.json(
        { success: false, message: '관리자 권한이 필요합니다.' },
        { status: 401 }
      );
    }

    CacheManager.getInstance().clear();
    
    return NextResponse.json({ 
      success: true, 
      message: '블로그 관리 캐시가 무효화되었습니다.' 
    });
  } catch (error) {
    console.error('캐시 무효화 오류:', error);
    return NextResponse.json(
      { success: false, error: '캐시 무효화에 실패했습니다.' },
      { status: 500 }
    );
  }
} 