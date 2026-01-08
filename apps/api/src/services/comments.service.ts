import type { FastifyInstance } from "fastify";
import type { Department } from "@simpleconf/shared";
import { CommentRepository } from "../repositories/comment.repository.js";
import { DocumentRepository } from "../repositories/document.repository.js";
import { FolderRepository } from "../repositories/folder.repository.js";

export class CommentsService {
  private commentRepo: CommentRepository;
  private docRepo: DocumentRepository;
  private folderRepo: FolderRepository;

  constructor(private app: FastifyInstance) {
    this.commentRepo = new CommentRepository(app.db);
    this.docRepo = new DocumentRepository(app.db);
    this.folderRepo = new FolderRepository(app.db);
  }

  async listDocumentComments(
    documentId: string,
    userDept: Department,
    paging: { page: number; limit: number }
  ) {
    // Access check: same logic as DocumentService.getDocument (doc -> folder -> visibility)
    const doc = await this.docRepo.findById(documentId);
    if (!doc) {
      const error = new Error("Document not found");
      (error as Error & { code: string }).code = "NOT_FOUND";
      throw error;
    }

    const folder = await this.folderRepo.findById(doc.folderId);
    if (folder && !this.isAccessible(folder, userDept)) {
      const error = new Error("Access denied to this document");
      (error as Error & { code: string }).code = "FORBIDDEN";
      throw error;
    }

    return this.commentRepo.listByDocumentId(documentId, paging);
  }

  async createComment(
    documentId: string,
    data: { content: string; parentCommentId?: string | null },
    userId: string,
    userDept: Department
  ) {
    // Same access check
    const doc = await this.docRepo.findById(documentId);
    if (!doc) {
      const error = new Error("Document not found");
      (error as Error & { code: string }).code = "NOT_FOUND";
      throw error;
    }

    const folder = await this.folderRepo.findById(doc.folderId);
    if (folder && !this.isAccessible(folder, userDept)) {
      const error = new Error("Access denied to this document");
      (error as Error & { code: string }).code = "FORBIDDEN";
      throw error;
    }

    // Optional: validate parentCommentId belongs to same document
    if (data.parentCommentId) {
      const parent = await this.commentRepo.findById(data.parentCommentId);
      if (!parent || parent.documentId !== documentId) {
        const error = new Error("Invalid parent comment");
        (error as Error & { code: string }).code = "NOT_FOUND";
        throw error;
      }
    }

    return this.commentRepo.create({
      documentId,
      content: data.content.trim(),
      createdBy: userId,
      parentCommentId: data.parentCommentId ?? null,
    });
  }

  async updateComment(
    commentId: string,
    data: { content: string },
    userId: string
  ) {
    const existing = await this.commentRepo.findById(commentId);
    if (!existing || existing.deletedAt) {
      const error = new Error("Comment not found");
      (error as Error & { code: string }).code = "NOT_FOUND";
      throw error;
    }

    if (existing.createdBy !== userId) {
      const error = new Error("You can only edit your own comments");
      (error as Error & { code: string }).code = "FORBIDDEN";
      throw error;
    }

    const updated = await this.commentRepo.updateContent(
      commentId,
      data.content.trim()
    );
    if (!updated) {
      const error = new Error("Comment not found");
      (error as Error & { code: string }).code = "NOT_FOUND";
      throw error;
    }

    return updated;
  }

  async deleteComment(commentId: string, userId: string) {
    const existing = await this.commentRepo.findById(commentId);
    if (!existing || existing.deletedAt) {
      const error = new Error("Comment not found");
      (error as Error & { code: string }).code = "NOT_FOUND";
      throw error;
    }

    if (existing.createdBy !== userId) {
      const error = new Error("You can only delete your own comments");
      (error as Error & { code: string }).code = "FORBIDDEN";
      throw error;
    }

    const ok = await this.commentRepo.softDelete(commentId);
    if (!ok) {
      const error = new Error("Comment not found");
      (error as Error & { code: string }).code = "NOT_FOUND";
      throw error;
    }
  }

  private isAccessible(
    folder: { visibility: string; department: Department | null },
    userDept: Department
  ) {
    if (folder.visibility === "public") return true;
    return folder.department === userDept;
  }
}
