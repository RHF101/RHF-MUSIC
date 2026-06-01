import { Router } from "express";
import { db, playHistoryTable, songsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { GetHistoryQueryParams, RecordPlayBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const query = GetHistoryQueryParams.parse(req.query);
    const rows = await db
      .select({ history: playHistoryTable, song: songsTable })
      .from(playHistoryTable)
      .innerJoin(songsTable, eq(playHistoryTable.songId, songsTable.id))
      .where(eq(playHistoryTable.userId, query.userId))
      .orderBy(desc(playHistoryTable.playedAt))
      .limit(query.limit ?? 20);

    res.json(
      rows.map((r) => ({
        id: r.history.id,
        userId: r.history.userId,
        songId: r.history.songId,
        playedAt: r.history.playedAt?.toISOString?.() ?? r.history.playedAt,
        song: formatSong(r.song),
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = RecordPlayBody.parse(req.body);
    await db.insert(playHistoryTable).values({ userId: body.userId, songId: body.songId });
    // Increment play count
    await db
      .update(songsTable)
      .set({ playCount: db.$count(playHistoryTable, eq(playHistoryTable.songId, body.songId)) as any })
      .where(eq(songsTable.id, body.songId));
    res.status(201).json({ success: true, message: "Play recorded" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to record play" });
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
