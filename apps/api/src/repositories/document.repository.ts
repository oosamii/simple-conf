import { Database } from "../db";
import { Document, DocumentWithMeta, Department } from "@simpleconf/shared";
import { DocumentRecord, documents, NewDocumentRecord } from "../db/schema";
import { eq } from "drizzle-orm";

interface CreateDocumentData {
  title: string;
  content: string;
  folderId: string;
  createdBy: string;
}

interface UpdateDocumentData {
  title?: string;
  content?: string;
  modifiedBy: string;
}

function mapToDocument(record: DocumentRecord): Document {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    folderId: record.folderId,
    createdAt: record.createdAt,
    createdBy: record.createdBy,
    modifiedBy: record.modifiedBy,
    viewCount: record.viewCount,
    updatedAt: record.updatedAt,
  };
}

export class DocumentRepository {
  constructor(private db: Database) {}

  async findById(id: string): Promise<Document | null> {
    const result = await this.db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }
    return mapToDocument(result[0]);
  }

  async findByFolderId(folderId: string): Promise<Document[]> {
    const results = await this.db
      .select()
      .from(documents)
      .where(eq(documents.folderId, folderId));
    return results.map(mapToDocument);
  }

  async create(data: CreateDocumentData): Promise<Document> {
    const newDocument: NewDocumentRecord = {
      title: data.title,
      content: data.content,
      folderId: data.folderId,
      createdBy: data.createdBy,
    };
    const result = await this.db
      .insert(documents)
      .values(newDocument)
      .returning();
    return mapToDocument(result[0]);
  }

  async update(id: string, data: UpdateDocumentData): Promise<Document | null> {
    const updateData: Partial<typeof documents.$inferInsert> = {
      modifiedBy: data.modifiedBy,
    };
    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.content !== undefined) {
      updateData.content = data.content;
    }

    const result = await this.db
      .update(documents)
      .set(updateData)
      .where(eq(documents.id, id))
      .returning();
    if (result.length === 0) {
      return null;
    }
    return mapToDocument(result[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(documents).where(eq(documents.id, id));
  }

  async findWithMeta(id: string): Promise<DocumentWithMeta | null> {
    const result = await this.db.query.documents.findFirst({
      where: eq(documents.id, id),
      with: {
        folder: true,
        createdByUser: true,
        modifiedByUser: true,
      },
    });

    if (!result) {
      return null;
    }

    return {
      ...mapToDocument(result),
      folderPath: result.folder.name,
      commentCount: 0,
      createdByUser: {
        id: result.createdByUser.id,
        displayName: result.createdByUser.displayName,
        department: result.createdByUser.department as Department,
      },
      modifiedByUser: result.modifiedByUser
        ? {
            id: result.modifiedByUser.id,
            displayName: result.modifiedByUser.displayName,
            department: result.modifiedByUser.department as Department,
          }
        : null,
    };
  }
}
