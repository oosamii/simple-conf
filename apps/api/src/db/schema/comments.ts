// import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm";
// import { users } from "./users";
// import { documents } from "./documents";

// export const comments = pgTable(
//   "comments",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),

//     documentId: uuid("document_id")
//       .notNull()
//       .references(() => documents.id, { onDelete: "cascade" }),

//     content: text("content").notNull(),

//     createdBy: uuid("created_by")
//       .notNull()
//       .references(() => users.id),

//     // Optional: replies (1-level or nested)
//     parentCommentId: uuid("parent_comment_id").references(() => comments.id, {
//       onDelete: "set null",
//     }),

//     createdAt: timestamp("created_at", { withTimezone: true })
//       .defaultNow()
//       .notNull(),

//     updatedAt: timestamp("updated_at", { withTimezone: true })
//       .defaultNow()
//       .notNull(),

//     // Soft delete
//     deletedAt: timestamp("deleted_at", { withTimezone: true }),
//   },
//   (table) => [
//     index("idx_comments_document").on(table.documentId),
//     index("idx_comments_created_by").on(table.createdBy),
//     index("idx_comments_created_at").on(table.createdAt),

//     // Good for listing only active comments for a doc
//     index("idx_comments_doc_deleted").on(table.documentId, table.deletedAt),
//   ]
// );

// export const commentsRelations = relations(comments, ({ one, many }) => ({
//   document: one(documents, {
//     fields: [comments.documentId],
//     references: [documents.id],
//   }),
//   author: one(users, {
//     fields: [comments.createdBy],
//     references: [users.id],
//     relationName: "commentAuthor",
//   }),
//   parent: one(comments, {
//     fields: [comments.parentCommentId],
//     references: [comments.id],
//     relationName: "commentParent",
//   }),
//   replies: many(comments, {
//     relationName: "commentParent",
//   }),
// }));

// export type CommentRecord = typeof comments.$inferSelect;
// export type NewCommentRecord = typeof comments.$inferInsert;

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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

    // ✅ define the column without referencing comments here
    parentCommentId: uuid("parent_comment_id"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    // ✅ self FK defined here, table is typed
    // @ts-ignore (only if your drizzle version complains, otherwise remove)
    // table.parentCommentId.references(() => table.id, { onDelete: "set null" }),

    index("idx_comments_document").on(table.documentId),
    index("idx_comments_created_by").on(table.createdBy),
    index("idx_comments_created_at").on(table.createdAt),
    index("idx_comments_doc_deleted").on(table.documentId, table.deletedAt),
  ]
);
