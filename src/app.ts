import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./modules/auth/auth.route";
import { providerRoutes } from "./modules/provider/provider.route";
import { gearRoutes } from "./modules/gear/gear.route";
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
app.use("/api/provider", providerRoutes);
app.use("/api", gearRoutes)

export default app;
