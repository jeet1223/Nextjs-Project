import { mysqlTable, serial, varchar,int, timestamp,text } from "drizzle-orm/mysql-core";

export const category = mysqlTable("categories", {
  id: int('id').primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});
