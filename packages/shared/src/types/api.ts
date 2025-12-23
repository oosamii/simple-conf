import type { User } from './user';
import type { FolderTreeNode, FolderDetailResponse, Folder } from './folder';
import type { Document, DocumentWithMeta } from './document';

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
}

export interface RegisterResponse {
  user: User;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface MeResponse {
  user: User;
}

// Folder API responses
export interface FolderTreeResponse {
  folders: FolderTreeNode[];
}

export interface GetFolderDetailResponse extends FolderDetailResponse {}

export interface CreateFolderResponse {
  folder: Folder;
}

// Document API responses
export interface DocumentResponse {
  document: DocumentWithMeta;
}

export interface CreateDocumentResponse {
  document: Document;
}

export interface UpdateDocumentResponse {
  document: Document;
}
