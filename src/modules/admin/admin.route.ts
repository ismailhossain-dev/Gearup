import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id", auth(Role.ADMIN), adminController.updateUser);

router.get("/gear", adminController.getAllGears);
router.get("/rentals", adminController.getAllRentals);

export const adminRoutes = router;
