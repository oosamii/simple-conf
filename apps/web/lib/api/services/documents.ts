import type {
  DocumentResponse,
  CreateDocumentResponse,
  UpdateDocumentResponse,
  CreateDocumentInput,
  UpdateDocumentInput,
} from '@simpleconf/shared';
import { apiClient } from '../client';

export const documentService = {
  async getDocument(id: string): Promise<DocumentResponse> {
    return apiClient.get<DocumentResponse>(`/api/documents/${id}`);
  },

  async createDocument(data: CreateDocumentInput): Promise<CreateDocumentResponse> {
    return apiClient.post<CreateDocumentResponse>('/api/documents', data);
  },

  async updateDocument(id: string, data: UpdateDocumentInput): Promise<UpdateDocumentResponse> {
    return apiClient.put<UpdateDocumentResponse>(`/api/documents/${id}`, data);
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/api/documents/${id}`);
  },
};
