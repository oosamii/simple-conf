import type { FastifyInstance } from "fastify";
import type { Document, DocumentWithMeta, Department } from "@simpleconf/shared";
import { DocumentRepository } from "../repositories/document.repository.js";
import { FolderRepository } from "../repositories/folder.repository.js";

export class DocumentService {
  private documentRepository: DocumentRepository;
  private folderRepository: FolderRepository;

  constructor(private app: FastifyInstance) {
    this.documentRepository = new DocumentRepository(app.db);
    this.folderRepository = new FolderRepository(app.db);
  }

  async getDocument(
    id: string,
    userDepartment: Department
  ): Promise<DocumentWithMeta> {
    const document = await this.documentRepository.findWithMeta(id);

    if (!document) {
      const error = new Error("Document not found");
      (error as Error & { code: string }).code = "NOT_FOUND";
      throw error;
    }

    // Check folder access
    const folder = await this.folderRepository.findById(document.folderId);
    if (folder && !this.isAccessible(folder, userDepartment)) {
      const error = new Error("Access denied to this document");
      (error as Error & { code: string }).code = "FORBIDDEN";
      throw error;
    }

    return document;
  }

  async createDocument(
    data: { title: string; content: string; folderId: string },
    userId: string,
    userDepartment: Department
  ): Promise<Document> {
    // Verify folder exists and user has access
    const folder = await this.folderRepository.findById(data.folderId);

    if (!folder) {
      const error = new Error("Folder not found");
      (error as Error & { code: string }).code = "NOT_FOUND";
      throw error;
    }

    if (!this.isAccessible(folder, userDepartment)) {
      const error = new Error("Access denied to this folder");
      (error as Error & { code: string }).code = "FORBIDDEN";
      throw error;
    }

    return this.documentRepository.create({
      title: data.title,
      content: data.content,
      folderId: data.folderId,
      createdBy: userId,
    });
  }

  async updateDocument(
    id: string,
    data: { title?: string; content?: string },
    userId: string
  ): Promise<Document> {
    const document = await this.documentRepository.findById(id);

    if (!document) {
      const error = new Error("Document not found");
      (error as Error & { code: string }).code = "NOT_FOUND";
      throw error;
    }

    // Verify ownership
    if (document.createdBy !== userId) {
      const error = new Error("You can only edit your own documents");
      (error as Error & { code: string }).code = "FORBIDDEN";
      throw error;
    }

    const updated = await this.documentRepository.update(id, {
      title: data.title,
      content: data.content,
      modifiedBy: userId,
    });

    if (!updated) {
      const error = new Error("Failed to update document");
      (error as Error & { code: string }).code = "NOT_FOUND";
      throw error;
    }

    return updated;
  }

  async deleteDocument(id: string, userId: string): Promise<void> {
    const document = await this.documentRepository.findById(id);

    if (!document) {
      const error = new Error("Document not found");
      (error as Error & { code: string }).code = "NOT_FOUND";
      throw error;
    }

    // Verify ownership
    if (document.createdBy !== userId) {
      const error = new Error("You can only delete your own documents");
      (error as Error & { code: string }).code = "FORBIDDEN";
      throw error;
    }

    await this.documentRepository.delete(id);
  }

  private isAccessible(
    folder: { visibility: string; department: Department | null },
    userDepartment: Department
  ): boolean {
    if (folder.visibility === "public") return true;
    return folder.department === userDepartment;
  }
}
