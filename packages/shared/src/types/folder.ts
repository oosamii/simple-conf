import type { Department } from './user.js';

export type FolderVisibility = 'public' | 'department';

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  department: Department | null;
  visibility: FolderVisibility;
  createdBy: string;
  createdAt: Date;
}
