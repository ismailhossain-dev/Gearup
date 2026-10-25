import { Router } from "express";
import { gearController } from "./gear.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post(
  "/provider/gear",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  gearController.createGear,
);
router.get("/gear", gearController.getAllGear);
router.get("/gear/:id", gearController.getGearById);
export const gearRoutes = router;
