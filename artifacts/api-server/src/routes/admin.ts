import { Router } from "express";
import { db, songsTable, playlistsTable, playHistoryTable, notificationsTable, profilesTable } from "@workspace/db";
import { desc, count, sql } from "drizzle-orm";
import { BroadcastNotificationBody } from "@workspace/api-zod";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const [songCount, playlistCount, playCount, userCount, topSongs, recentActivity] = await Promise.all([
      db.select({ count: count() }).from(songsTable),
      db.select({ count: count() }).from(playlistsTable),
      db.select({ count: count() }).from(playHistoryTable),
      db.select({ count: count() }).from(profilesTable),
      db.select().from(songsTable).orderBy(desc(songsTable.playCount)).limit(10),
      db
        .select({ history: playHistoryTable, song: songsTable })
        .from(playHistoryTable)
        .innerJoin(songsTable, sql`${playHistoryTable.songId} = ${songsTable.id}`)
        .orderBy(desc(playHistoryTable.playedAt))
        .limit(10),
    ]);

    res.json({
      totalSongs: songCount[0]?.count ?? 0,
      totalPlaylists: playlistCount[0]?.count ?? 0,
      totalPlays: playCount[0]?.count ?? 0,
      totalUsers: userCount[0]?.count ?? 0,
      topSongs: topSongs.map(formatSong),
      recentActivity: recentActivity.map((r) => ({
        id: r.history.id,
        userId: r.history.userId,
        songId: r.history.songId,
        playedAt: r.history.playedAt?.toISOString?.() ?? r.history.playedAt,
        song: formatSong(r.song),
      })),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.post("/broadcast", async (req, res) => {
  try {
    const body = BroadcastNotificationBody.parse(req.body);
    const users = await db.select({ id: profilesTable.id }).from(profilesTable);
    if (users.length > 0) {
      await db.insert(notificationsTable).values(
        users.map((u) => ({ userId: u.id, message: body.message }))
      );
    }
    res.json({ success: true, message: `Broadcast sent to ${users.length} users` });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to broadcast" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await db.select().from(profilesTable).orderBy(desc(profilesTable.createdAt));
    res.json(
      users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt?.toISOString?.() ?? u.createdAt,
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
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
