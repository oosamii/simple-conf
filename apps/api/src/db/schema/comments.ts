import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { documents } from "./documents";

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),

    content: text("content").notNull(),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("idx_comments_document").on(table.documentId),
    index("idx_comments_created_by").on(table.createdBy),
    index("idx_comments_created_at").on(table.createdAt),
    index("idx_comments_doc_deleted").on(table.documentId, table.deletedAt),
  ]
);
