import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: 댓글 신고
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id: blogId, commentId: commentIdStr } = await params;
    const commentId = parseInt(commentIdStr);
    const { userId, reason } = await req.json();

    if (isNaN(commentId)) {
      return NextResponse.json({ error: "유효하지 않은 댓글 ID입니다." }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    if (!reason || reason.trim().length < 5) {
      return NextResponse.json({ error: "신고 사유를 5자 이상 입력해주세요." }, { status: 400 });
    }

    // 댓글 존재 확인
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true }
    });

    if (!comment) {
      return NextResponse.json({ error: "존재하지 않는 댓글입니다." }, { status: 404 });
    }

    // 본인 댓글에는 신고 불가
    if (comment.userId === userId) {
      return NextResponse.json({ error: "본인 댓글에는 신고할 수 없습니다." }, { status: 400 });
    }

    // 이미 신고했는지 확인
    const existingReport = await prisma.commentReport.findUnique({
      where: { commentId_userId: { commentId, userId } }
    });

    if (existingReport) {
      return NextResponse.json({ error: "이미 신고한 댓글입니다." }, { status: 400 });
    }

    // 신고 추가
    await prisma.commentReport.create({
      data: { 
        commentId, 
        userId, 
        reason: reason.trim() 
      }
    });

    // 신고 수 확인
    const reportCount = await prisma.commentReport.count({
      where: { commentId }
    });

    let autoAction = null;

    // 신고 수에 따른 자동 처리
    if (reportCount >= 10) {
      // 10개 이상: 즉시 삭제
      await prisma.$transaction([
        prisma.commentLike.deleteMany({ where: { commentId } }),
        prisma.commentReport.deleteMany({ where: { commentId } }),
        prisma.comment.deleteMany({ where: { id: commentId } })
      ]);
      autoAction = "deleted";
    } else if (reportCount >= 5) {
      // 5개 이상: 숨김 처리 (관리자 승인 필요)
      await prisma.comment.update({
        where: { id: commentId },
        data: { isHidden: true }
      });
      autoAction = "hidden";
    }

    return NextResponse.json({ 
      message: autoAction === "deleted" 
        ? "댓글이 자동으로 삭제되었습니다." 
        : autoAction === "hidden"
        ? "댓글이 숨겨졌습니다. 관리자 검토가 필요합니다."
        : "댓글이 신고되었습니다.",
      reportCount,
      isReported: true,
      autoAction
    });

  } catch (e) {
    console.error("댓글 신고 오류:", e);
    return NextResponse.json({ error: "신고 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
} 