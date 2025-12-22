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
}
