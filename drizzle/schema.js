import { pgTable, serial, text, varchar, timestamp, boolean, integer, numeric, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  email: text('email'),
  phone: varchar('phone', { length: 256 }),
  role: text('role').default('admin'),
  name: text('name'),
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  location: text('location').notNull(),
  image: text('image'),
  images: jsonb('images').default([]),
  price: numeric('price').notNull().default('0'),
  status: text('status').notNull().default('sale'),
  type: text('type'),
  bedrooms: integer('bedrooms'),
  bathrooms: integer('bathrooms'),
  squareFootage: integer('square_footage'),
  description: text('description'),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  location: text('location').notNull(),
  status: text('status').notNull().default('Ongoing'),
  progress: integer('progress').notNull().default(0),
  description: text('description'),
  type: text('type'),
  image: text('image'),
  images: jsonb('images').default([]),
  createdAt: timestamp('created_at').defaultNow(),
});
