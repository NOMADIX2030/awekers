// 댓글 시스템 관련 타입 정의

export interface CommentUser {
  id: number;
  email: string;
  isAdmin: boolean;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  blogId: number;
  isHidden: boolean;
  user: CommentUser;
  _count: {
    likes: number;
    reports: number;
  };
}

export interface CommentFormData {
  content: string;
  userId: number;
}

export interface CommentAPIResponse {
  comments: Comment[];
}

export interface CommentCreateResponse {
  comment: Comment;
  message: string;
}

export interface LikeResponse {
  message: string;
  likesCount: number;
  isLiked: boolean;
}

export interface ReportResponse {
  message: string;
  reportCount: number;
  isHidden: boolean;
}

export interface ReportFormData {
  userId: number;
  reason: string;
}

export type CommentActionType = 'like' | 'report' | 'delete'; 