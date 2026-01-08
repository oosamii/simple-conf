import { Database } from "../db";
import { comments, users } from "../db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";

export type CommentRow = typeof comments.$inferSelect;

function mapComment(record: CommentRow) {
  return {
    id: record.id,
    documentId: record.documentId,
    content: record.content,
    createdBy: record.createdBy,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    deletedAt: record.deletedAt ?? null,
  };
}

export class CommentRepository {
  constructor(private db: Database) {}

  async create(data: {
    documentId: string;
    content: string;
    createdBy: string;
    parentCommentId?: string | null;
  }) {
    const result = await this.db
      .insert(comments)
      .values({
        documentId: data.documentId,
        content: data.content,
        createdBy: data.createdBy,
      })
      .returning();

    return mapComment(result[0]);
  }

  async listByDocumentId(
    documentId: string,
    opts: { page: number; limit: number }
  ) {
    const offset = (opts.page - 1) * opts.limit;

    const rows = await this.db
      .select({
        id: comments.id,
        documentId: comments.documentId,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,

        userId: users.id,
        displayName: users.displayName,
        department: users.department,
      })
      .from(comments)
      .innerJoin(users, eq(comments.createdBy, users.id))
      .where(
        and(eq(comments.documentId, documentId), isNull(comments.deletedAt))
      )
      .orderBy(desc(comments.createdAt))
      .limit(opts.limit)
      .offset(offset);

    return rows.map((row) => ({
      id: row.id,
      documentId: row.documentId,
      content: row.content,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      createdByUser: {
        id: row.userId,
        displayName: row.displayName,
        department: row.department,
      },
    }));
  }

  async findById(id: string) {
    const rows = await this.db
      .select()
      .from(comments)
      .where(eq(comments.id, id))
      .limit(1);
    return rows.length ? mapComment(rows[0]) : null;
  }

  async updateContent(id: string, content: string) {
    const rows = await this.db
      .update(comments)
      .set({ content, updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();

    return rows.length ? mapComment(rows[0]) : null;
  }

  async softDelete(id: string) {
    const rows = await this.db
      .update(comments)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning({ id: comments.id });

    return rows.length > 0;
  }
}
