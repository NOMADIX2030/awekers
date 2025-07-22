import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import BlogDetailClient from './BlogDetailClient';
import './styles.css';

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const blogId = parseInt(id);
    if (isNaN(blogId)) {
      return {
        title: '블로그를 찾을 수 없습니다 - AWEKERS',
        description: '요청하신 블로그 페이지를 찾을 수 없습니다.',
      };
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        title: true,
        summary: true,
        tag: true,
        image: true,
        date: true,
      },
    });

    if (!blog) {
      return {
        title: '블로그를 찾을 수 없습니다 - AWEKERS',
        description: '요청하신 블로그 페이지를 찾을 수 없습니다.',
      };
    }

    return {
      title: `${blog.title} - AWEKERS`,
      description: blog.summary,
      keywords: blog.tag,
      openGraph: {
        title: blog.title,
        description: blog.summary,
        type: 'article',
        publishedTime: blog.date.toISOString(),
        images: blog.image ? [blog.image] : [],
        url: `https://awekers.com/blog/${blog.id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.summary,
        images: blog.image ? [blog.image] : [],
      },
    };
  } catch (error) {
    console.error('[Blog Metadata] Error:', error);
    return {
      title: '블로그 - AWEKERS',
      description: 'AWEKERS의 블로그 페이지입니다.',
    };
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  try {
    const { id } = await params;
    const blogId = parseInt(id);
    if (isNaN(blogId)) {
      notFound();
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        title: true,
        summary: true,
        content: true,
        tag: true,
        image: true,
        date: true,
        view: true,
      },
    });

    if (!blog) {
      notFound();
    }

    // 댓글 데이터 가져오기
    const rawComments = await prisma.comment.findMany({
      where: { 
        blogId: blogId,
        isHidden: false 
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isAdmin: true
          }
        },
        _count: {
          select: {
            likes: true,
            reports: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 타입 변환
    const comments = rawComments.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    }));

    // 관리자 권한 체크 (간단한 방식)
    const isAdmin = false; // 실제로는 세션에서 확인해야 함

    return (
      <BlogDetailClient 
        blog={blog} 
        comments={comments}
        isAdmin={isAdmin}
      />
    );
  } catch (error) {
    console.error('[Blog Page] Error:', error);
    notFound();
  }
}

// 정적 생성 설정
export const revalidate = 3600; // 1시간마다 재생성 