// @ts-nocheck
import { Router } from "express";
import { db, playlistsTable, playlistSongsTable, songsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import {
  CreatePlaylistBody,
  UpdatePlaylistBody,
  GetPlaylistsQueryParams,
  GetPlaylistParams,
  UpdatePlaylistParams,
  DeletePlaylistParams,
  AddSongToPlaylistParams,
  AddSongToPlaylistBody,
  RemoveSongFromPlaylistParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const query = GetPlaylistsQueryParams.parse(req.query);
    let q = db.select().from(playlistsTable).$dynamic();
    if (query.userId) q = q.where(eq(playlistsTable.userId, query.userId));
    else if (query.isPublic !== undefined) q = q.where(eq(playlistsTable.isPublic, query.isPublic));
    const playlists = await q.orderBy(desc(playlistsTable.createdAt));

    const result = await Promise.all(
      playlists.map(async (p) => {
        const songs = await db
          .select({ id: playlistSongsTable.id })
          .from(playlistSongsTable)
          .where(eq(playlistSongsTable.playlistId, p.id));
        return { ...formatPlaylist(p), songCount: songs.length };
      })
    );
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreatePlaylistBody.parse(req.body);
    const [playlist] = await db.insert(playlistsTable).values(body).returning();
    res.status(201).json({ ...formatPlaylist(playlist), songCount: 0 });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to create playlist" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = GetPlaylistParams.parse({ id: Number(req.params.id) });
    const [playlist] = await db.select().from(playlistsTable).where(eq(playlistsTable.id, id));
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });

    const songRows = await db
      .select({ song: songsTable })
      .from(playlistSongsTable)
      .innerJoin(songsTable, eq(playlistSongsTable.songId, songsTable.id))
      .where(eq(playlistSongsTable.playlistId, id))
      .orderBy(desc(playlistSongsTable.addedAt));

    res.json({
      ...formatPlaylist(playlist),
      songs: songRows.map((r) => formatSong(r.song)),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = UpdatePlaylistParams.parse({ id: Number(req.params.id) });
    const body = UpdatePlaylistBody.parse(req.body);
    const [playlist] = await db.update(playlistsTable).set(body).where(eq(playlistsTable.id, id)).returning();
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    res.json({ ...formatPlaylist(playlist), songCount: 0 });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to update playlist" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = DeletePlaylistParams.parse({ id: Number(req.params.id) });
    await db.delete(playlistsTable).where(eq(playlistsTable.id, id));
    res.json({ success: true, message: "Playlist deleted" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
});

router.post("/:id/songs", async (req, res) => {
  try {
    const { id } = AddSongToPlaylistParams.parse({ id: Number(req.params.id) });
    const body = AddSongToPlaylistBody.parse(req.body);
    await db.insert(playlistSongsTable).values({ playlistId: id, songId: body.songId });
    res.status(201).json({ success: true, message: "Song added to playlist" });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to add song" });
  }
});

router.delete("/:id/songs/:songId", async (req, res) => {
  try {
    const { id, songId } = RemoveSongFromPlaylistParams.parse({
      id: Number(req.params.id),
      songId: Number(req.params.songId),
    });
    await db
      .delete(playlistSongsTable)
      .where(and(eq(playlistSongsTable.playlistId, id), eq(playlistSongsTable.songId, songId)));
    res.json({ success: true, message: "Song removed from playlist" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to remove song" });
  }
});

function formatPlaylist(p: any) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    coverUrl: p.coverUrl,
    userId: p.userId,
    isPublic: p.isPublic,
    createdAt: p.createdAt?.toISOString?.() ?? p.createdAt,
  };
}

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
