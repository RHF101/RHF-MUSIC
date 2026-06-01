import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const songsTable = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  album: text("album"),
  audioUrl: text("audio_url").notNull(),
  coverUrl: text("cover_url").notNull(),
  duration: integer("duration").notNull().default(0),
  uploadedBy: text("uploaded_by"),
  playCount: integer("play_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSongSchema = createInsertSchema(songsTable).omit({ id: true, createdAt: true, playCount: true });
export type InsertSong = z.infer<typeof insertSongSchema>;
export type Song = typeof songsTable.$inferSelect;

export const profilesTable = pgTable("profiles", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  isBanned: boolean("is_banned").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({ createdAt: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;
