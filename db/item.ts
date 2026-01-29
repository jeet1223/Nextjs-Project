import { mysqlTable, serial, varchar,int, timestamp,text ,boolean } from "drizzle-orm/mysql-core";
import { category } from "./category";

export const items = mysqlTable('items', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name',{ length: 255 }).notNull(),
  slug: varchar('slug',{ length: 255 }).notNull(),
  description: varchar('description', { length: 500 }).notNull(),
  price: int('price').notNull(),
  discountPrice: int('discount_price'),
  color: varchar('color', { length: 255 }),
  stock: boolean('in_stock',).default(true),
  tag:varchar('tag', { length: 255 }),
  quantityName:varchar('quantityName',{ length: 500 }),
  limitedItem:int('limitedItem'),
  categoryId: int('category_id').notNull().references(() => category.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow(),
});
