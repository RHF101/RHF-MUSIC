// @ts-nocheck
import { Router } from "express";
import { db, songsTable, playlistsTable } from "@workspace/db";
import { ilike, or, eq } from "drizzle-orm";
import { SearchSongsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { q } = SearchSongsQueryParams.parse(req.query);
    const [songs, playlists] = await Promise.all([
      db
        .select()
        .from(songsTable)
        .where(or(ilike(songsTable.title, `%${q}%`), ilike(songsTable.artist, `%${q}%`), ilike(songsTable.album, `%${q}%`)))
        .limit(20),
      db
        .select()
        .from(playlistsTable)
        .where(or(ilike(playlistsTable.name, `%${q}%`), ilike(playlistsTable.description, `%${q}%`)))
        .where(eq(playlistsTable.isPublic, true))
        .limit(10),
    ]);

    res.json({
      songs: songs.map(formatSong),
      playlists: playlists.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        coverUrl: p.coverUrl,
        userId: p.userId,
        isPublic: p.isPublic,
        songCount: 0,
        createdAt: p.createdAt?.toISOString?.() ?? p.createdAt,
      })),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Search failed" });
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
