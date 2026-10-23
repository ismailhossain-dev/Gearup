import { Router } from "express";
import { gearController } from "./gear.controller";

const router = Router();
router.get("/gear", gearController.getAllGear)
export const gearRoutes = router;
