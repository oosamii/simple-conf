import { count, eq, isNull } from "drizzle-orm";
import type { Database } from "../db/index.js";
import {
  folders,
  type FolderRecord,
  type NewFolderRecord,
} from "../db/schema/folders.js";
import type { Folder, Department, User } from "@simpleconf/shared";
import { documents } from "../db/schema/documents.js";

export interface CreateFolderData {
  name: string;
  parentId: string | null;
  visibility: "public" | "department";
  department: Department | null;
  createdBy: User["id"];
}

function mapToFolder(record: FolderRecord): Folder {
  return {
    id: record.id,
    name: record.name,
    parentId: record.parentId,
    visibility: record.visibility,
    department: record.department as Department | null,
    createdAt: record.createdAt,
    createdBy: record.createdBy,
  };
}

export class FolderRepository {
  constructor(private db: Database) {}

  async findAll() {
    const results = await this.db.select().from(folders);
    return results.map(mapToFolder);
  }

  async findById(id: string): Promise<Folder | null> {
    const result = await this.db
      .select()
      .from(folders)
      .where(eq(folders.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return mapToFolder(result[0]);
  }

  async findChildren(parentId: string | null): Promise<Folder[]> {
    const result =
      parentId === null
        ? await this.db.select().from(folders).where(isNull(folders.parentId))
        : await this.db
            .select()
            .from(folders)
            .where(eq(folders.parentId, parentId));

    return result.map(mapToFolder);
  }

  async create(data: CreateFolderData): Promise<Folder> {
    const newFolder: NewFolderRecord = {
      name: data.name,
      parentId: data.parentId,
      visibility: data.visibility,
      department: data.department,
      createdBy: data.createdBy,
    };

    const result = await this.db.insert(folders).values(newFolder).returning();

    return mapToFolder(result[0]);
  }

  async getDocumentCount(folderId: string): Promise<number> {
    const result = await this.db
      .select({ count: count() })
      .from(documents)
      .where(eq(documents.folderId, folderId));

    return result[0]?.count ?? 0;
  }
}
