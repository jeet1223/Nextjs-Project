import { mysqlTable, serial, varchar,int, timestamp } from "drizzle-orm/mysql-core";

export const addresses = mysqlTable("addresses", {
  id: int('id').primaryKey().autoincrement(),
  street: varchar("street", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  area: varchar("area", { length: 100 }),
  pincode: varchar("pincode", { length: 20 }),
  landmark: varchar("landmark", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
});
