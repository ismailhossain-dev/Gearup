import { Router } from "express";
import { providerController } from "./provider.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/gear",
  auth(Role.ADMIN, Role.PROVIDER, Role.CUSTOMER),
  providerController.createGear,
);

router.put(
  "/gear/:id",
  auth(Role.ADMIN, Role.PROVIDER),
  providerController.updateGear,
);

export const providerRoutes = router;
