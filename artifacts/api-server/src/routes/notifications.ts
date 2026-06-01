// @ts-nocheck
import { Router } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  GetNotificationsQueryParams,
  SendNotificationBody,
  MarkNotificationReadParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { userId } = GetNotificationsQueryParams.parse(req.query);
    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, userId))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(50);
    res.json(
      notifications.map((n) => ({
        id: n.id,
        userId: n.userId,
        message: n.message,
        isRead: n.isRead,
        createdAt: n.createdAt?.toISOString?.() ?? n.createdAt,
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = SendNotificationBody.parse(req.body);
    await db.insert(notificationsTable).values({ userId: body.userId, message: body.message });
    res.status(201).json({ success: true, message: "Notification sent" });
  } catch (err) {
    req.log.error(err);
    res.status(400).json({ error: "Failed to send notification" });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const { id } = MarkNotificationReadParams.parse({ id: Number(req.params.id) });
    await db.update(notificationsTable).set({ isRead: true }).where(eq(notificationsTable.id, id));
    res.json({ success: true, message: "Marked as read" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to mark notification" });
  }
});

export default router;
