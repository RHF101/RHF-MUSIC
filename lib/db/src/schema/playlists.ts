// @ts-nocheck
import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { songsTable } from "./songs";

export const playlistsTable = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  coverUrl: text("cover_url"),
  userId: text("user_id").notNull(),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlaylistSchema = createInsertSchema(playlistsTable).omit({ id: true, createdAt: true });
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlistsTable.$inferSelect;

export const playlistSongsTable = pgTable("playlist_songs", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").notNull().references(() => playlistsTable.id, { onDelete: "cascade" }),
  songId: integer("song_id").notNull().references(() => songsTable.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export const insertPlaylistSongSchema = createInsertSchema(playlistSongsTable).omit({ id: true, addedAt: true });
export type InsertPlaylistSong = z.infer<typeof insertPlaylistSongSchema>;
export type PlaylistSong = typeof playlistSongsTable.$inferSelect;

export const likedSongsTable = pgTable("liked_songs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  songId: integer("song_id").notNull().references(() => songsTable.id, { onDelete: "cascade" }),
  likedAt: timestamp("liked_at").defaultNow().notNull(),
});

export const insertLikedSongSchema = createInsertSchema(likedSongsTable).omit({ id: true, likedAt: true });
export type InsertLikedSong = z.infer<typeof insertLikedSongSchema>;
export type LikedSong = typeof likedSongsTable.$inferSelect;

export const playHistoryTable = pgTable("play_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  songId: integer("song_id").notNull().references(() => songsTable.id, { onDelete: "cascade" }),
  playedAt: timestamp("played_at").defaultNow().notNull(),
});

export const insertPlayHistorySchema = createInsertSchema(playHistoryTable).omit({ id: true, playedAt: true });
export type InsertPlayHistory = z.infer<typeof insertPlayHistorySchema>;
export type PlayHistory = typeof playHistoryTable.$inferSelect;

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({ id: true, createdAt: true, isRead: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notificationsTable.$inferSelect;

export const aiChatsTable = pgTable("ai_chats", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAiChatSchema = createInsertSchema(aiChatsTable).omit({ id: true, createdAt: true });
export type InsertAiChat = z.infer<typeof insertAiChatSchema>;
export type AiChat = typeof aiChatsTable.$inferSelect;
