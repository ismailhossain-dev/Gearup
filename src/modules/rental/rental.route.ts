import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { rentalController } from "./rental.controller";

const router = Router();
router.post(
  "/",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  rentalController.createRental,
);
router.get("/", rentalController.getMyRentals);

router.get(
  "/:id",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  rentalController.getRentalById,
);

export const rentalRoutes = router;
