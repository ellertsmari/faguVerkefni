import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projectContent = sqliteTable("project_content", {
  number: integer("number").primaryKey(),
  publishedJson: text("published_json"),
  draftJson: text("draft_json"),
  revision: integer("revision").notNull(),
  updatedAt: text("updated_at").notNull(),
  publishedAt: text("published_at"),
});
