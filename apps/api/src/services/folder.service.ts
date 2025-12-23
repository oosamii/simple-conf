import type { FastifyInstance } from "fastify";
import type {
  Folder,
  Department,
  FolderTreeNode,
  FolderDetailResponse,
  DocumentSummary,
} from "@simpleconf/shared";
import { FolderRepository } from "../repositories/folder.repository.js";
import { DocumentRepository } from "../repositories/document.repository.js";

export class FolderService {
  private folderRepository: FolderRepository;
  private documentRepository: DocumentRepository;

  constructor(private app: FastifyInstance) {
    this.folderRepository = new FolderRepository(app.db);
    this.documentRepository = new DocumentRepository(app.db);
  }

  async getFolderTree(userDepartment: Department): Promise<FolderTreeNode[]> {
    const allFolders = await this.folderRepository.findAll();

    // Get document counts for all folders
    const folderCounts = await Promise.all(
      allFolders.map(async (folder) => ({
        folderId: folder.id,
        count: await this.folderRepository.getDocumentCount(folder.id),
      }))
    );

    const countMap = new Map(
      folderCounts.map((fc) => [fc.folderId, fc.count])
    );

    // Build tree structure
    const folderMap = new Map<string, FolderTreeNode>();

    // Create nodes
    for (const folder of allFolders) {
      const isAccessible = this.isAccessible(folder, userDepartment);
      folderMap.set(folder.id, {
        id: folder.id,
        name: folder.name,
        parentId: folder.parentId,
        visibility: folder.visibility,
        department: folder.department,
        documentCount: countMap.get(folder.id) ?? 0,
        isAccessible,
        children: [],
      });
    }

    // Build tree
    const rootNodes: FolderTreeNode[] = [];
    for (const folder of allFolders) {
      const node = folderMap.get(folder.id)!;
      if (folder.parentId === null) {
        rootNodes.push(node);
      } else {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(node);
        }
      }
    }

    return rootNodes;
  }

  async getFolderDetails(
    id: string,
    userDepartment: Department
  ): Promise<FolderDetailResponse | null> {
    const folder = await this.folderRepository.findById(id);

    if (!folder) {
      return null;
    }

    // Check access
    if (!this.isAccessible(folder, userDepartment)) {
      const error = new Error("Access denied to this folder");
      (error as Error & { code: string }).code = "FORBIDDEN";
      throw error;
    }

    // Get breadcrumbs
    const breadcrumbs = await this.buildBreadcrumbs(folder);

    // Get subfolders with meta
    const children = await this.folderRepository.findChildren(id);
    const subfolders = await Promise.all(
      children.map(async (child) => ({
        ...child,
        documentCount: await this.folderRepository.getDocumentCount(child.id),
        isAccessible: this.isAccessible(child, userDepartment),
      }))
    );

    // Get documents in folder
    const docs = await this.documentRepository.findByFolderId(id);
    const documents: DocumentSummary[] = docs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      folderId: doc.folderId,
      folderPath: folder.name,
      createdBy: { id: doc.createdBy, displayName: "", department: userDepartment },
      updatedAt: doc.updatedAt,
      viewCount: doc.viewCount,
      commentCount: 0,
    }));

    return {
      folder,
      breadcrumbs,
      subfolders,
      documents,
    };
  }

  async createFolder(
    data: { name: string; parentId: string | null },
    userId: string,
    userDepartment: Department
  ): Promise<Folder> {
    // If parent specified, verify it exists and user has access
    if (data.parentId) {
      const parent = await this.folderRepository.findById(data.parentId);
      if (!parent) {
        const error = new Error("Parent folder not found");
        (error as Error & { code: string }).code = "NOT_FOUND";
        throw error;
      }
      if (!this.isAccessible(parent, userDepartment)) {
        const error = new Error("Access denied to parent folder");
        (error as Error & { code: string }).code = "FORBIDDEN";
        throw error;
      }
    }

    return this.folderRepository.create({
      name: data.name,
      parentId: data.parentId,
      visibility: "public",
      department: null,
      createdBy: userId,
    });
  }

  private isAccessible(folder: Folder, userDepartment: Department): boolean {
    if (folder.visibility === "public") return true;
    return folder.department === userDepartment;
  }

  private async buildBreadcrumbs(
    folder: Folder
  ): Promise<{ id: string; name: string }[]> {
    const breadcrumbs: { id: string; name: string }[] = [];
    let current: Folder | null = folder;

    while (current) {
      breadcrumbs.unshift({ id: current.id, name: current.name });
      if (current.parentId) {
        current = await this.folderRepository.findById(current.parentId);
      } else {
        current = null;
      }
    }

    return breadcrumbs;
  }
}
