import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./modules/auth/auth.route";
import { gearRoutes } from "./modules/gear/gear.route";
import { categoryRoutes } from "./modules/category/category.route";
import { rentalRoutes } from "./modules/rental/rental.route";
import { reviewRoutes } from "./modules/review/review.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { providerRoutes } from "./modules/provider/provider.route";
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello Gearup",
    author: "Sabbir vai",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", gearRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/provider", providerRoutes);

export default app;
