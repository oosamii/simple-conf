import { Department, PublicUser } from "./user.js";

export interface Document {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdBy: string;
  modifiedBy: string | null;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  // ✅ NEW
  commentCount: number;
  createdByUser?: PublicUser; 
}

export interface DocumentWithMeta extends Document {
  commentCount: number;
  createdByUser: PublicUser;
  modifiedByUser: PublicUser | null;
  folderPath: string;
}

export interface DocumentSummary {
  id: string;
  title: string;
  folderId: string;
  folderPath: string;
  createdBy: PublicUser;
  updatedAt: Date;
  viewCount: number;
  commentCount: number;
}
