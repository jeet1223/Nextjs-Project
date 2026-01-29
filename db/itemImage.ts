import { mysqlTable, int, varchar,timestamp } from "drizzle-orm/mysql-core";
import { items } from "./item";

export const itemImages = mysqlTable('item_images', {
  id: int('id').primaryKey().autoincrement(),
  itemId: int('item_id').notNull().references(() => items.id, { onDelete: "cascade" }),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
