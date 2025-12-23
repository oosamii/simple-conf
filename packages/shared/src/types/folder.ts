import type { Department } from './user.js';
import type { DocumentSummary } from './document.js';

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

export interface FolderTreeNode {
  id: string;
  name: string;
  parentId: string | null;
  visibility: FolderVisibility;
  department: Department | null;
  documentCount: number;
  isAccessible: boolean;
  children: FolderTreeNode[];
}

export interface FolderWithMeta extends Folder {
  documentCount: number;
  isAccessible: boolean;
  children?: FolderWithMeta[];
}

export interface FolderDetailResponse {
  folder: Folder;
  breadcrumbs: { id: string; name: string }[];
  subfolders: FolderWithMeta[];
  documents: DocumentSummary[];
}
