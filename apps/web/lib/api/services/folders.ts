import type { FolderTreeResponse, GetFolderDetailResponse } from '@simpleconf/shared';
import { apiClient } from '../client';

export const folderService = {
  async getFolderTree(): Promise<FolderTreeResponse> {
    return apiClient.get<FolderTreeResponse>('/api/folders');
  },

  async getFolderDetails(id: string): Promise<GetFolderDetailResponse> {
    return apiClient.get<GetFolderDetailResponse>(`/api/folders/${id}`);
  },
};
