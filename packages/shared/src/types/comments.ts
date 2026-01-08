import type { Department, PublicUser } from "./user"; // adjust path if needed

// export interface PublicUser {
//   id: string;
//   displayName: string;
//   department: Department;
// }

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

export interface CreateCommentResponse {
  comment: CommentWithUser;
}

export interface UpdateCommentResponse {
  comment: CommentWithUser;
}

export interface ListCommentsResponse {
  comments: CommentWithUser[];
}

export interface DocumentViewResponse {
  viewCount: number;
}
