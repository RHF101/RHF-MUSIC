// @ts-nocheck
import { Router } from "express";
import { db, songsTable } from "@workspace/db";
import { eq, ilike, or, desc } from "drizzle-orm";
import {
  CreateSongBody,
  UpdateSongBody,
  GetSongsQueryParams,
  GetSongParams,
  UpdateSongParams,
  DeleteSongParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const query = GetSongsQueryParams.parse(req.query);
    const songs = await db
      .select()
      .from(songsTable)
      .orderBy(desc(songsTable.createdAt))
      .limit(query.limit ?? 50)
      .offset(query.offset ?? 0);
    res.json(songs.map(formatSong));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const songs = await db
      .select()
      .from(songsTable)
      .orderBy(desc(songsTable.playCount))
      .limit(10);
    res.json(songs.map(formatSong));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch featured songs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = GetSongParams.parse({ id: Number(req.params.id) });
    const [song] = await db.select().from(songsTable).where(eq(songsTable.id, id));
    if (!song) return res.status(404).json({ error: "Song not found" });
    res.json(formatSong(song));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch song" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateSongBody.parse(req.body);
    const [song] = await db.insert(songsTable).values(body).returning();
    res.status(201).json(formatSong(song));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to create song" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = UpdateSongParams.parse({ id: Number(req.params.id) });
    const body = UpdateSongBody.parse(req.body);
    const [song] = await db.update(songsTable).set(body).where(eq(songsTable.id, id)).returning();
    if (!song) return res.status(404).json({ error: "Song not found" });
    res.json(formatSong(song));
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to update song" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = DeleteSongParams.parse({ id: Number(req.params.id) });
    await db.delete(songsTable).where(eq(songsTable.id, id));
    res.json({ success: true, message: "Song deleted" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete song" });
  }
});

function formatSong(song: any) {
  return {
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    audioUrl: song.audioUrl,
    coverUrl: song.coverUrl,
    duration: song.duration,
    uploadedBy: song.uploadedBy,
    playCount: song.playCount,
    createdAt: song.createdAt?.toISOString?.() ?? song.createdAt,
  };
}

export function searchSongsQuery(q: string) {
  return db
    .select()
    .from(songsTable)
    .where(or(ilike(songsTable.title, `%${q}%`), ilike(songsTable.artist, `%${q}%`), ilike(songsTable.album, `%${q}%`)))
    .limit(20);
}

export default router;
