import { Router } from "express";
import { db, likedSongsTable, songsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { GetLikedSongsQueryParams, LikeSongBody, UnlikeSongParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const query = GetLikedSongsQueryParams.parse(req.query);
    const rows = await db
      .select({ song: songsTable })
      .from(likedSongsTable)
      .innerJoin(songsTable, eq(likedSongsTable.songId, songsTable.id))
      .where(eq(likedSongsTable.userId, query.userId));
    res.json(rows.map((r) => formatSong(r.song)));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch liked songs" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = LikeSongBody.parse(req.body);
    const existing = await db
      .select()
      .from(likedSongsTable)
      .where(and(eq(likedSongsTable.userId, body.userId), eq(likedSongsTable.songId, body.songId)));
    if (existing.length === 0) {
      await db.insert(likedSongsTable).values({ userId: body.userId, songId: body.songId });
    }
    res.status(201).json({ success: true, message: "Song liked" });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to like song" });
  }
});

router.delete("/:userId/:songId", async (req, res) => {
  try {
    const { userId, songId } = UnlikeSongParams.parse({
      userId: req.params.userId,
      songId: Number(req.params.songId),
    });
    await db
      .delete(likedSongsTable)
      .where(and(eq(likedSongsTable.userId, userId), eq(likedSongsTable.songId, songId)));
    res.json({ success: true, message: "Song unliked" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to unlike song" });
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

export default router;
