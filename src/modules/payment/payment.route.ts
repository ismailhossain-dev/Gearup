import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();
router.post(
  "/create",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  paymentController.createCheckoutSession,
);

router.post("/confirm", paymentController.handleWebhook);

router.get(
  "/",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  paymentController.getMyPayments,
);

router.get(
  "/:id",
  auth(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  paymentController.getSinglePayment,
);


export const paymentRoutes = router;
