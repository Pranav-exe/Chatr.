import { Router } from "express";
import protectRoute from "../middleware/protectRoute";
import { getUsersForSidebar } from "../controllers/user.controller";

const router = Router();

router.get("/", protectRoute, getUsersForSidebar);

export default router;