// @ts-nocheck
import { Router } from "express";
import { db, songsTable, playHistoryTable, aiChatsTable } from "@workspace/db";
import { eq, desc, ilike, or } from "drizzle-orm";
import { generateResponse } from "../lib/gemini.js";
import { AiChatBody, GetAiRecommendationsQueryParams } from "@workspace/api-zod";

const router = Router();

router.post("/chat", async (req, res) => {
  try {
    const body = AiChatBody.parse(req.body);

    // Save user message
    if (body.userId) {
      await db.insert(aiChatsTable).values({ userId: body.userId, role: "user", content: body.prompt });
    }

    const response = await generateResponse(body.prompt, body.context ?? undefined);

    // Save AI response
    if (body.userId) {
      await db.insert(aiChatsTable).values({ userId: body.userId, role: "assistant", content: response });
    }

    // Parse action from response for admin commands
    let action: string | null = null;
    let data: unknown = null;

    if (body.prompt.toLowerCase().includes("tambahkan lagu") || body.prompt.toLowerCase().includes("add song")) {
      action = "upload_song";
    } else if (body.prompt.toLowerCase().includes("ubah tema") || body.prompt.toLowerCase().includes("change theme")) {
      action = "change_theme";
    } else if (body.prompt.toLowerCase().includes("laporan") || body.prompt.toLowerCase().includes("report")) {
      action = "generate_report";
      const topSongs = await db.select().from(songsTable).orderBy(desc(songsTable.playCount)).limit(10);
      data = topSongs;
    }

    res.json({ response, action, data });
  } catch (err) {
    req.log.error(err);
    if ((err as Error).message?.includes("GEMINI_API_KEY")) {
      res.status(503).json({ error: "AI service not configured. Please set GEMINI_API_KEY." });
    } else {
      res.status(500).json({ error: "AI request failed" });
    }
  }
});

router.get("/recommend", async (req, res) => {
  try {
    const { userId } = GetAiRecommendationsQueryParams.parse(req.query);

    // Get user history to build context
    const history = await db
      .select({ song: songsTable })
      .from(playHistoryTable)
      .innerJoin(songsTable, eq(playHistoryTable.songId, songsTable.id))
      .where(eq(playHistoryTable.userId, userId))
      .orderBy(desc(playHistoryTable.playedAt))
      .limit(5);

    if (history.length === 0) {
      // Return featured songs if no history
      const songs = await db.select().from(songsTable).orderBy(desc(songsTable.playCount)).limit(10);
      return res.json(songs.map(formatSong));
    }

    const artistContext = history.map((h) => h.song.artist).join(", ");
    const prompt = `Based on listening history with artists: ${artistContext}, recommend 5 similar artists. Return only artist names separated by commas.`;

    let artistNames: string[] = [];
    try {
      const aiResponse = await generateResponse(prompt);
      artistNames = aiResponse.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);
    } catch {
      // Fallback to top songs
    }

    let recommended: any[] = [];
    for (const artist of artistNames) {
      const songs = await db
        .select()
        .from(songsTable)
        .where(ilike(songsTable.artist, `%${artist}%`))
        .limit(3);
      recommended.push(...songs);
    }

    if (recommended.length < 5) {
      const top = await db.select().from(songsTable).orderBy(desc(songsTable.playCount)).limit(10);
      recommended = [...recommended, ...top].slice(0, 10);
    }

    res.json(recommended.slice(0, 10).map(formatSong));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get recommendations" });
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
