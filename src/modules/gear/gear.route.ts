import { Router } from "express";
import { gearController } from "./gear.controller";

const router = Router();

router.get("/gear", gearController.getAllGear);
router.get("/gear/:id", gearController.getGearById);
router.get("/categories", gearController.getAllGearCategory);
export const gearRoutes = router;
