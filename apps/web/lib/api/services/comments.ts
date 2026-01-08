import {
  CreateCommentInput,
  CreateCommentResponse,
  ListCommentsResponse,
  UpdateCommentInput,
  UpdateCommentResponse,
} from "@simpleconf/shared";
import { apiClient } from "../client";

export const commentsService = {
  async listComments(
    documentId: string,
    page = 1,
    limit = 20
  ): Promise<ListCommentsResponse> {
    return apiClient.get<ListCommentsResponse>(
      `/api/documents/${documentId}/comments?page=${page}&limit=${limit}`
    );
  },

  async createComment(
    documentId: string,
    data: CreateCommentInput
  ): Promise<CreateCommentResponse> {
    return apiClient.post<CreateCommentResponse>(
      `/api/documents/${documentId}/comments`,
      data
    );
  },

  async updateComment(
    commentId: string,
    data: UpdateCommentInput
  ): Promise<UpdateCommentResponse> {
    return apiClient.patch<UpdateCommentResponse>(
      `/api/comments/${commentId}`,
      data
    );
  },

  // async deleteComment(commentId: string): Promise<{ success: boolean }> {
  //   return apiClient.delete<{ success: boolean }>(`/api/comments/${commentId}`);
  // },
  async deleteComment(commentId: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(
      `/api/comments/${commentId}`,
      {
        body: JSON.stringify({ ok: true }),
      }
    );
  },
};
