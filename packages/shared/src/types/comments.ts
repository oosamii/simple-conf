import type { Department, PublicUser } from "./user";

export interface Comment {
  id: string;
  documentId: string;
  content: string;

  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  parentCommentId: string | null;
  deletedAt: Date | null;
}

export interface CommentWithUser extends Comment {
  createdByUser: PublicUser;
}

export interface CreateCommentInput {
  content: string;
  parentCommentId?: string | null;
}

export interface UpdateCommentInput {
  content: string;
}

export interface DocumentViewResponse {
  viewCount: number;
}
