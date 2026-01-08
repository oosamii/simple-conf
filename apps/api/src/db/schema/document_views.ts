import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { documents } from "./documents";

export const documentViews = pgTable(
  "document_views",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // ✅ one view per user per document (lifetime)
    unique("uniq_document_views_lifetime").on(table.documentId, table.userId),

    index("idx_document_views_document").on(table.documentId),
    index("idx_document_views_user").on(table.userId),
    index("idx_document_views_created").on(table.createdAt),
  ]
);

export const documentViewsRelations = relations(documentViews, ({ one }) => ({
  document: one(documents, {
    fields: [documentViews.documentId],
    references: [documents.id],
  }),
  user: one(users, {
    fields: [documentViews.userId],
    references: [users.id],
  }),
}));

export type DocumentViewRecord = typeof documentViews.$inferSelect;
export type NewDocumentViewRecord = typeof documentViews.$inferInsert;
