import { mysqlTable, serial, varchar,int, boolean, json, timestamp } from 'drizzle-orm/mysql-core';
import { addresses } from "./addresses";
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
  phone_number: varchar('phone_number', { length: 20 }),
  role: varchar('role', { length: 50 }).default('user'),
  status: boolean('status').default(true),
  refresh_token: varchar('refresh_token', { length: 255 }),
  is_notification: boolean('is_notification').default(true),
  deviceToken: varchar('device_token', { length: 255 }).default(''),
  deviceType: varchar('device_type', { length: 50 }).default('web'),
  loginWith: varchar('login_with', { length: 50 }).default('andriod'),
  image: varchar('image', { length: 255 }),
  address_id: int("address_id").references(() => addresses.id, { onDelete: "cascade" }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

