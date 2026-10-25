import { Router } from "express";
import { categroyController } from "./category.controller";

const router = Router();

router.post("/", categroyController.createCategory);

export const categoryRoutes = router;
