import { mysqlTable,int, text, varchar, timestamp } from "drizzle-orm/mysql-core";
import { category } from "./category";

export const cmsContent = mysqlTable("cms_content", {
  id: int('id').primaryKey().autoincrement(),
  type: varchar("type", { length: 20 }).notNull().unique(), // about | terms | privacy
  html: text("html").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

