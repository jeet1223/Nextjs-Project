import { mysqlTable, serial, varchar,int, timestamp,text } from "drizzle-orm/mysql-core";
import { items } from "./item";

export const addToCart = mysqlTable('addToCart', {
  id: int('id').primaryKey().autoincrement(),
  quantity: varchar('quantity',{ length: 255 }).notNull(),
  price: int('price').notNull(),
  itemId: int('item_id').notNull().references(() => items.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow(),
});
