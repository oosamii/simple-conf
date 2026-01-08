import { Database } from "../db";
import { Document, DocumentWithMeta, Department } from "@simpleconf/shared";
import {
  DocumentRecord,
  documents,
  NewDocumentRecord,
  documentViews,
  users,
} from "../db/schema";
import { eq, and, sql } from "drizzle-orm";

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
    commentCount: 0,
  };
}

export class DocumentRepository {
  constructor(private db: Database) {}

  async findById(id: string): Promise<Document | null> {
    const result = await this.db
      .select({
        id: documents.id,
        title: documents.title,
        content: documents.content,
        folderId: documents.folderId,
        createdBy: documents.createdBy,
        modifiedBy: documents.modifiedBy,
        viewCount: documents.viewCount,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,

        commentCount: sql<number>`
        (
          select count(*)
          from comments c
          where c.document_id = ${documents.id}
            and c.deleted_at is null
        )
      `.as("commentCount"),
      })
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];

    return {
      id: row.id,
      title: row.title,
      content: row.content,
      folderId: row.folderId,
      createdBy: row.createdBy,
      modifiedBy: row.modifiedBy,
      viewCount: row.viewCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      commentCount: Number(row.commentCount) || 0,
    };
  }

  async findByFolderId(folderId: string): Promise<Document[]> {
    const results = await this.db
      .select({
        id: documents.id,
        title: documents.title,
        content: documents.content,
        folderId: documents.folderId,
        createdBy: documents.createdBy,
        modifiedBy: documents.modifiedBy,
        viewCount: documents.viewCount,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,

        createdByUserId: users.id,
        createdByUserName: users.displayName,
        createdByUserDept: users.department,

        commentCount: sql<number>`
        (
          select count(*)
          from comments c
          where c.document_id = ${documents.id}
            and c.deleted_at is null
        )
      `.as("commentCount"),
      })
      .from(documents)
      .innerJoin(users, eq(documents.createdBy, users.id))
      .where(eq(documents.folderId, folderId));

    return results.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      folderId: row.folderId,
      createdBy: row.createdBy,
      modifiedBy: row.modifiedBy,
      viewCount: row.viewCount,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      commentCount: Number(row.commentCount) || 0,
      createdByUser: {
        id: row.createdByUserId,
        displayName: row.createdByUserName,
        department: row.createdByUserDept as Department,
      },
    }));
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
      updatedAt: new Date(),
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
      extras: {
        commentCount: sql<number>`
        (
          select count(*)
          from comments c
          where c.document_id = ${documents.id}
            and c.deleted_at is null
        )
      `.as("commentCount"),
      },
    });

    if (!result) {
      return null;
    }

    return {
      ...mapToDocument(result),
      folderPath: result.folder.name,
      commentCount: Number((result as any).commentCount) || 0, // ✅ from extras
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

  async insertViewIfNotExists(
    documentId: string,
    userId: string
  ): Promise<boolean> {
    // With the UNIQUE index on (document_id, user_id), this works safely.
    const result = await this.db
      .insert(documentViews)
      .values({
        documentId,
        userId,
      })
      .onConflictDoNothing()
      .returning({ id: documentViews.id });

    return result.length > 0;
  }

  async incrementViewCount(documentId: string): Promise<number> {
    const result = await this.db
      .update(documents)
      .set({
        viewCount: sql`${documents.viewCount} + 1`,
        updatedAt: sql`now()`,
      })
      .where(eq(documents.id, documentId))
      .returning({ viewCount: documents.viewCount });

    // If doc is missing (shouldn't happen because service checks), guard anyway:
    if (result.length === 0) {
      return 0;
    }
    return result[0].viewCount;
  }
}
