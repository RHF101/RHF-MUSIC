import { Router, type IRouter } from "express";
import healthRouter from "./health";
import songsRouter from "./songs";
import playlistsRouter from "./playlists";
import likedRouter from "./liked";
import historyRouter from "./history";
import searchRouter from "./search";
import notificationsRouter from "./notifications";
import adminRouter from "./admin";
import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/songs", songsRouter);
router.use("/playlists", playlistsRouter);
router.use("/liked", likedRouter);
router.use("/history", historyRouter);
router.use("/search", searchRouter);
router.use("/notifications", notificationsRouter);
router.use("/admin", adminRouter);
router.use("/ai", aiRouter);

export default router;
